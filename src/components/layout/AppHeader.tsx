"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { Button, Logo } from "@/components/ui";
import { NavLink as SmartLink } from "./NavLink";
import type { Catalog } from "@/lib/cms";
import { SearchOverlay } from "./SearchOverlay";
import { ServicesMenu, type ServiceGroup } from "./ServicesMenu";
import {
  companyMenu, insightsMenu, mainNav, resourcesMenu, servicesMenu, solutionsMenu, utilityLinks,
} from "./nav-data";
import type { FeatureCard, Link, MenuId } from "./nav-data";

/** One of the newest articles shown in the Insights menu: its photo, or its illustration. */
export interface MenuStory { id: string; title: string; cat: string; date: string; photo?: string; cls: string; art: string }

const Chev = () => <svg className="sv-mx__chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>;
const TAB_ICON: Record<string, string> = { products: "M12 3 4 7v10l8 4 8-4V7l-8-4Zm0 9v9m0-9 8-5M12 12 4 7", industry: "M4 21V8l6-3v16M10 21V11l7-3v13M3 21h18M7 11h.01M7 15h.01M13 14h.01M13 17h.01" };
const Plus = () => <span aria-hidden="true">+</span>;

/** Pages under each top-level item: it is underlined (and opened in the drawer) while one of them is shown. */
const SECTION_PATHS: Record<MenuId, string[]> = {
  solutions: ["/solutions", "/products", "/industries", "/use-cases"],
  services: ["/services"],
  insights: ["/insights", "/customers"],
  resources: [],
  company: ["/about", "/innovation", "/careers"],
};

const drawerSections: Array<{ id: MenuId; label: string; overview: string; links: Link[] }> = [
  { id: "services", label: "Services", overview: servicesMenu.all.href, links: servicesMenu.links },
  { id: "insights", label: "Insights", overview: insightsMenu.overview.href, links: insightsMenu.links },
  { id: "resources", label: "Resources", overview: resourcesMenu.all.href, links: resourcesMenu.links },
  { id: "company", label: "Company", overview: companyMenu.all.href, links: companyMenu.links },
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
export function AppHeader({ pillars, industries, productHrefs, cardArt, latest, serviceGroups }: Catalog & { productHrefs: Record<string, string>; cardArt: Record<string, string>; latest: MenuStory[]; serviceGroups: ServiceGroup[] }) {
  const [open, setOpen] = useState<MenuId | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [searching, setSearching] = useState(false);
  const [mac, setMac] = useState(false);
  useEffect(() => { setMac(/mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent)); }, []);
  const [tab, setTab] = useState<"products" | "industry">("products");
  const [pillarId, setPillarId] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const path = usePathname();
  const current = mainNav.find((m) => SECTION_PATHS[m.id].some((p) => path === p || path.startsWith(`${p}/`)))?.id;

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

  const close = () => { setOpen(null); setDrawer(false); };
  const closeSearch = () => { setSearching(false); ref.current?.querySelector<HTMLElement>(".sv-search")?.focus(); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(null); setDrawer(false); }
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement).tagName) || (e.target as HTMLElement).isContentEditable;
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) { e.preventDefault(); setSearching(true); setOpen(null); setDrawer(false); }
    };
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDoc);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onDoc); };
  }, []);

  const pillar = pillars.find((p) => p.id === pillarId) ?? null;

  return (
    <>
      <div className="sv-util">
        <div className="sv-wrap">
          {utilityLinks.map((l) => <SmartLink key={l.label} href={l.href}>{l.label}</SmartLink>)}
        </div>
      </div>
      <header className={`sv-header${scrolled ? " is-scrolled" : ""}`} ref={ref} onMouseLeave={() => setOpen(null)}>
        <div className="sv-wrap sv-header__bar">
          <Logo />
          <nav className="sv-nav" aria-label="Main">
            <ul>
              {mainNav.map((m) => (
                <li key={m.id}>
                  <button type="button" aria-expanded={open === m.id} aria-controls="sv-mx" aria-current={current === m.id ? "page" : undefined} onMouseEnter={() => setOpen(m.id)} onClick={() => setOpen(open === m.id ? null : m.id)}>
                    {m.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="sv-header__actions">
            <button type="button" className="sv-search" aria-label="Search" aria-haspopup="dialog" aria-keyshortcuts="Control+K Meta+K" title={`Search (${mac ? "⌘" : "Ctrl"} K)`} onClick={() => { setSearching(true); setOpen(null); setDrawer(false); }}>
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
              {open === "solutions" && (
                <div className="sv-mx__sol">
                  <div className="sv-mx__tabs">
                    {solutionsMenu.tabs.map((t) => (
                      <button key={t.id} type="button" className="sv-mx__tab" aria-pressed={tab === t.id}
                        onClick={() => { setTab(t.id as "products" | "industry"); setPillarId(null); }}>
                        <svg className="sv-mx__ico" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true"><path d={TAB_ICON[t.id]} /></svg><b>{t.title}<Chev /></b><span>{t.text}</span>
                      </button>
                    ))}
                    <SmartLink href={solutionsMenu.overview.href} className="sv-mx__more" onClick={close}>{solutionsMenu.overview.label}</SmartLink>
                  </div>
                  <div className="sv-mx__col">
                    <span className="sv-mx__k">{tab === "products" ? "Products by solution" : "Industries"}</span>
                    {tab === "products" ? (
                      <ul className="sv-mx__list">
                        {pillars.map((p) => (
                          <li key={p.id}>
                            <button type="button" aria-current={pillarId === p.id} onClick={() => setPillarId(p.id)} onMouseEnter={() => setPillarId(p.id)}>{p.short}<Chev /></button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="sv-mx__list">
                        {industries.map((i) => <li key={i.id}><SmartLink href={`#ind-${i.id}`} onClick={close}>{i.name}<Chev /></SmartLink></li>)}
                      </ul>
                    )}
                    <SmartLink href={solutionsMenu.all.href} className="sv-mx__more" onClick={close}>{solutionsMenu.all.label}</SmartLink>
                  </div>
                  {tab === "products" && pillar ? (
                    <div className="sv-mx__detail">
                      <SmartLink href={`#pillar-${pillar.id}`} className="sv-mx__pillar" onClick={close}>{pillar.name} →</SmartLink>
                      <div className="sv-mx__groups">
                        {pillar.groups.map((g) => (
                          <div key={g.name}>
                            <h4>{g.name}</h4>
                            <ul>{g.items.map((it) => <li key={it}><SmartLink href={productHrefs[it] ?? "/solutions"} onClick={close}>{it}</SmartLink></li>)}</ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <SmartLink href={solutionsMenu.promo.href} className="sv-mx__promo" onClick={close}>
                      <span className="sv-mx__k">{solutionsMenu.promo.tag}</span>
                      <span className="sv-mx__cover"><em>{solutionsMenu.promo.kicker}</em><b>{solutionsMenu.promo.title}</b></span>
                      <i>{solutionsMenu.promo.cta}</i>
                    </SmartLink>
                  )}
                </div>
              )}

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

              {open === "resources" && (
                <div className="sv-mx__split">
                  <div className="sv-mx__side">
                    <span className="sv-mx__k">{resourcesMenu.heading}</span>
                    <LinkList links={resourcesMenu.links} onNavigate={close} />
                    <SmartLink href={resourcesMenu.all.href} className="sv-mx__more" onClick={close}>{resourcesMenu.all.label}</SmartLink>
                  </div>
                  <div><div className="sv-mx__head"><span className="sv-mx__k">Featured resources</span><SmartLink href={resourcesMenu.all.href} onClick={close}>{resourcesMenu.all.label}</SmartLink></div><Cards cards={resourcesMenu.cards} art={cardArt} onNavigate={close} /></div>
                </div>
              )}

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
                <li className="is-overview"><SmartLink href={solutionsMenu.overview.href} onClick={close}>{solutionsMenu.overview.label}</SmartLink></li>
                <li className="is-heading">Solution pillars</li>
                {pillars.map((p) => <li key={p.id}><SmartLink href={`#pillar-${p.id}`} onClick={close}>{p.n} · {p.name}</SmartLink></li>)}
                <li className="is-heading">Industries</li>
                {industries.map((i) => <li key={i.id}><SmartLink href={`#ind-${i.id}`} onClick={close}>{i.name}</SmartLink></li>)}
              </ul>
            </details>
            {drawerSections.map((s) => (
              <details key={s.id} open={current === s.id} data-cur={current === s.id ? "" : undefined}>
                <summary>{s.label}<Plus /></summary>
                <ul>
                  <li className="is-overview"><SmartLink href={s.overview} onClick={close}>{s.label} overview →</SmartLink></li>
                  {s.links.map((l) => <li key={l.label}><SmartLink href={l.href} onClick={close}>{l.label}</SmartLink></li>)}
                </ul>
              </details>
            ))}
            <div className="sv-drawer__cta" onClick={close}><Button href="/contact">Contact us</Button></div>
          </div>
        </div>
      )}
      <SearchOverlay open={searching} onClose={closeSearch} mac={mac} />
    </>
  );
}
