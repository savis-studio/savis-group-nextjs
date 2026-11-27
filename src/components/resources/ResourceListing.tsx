"use client";

import { useEffect, useRef, useState } from "react";
import { pageList } from "@/components/insights/InsightListing";
import { SmartLink } from "@/components/ui/SmartLink";
import { animateThumbs } from "@/components/ui/VxActivate";
import type { FilmId } from "@/data/films";
import type { ResourceArt as Art } from "@/lib/resources";
import { ResourceArt } from "./ResourceArt";
import { VideoDialog } from "./VideoDialog";

export interface LibraryItem {
  id: string;
  title: string;
  text: string;
  /** Pillar the item belongs to; the chips filter on it. */
  topic?: string;
  /** "Datasheet · Digital Identity & Trust": the kind, then what it is about. */
  kind: string;
  about?: string;
  art: Art;
  /** Opens the video instead of a page. */
  film?: FilmId;
  /** The first link is the picture's too. */
  links: Array<{ label: string; href: string }>;
}

type Sort = "featured" | "az" | "za";

/**
 * A resource category: sort, filter by solution and pages over a grid of cards. Only the cards on screen are rendered,
 * so a long list such as the datasheets stays light.
 */
export function ResourceListing({ title, items, topics, perPage, skip }: {
  title: string;
  items: LibraryItem[];
  /** Filter chips; shown when there is more than one. */
  topics: Array<{ id: string; label: string }>;
  perPage: number;
  /** An item shown above the list, left out of it until a filter is chosen. */
  skip?: string;
}) {
  const [topic, setTopic] = useState("");
  const [sort, setSort] = useState<Sort>("featured");
  const [page, setPage] = useState(1);
  const [film, setFilm] = useState<FilmId | null>(null);
  const top = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);

  const hits = items.filter((i) => (topic ? i.topic === topic : i.id !== skip));
  if (sort !== "featured") hits.sort((a, b) => (sort === "az" ? 1 : -1) * a.title.localeCompare(b.title, "en"));
  const pages = Math.max(1, Math.ceil(hits.length / perPage));
  const current = Math.min(page, pages);
  const shown = hits.slice((current - 1) * perPage, current * perPage);

  // Cards drawn after the page loaded need their animation started too.
  useEffect(() => (grid.current ? animateThumbs(grid.current) : undefined), [topic, sort, current]);

  const turn = (p: number) => { setPage(p); top.current?.scrollIntoView({ block: "start" }); };

  return (
    <div className="sv-lib" ref={top}>
      <div className="sv-lib__tools">
        <h2>{title}</h2>
        <label>
          Sort by
          <select value={sort} onChange={(e) => { setSort(e.target.value as Sort); setPage(1); }}>
            <option value="featured">Featured</option>
            <option value="az">Name (A-Z)</option>
            <option value="za">Name (Z-A)</option>
          </select>
        </label>
      </div>
      {topics.length > 1 && (
        <div className="sv-lib__chips" role="group" aria-label="Filter by solution">
          {[{ id: "", label: "All solutions" }, ...topics].map((t) => (
            <button key={t.id} type="button" aria-pressed={topic === t.id} onClick={() => { setTopic(t.id); setPage(1); }}>{t.label}</button>
          ))}
        </div>
      )}
      <div className="sv-lib__grid" ref={grid}>
        {shown.map((i) => {
          const picture = (
            <>
              <ResourceArt art={i.art} />
              {i.film && <span className="sv-mx__play" aria-hidden="true" />}
            </>
          );
          return (
            <article key={i.id} className="sv-libcard">
              {i.film
                ? <button type="button" className="sv-libcard__th" aria-haspopup="dialog" aria-label={`Play: ${i.title}`} onClick={() => setFilm(i.film as FilmId)}>{picture}</button>
                : <SmartLink href={i.links[0].href} className="sv-libcard__th" aria-label={`${i.links[0].label.replace(" →", "")}: ${i.title}`} tabIndex={-1}>{picture}</SmartLink>}
              <span className="sv-libcard__meta"><b>{i.kind}</b>{i.about && <> · {i.about}</>}</span>
              <h3>{i.title}</h3>
              <p>{i.text}</p>
              <span className="sv-libcard__acts">
                {i.film
                  ? <button type="button" aria-haspopup="dialog" onClick={() => setFilm(i.film as FilmId)}>Watch the video →</button>
                  : i.links.map((l) => <SmartLink key={l.label} href={l.href} aria-label={`${l.label.replace(" →", "")}: ${i.title}`}>{l.label}</SmartLink>)}
              </span>
            </article>
          );
        })}
      </div>
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
      <p className="sv-lib__count" aria-live="polite">Page {current} of {pages} · {hits.length} {hits.length === 1 ? "item" : "items"}</p>
      <VideoDialog film={film} onClose={() => setFilm(null)} />
    </div>
  );
}
