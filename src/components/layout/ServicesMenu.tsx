"use client";

import { useState, type KeyboardEvent, type ReactNode } from "react";
import { LineIcon } from "@/components/ui/LineIcon";
import type { LineIconName } from "@/lib/line-icons";
import { NavLink as SmartLink } from "./NavLink";
import { servicesMenu } from "./nav-data";

export interface ServiceGroup {
  id: string;
  name: string;
  href: string;
  explore: string;
  lead: string;
  lines: Array<{ name: string; href: string; icon: LineIconName }>;
  /** `art` is the color family of the card's picture, `svg` its drawing, rendered on the server. */
  card: { tag: string; title: string; cta: string; href: string; art: string; svg: string };
}

const Chev = () => <svg className="sv-mx__chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>;

/**
 * Services mega menu: the groups on the left. Pointing at a group, or focusing it, lists its services on the right
 * instead of the featured cards. From the keyboard, Right Arrow moves into that list and Left Arrow comes back.
 */
export function ServicesMenu({ groups, featured, onNavigate }: { groups: ServiceGroup[]; featured: ReactNode; onNavigate: () => void }) {
  const [active, setActive] = useState<string | null>(null);
  const group = groups.find((g) => g.id === active) ?? null;

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const root = e.currentTarget;
    const target = e.target as HTMLElement;
    const side = target.closest<HTMLElement>("[data-group]");
    if (e.key === "ArrowRight" && side) {
      e.preventDefault();
      root.querySelector<HTMLElement>(".sv-mx__lines a")?.focus();
    } else if (e.key === "ArrowLeft" && target.closest(".sv-mx__panel") && active) {
      e.preventDefault();
      root.querySelector<HTMLElement>(`[data-group="${active}"] a`)?.focus();
    }
  };

  return (
    <div className="sv-mx__split" onKeyDown={onKey}>
      <div className="sv-mx__side">
        <span className="sv-mx__k">{servicesMenu.heading}</span>
        <ul className="sv-mx__links">
          {groups.map((g) => (
            <li key={g.id} data-group={g.id} onMouseEnter={() => setActive(g.id)} onFocus={() => setActive(g.id)}>
              <SmartLink href={g.href} data-active={active === g.id ? "" : undefined} aria-keyshortcuts="ArrowRight" onClick={onNavigate}>{g.name}<Chev /></SmartLink>
            </li>
          ))}
        </ul>
        <SmartLink href={servicesMenu.all.href} className="sv-mx__more" onClick={onNavigate}>{servicesMenu.all.label}</SmartLink>
        <SmartLink href={servicesMenu.talk.href} className="sv-mx__more" onClick={onNavigate}>{servicesMenu.talk.label}</SmartLink>
      </div>
      <div className="sv-mx__panel">
        {group ? (
          <>
            <div className="sv-mx__head"><span className="sv-mx__k">{group.name}</span><SmartLink href={group.href} onClick={onNavigate}>{group.explore}</SmartLink></div>
            <p className="sv-mx__lead">{group.lead}</p>
            <div className="sv-mx__group">
              <ul className="sv-mx__lines">
                {group.lines.map((l) => (
                  <li key={l.href}><SmartLink href={l.href} onClick={onNavigate}><span><LineIcon name={l.icon} size={16} /></span>{l.name}</SmartLink></li>
                ))}
              </ul>
              <SmartLink href={group.card.href} className="sv-mx__card" onClick={onNavigate}>
                <span className={`sv-mx__thumb uc-th-${group.card.art}`} aria-hidden="true"><span dangerouslySetInnerHTML={{ __html: group.card.svg }} /></span>
                <span className="sv-mx__body"><em>{group.card.tag}</em><b>{group.card.title}</b><i>{group.card.cta}</i></span>
              </SmartLink>
            </div>
          </>
        ) : featured}
      </div>
    </div>
  );
}
