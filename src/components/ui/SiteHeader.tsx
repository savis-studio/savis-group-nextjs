"use client";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Button } from "./Button";
import { Logo } from "./Logo";
import type { LogoSources } from "./Logo";
import { SmartLink } from "./SmartLink";

export interface NavLink { label: string; href: string }
export interface NavGroup { heading: string; links: NavLink[] }
export interface NavItem {
  label: string;
  /** Plain link when there is no mega-menu. */
  href?: string;
  intro?: { title: string; text: string };
  groups?: NavGroup[];
  feature?: { title: string; text: string; href: string; cta: string };
}

export interface SiteHeaderProps {
  nav: NavItem[];
  utilityLinks?: NavLink[];
  cta?: NavLink;
  onSearch?: () => void;
  logoBasePath?: string;
  logoSources?: LogoSources;
  /** Label of the current top-level item, for aria-current. */
  current?: string;
  extra?: ReactNode;
}

const Chevron = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
);

/** Utility bar + sticky header with mega-menu (desktop) and drawer (below 1100px). */
export function SiteHeader({ nav, utilityLinks = [], cta = { label: "Contact us", href: "/contact" }, onSearch, logoBasePath, logoSources, current, extra }: SiteHeaderProps) {
  const [open, setOpen] = useState<number | null>(null);
  const [drawer, setDrawer] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(null); setDrawer(false); } };
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDoc);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onDoc); };
  }, []);

  const panel = open !== null ? nav[open] : null;

  return (
    <>
      {utilityLinks.length > 0 && (
        <div className="sv-util">
          <div className="sv-wrap">
            {utilityLinks.map((l) => <SmartLink key={l.href} href={l.href}>{l.label}</SmartLink>)}
          </div>
        </div>
      )}
      <header className="sv-header" ref={ref}>
        <div className="sv-wrap sv-header__bar">
          <Logo basePath={logoBasePath} sources={logoSources} />
          <nav className="sv-nav" aria-label="Main">
            <ul>
              {nav.map((item, i) => (
                <li key={item.label}>
                  {item.groups ? (
                    <button type="button" aria-expanded={open === i} aria-controls="sv-mega" onClick={() => setOpen(open === i ? null : i)}
                      aria-current={current === item.label ? "page" : undefined}>
                      {item.label}<Chevron />
                    </button>
                  ) : (
                    <SmartLink href={item.href ?? "#"} aria-current={current === item.label ? "page" : undefined}>{item.label}</SmartLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className="sv-header__actions">
            {extra}
            {onSearch && (
              <button type="button" className="sv-search" onClick={onSearch} aria-label="Search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
                <span className="sv-search__lbl">Search</span>
              </button>
            )}
            <Button href={cta.href}>{cta.label}</Button>
            <button type="button" className="sv-icon-btn" aria-label={drawer ? "Close menu" : "Open menu"} aria-expanded={drawer} aria-controls="sv-drawer" onClick={() => setDrawer(!drawer)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                {drawer ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
        {panel && panel.groups && (
          <div className="sv-mega" id="sv-mega">
            <div className="sv-wrap sv-mega__in">
              <div className="sv-mega__intro">
                <h3>{panel.intro?.title ?? panel.label}</h3>
                {panel.intro && <p>{panel.intro.text}</p>}
              </div>
              <div className="sv-mega__cols">
                {panel.groups.map((g) => (
                  <div key={g.heading}>
                    <h4>{g.heading}</h4>
                    <ul>{g.links.map((l) => <li key={l.href}><SmartLink href={l.href} onClick={() => setOpen(null)}>{l.label}</SmartLink></li>)}</ul>
                  </div>
                ))}
              </div>
              {panel.feature && (
                <div className="sv-mega__feature">
                  <h3>{panel.feature.title}</h3>
                  <p>{panel.feature.text}</p>
                  <SmartLink href={panel.feature.href}>{panel.feature.cta} →</SmartLink>
                </div>
              )}
            </div>
          </div>
        )}
        {drawer && (
          <div className="sv-drawer" id="sv-drawer">
            <div className="sv-wrap">
              {nav.map((item) =>
                item.groups ? (
                  <details key={item.label}>
                    <summary>{item.label}<Chevron /></summary>
                    {item.groups.map((g) => (
                      <ul key={g.heading} aria-label={g.heading}>
                        {g.links.map((l) => <li key={l.href}><SmartLink href={l.href}>{l.label}</SmartLink></li>)}
                      </ul>
                    ))}
                  </details>
                ) : (
                  <SmartLink key={item.label} href={item.href ?? "#"}>{item.label}</SmartLink>
                ),
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
