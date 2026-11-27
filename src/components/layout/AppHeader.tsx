"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { VideoDialog } from "@/components/resources/VideoDialog";
import { Button, Logo } from "@/components/ui";
import type { FilmId } from "@/data/films";
import type { ResourceSet } from "@/lib/resources";
import { NavLink as SmartLink } from "./NavLink";
import { ResourcesMenu } from "./ResourcesMenu";
import { SearchOverlay } from "./SearchOverlay";
import { ServicesMenu, type ServiceGroup } from "./ServicesMenu";
import { SolutionsMenu, type Sector, type SolutionPillar } from "./SolutionsMenu";
import {
  companyMenu, insightsMenu, mainNav, resourcesMenu, servicesMenu, solutionsMenu, utilityLinks,
} from "./nav-data";
import type { FeatureCard, Link, MenuId } from "./nav-data";

/** One of the newest articles shown in the Insights menu: its photo, or its illustration. */
export interface MenuStory { id: string; title: string; cat: string; date: string; photo?: string; cls: string; art: string }

const Chev = () => <svg className="sv-mx__chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>;
const Plus = () => <span aria-hidden="true">+</span>;

/** Pages under each top-level item: it is underlined (and opened in the drawer) while one of them is shown. */
const SECTION_PATHS: Record<MenuId, string[]> = {
  solutions: ["/solutions", "/products", "/industries", "/use-cases"],
  services: ["/services"],
  insights: ["/insights", "/customers"],
  resources: ["/resources"],
  company: ["/about", "/innovation", "/careers"],
};

/** `more` is the section's overview link: first in the list, or last when `after` is set. */
const drawerSections: Array<{ id: MenuId; label: string; links: Link[]; more: Link; after?: boolean }> = [
  { id: "services", label: "Services", links: servicesMenu.links, more: { label: "Services overview →", href: servicesMenu.all.href } },
  { id: "insights", label: "Insights", links: insightsMenu.links, more: { label: "Insights overview →", href: insightsMenu.overview.href } },
  { id: "resources", label: "Resources", links: resourcesMenu.categories, more: resourcesMenu.all, after: true },
  { id: "company", label: "Company", links: companyMenu.links, more: { label: "Company overview →", href: companyMenu.all.href } },
];

function Cards({ cards, art, onNavigate }: { cards: FeatureCard[]; art: Record<string, string>; onNavigate: () => void }) {
  return (
    <div className="sv-mx__cards">
      {cards.map((c) => (
        <SmartLink key={c.title} href={c.href} className="sv-mx__card" onClick={onNavigate}>
          <span className={`sv-mx__thumb${c.art ? ` uc-th-${c.art.cls}` : ""}`} aria-hidden="true">{c.photo ? <img src={c.photo} alt="" loading="lazy" className="sv-mx__photo" /> : art[c.title] && <span dangerouslySetInnerHTML={{ __html: art[c.title] }} />}{c.video && <span className="sv-mx__play" />}</span>
          <span className="sv-mx__body">
            <em>{c.tag}</em>
            <b>{c.title}</b>
            <i>{c.cta}</i>
          </span>
        </SmartLink>
      ))}
    </div>
  );
}

function LinkList({ links, onNavigate }: { links: Link[]; onNavigate: () => void }) {
  return (
    <ul className="sv-mx__links">
      {links.map((l) => <li key={l.label}><SmartLink href={l.href} onClick={onNavigate}>{l.label}<Chev /></SmartLink></li>)}
    </ul>
  );
}

/** Utility bar, sticky header, five mega-menus (desktop) and a full-screen drawer (up to 1080px). */
export function AppHeader({ pillars, sectors, cardArt, latest, serviceGroups, resources, reportLinks }: { pillars: SolutionPillar[]; sectors: Sector[]; cardArt: Record<string, string>; latest: MenuStory[]; serviceGroups: ServiceGroup[]; resources: ResourceSet[]; reportLinks: Record<string, string> }) {
  const [open, setOpen] = useState<MenuId | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [searching, setSearching] = useState(false);
  const [film, setFilm] = useState<FilmId | null>(null);
  const [mac, setMac] = useState(false);
  useEffect(() => { setMac(/mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent)); }, []);
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const path = usePathname();
  // A datasheet is part of the resource library, although its address sits under its product.
  const current = path.endsWith("/datasheet") ? "resources" : mainNav.find((m) => SECTION_PATHS[m.id].some((p) => path === p || path.startsWith(`${p}/`)))?.id;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The open drawer covers the page: hold the scroll, move focus into it, and hand focus back on close.
  useEffect(() => {
    if (!drawer) return;
    const root = document.documentElement;
    const header = ref.current;
    root.style.overflow = "hidden";
    drawerRef.current?.querySelector<HTMLElement>("button")?.focus();
    return () => {
      root.style.overflow = "";
      header?.querySelector<HTMLElement>(".sv-icon-btn")?.focus();
    };
  }, [drawer]);

  /** Tab stays inside the drawer. */
  const keepFocus = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const stops = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("a[href], button, summary")).filter((el) => el.checkVisibility());
    const first = stops[0], last = stops[stops.length - 1];
    if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
      e.preventDefault();
      (e.shiftKey ? last : first)?.focus();
    }
  };

  // With a mouse the menus open on hover and close shortly after the pointer leaves the header and its panel.
  const timer = useRef<number | undefined>(undefined);
  const cancel = () => window.clearTimeout(timer.current);
  const later = (fn: () => void, ms: number) => { cancel(); timer.current = window.setTimeout(fn, ms); };
  useEffect(() => cancel, []);

  const close = () => { cancel(); setOpen(null); setDrawer(false); };
  const closeSearch = () => { setSearching(false); ref.current?.querySelector<HTMLElement>(".sv-search")?.focus(); };
  /** A video picked in a menu: the menu closes, and the focus returns to its button afterwards. */
  const play = (id: FilmId) => { close(); setFilm(id); };
  const endFilm = () => {
    setFilm(null);
    const back = [".sv-nav button[data-menu=resources]", ".sv-icon-btn"].map((s) => ref.current?.querySelector<HTMLElement>(s)).find((el) => el?.checkVisibility());
    back?.focus();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // An open video window keeps the keyboard to itself.
      if (document.querySelector("dialog.sv-vdlg[open]")) return;
      if (e.key === "Escape") { cancel(); setOpen(null); setDrawer(false); }
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement).tagName) || (e.target as HTMLElement).isContentEditable;
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) { e.preventDefault(); cancel(); setSearching(true); setOpen(null); setDrawer(false); }
    };
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDoc);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onDoc); };
  }, []);

  return (
    <>
      <div className="sv-util">
        <div className="sv-wrap">
          {utilityLinks.map((l) => <SmartLink key={l.label} href={l.href}>{l.label}</SmartLink>)}
        </div>
      </div>
      <header className={`sv-header${scrolled ? " is-scrolled" : ""}`} ref={ref}
        onPointerEnter={cancel} onPointerLeave={(e) => { if (e.pointerType !== "touch") later(() => setOpen(null), 280); }}>
        <div className="sv-wrap sv-header__bar">
          <Logo />
          <nav className="sv-nav" aria-label="Main">
            <ul>
              {mainNav.map((m) => (
                <li key={m.id}>
                  <button type="button" data-menu={m.id} aria-expanded={open === m.id} aria-controls="sv-mx" aria-current={current === m.id ? "page" : undefined} onPointerEnter={(e) => { if (e.pointerType !== "touch") later(() => setOpen(m.id), open ? 60 : 140); }} onClick={() => { cancel(); setOpen(open === m.id ? null : m.id); }}>
                    {m.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="sv-header__actions">
            <button type="button" className="sv-search" aria-label="Search" aria-haspopup="dialog" aria-keyshortcuts="Control+K Meta+K" title={`Search (${mac ? "⌘" : "Ctrl"} K)`} onClick={() => { cancel(); setSearching(true); setOpen(null); setDrawer(false); }}>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
            <Button href="/contact">Contact us</Button>
            <button type="button" className="sv-icon-btn" aria-label="Open menu" aria-haspopup="dialog" aria-expanded={drawer} aria-controls="sv-drawer" onClick={() => { setDrawer(true); setOpen(null); }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div className="sv-mega" id="sv-mx">
            <div className="sv-wrap sv-mx">
              {open === "solutions" && <SolutionsMenu pillars={pillars} sectors={sectors} reportLinks={reportLinks} onNavigate={close} />}

              {open === "services" && (
                <ServicesMenu
                  groups={serviceGroups}
                  onNavigate={close}
                  featured={<><div className="sv-mx__head"><span className="sv-mx__k">Featured</span><SmartLink href={servicesMenu.all.href} onClick={close}>{servicesMenu.all.label}</SmartLink></div><Cards cards={servicesMenu.cards} art={cardArt} onNavigate={close} /></>}
                />
              )}

              {open === "insights" && (
                <div className="sv-mx__split sv-mx__split--insights">
                  <div>
                    <span className="sv-mx__k">Latest</span>
                    <div className="sv-mx__news">
                      {latest.map((n) => (
                        <SmartLink key={n.id} href={`/insights/${n.id}`} className="sv-mx__item" onClick={close}>
                          <span className={`sv-mx__nthumb uc-th uc-th-${n.cls}${n.photo ? " uc-th-photo" : ""}`} aria-hidden="true">
                            {n.photo ? <img src={n.photo} alt="" loading="lazy" /> : <span dangerouslySetInnerHTML={{ __html: n.art }} />}
                            <em className="uc-steps">{n.cat}</em>
                          </span>
                          <span className="sv-mx__ntext"><span className="sv-mx__meta"><em>{n.cat}</em> · <time>{n.date}</time></span><b>{n.title}</b></span>
                        </SmartLink>
                      ))}
                    </div>
                    <SmartLink href={insightsMenu.all.href} className="sv-mx__more" onClick={close}>{insightsMenu.all.label}</SmartLink>
                  </div>
                  <div className="sv-mx__side">
                    <span className="sv-mx__k">Insights</span>
                    <LinkList links={insightsMenu.links} onNavigate={close} />
                    <SmartLink href={insightsMenu.overview.href} className="sv-mx__more" onClick={close}>{insightsMenu.overview.label}</SmartLink>
                  </div>
                </div>
              )}

              {open === "resources" && <ResourcesMenu sets={resources} onNavigate={close} onFilm={play} />}

              {open === "company" && (
                <div className="sv-mx__split">
                  <div className="sv-mx__side">
                    <span className="sv-mx__k">{companyMenu.heading}</span>
                    <LinkList links={companyMenu.links} onNavigate={close} />
                    <SmartLink href={companyMenu.contact.href} className="sv-mx__more" onClick={close}>{companyMenu.contact.label}</SmartLink>
                    <SmartLink href={companyMenu.partner.href} className="sv-mx__more" onClick={close}>{companyMenu.partner.label}</SmartLink>
                  </div>
                  <div><div className="sv-mx__head"><span className="sv-mx__k">Featured</span><SmartLink href={companyMenu.all.href} onClick={close}>{companyMenu.all.label}</SmartLink></div><Cards cards={companyMenu.cards} art={cardArt} onNavigate={close} /></div>
                </div>
              )}
            </div>
          </div>
        )}

      </header>

      {drawer && (
        <div className="sv-drawer" id="sv-drawer" role="dialog" aria-modal="true" aria-label="Menu" ref={drawerRef} onKeyDown={keepFocus}>
          <div className="sv-wrap">
            <div className="sv-drawer__top">
              <Logo />
              <button type="button" className="sv-icon-btn" aria-label="Close menu" onClick={close}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
              </button>
            </div>
            <SmartLink href="/" className="sv-drawer__home" onClick={close}>Home</SmartLink>
            <details open={current === "solutions"} data-cur={current === "solutions" ? "" : undefined}>
              <summary>Solutions &amp; Products<Plus /></summary>
              <ul>
                <li className="is-heading">By products</li>
                {pillars.map((p) => <li key={p.id}><SmartLink href={`#pillar-${p.id}`} onClick={close}>{p.name}</SmartLink></li>)}
                <li className="is-heading">By industry</li>
                {sectors.flatMap((s) => s.industries).map((i) => <li key={i.id}><SmartLink href={`#ind-${i.id}`} onClick={close}>{i.name}</SmartLink></li>)}
                <li className="is-overview"><SmartLink href={solutionsMenu.overview.href} onClick={close}>{solutionsMenu.overview.label}</SmartLink></li>
              </ul>
            </details>
            {drawerSections.map((s) => (
              <details key={s.id} open={current === s.id} data-cur={current === s.id ? "" : undefined}>
                <summary>{s.label}<Plus /></summary>
                <ul>
                  {!s.after && <li className="is-overview"><SmartLink href={s.more.href} onClick={close}>{s.more.label}</SmartLink></li>}
                  {s.links.map((l) => <li key={l.label}><SmartLink href={l.href} onClick={close}>{l.label}</SmartLink></li>)}
                  {s.after && <li className="is-overview"><SmartLink href={s.more.href} onClick={close}>{s.more.label}</SmartLink></li>}
                </ul>
              </details>
            ))}
            <div className="sv-drawer__cta" onClick={close}><Button href="/contact">Contact us</Button></div>
          </div>
        </div>
      )}
      <SearchOverlay open={searching} onClose={closeSearch} mac={mac} />
      <VideoDialog film={film} onClose={endFilm} />
    </>
  );
}
