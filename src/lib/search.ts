/** Site search: entry shape and the scoring used by both the overlay (in the browser) and the /search page (on the server). */
export interface SearchEntry {
  /** Title. */
  t: string;
  /** Path. */
  u: string;
  /** Kind, shown as the group heading. */
  k: string;
  /** Short summary. */
  s: string;
  /** Extra keywords (tags, client, country, product names), searched but not shown. */
  x?: string;
}

/** Group order in the results. */
export const KIND_ORDER = ["Solution", "Product", "Use case", "Industry", "Customer story", "Insight", "News", "Press", "Page"];

/** Lower case, accents removed (so "dinh danh" finds "định danh"), punctuation to spaces. */
export const fold = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/đ/g, "d").replace(/[^\p{L}\p{N}]+/gu, " ").trim();

const prepared = new WeakMap<SearchEntry, { t: string; s: string; x: string }>();
const fields = (e: SearchEntry) => {
  let f = prepared.get(e);
  if (!f) prepared.set(e, (f = { t: fold(e.t), s: fold(e.s), x: fold(e.x ?? "") }));
  return f;
};

/** Every query word must appear somewhere; title hits count most, then keywords, then the summary. */
export function search(entries: SearchEntry[], query: string, limit = 30): SearchEntry[] {
  const terms = fold(query).split(" ").filter(Boolean);
  if (terms.length === 0) return [];
  const scored: Array<[number, SearchEntry]> = [];
  for (const e of entries) {
    const f = fields(e);
    const titleWords = f.t.split(" ");
    let score = 0;
    let ok = true;
    for (const term of terms) {
      let s = 0;
      if (titleWords.includes(term)) s = 10;
      else if (titleWords.some((w) => w.startsWith(term))) s = 8;
      else if (f.t.includes(term)) s = 6;
      else if (f.x.includes(term)) s = 4;
      else if (f.s.includes(term)) s = 2;
      if (s === 0) { ok = false; break; }
      score += s;
    }
    if (!ok) continue;
    if (f.t === terms.join(" ")) score += 20;
    else if (f.t.startsWith(terms.join(" "))) score += 8;
    scored.push([score, e]);
  }
  return scored.sort((a, b) => b[0] - a[0] || a[1].t.localeCompare(b[1].t)).slice(0, limit).map(([, e]) => e);
}

/** Groups results by kind, in display order. */
export function groupResults(results: SearchEntry[]): Array<[kind: string, items: SearchEntry[]]> {
  const by = new Map<string, SearchEntry[]>();
  for (const r of results) by.set(r.k, [...(by.get(r.k) ?? []), r]);
  return [...by.entries()].sort((a, b) => (KIND_ORDER.indexOf(a[0]) + 100) % 100 - (KIND_ORDER.indexOf(b[0]) + 100) % 100);
}
