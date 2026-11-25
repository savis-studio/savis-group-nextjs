"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { groupResults, search, type SearchEntry } from "@/lib/search";

/** Full-screen search. Loads the index the first time it opens, then filters in the browser. */
export function SearchOverlay({ open, onClose, mac }: { open: boolean; onClose: () => void; mac: boolean }) {
  const router = useRouter();
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!index && !failed) {
      fetch("/search-index").then((r) => (r.ok ? r.json() : Promise.reject(r.status))).then(setIndex).catch(() => setFailed(true));
    }
    return () => { document.body.style.overflow = prevOverflow; };
  }, [open, index, failed]);

  const results = useMemo(() => (index ? search(index, q, 24) : []), [index, q]);
  const groups = useMemo(() => groupResults(results), [results]);
  const flat = useMemo(() => groups.flatMap(([, items]) => items), [groups]);

  useEffect(() => { setActive(0); }, [q]);
  useEffect(() => { list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" }); }, [active]);

  if (!open) return null;

  const go = (path: string) => { onClose(); router.push(path); };
  const all = `/search?q=${encodeURIComponent(q.trim())}`;
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { e.preventDefault(); onClose(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, flat.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter") {
      e.preventDefault();
      if (flat[active]) go(flat[active].u);
      else if (q.trim()) go(all);
    } else if (e.key === "Tab") {
      // Keep focus inside the dialog: the input and the close button are the only stops.
      const stops = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("input,button:not([tabindex='-1'])"));
      const i = stops.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey ? (i <= 0 ? stops.length - 1 : i - 1) : (i === stops.length - 1 ? 0 : i + 1);
      e.preventDefault();
      stops[next]?.focus();
    }
  };

  let n = -1;
  return (
    <div className="sv-sr" role="dialog" aria-modal="true" aria-label="Search" onKeyDown={onKey}>
      <button type="button" className="sv-sr__scrim" aria-label="Close search" tabIndex={-1} onClick={onClose} />
      <div className="sv-sr__panel">
        <div className="sv-sr__bar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} type="search" placeholder="Search products, solutions, insights…"
            role="combobox" aria-expanded={flat.length > 0} aria-controls="sv-sr-list" aria-activedescendant={flat[active] ? `sv-sr-${active}` : undefined}
            autoComplete="off" spellCheck={false} aria-label="Search the site" />
          <button type="button" className="sv-sr__x" onClick={onClose}>Esc</button>
        </div>
        <div className="sv-sr__body" ref={list} id="sv-sr-list" role="listbox" aria-label="Results">
          {failed && <p className="sv-sr__msg">Search is unavailable right now. Try again in a moment.</p>}
          {!failed && !index && <p className="sv-sr__msg">Loading…</p>}
          {index && !q.trim() && <p className="sv-sr__msg">Type to search {index.length} pages: solutions, products, use cases, customer stories and articles.</p>}
          {index && q.trim() && flat.length === 0 && (
            <p className="sv-sr__msg">No results for “{q.trim()}”. Try fewer words, or <button type="button" onClick={() => go("/contact")}>ask an expert</button>.</p>
          )}
          {groups.map(([kind, items]) => (
            <div key={kind} role="group" aria-label={kind}>
              <span className="sv-sr__k">{kind}</span>
              {items.map((r) => {
                n += 1;
                const i = n;
                return (
                  <a key={r.u} id={`sv-sr-${i}`} role="option" aria-selected={i === active} href={r.u} className="sv-sr__hit"
                    onMouseMove={() => setActive(i)} onClick={(e) => { e.preventDefault(); go(r.u); }}>
                    <b>{r.t}</b>
                    <span>{r.s}</span>
                  </a>
                );
              })}
            </div>
          ))}
          {flat.length > 0 && (
            <a className="sv-sr__all" href={all} onClick={(e) => { e.preventDefault(); go(all); }}>See all results →</a>
          )}
        </div>
        <div className="sv-sr__foot" aria-hidden="true">
          <span><kbd className="sv-kbd">↑</kbd> <kbd className="sv-kbd">↓</kbd> to move</span>
          <span><kbd className="sv-kbd">Enter</kbd> to open</span>
          <span><kbd className="sv-kbd">Esc</kbd> to close</span>
          <span className="sv-sr__tip">Open anywhere with <kbd className="sv-kbd">{mac ? "⌘ K" : "Ctrl K"}</kbd></span>
        </div>
      </div>
    </div>
  );
}
