/* Reads the report pages of a saved copy of the design mockup and writes what they show to
   src/data/report-import/reports.json, for `npm run import:reports`. The file is not kept in git: the repository is
   public and the reports wait for approval.

   node scripts/extract-reports.mjs <mockup page.html> [output.json]

   Only text that is visible on a report's page is taken; the text of its chapters is never written. The mockup runs in
   a headless Chrome that is not allowed to reach the network. */
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright-core";

const here = path.dirname(fileURLToPath(import.meta.url));
const [source, output = path.join(here, "../src/data/report-import/reports.json")] = process.argv.slice(2);
if (!source) {
  console.error("Usage: node scripts/extract-reports.mjs <mockup page.html> [output.json]");
  process.exit(1);
}

/** The cards of the Resources menu in the design; they start as the featured reports. */
const FEATURED = new Set(["wallet-architecture-2026", "secure-ai-2026", "pqc-readiness-2026"]);

// The list of reports is private to a script in the page: a copy hands it out.
const html = readFileSync(source, "utf8");
const MARK = "const REPORTS=[";
if (!html.includes(MARK)) throw new Error("This copy of the mockup has no list of reports.");
const work = mkdtempSync(path.join(tmpdir(), "savis-reports-"));
const copy = path.join(work, "page.html");
writeFileSync(copy, html.replace(MARK, "const REPORTS=window.__reports=["));

const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  await context.route(/^(?!file:|data:|blob:)/, (route) => route.abort());
  const page = await context.newPage();
  await page.goto(pathToFileURL(copy).href, { waitUntil: "load" });
  await page.waitForFunction(() => window.__reports?.length);

  const open = async (hash, ready) => {
    await page.evaluate((h) => { location.hash = h; }, hash);
    await page.waitForFunction(ready.test, ready.arg);
    await page.waitForTimeout(250);
  };

  await open("#resources-reports", { test: () => document.querySelectorAll('#view a[href^="#report-"]').length > 10 });
  const listed = await page.evaluate(() => [...new Set([...document.querySelectorAll('#view a[href^="#report-"]')].map((a) => a.getAttribute("href").slice("#report-".length)))]);
  // The line under each series heading in the library.
  const rows = await page.evaluate(() => [...document.querySelectorAll("#view .rp-row")].map((row) => ({
    summary: row.querySelector(".rp-rh p")?.textContent.replace(/\s+/g, " ").trim(),
    ids: [...row.querySelectorAll('a[href^="#report-"]')].map((a) => a.getAttribute("href").slice("#report-".length)),
  })));
  const summaryOf = (id) => rows.find((row) => row.ids.includes(id))?.summary;
  const ids = await page.evaluate(() => window.__reports.map((r) => r.id));
  // Library order first; a report the library does not list goes to the end.
  const ordered = [...listed.filter((id) => ids.includes(id)), ...ids.filter((id) => !listed.includes(id))];

  const reports = [];
  const notes = [];
  for (const [index, id] of ordered.entries()) {
    await open(`#report-${id}`, { test: (title) => document.querySelector("#view h1")?.textContent.trim() === title, arg: await page.evaluate((i) => window.__reports.find((r) => r.id === i).title.replace(/&amp;/g, "&"), id) });
    const { report, hidden, leaked } = await page.evaluate((reportId) => {
      const r = window.__reports.find((x) => x.id === reportId);
      const view = document.querySelector("#view");
      const box = document.createElement("textarea");
      const plain = (s) => { box.innerHTML = String(s ?? ""); return box.value.replace(/\s+/g, " ").trim(); };
      const norm = (s) => plain(s).toLowerCase();
      const visible = view.innerText.replace(/\s+/g, " ").toLowerCase();
      const hidden = {};
      const shown = (text) => !!norm(text) && visible.includes(norm(text));
      /** The text if the page shows it; otherwise nothing, and it is counted. */
      const take = (field, text) => {
        if (!text) return undefined;
        if (shown(text)) return plain(text);
        hidden[field] = (hidden[field] ?? 0) + 1;
        return undefined;
      };
      const list = (field, rows, map) => (rows ?? []).flatMap((row) => { const out = map(row, (t) => take(field, t)); return out ? [out] : []; });
      const sectionOf = (heading) => {
        const h = [...view.querySelectorAll("h2")].find((x) => x.textContent.trim().startsWith(heading));
        return h ? h.closest("section") ?? h.parentElement.parentElement : null;
      };
      const previews = [...(sectionOf("A look inside")?.querySelectorAll("figure") ?? [])].flatMap((figure) => {
        const svg = figure.querySelector("svg");
        const caption = plain(figure.querySelector("figcaption")?.textContent);
        return svg && caption ? [{ diagram: svg.outerHTML.replace(/ data-fit="[^"]*"/g, ""), caption }] : [];
      });
      const products = [...new Set([...(sectionOf("SAVIS products")?.querySelectorAll('a[href^="#p-"]') ?? [])].map((a) => a.getAttribute("href").slice(3)))];
      const series = /^(.*?)\s*·\s*Part (\d+) of (\d+)$/.exec(plain(r.series));
      const report = {
        slug: r.id,
        kind: r.kind === "Whitepaper" ? "whitepaper" : "report",
        topic: plain(r.tag),
        palette: r.pal,
        title: plain(r.title),
        subtitle: plain(r.sub),
        hook: take("hook", r.hook),
        lead: take("lead", r.lead),
        series: series ? { name: series[1], part: Number(series[2]), parts: Number(series[3]) } : r.series ? { name: plain(r.series) } : undefined,
        credit: take("credit", r.credit),
        stats: list("stats", r.stats, ([value, label], t) => { const l = t(label); return l && { value: plain(value), label: l }; }),
        why: list("why", r.why, (x, t) => { const text = t(x); return text && { text }; }),
        editions: list("editions", r.editions, ([audience, body], t) => { const text = t(body); return text && { audience: plain(audience), text }; }),
        learn: list("learn", r.learn, (x, t) => { const text = t(x); return text && { text }; }),
        previews,
        products,
        chapters: list("chapters", r.chapters, (c, t) => { const title = t(c[0]); return title && { title }; }),
        questions: {
          heading: take("questions.heading", r.sqT),
          intro: take("questions.intro", r.sqP),
          items: list("questions", r.sectors, ([title, body], t) => { const text = t(body); return text && { title: plain(title), text }; }),
        },
        path: { title: take("path.title", r.ladder?.t), text: take("path.text", r.ladder?.p) },
        board: list("board", r.board, (x, t) => { const text = t(x); return text && { text }; }),
      };
      // Safety net: no paragraph of a chapter that the page does not show may be in the result.
      const result = JSON.stringify(report).toLowerCase();
      const chapterTexts = (r.chapters ?? []).flatMap((c) => c.slice(1)).filter((b) => typeof b === "string");
      const leaked = chapterTexts.filter((b) => norm(b).length > 60 && !shown(b) && result.includes(norm(b))).length;
      return { report, hidden, leaked };
    }, id);
    if (leaked) throw new Error(`${id}: chapter text found in the result.`);
    const missing = ["title", "subtitle", "lead", "topic", "palette"].filter((k) => !report[k]);
    if (missing.length) throw new Error(`${id}: the page shows no ${missing.join(", ")}.`);
    const series = report.series && { ...report.series, summary: summaryOf(id) };
    reports.push({ ...report, series, order: index + 1, featured: FEATURED.has(id) });
    if (Object.keys(hidden).length) notes.push(`${id}: not on the page, left out: ${Object.entries(hidden).map(([k, n]) => `${k} ${n}`).join(", ")}`);
  }

  mkdirSync(path.dirname(output), { recursive: true });
  writeFileSync(output, `${JSON.stringify({ reports }, null, 1)}\n`);
  const count = (field) => reports.reduce((n, r) => n + (r[field]?.length ?? 0), 0);
  console.log(notes.join("\n"));
  console.log(`${reports.length} reports (${listed.length} listed in the library) -> ${output}`);
  console.log(`previews ${count("previews")}, chapter titles ${count("chapters")}, product links ${count("products")}, board questions ${count("board")}`);
} finally {
  await browser.close();
  rmSync(work, { recursive: true, force: true });
}
