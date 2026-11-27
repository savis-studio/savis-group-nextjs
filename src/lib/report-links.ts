/**
 * Finds the links of an article that were pointed at /insights while reports had no pages (see insight-href.ts), and
 * points them at the report. A link is recognised by its words, as written in the bundled article. Used by
 * scripts/link-reports.ts. Not imported by the website.
 */
import { fold } from "./search";
import { fixWording } from "./wording";

/** The words of a link, comparable: no tags, markup or punctuation, in the house style. */
export const linkWords = (s: string) =>
  fold(fixWording(s.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&#?\w+;/g, " ").replace(/\*/g, "")));

const REPORT_LINK = /<a\s[^>]*href="#(report-[a-z0-9-]+|resources-reports)"[^>]*>([\s\S]*?)<\/a>/g;

/**
 * Link words to mockup targets ("report-<slug>" or "resources-reports") of one bundled article. Words that lead to two
 * different targets are left out.
 */
export function reportLinks(bundledHtml: string): Map<string, string> {
  const found = new Map<string, string | null>();
  for (const [, target, label] of bundledHtml.matchAll(REPORT_LINK)) {
    const words = linkWords(label);
    if (!words) continue;
    found.set(words, found.has(words) && found.get(words) !== target ? null : target);
  }
  return new Map([...found].flatMap(([k, v]) => (v ? [[k, v] as [string, string]] : [])));
}

const OLD = "/insights";

/**
 * A copy of the article body with those links changed, wherever they sit: rich text links, "[words](address)" markup
 * in a block, or HTML in a block. `address` answers where the words lead, or undefined to leave the link as it is.
 */
export function relink(value: unknown, address: (words: string) => string | undefined, changed: string[]): unknown {
  const swap = (label: string) => {
    const to = address(linkWords(label));
    if (to) changed.push(`${label.replace(/<[^>]*>/g, "").trim()} -> ${to}`);
    return to;
  };
  if (typeof value === "string") {
    return value
      .replace(/\[((?:[^\][]|\[[^\]]*\])+)\]\(\/insights\)/g, (m, label: string) => {
        const to = swap(label);
        return to ? `[${label}](${to})` : m;
      })
      .replace(/(<a\s[^>]*href=")\/insights("[^>]*>)([\s\S]*?)(<\/a>)/g, (m, open: string, mid: string, label: string, close: string) => {
        const to = swap(label);
        return to ? `${open}${to}${mid}${label}${close}` : m;
      });
  }
  if (Array.isArray(value)) return value.map((v) => relink(v, address, changed));
  if (!value || typeof value !== "object") return value;
  const node = value as Record<string, unknown>;
  const fields = node.fields as Record<string, unknown> | undefined;
  if ((node.type === "link" || node.type === "autolink") && fields?.url === OLD) {
    const text = (n: unknown): string => {
      const o = n as { text?: string; children?: unknown[] };
      return o.text ?? (o.children ?? []).map(text).join("");
    };
    const to = swap(text(node));
    if (to) return { ...node, fields: { ...fields, url: to } };
  }
  return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, relink(v, address, changed)]));
}
