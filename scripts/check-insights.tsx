/* Verifies that every article stored in Payload renders the same HTML as the mockup source (bare text becomes <p>).
   Usage: npx payload run scripts/check-insights.tsx */
import config from "@payload-config";
import { getPayload } from "payload";
import { JSDOM } from "jsdom";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import news from "../src/data/mockup/news.json" with { type: "json" };
import { ArticleRichText } from "../src/components/page/ArticleRichText";
import { canonHtml } from "../src/lib/insight-import";
import { mapHref } from "../src/lib/insight-href";

const payload = await getPayload({ config });
const { docs } = await payload.find({ collection: "insights", limit: 500, pagination: false, depth: 0 });
const bySlug = new Map(docs.map((d) => [d.slug, d]));
const norm = (h: string) => h.replace(/<(\/?)strong>/g, "<$1b>").replace(/ class=""/g, "");
let bad = 0;
let checked = 0;

for (const n of news as Array<{ id: string; body?: string[] }>) {
  const d = bySlug.get(n.id);
  if (!d) { console.log("MISSING in CMS:", n.id); bad++; continue; }
  if (!n.body?.length) continue;
  const expected = n.body
    .map((b) => (/^\s*<(?!(a|b|strong|em|i)[\s>])/.test(b) ? b : `<p>${b}</p>`))
    .join("")
    .replace(/href="(#[^"]*)"/g, (_m, h: string) => `href="${mapHref(h)}"`);
  const box = new JSDOM(renderToStaticMarkup(createElement(ArticleRichText, { data: d.body as never }))).window.document.body;
  box.querySelectorAll("noscript").forEach((x) => x.remove());
  box.querySelectorAll('div[style="display:contents"]').forEach((w) => w.replaceWith(...Array.from(w.childNodes)));
  const actual = box.querySelector(".article")!.innerHTML
    .replace(/ class="(list-(bullet|number))?"/g, "").replace(/ value="[0-9]+"/g, "").replace(/<(\/?)strong>/g, "<$1b>");
  checked++;
  if (canonHtml(norm(expected)) !== canonHtml(norm(actual))) {
    bad++;
    const a = canonHtml(norm(expected)), b = canonHtml(norm(actual));
    let i = 0; while (i < a.length && a[i] === b[i]) i++;
    console.log(`DIFF ${n.id} @${i}\n  src: ${a.slice(Math.max(0, i - 60), i + 120)}\n  cms: ${b.slice(Math.max(0, i - 60), i + 120)}`);
  }
}
console.log(`${checked} articles compared, ${bad} differ.`);
process.exit(bad ? 1 : 0);
