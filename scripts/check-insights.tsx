/* Verifies that every article stored in Payload renders the same HTML as the mockup source (bare text becomes <p>).
   Usage: npx payload run scripts/check-insights.tsx */
import config from "@payload-config";
import { getPayload } from "payload";
import { JSDOM } from "jsdom";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import news from "../src/data/mockup/news.json" with { type: "json" };
import { ArticleRichText } from "../src/components/page/ArticleRichText";
import { canonHtml, wholeElements } from "../src/lib/insight-import";
import { localMedia, mapHref } from "../src/lib/insight-href";

const payload = await getPayload({ config });
const { docs } = await payload.find({ collection: "insights", limit: 500, pagination: false, depth: 0 });
const bySlug = new Map(docs.map((d) => [d.slug, d]));
const files = await payload.find({ collection: "media", limit: 1000, pagination: false, depth: 0 });
const urls = new Map(files.docs.map((f) => [f.filename ?? "", f.url ?? ""]));
const norm = (h: string) => h.replace(/<(\/?)strong>/g, "<$1b>").replace(/ class=""/g, "");
let bad = 0;
let checked = 0;

// One document for every comparison: a new JSDOM window per article runs the container out of memory.
const page = new JSDOM("<!doctype html><body></body>").window.document;
const parse = (html: string) => {
  const box = page.createElement("div");
  box.innerHTML = html;
  return box;
};

/** What a reader sees: each run of text with its bold, italic and link, however the editor nests those tags. */
function runs(html: string): string {
  let out = "";
  let last = "";
  const walk = (node: Node, format: string[], link: string) => {
    for (const c of Array.from(node.childNodes)) {
      if (c.nodeType === 3) {
        const text = (c.textContent ?? "").replace(/\s+/g, " ");
        if (!text.trim()) continue;
        const key = `[${[...new Set(format)].sort().join(" ")} ${link}]`;
        out += (key === last ? "" : key) + text;
        last = key;
      } else if (c.nodeType === 1) {
        const el = c as Element;
        const tag = el.tagName.toLowerCase();
        if ((tag === "b" || tag === "em") && el.attributes.length === 0) walk(el, [...format, tag], link);
        else if (tag === "a") walk(el, format, `${el.getAttribute("href")} ${el.getAttribute("class") ?? ""}`);
        else {
          const attrs = Array.from(el.attributes).map((a) => `${a.name}="${a.value.trim()}"`).sort().join(" ");
          out += `<${tag} ${attrs}>`;
          last = "";
          walk(el, format, link);
          out += `</${tag}>`;
          last = "";
        }
      }
    }
  };
  walk(parse(canonHtml(html)), [], "");
  return out;
}

for (const n of news as Array<{ id: string; body?: string[] }>) {
  const d = bySlug.get(n.id);
  if (!d) { console.log("MISSING in CMS:", n.id); bad++; continue; }
  if (!n.body?.length) continue;
  const expected = wholeElements(n.body)
    .map((b) => localMedia(b, (f) => urls.get(f)).replace(/<ul class="ev-list">/g, "<ul>"))
    .filter((b) => b.trim() !== "")
    .map((b) => (/^\s*<(?!(a|b|strong|em|i)[\s>])/.test(b) ? b : `<p>${b}</p>`))
    .join("")
    .replace(/href="(#[^"]*)"/g, (_m, h: string) => `href="${mapHref(h)}"`);
  const box = parse(renderToStaticMarkup(createElement(ArticleRichText, { data: d.body as never })));
  box.querySelectorAll("noscript, .ph-gal").forEach((x) => x.remove()); // the gallery is added by the import
  box.querySelectorAll('div[style="display:contents"]').forEach((w) => w.replaceWith(...Array.from(w.childNodes)));
  const actual = box.querySelector(".article")!.innerHTML
    .replace(/ class="(list-(bullet|number))?"/g, "").replace(/ value="[0-9]+"/g, "").replace(/<(\/?)strong>/g, "<$1b>");
  checked++;
  const a = runs(norm(expected)), b = runs(norm(actual));
  if (a !== b) {
    bad++;
    let i = 0; while (i < a.length && a[i] === b[i]) i++;
    console.log(`DIFF ${n.id} @${i}\n  src: ${a.slice(Math.max(0, i - 60), i + 120)}\n  cms: ${b.slice(Math.max(0, i - 60), i + 120)}`);
  }
}
console.log(`${checked} articles compared, ${bad} differ.`);
process.exit(bad ? 1 : 0);
