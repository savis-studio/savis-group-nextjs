/**
 * Crawls a running build and audits every page in the sitemap: status, title/description length, canonical, h1,
 * Open Graph, JSON-LD validity, image alt text, duplicate ids, and every internal link (status + fragment target).
 *
 *   npx tsx scripts/audit-site.ts [baseUrl]      (default http://localhost:3150)
 *
 * Exits 1 on any error. Warnings (for example short descriptions) are listed but do not fail the run.
 */
const BASE = (process.argv[2] ?? "http://localhost:3150").replace(/\/$/, "");
const ORIGIN = "https://savis-group.com";

type Issue = { page: string; level: "error" | "warn"; msg: string };
const issues: Issue[] = [];
const add = (page: string, level: Issue["level"], msg: string) => issues.push({ page, level, msg });

const attr = (tag: string, name: string) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1];
const decode = (s: string) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

async function get(path: string) {
  const r = await fetch(BASE + path, { redirect: "manual" });
  return { status: r.status, location: r.headers.get("location"), body: r.status === 200 ? await r.text() : "" };
}

async function pool<T>(items: T[], n: number, fn: (x: T) => Promise<void>) {
  const q = [...items];
  await Promise.all(Array.from({ length: n }, async () => { for (let x = q.shift(); x !== undefined; x = q.shift()) await fn(x); }));
}

const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(ORIGIN, ""));
console.log(`sitemap: ${pages.length} URLs`);

const pageIds = new Map<string, Set<string>>();
const linkSources = new Map<string, Set<string>>(); // target -> pages linking to it
const titles = new Map<string, string[]>();
const descriptions = new Map<string, string[]>();

await pool(pages, 8, async (path) => {
  const { status, body } = await get(path);
  if (status !== 200) return add(path, "error", `status ${status}`);
  const head = body.slice(0, body.indexOf("</head>"));

  const title = decode(head.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  if (!title) add(path, "error", "missing <title>");
  else {
    if (title.length > 60) add(path, "warn", `title ${title.length} chars`);
    titles.set(title, [...(titles.get(title) ?? []), path]);
  }

  const metas = [...head.matchAll(/<meta [^>]*>/g)].map((m) => m[0]);
  const meta = (key: string, v: string) => metas.find((m) => attr(m, key) === v);
  const desc = decode(attr(meta("name", "description") ?? "", "content") ?? "");
  if (!desc) add(path, "error", "missing meta description");
  else {
    if (desc.length > 160) add(path, "warn", `description ${desc.length} chars`);
    if (desc.length < 50) add(path, "warn", `description only ${desc.length} chars`);
    descriptions.set(desc, [...(descriptions.get(desc) ?? []), path]);
  }
  if (meta("name", "robots")?.includes("noindex")) add(path, "error", "page is noindex");

  const canonical = head.match(/<link [^>]*rel="canonical"[^>]*>/)?.[0];
  const canonHref = canonical && attr(canonical, "href");
  const expected = ORIGIN + (path === "/" ? "" : path);
  if (!canonHref) add(path, "error", "missing canonical");
  else if (canonHref.replace(/\/$/, "") !== expected.replace(/\/$/, "")) add(path, "error", `canonical ${canonHref} ≠ ${expected}`);
  for (const p of ["og:title", "og:description", "og:url", "og:type"]) if (!meta("property", p)) add(path, "warn", `missing ${p}`);

  const h1 = (body.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) add(path, "error", `${h1} <h1> elements`);
  if (!/<html[^>]*lang="/.test(body)) add(path, "error", "html lang missing");

  for (const m of body.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const parsed = JSON.parse(m[1]);
      for (const j of Array.isArray(parsed) ? parsed : [parsed]) {
        if (!j["@context"] || !j["@type"]) add(path, "error", "JSON-LD without @context/@type");
      }
    } catch {
      add(path, "error", "invalid JSON-LD");
    }
  }

  for (const m of body.matchAll(/<img\b[^>]*>/g)) if (attr(m[0], "alt") === undefined) add(path, "error", `img without alt: ${(attr(m[0], "src") ?? "").slice(0, 60)}`);

  const ids = [...body.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) add(path, "warn", `duplicate id "${id}"`);
    seen.add(id);
  }
  pageIds.set(path, seen);

  for (const m of body.matchAll(/<a\b[^>]*\shref="([^"]*)"[^>]*>/g)) {
    const href = decode(m[1]);
    if (href === "#") { add(path, "warn", 'placeholder href="#"'); continue; }
    if (!href || /^(mailto:|tel:|javascript:)/.test(href)) continue;
    let target = href;
    if (/^https?:\/\//.test(href)) {
      if (!href.startsWith(ORIGIN) && !href.startsWith(BASE)) continue;
      target = href.replace(ORIGIN, "").replace(BASE, "") || "/";
    }
    if (target.startsWith("#")) target = path + target;
    if (!target.startsWith("/")) { add(path, "error", `odd href "${href}"`); continue; }
    // Cloudflare's own paths: on the live site it rewrites email links to one that answers 404 when fetched.
    if (target.startsWith("/cdn-cgi/")) continue;
    if (target.includes("?")) target = target.split("?")[0] + (target.includes("#") ? "#" + target.split("#")[1] : "");
    (linkSources.get(target) ?? linkSources.set(target, new Set()).get(target)!).add(path);
  }
});

// Check every distinct internal link target once.
const targets = [...linkSources.keys()];
console.log(`internal link targets: ${targets.length}`);
const cache = new Map<string, { status: number; location: string | null }>();
await pool([...new Set(targets.map((t) => t.split("#")[0]))], 8, async (p) => {
  const r = await get(p);
  cache.set(p, { status: r.status, location: r.location });
  if (r.status === 200 && !pageIds.has(p)) pageIds.set(p, new Set([...r.body.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
});
for (const t of targets) {
  const [p, frag] = t.split("#");
  const r = cache.get(p)!;
  const from = [...linkSources.get(t)!];
  const where = `${from[0]}${from.length > 1 ? ` (+${from.length - 1})` : ""}`;
  if (r.status === 404 || r.status >= 500) add(where, "error", `broken link ${t} → ${r.status}`);
  else if (r.status >= 300) add(where, "warn", `redirected link ${t} → ${r.location}`);
  else if (frag && !pageIds.get(p)?.has(frag)) add(where, "warn", `missing anchor ${t}`);
}

for (const [k, v] of titles) if (v.length > 1) add(v[0], "warn", `duplicate title "${k}" on ${v.length} pages`);
for (const [k, v] of descriptions) if (v.length > 1) add(v[0], "warn", `duplicate description on ${v.length} pages: "${k.slice(0, 60)}…"`);

const errors = issues.filter((i) => i.level === "error");
const warns = issues.filter((i) => i.level === "warn");
/** Same message on many pages (for example a missing anchor) is printed once with a count. */
const show = (xs: Issue[]) => {
  const by = new Map<string, Issue[]>();
  for (const i of xs) {
    const key = i.msg.replace(/^(broken link|redirected link) \/[^ ]*/, "$1").replace(/^missing anchor \/[^#]*/, "missing anchor ");
    by.set(key, [...(by.get(key) ?? []), i]);
  }
  for (const [msg, list] of [...by].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  ${list.length > 1 ? `×${list.length} ` : ""}${list[0].page}  ${msg}`);
  }
};
console.log(`\nERRORS: ${errors.length}`); show(errors);
console.log(`\nWARNINGS: ${warns.length}`); show(warns);
process.exit(errors.length ? 1 : 0);
