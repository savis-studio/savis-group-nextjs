"use client";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Button } from "./Button";
import { Logo } from "./Logo";
import type { LogoSources } from "./Logo";
import { SmartLink } from "./SmartLink";

export interface NavLink { label: string; href: string; /** Second line under the link in the mega-menu. */ note?: string }
export interface NavGroup { heading: string; href?: string; links: NavLink[] }
export interface NavRail { eyebrow?: string; title: string; text?: string; links?: NavLink[] }
export interface NavCategory { label: string; href: string; links: NavLink[] }
export interface NavItem {
  label: string;
  /** Section landing page; used by the drawer's "overview" link and when the item has no menu. */
  href: string;
  /** Left column of the mega-menu. */
  rail?: NavRail;
  /** Columns of link groups (Services, Insights, Resources, Company). */
  groups?: NavGroup[];
  /** Drill-down menu (Solutions & Products): pick a category, see its links. */
  categories?: NavCategory[];
  /** Label of the "see all" link under the categories. */
  allLabel?: string;
  feature?: { title: string; text: string; href: string; cta: string };
}

export interface SiteHeaderProps {
  nav: NavItem[];
  utilityLinks?: NavLink[];
  cta?: NavLink;
  onSearch?: () => void;
  logoBasePath?: string;
  logoSources?: LogoSources;
  /** Label of the current top-level item (aria-current). */
  current?: string;
  /** Open this item's mega-menu on first render (previews, docs). */
  defaultOpen?: string;
  extra?: ReactNode;
}

const Plus = () => <span aria-hidden="true">+</span>;
const hasMenu = (i: NavItem) => !!(i.groups?.length || i.categories?.length);

/** Utility bar + sticky header with mega-menu (≥1080px) and full-screen drawer (<1080px). Matches mockup v6.6. */
export function SiteHeader({
  nav, utilityLinks = [], cta = { label: "Contact us", href: "/contact" }, onSearch,
  logoBasePath, logoSources, current, defaultOpen, extra,
}: SiteHeaderProps) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null);
  const [cat, setCat] = useState(0);
  const [drawer, setDrawer] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(null); setDrawer(false); } };
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null); };
    const onScroll = () => setScrolled(window.scrollY > 8);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = drawer ? "hidden" : "";
  }, [drawer]);

  const panel = nav.find((i) => i.label === open && hasMenu(i));
  const close = () => setOpen(null);

  const rail = (item: NavItem) => item.rail && (
    <div className="sv-mega__rail">
      {item.rail.eyebrow && <span className="sv-eyebrow">{item.rail.eyebrow}</span>}
      <b>{item.rail.title}</b>
      {item.rail.text && <p>{item.rail.text}</p>}
      {item.rail.links?.map((l) => <SmartLink key={l.href} href={l.href} onClick={close}>{l.label} →</SmartLink>)}
    </div>
  );

  return (
    <>
      {utilityLinks.length > 0 && (
        <div className="sv-util">
          <div className="sv-wrap">{utilityLinks.map((l) => <SmartLink key={l.href} href={l.href}>{l.label}</SmartLink>)}</div>
        </div>
      )}
      <header className={"sv-header" + (scrolled ? " is-scrolled" : "")} ref={ref}>
        <div className="sv-wrap sv-header__bar">
          <Logo basePath={logoBasePath} sources={logoSources} />
          <nav className="sv-nav" aria-label="Main">
            <ul>
              {nav.map((item) => (
                <li key={item.label} style={{ display: "flex" }}>
                  {hasMenu(item) ? (
                    <button type="button" aria-haspopup="true" aria-expanded={open === item.label} aria-controls="sv-mega"
                      aria-current={current === item.label ? "page" : undefined}
                      onClick={() => { setCat(0); setOpen(open === item.label ? null : item.label); }}>
                      {item.label}
                    </button>
                  ) : (
                    <SmartLink href={item.href} aria-current={current === item.label ? "page" : undefined}>{item.label}</SmartLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className="sv-header__actions">
            {extra}
            {onSearch && (
              <button type="button" className="sv-search" onClick={onSearch} aria-label="Search">
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
              </button>
            )}
            <Button href={cta.href}>{cta.label}</Button>
            <button type="button" className="sv-icon-btn" aria-label="Open menu" aria-expanded={drawer} aria-controls="sv-drawer" onClick={() => setDrawer(true)}>
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>

        {panel && (
          <div id="sv-mega" className={"sv-mega" + (panel.categories ? " sv-mega--drill" : panel.feature ? " sv-mega--feature" : "")}>
            {panel.categories ? (
              <div className="sv-wrap sv-mega__in">
                {rail(panel) ?? <div />}
                <span className="sv-mega__div" aria-hidden="true" />
                <div>
                  <span className="sv-mega__k">{panel.label}</span>
                  <ul className="sv-mega__list">
                    {panel.categories.map((c, i) => (
                      <li key={c.label}>
                        <button type="button" aria-current={i === cat} onMouseEnter={() => setCat(i)} onFocus={() => setCat(i)} onClick={() => setCat(i)}>{c.label}</button>
                      </li>
                    ))}
                  </ul>
                  <SmartLink className="sv-mega__all" href={panel.href} onClick={close}>{panel.allLabel ?? `All ${panel.label.toLowerCase()}`} →</SmartLink>
                </div>
                <div>
                  <span className="sv-mega__k">{panel.categories[cat]?.label}</span>
                  <ul className="sv-mega__list">
                    {panel.categories[cat]?.links.map((l) => <li key={l.href}><SmartLink href={l.href} onClick={close}>{l.label}</SmartLink></li>)}
                  </ul>
                  <SmartLink className="sv-mega__all" href={panel.categories[cat]?.href ?? panel.href} onClick={close}>Overview →</SmartLink>
                </div>
              </div>
            ) : (
              <div className="sv-wrap sv-mega__in">
                {rail(panel) ?? <div />}
                <div className="sv-mega__cols" style={{ gridTemplateColumns: `repeat(${Math.min(panel.groups!.length, 4)}, minmax(0, 1fr))` }}>
                  {panel.groups!.map((g) => (
                    <div className="sv-mega__grp" key={g.heading}>
                      <h4>{g.href ? <SmartLink href={g.href} onClick={close}>{g.heading}</SmartLink> : g.heading}</h4>
                      <ul>{g.links.map((l) => <li key={l.href}><SmartLink href={l.href} onClick={close}>{l.label}{l.note && <small>{l.note}</small>}</SmartLink></li>)}</ul>
                    </div>
                  ))}
                </div>
                {panel.feature && (
                  <div className="sv-mega__feature">
                    <h3>{panel.feature.title}</h3>
                    <p>{panel.feature.text}</p>
                    <SmartLink href={panel.feature.href} onClick={close}>{panel.feature.cta} →</SmartLink>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </header>

      {drawer && (
        <div className="sv-drawer" id="sv-drawer" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="sv-wrap">
            <div className="sv-drawer__top">
              <Logo basePath={logoBasePath} sources={logoSources} />
              <button type="button" className="sv-icon-btn" aria-label="Close menu" onClick={() => setDrawer(false)}>
                <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </button>
            </div>
            <SmartLink className="sv-drawer__home" href="/">Home</SmartLink>
            {nav.map((item) => hasMenu(item) ? (
              <details key={item.label} data-cur={current === item.label ? "" : undefined} open={current === item.label}>
                <summary>{item.label} <Plus /></summary>
                <ul>
                  <li className="is-overview"><SmartLink href={item.href}>{item.label} overview →</SmartLink></li>
                  {item.categories?.map((c) => <li key={c.label}><SmartLink href={c.href}>{c.label}</SmartLink></li>)}
                  {item.categories && <li className="is-all"><SmartLink href={item.href}>{item.allLabel ?? "Explore all"} →</SmartLink></li>}
                  {item.groups?.map((g) => [
                    <li key={g.heading} className="is-heading">{g.heading}</li>,
                    ...g.links.map((l) => <li key={g.heading + l.href}><SmartLink href={l.href}>{l.label}</SmartLink></li>),
                  ])}
                </ul>
              </details>
            ) : (
              <SmartLink key={item.label} className="sv-drawer__home" href={item.href}>{item.label}</SmartLink>
            ))}
            <div className="sv-drawer__cta"><Button href={cta.href}>{cta.label}</Button></div>
          </div>
        </div>
      )}
    </>
  );
}
