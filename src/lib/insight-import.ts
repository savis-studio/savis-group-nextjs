/**
 * One-off conversion of the mockup's article HTML into Payload (Lexical) content with structured blocks.
 * Every structured block is rendered back to HTML and compared with its source; a block that does not reproduce
 * exactly falls back to an HTML block, so nothing is ever lost or altered silently.
 * Used by scripts/import-insights.ts. Not imported by the website.
 */
import { randomBytes } from "node:crypto";
import { JSDOM } from "jsdom";
import { escapeMarkup } from "./inline";
import { type BlockType, renderBlock } from "./insight-render";
import { mapHref } from "./insight-href";

type El = Element;
type Fields = Record<string, unknown>;
export interface Report { structured: Record<string, number>; fallbacks: Array<{ article: string; kind: string; why: string; src?: string }> }

const doc = new JSDOM("<!doctype html><body></body>").window.document;

/* ----------------------------- links ----------------------------- */
function mapLinks(root: El) {
  for (const a of Array.from(root.querySelectorAll("a[href]"))) a.setAttribute("href", mapHref(a.getAttribute("href") ?? ""));
}

/* ----------------------------- canonical form (for comparison) ----------------------------- */
const IGNORED_ATTRS = new Set(["target", "rel"]);
function canon(node: Node): string {
  if (node.nodeType === 3) {
    const t = (node.textContent ?? "").replace(/\s+/g, " ");
    return t.trim() === "" ? "" : t;
  }
  if (node.nodeType !== 1) return "";
  const el = node as El;
  const attrs = Array.from(el.attributes)
    .filter((a) => !IGNORED_ATTRS.has(a.name))
    .map((a) => `${a.name}="${a.name === "class" ? a.value.trim().split(/\s+/).filter(Boolean).join(" ") : a.value.trim()}"`)
    .sort()
    .join(" ");
  return `<${el.tagName.toLowerCase()} ${attrs}>${Array.from(el.childNodes).map(canon).join("")}</${el.tagName.toLowerCase()}>`;
}
export function canonHtml(html: string): string {
  const box = doc.createElement("div");
  box.innerHTML = html;
  return Array.from(box.childNodes).map(canon).join("");
}

/* ----------------------------- inline → markup ----------------------------- */
class Unsupported extends Error {}

function inlineMarkup(node: Node): string {
  let out = "";
  for (const c of Array.from(node.childNodes)) {
    if (c.nodeType === 3) { out += escapeMarkup(c.textContent ?? ""); continue; }
    if (c.nodeType !== 1) continue;
    const el = c as El;
    const tag = el.tagName.toLowerCase();
    const inner = inlineMarkup(el);
    if (tag === "b" || tag === "strong") out += `**${inner}**`;
    else if (tag === "em" || tag === "i") out += `*${inner}*`;
    else if (tag === "a") out += `[${inner}](${el.getAttribute("href") ?? "#"})`;
    else throw new Unsupported(`inline <${tag}>`);
  }
  return out;
}

const kids = (el: El) => Array.from(el.children);
const has = (el: El, sel: string) => el.matches(sel);
const must = <T>(x: T | null | undefined | false): T => {
  if (!x) throw new Unsupported("unexpected structure");
  return x;
};

/* ----------------------------- block parsers ----------------------------- */
type Parser = (el: El) => Fields | null;

const PARSERS: Array<[BlockType, Parser]> = [
  ["keyPoint", (el) => (has(el, "div.af-key") ? { text: inlineMarkup(el) } : null)],
  ["note", (el) => (has(el, "p.af-note") ? { text: inlineMarkup(el) } : null)],

  ["cardGrid", (el) => {
    if (!has(el, "div.af-grid")) return null;
    const toks = Array.from(el.classList);
    const layout = (["g2", "g3", "x2", "three", "four"] as const).find((t) => toks.includes(t)) ?? "auto";
    const cards = kids(el).map((c) => {
      must(has(c, "div.af-c"));
      const [b, ...rest] = kids(c);
      must(b && has(b, "b"));
      const out: Fields = { title: inlineMarkup(b) };
      const style = c.getAttribute("style");
      if (style) out.accent = must(/^--c:\s*([^;]+);?$/.exec(style))[1].trim();
      for (const r of rest) {
        if (has(r, "p")) out.text = inlineMarkup(r);
        else if (has(r, "ul")) out.bullets = kids(r).map((li) => ({ text: inlineMarkup(must(has(li, "li") && li)) }));
        else if (has(r, "em")) out.tag = inlineMarkup(r);
        else throw new Unsupported("card child");
      }
      return out;
    });
    return { layout, soft: toks.includes("soft"), cards };
  }],

  ["steps", (el) => {
    if (!has(el, "div.af-flow")) return null;
    return {
      items: kids(el).map((s) => {
        must(has(s, "div.af-st"));
        const [n, b, ...rest] = kids(s);
        must(n && has(n, "span.af-n") && b && has(b, "b"));
        const out: Fields = { title: inlineMarkup(b) };
        for (const r of rest) {
          if (has(r, "p")) out.text = inlineMarkup(r);
          else if (has(r, "em")) out.tag = inlineMarkup(r);
          else throw new Unsupported("step child");
        }
        return out;
      }),
    };
  }],

  ["chips", (el) => (has(el, "div.af-chips") ? { items: kids(el).map((s) => ({ text: inlineMarkup(must(has(s, "span") && s)) })) } : null)],

  ["stats", (el) => {
    if (!has(el, "div.af-stats")) return null;
    return {
      items: kids(el).map((d) => {
        const [b, s] = kids(d);
        must(b && has(b, "b") && s && has(s, "span"));
        return { value: inlineMarkup(b), label: inlineMarkup(s) };
      }),
    };
  }],

  ["table", (el) => {
    if (!has(el, "div.dt-tbl") || has(el, ".af-mx")) return null;
    const table = must(el.querySelector(":scope > table"));
    const head = Array.from(table.querySelectorAll(":scope > thead > tr > th")).map((th) => ({ text: inlineMarkup(th) }));
    const trs = Array.from(table.querySelectorAll(":scope > tbody > tr"));
    const rowHeaders = trs.length > 0 && trs.every((tr) => tr.children[0]?.tagName === "TH");
    const rows = trs.map((tr) => ({
      cells: kids(tr).map((c, n) => {
        const tone = c.getAttribute("class");
        return { text: inlineMarkup(c), ...(tone && !(rowHeaders && n === 0) ? { tone } : {}) };
      }),
    }));
    return { variant: el.classList.contains("x-tbl") ? "x-tbl" : "plain", label: el.getAttribute("aria-label") ?? "Table", rowHeaders, head, rows };
  }],

  ["timeline", (el) => {
    if (!has(el, "figure.xd-tl")) return null;
    const ol = must(el.querySelector(":scope > ol"));
    const cap = el.querySelector(":scope > figcaption");
    return {
      items: kids(ol).map((li) => {
        const [d, b, p] = kids(li);
        must(d && has(d, "span.xt-d") && b && has(b, "b"));
        const state = li.classList.contains("now") ? "now" : li.classList.contains("done") ? "done" : "later";
        return { date: inlineMarkup(d), title: inlineMarkup(b), ...(p ? { text: inlineMarkup(p) } : {}), state };
      }),
      ...(cap ? { caption: inlineMarkup(cap) } : {}),
    };
  }],

  ["arch", (el) => {
    if (!has(el, "figure.xd-arch")) return null;
    const row = must(el.querySelector(":scope > .xa-row"));
    const cols: Fields[] = [];
    const links: Fields[] = [];
    for (const c of kids(row)) {
      if (has(c, ".xa-col")) {
        const b = must(c.querySelector(":scope > b"));
        const em = c.querySelector(":scope > em");
        const ul = must(c.querySelector(":scope > ul"));
        cols.push({ title: inlineMarkup(b), core: c.classList.contains("core"), ...(em ? { tag: inlineMarkup(em) } : {}), items: kids(ul).map((li) => ({ text: inlineMarkup(li) })) });
      } else if (has(c, ".xa-link")) links.push({ text: inlineMarkup(must(c.querySelector("span"))) });
      else throw new Unsupported("arch row child");
    }
    const base = el.querySelector(":scope > .xa-base");
    const cap = el.querySelector(":scope > figcaption");
    return {
      cols, links,
      ...(base ? { baseTitle: inlineMarkup(must(base.querySelector("b"))), baseText: inlineMarkup(must(base.querySelector("span"))) } : {}),
      ...(cap ? { caption: inlineMarkup(cap) } : {}),
    };
  }],

  ["layers", (el) => {
    if (!has(el, "div.af-lay")) return null;
    return {
      items: kids(el).map((l) => {
        const lb = must(l.querySelector(":scope > .af-lb"));
        const b = must(lb.querySelector(":scope > b"));
        const span = lb.querySelector(":scope > span");
        const em = l.querySelector(":scope > em");
        return { title: inlineMarkup(b), ...(span ? { text: inlineMarkup(span) } : {}), ...(em ? { tag: inlineMarkup(em) } : {}) };
      }),
    };
  }],

  ["landscape", (el) => {
    if (!has(el, "div.af-land")) return null;
    const status = (x: El) => must((["live", "pilot", "plan"] as const).find((s) => x.classList.contains(s)));
    const columns = kids(el).filter((c) => has(c, ".al-col")).map((c) => ({
      heading: inlineMarkup(must(c.querySelector(":scope > .al-h"))),
      items: Array.from(c.querySelectorAll(":scope > .al-it")).map((it) => {
        const head = must(it.querySelector(":scope > div"));
        const em = head.querySelector("em");
        const span = it.querySelector(":scope > span");
        return { status: status(it), name: inlineMarkup(must(head.querySelector("strong"))), ...(em ? { tag: inlineMarkup(em) } : {}), ...(span ? { text: inlineMarkup(span) } : {}) };
      }),
    }));
    const leg = el.querySelector(":scope > .al-leg");
    return { columns, ...(leg ? { legend: kids(leg).map((s) => ({ status: status(s), label: inlineMarkup(s) })) } : {}) };
  }],
];

/** Generated SVG or heavily bespoke diagrams: kept as markup in a "Diagram (HTML)" block. */
const RAW_DIAGRAM = "figure.xd, figure.af-hub, div.af-gantt, div.dt-tbl.af-mx";

const withIds = (v: unknown): unknown => {
  if (Array.isArray(v)) return v.map((x) => (x && typeof x === "object" ? { id: randomBytes(12).toString("hex"), ...(withIds(x) as object) } : x));
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, withIds(x)]));
  return v;
};

function blockNode(blockType: string, fields: Fields) {
  return { type: "block", version: 2, format: "", fields: { id: randomBytes(12).toString("hex"), blockName: "", blockType, ...(withIds(fields) as Fields) } };
}

/* ----------------------------- rich text nodes ----------------------------- */
const TEXT = (text: string, format: number) => ({ type: "text", version: 1, detail: 0, format, mode: "normal", style: "", text });

function inlineNodes(node: Node, format = 0): unknown[] {
  const out: unknown[] = [];
  for (const c of Array.from(node.childNodes)) {
    if (c.nodeType === 3) { if (c.textContent) out.push(TEXT(c.textContent, format)); continue; }
    if (c.nodeType !== 1) continue;
    const el = c as El;
    const tag = el.tagName.toLowerCase();
    if (tag === "b" || tag === "strong") out.push(...inlineNodes(el, format | 1));
    else if (tag === "em" || tag === "i") out.push(...inlineNodes(el, format | 2));
    else if (tag === "code") out.push(...inlineNodes(el, format | 16));
    else if (tag === "br") out.push({ type: "linebreak", version: 1 });
    else if (tag === "a") {
      out.push({ type: "link", version: 3, direction: "ltr", format: "", indent: 0, fields: { linkType: "custom", newTab: /^https?:/.test(el.getAttribute("href") ?? ""), url: el.getAttribute("href") ?? "#" }, children: inlineNodes(el, format) });
    } else throw new Unsupported(`inline <${tag}>`);
  }
  return out;
}

const para = (children: unknown[]) => ({ type: "paragraph", version: 1, direction: "ltr", format: "", indent: 0, textFormat: 0, textStyle: "", children });
const heading = (tag: string, children: unknown[]) => ({ type: "heading", version: 1, tag, direction: "ltr", format: "", indent: 0, children });

function listNode(el: El) {
  const ordered = el.tagName === "OL";
  return {
    type: "list", version: 1, listType: ordered ? "number" : "bullet", start: 1, tag: ordered ? "ol" : "ul", direction: "ltr", format: "", indent: 0,
    children: kids(el).map((li, n) => ({ type: "listitem", version: 1, value: n + 1, direction: "ltr", format: "", indent: 0, children: inlineNodes(must(has(li, "li") && li)) })),
  };
}

/* ----------------------------- one body item → node ----------------------------- */
function convertItem(raw: string, article: string, report: Report): unknown {
  const box = doc.createElement("div");
  box.innerHTML = raw;
  mapLinks(box);
  const el = box.firstElementChild;
  const startsWithTag = /^\s*</.test(raw);
  const inlineOnly = !startsWithTag || (el && /^(a|b|strong|em|i)$/.test(el.tagName.toLowerCase()));

  const fallback = (kind: string, why: string) => {
    report.fallbacks.push({ article, kind, why, src: raw.slice(0, 700) });
    const isDiagram = !!el && el.matches(RAW_DIAGRAM);
    report.structured[isDiagram ? "diagramHtml" : "htmlBlock"] = (report.structured[isDiagram ? "diagramHtml" : "htmlBlock"] ?? 0) + 1;
    const kindName = el ? (Array.from(el.classList).filter((c) => /^(xd-|af-)/.test(c))[0] ?? el.tagName.toLowerCase()) : "html";
    return blockNode(isDiagram ? "diagramHtml" : "htmlBlock", isDiagram ? { kind: kindName, html: box.innerHTML } : { html: box.innerHTML });
  };

  try {
    if (/<a\s[^>]*class=/.test(raw)) return fallback("link", "link with a style class (button)");
    if (inlineOnly) { report.structured.paragraph = (report.structured.paragraph ?? 0) + 1; return para(inlineNodes(box)); }
    if (!el || box.children.length !== 1) return fallback("multi", "several top-level elements");
    const tag = el.tagName.toLowerCase();
    if (tag === "p" && !el.className) { report.structured.paragraph = (report.structured.paragraph ?? 0) + 1; return para(inlineNodes(el)); }
    if (tag === "h2" || tag === "h3") { report.structured[tag] = (report.structured[tag] ?? 0) + 1; return heading(tag, inlineNodes(el)); }
    // "ev-list" is the plain list of the press articles: keep it editable as a list.
    if ((tag === "ul" || tag === "ol") && (!el.className || el.className === "ev-list")) { report.structured.list = (report.structured.list ?? 0) + 1; return listNode(el); }

    if (el.matches(RAW_DIAGRAM)) return fallback("raw", "generated or bespoke diagram");
    for (const [type, parse] of PARSERS) {
      let fields: Fields | null;
      try { fields = parse(el); } catch (err) { if (err instanceof Unsupported) return fallback(type, err.message); throw err; }
      if (!fields) continue;
      if (canonHtml(renderBlock(type, fields)) !== canonHtml(el.outerHTML)) return fallback(type, "re-render differs from source");
      report.structured[type] = (report.structured[type] ?? 0) + 1;
      return blockNode(type, fields);
    }
    return fallback(tag, "no matching block");
  } catch (err) {
    if (err instanceof Unsupported) return fallback("inline", err.message);
    throw err;
  }
}

/** The mockup's news feed spreads a list over several body items ("<ul>", "<li>…", "</ul>"): put each element back together. */
export function wholeElements(body: string[]): string[] {
  const out: string[] = [];
  let open = 0;
  for (const item of body) {
    if (open > 0) out[out.length - 1] += item;
    else out.push(item);
    open += (item.match(/<(ul|ol|div|table|figure)\b/g)?.length ?? 0) - (item.match(/<\/(ul|ol|div|table|figure)>/g)?.length ?? 0);
  }
  return out;
}

export function bodyToLexical(body: string[], article: string, report: Report) {
  return {
    root: {
      type: "root", version: 1, direction: "ltr", format: "", indent: 0,
      children: wholeElements(body).map((b) => convertItem(b, article, report)),
    },
  };
}
