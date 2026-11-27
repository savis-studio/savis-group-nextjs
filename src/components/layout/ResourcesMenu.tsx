"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { flushSync } from "react-dom";
import { ResourceArt } from "@/components/resources/ResourceArt";
import type { FilmId } from "@/data/films";
import type { ResourceSet } from "@/lib/resources";
import { NavLink as SmartLink } from "./NavLink";
import { resourcesMenu } from "./nav-data";

const Chev = () => <svg className="sv-mx__chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>;

/**
 * Resources mega menu: the categories on the left, three cards on the right. Pointing at a category, or focusing it,
 * previews its items; clicking it opens the category. From the keyboard, Right Arrow moves into the cards and Left
 * Arrow comes back.
 */
export function ResourcesMenu({ sets, onNavigate, onFilm }: { sets: ResourceSet[]; onNavigate: () => void; onFilm: (film: FilmId) => void }) {
  const [active, setActive] = useState<ResourceSet["id"]>("featured");
  const set = sets.find((s) => s.id === active) ?? sets[0];

  // A short delay, so crossing a row on the way to the cards does not change them.
  const timer = useRef<number | undefined>(undefined);
  const cancel = () => window.clearTimeout(timer.current);
  useEffect(() => cancel, []);
  const aim = (id: ResourceSet["id"]) => (e: PointerEvent) => {
    if (e.pointerType === "touch" || id === active) return cancel();
    cancel();
    timer.current = window.setTimeout(() => setActive(id), active === "featured" ? 80 : 160);
  };
  const show = (id: ResourceSet["id"]) => { cancel(); setActive(id); };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const root = e.currentTarget;
    const target = e.target as HTMLElement;
    const row = target.closest<HTMLElement>("[data-cat]");
    if (e.key === "ArrowRight" && row) {
      e.preventDefault();
      flushSync(() => show(row.dataset.cat as ResourceSet["id"]));
      root.querySelector<HTMLElement>(".sv-rf__card")?.focus();
    } else if (e.key === "ArrowLeft" && target.closest(".sv-rf__panel") && active !== "featured") {
      e.preventDefault();
      root.querySelector<HTMLElement>(`[data-cat="${active}"] a`)?.focus();
    }
  };

  return (
    <div className="sv-rf" onKeyDown={onKey}>
      <div className="sv-rf__side">
        <span className="sv-mx__k">{resourcesMenu.heading}</span>
        <ul className="sv-rf__cats">
          {resourcesMenu.categories.map((c) => (
            <li key={c.id} data-cat={c.id} onPointerEnter={aim(c.id)} onPointerLeave={cancel} onFocus={() => show(c.id)}>
              <SmartLink href={c.href} data-active={active === c.id ? "" : undefined} aria-keyshortcuts="ArrowRight" onClick={onNavigate}>{c.label}<Chev /></SmartLink>
            </li>
          ))}
        </ul>
        <SmartLink href={resourcesMenu.all.href} className="sv-mx__more" onClick={onNavigate}>{resourcesMenu.all.label}</SmartLink>
      </div>
      <div className="sv-rf__panel" onPointerEnter={cancel}>
        <div className="sv-mx__head"><span className="sv-mx__k">{set.heading}</span><SmartLink href={set.more.href} onClick={onNavigate}>{set.more.label}</SmartLink></div>
        <div className="sv-rf__cards" key={set.id}>
          {set.cards.map((c) => {
            const body = (
              <>
                <span className="sv-rf__th">
                  <ResourceArt art={c.art} />
                  <em>{c.tag}</em>
                  {c.film && <span className="sv-mx__play" aria-hidden="true" />}
                </span>
                <span className="sv-rf__body">
                  <b>{c.title}</b>
                  <span>{c.text}</span>
                  <i>{c.cta}</i>
                </span>
              </>
            );
            return c.film
              ? <button key={c.title} type="button" className="sv-rf__card" aria-haspopup="dialog" onClick={() => onFilm(c.film as FilmId)}>{body}</button>
              : <SmartLink key={c.title} href={c.href ?? "#resources"} className="sv-rf__card" onClick={onNavigate}>{body}</SmartLink>;
          })}
        </div>
      </div>
    </div>
  );
}
