"use client";
import { useRef, useState, type ReactNode } from "react";

export interface ListingItem {
  id: string;
  category?: string;
  region?: string;
  /** Plain text the search box looks in. */
  text: string;
  node: ReactNode;
}

const PER_PAGE = 9;

/** Lower case without accents, so "Viet Nam" finds "Việt Nam". */
const plain = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").toLowerCase();

/** Page numbers with gaps: 1 2 3 4 5 … 12. */
function pageList(pages: number, current: number): Array<number | "gap"> {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "gap", pages];
  if (current >= pages - 3) return [1, "gap", pages - 4, pages - 3, pages - 2, pages - 1, pages];
  return [1, "gap", current - 1, current, current + 1, "gap", pages];
}

function Select({ label, all, options, value, onChange }: { label: string; all: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <label className="sv-filter__sel">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{all}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

/**
 * A tab's articles: category, region and text filters, nine cards a page. All cards come rendered from the server;
 * this only chooses which to show. A filter with fewer than two choices is left out.
 */
export function InsightListing({ items, categories = [], regions = [] }: { items: ListingItem[]; categories?: string[]; regions?: string[] }) {
  const [category, setCategory] = useState("");
  const [region, setRegion] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const top = useRef<HTMLDivElement>(null);

  const words = plain(query).split(/\s+/).filter(Boolean);
  const hits = items.filter((i) =>
    (!category || i.category === category) && (!region || i.region === region) && words.every((w) => plain(i.text).includes(w)));
  const pages = Math.max(1, Math.ceil(hits.length / PER_PAGE));
  const current = Math.min(page, pages);
  const from = (current - 1) * PER_PAGE;
  const shown = new Set(hits.slice(from, from + PER_PAGE).map((i) => i.id));

  const filter = (set: (v: string) => void) => (v: string) => { set(v); setPage(1); };
  const turn = (p: number) => { setPage(p); top.current?.scrollIntoView({ block: "start" }); };

  return (
    <div className="sv-listing" ref={top}>
      <div className="sv-filter">
        {categories.length > 1 && <Select label="Category" all="All categories" options={categories} value={category} onChange={filter(setCategory)} />}
        {regions.length > 1 && <Select label="Region" all="All regions" options={regions} value={region} onChange={filter(setRegion)} />}
        <label className="sv-filter__q">
          <span className="sr-only">Search</span>
          <input type="search" placeholder="Search articles" autoComplete="off" value={query} onChange={(e) => filter(setQuery)(e.target.value)} />
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        </label>
      </div>
      <p className="sv-listing__count" aria-live="polite">
        {hits.length ? `Showing ${from + 1}-${from + shown.size} of ${hits.length}` : ""}
      </p>
      <div className="sv-lgrid">
        {items.map((i) => <div key={i.id} hidden={!shown.has(i.id)}>{i.node}</div>)}
      </div>
      {!hits.length && <p className="sv-listing__empty">No articles match your search. Try another keyword or category.</p>}
      {pages > 1 && (
        <nav className="sv-pager" aria-label="Pagination">
          <button type="button" aria-label="Previous page" disabled={current === 1} onClick={() => turn(current - 1)}>‹</button>
          {pageList(pages, current).map((p, i) =>
            p === "gap"
              ? <span key={`gap-${i}`} aria-hidden="true">…</span>
              : <button key={p} type="button" aria-current={p === current ? "page" : undefined} onClick={() => turn(p)}>{p}</button>)}
          <button type="button" className="sv-pager__next" aria-label="Next page" disabled={current === pages} onClick={() => turn(current + 1)}>›</button>
        </nav>
      )}
    </div>
  );
}
