"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { flushSync } from "react-dom";
import { NavLink as SmartLink } from "./NavLink";
import { solutionsMenu, type Link } from "./nav-data";

export interface SolutionPillar {
  id: string;
  name: string;
  short: string;
  groups: Array<{ slug: string; name: string }>;
}

export interface Sector {
  name: string;
  industries: Array<{ id: string; name: string }>;
}

type TabId = (typeof solutionsMenu.tabs)[number]["id"];
interface Row { id: string; name: string; links: Link[]; overview?: Link }

/** Gold strokes pick out one part of each drawing. */
const TAB_ICON: Record<TabId, React.ReactNode> = {
  products: (
    <>
      <path className="sv-sol__gold" d="M20 4l13 6v11c0 8-6 13-13 15C13 34 7 29 7 21V10z" />
      <path d="M14 15l6-3 6 3v7l-6 3-6-3z" />
      <path d="M14 15l6 3 6-3M20 18v7" />
    </>
  ),
  industry: (
    <>
      <path d="M6 34h28M9 34V17l7-4v21M16 34V9l9-4v29M25 34V15l6 3v16" />
      <path className="sv-sol__gold" d="M12 21h1M12 26h1M20 14h1M20 19h1M20 24h1M28 22h1M28 27h1" strokeWidth="2" />
    </>
  ),
};

/**
 * Solutions & Products mega menu. Two ways in on the left; pointing at one lists its pillars or sectors, pointing at one of
 * those lists the product groups or industries under it, and the card on the right follows the selection. Nothing is
 * selected when the menu opens. From the keyboard, Enter selects, Right Arrow moves into the list and Left Arrow comes back.
 */
export function SolutionsMenu({ pillars, sectors, onNavigate }: { pillars: SolutionPillar[]; sectors: Sector[]; onNavigate: () => void }) {
  const [tabId, setTabId] = useState<TabId>("products");
  const [rowId, setRowId] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const cancel = () => window.clearTimeout(timer.current);
  useEffect(() => cancel, []);

  const rows: Row[] = tabId === "products"
    ? pillars.map((p) => ({
        id: p.id,
        name: p.short,
        links: p.groups.map((g) => ({ label: g.name, href: `/solutions/${p.id}#${g.slug}` })),
        overview: { label: `${p.short} overview →`, href: `#pillar-${p.id}` },
      }))
    : sectors.map((s) => ({ id: s.name, name: s.name, links: s.industries.map((i) => ({ label: i.name, href: `#ind-${i.id}` })) }));
  const tab = solutionsMenu.tabs.find((t) => t.id === tabId)!;
  const row = rows.find((r) => r.id === rowId) ?? null;
  const doc = solutionsMenu.docs[row?.id ?? tabId] ?? solutionsMenu.docs[tabId];

  const showTab = (id: TabId) => { cancel(); setTabId(id); setRowId(null); };
  const showRow = (id: string) => { cancel(); setRowId(id); };

  /** Hover waits a moment, longer once a list is open, so a diagonal move toward it does not switch rows on the way. */
  const intent = (e: PointerEvent, changes: boolean, apply: () => void) => {
    if (e.pointerType === "touch") return;
    cancel();
    if (changes) timer.current = window.setTimeout(apply, rowId ? 180 : 80);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const root = e.currentTarget;
    const target = e.target as HTMLElement;
    const from = target.closest<HTMLElement>("[data-row]")?.dataset.row;
    if (e.key === "ArrowRight" && from) {
      e.preventDefault();
      flushSync(() => showRow(from));
      root.querySelector<HTMLElement>(".sv-sol__sub a")?.focus();
    } else if (e.key === "ArrowLeft" && target.closest(".sv-sol__sub") && rowId) {
      e.preventDefault();
      root.querySelector<HTMLElement>(`[data-row="${rowId}"]`)?.focus();
    }
  };

  return (
    <div className="sv-sol" onKeyDown={onKey}>
      <div className="sv-sol__tabs">
        {solutionsMenu.tabs.map((t) => (
          <button key={t.id} type="button" className="sv-sol__tab" aria-pressed={tabId === t.id}
            onClick={() => showTab(t.id)} onPointerEnter={(e) => intent(e, t.id !== tabId, () => showTab(t.id))}>
            <svg viewBox="0 0 40 40" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">{TAB_ICON[t.id]}</svg>
            <b>{t.title}</b>
            <span>{t.text}</span>
          </button>
        ))}
        <SmartLink href={solutionsMenu.overview.href} className="sv-sol__all" onClick={onNavigate}>{solutionsMenu.overview.label}</SmartLink>
      </div>
      <div className="sv-sol__rule" aria-hidden="true" />
      <div>
        <span className="sv-sol__k">{tab.heading}</span>
        <ul className="sv-sol__list">
          {rows.map((r) => (
            <li key={r.id}>
              <button type="button" data-row={r.id} aria-current={row?.id === r.id} aria-keyshortcuts="ArrowRight"
                onClick={() => showRow(r.id)} onPointerEnter={(e) => intent(e, r.id !== rowId, () => showRow(r.id))}>
                {r.name}
              </button>
            </li>
          ))}
        </ul>
        <SmartLink href={tab.all.href} className="sv-sol__all" onClick={onNavigate}>{tab.all.label}</SmartLink>
      </div>
      <div onPointerEnter={cancel}>
        {row && (
          <div className="sv-sol__sub" key={row.id}>
            <span className="sv-sol__k">{row.name}</span>
            <ul className="sv-sol__list">
              {row.links.map((l) => <li key={l.href}><SmartLink href={l.href} onClick={onNavigate}>{l.label}</SmartLink></li>)}
            </ul>
            {row.overview && <SmartLink href={row.overview.href} className="sv-sol__all" onClick={onNavigate}>{row.overview.label}</SmartLink>}
          </div>
        )}
      </div>
      <SmartLink href={solutionsMenu.request} className="sv-sol__doc" onClick={onNavigate}>
        <span className="sv-sol__k">Featured {doc.kind.toLowerCase()}</span>
        <span className="sv-sol__cover" data-pal={doc.pal} aria-hidden="true"><em>SAVIS {doc.kind} · 2026</em><b>{doc.title}</b></span>
        <b>{doc.series ?? doc.title}</b>
        <i>Request the {doc.kind.toLowerCase()} →</i>
      </SmartLink>
    </div>
  );
}
