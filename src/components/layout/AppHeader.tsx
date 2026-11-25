"use client";
import { useEffect, useRef, useState } from "react";
import { Button, Logo } from "@/components/ui";
import { NavLink as SmartLink } from "./NavLink";
import type { Catalog } from "@/lib/cms";
import { SearchOverlay } from "./SearchOverlay";
import {
  companyMenu, insightsMenu, mainNav, resourcesMenu, servicesMenu, solutionsMenu, utilityLinks,
} from "./nav-data";
import type { FeatureCard, Link, MenuId } from "./nav-data";

const Chevron = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
);

function Cards({ cards, art, onNavigate }: { cards: FeatureCard[]; art: Record<string, string>; onNavigate: () => void }) {
  return (
    <div className="sv-mx__cards">
      {cards.map((c) => (
        <SmartLink key={c.title} href={c.href} className="sv-mx__card" onClick={onNavigate}>
          <span className={`sv-mx__thumb${c.art ? ` uc-th-${c.art.cls}` : ""}`} aria-hidden="true">{art[c.title] && <span dangerouslySetInnerHTML={{ __html: art[c.title] }} />}</span>
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
      {links.map((l) => <li key={l.label}><SmartLink href={l.href} onClick={onNavigate}>{l.label}</SmartLink></li>)}
    </ul>
  );
}

/** Utility bar, sticky header, five mega-menus (desktop) and an accordion drawer (below 1100px). */
export function AppHeader({ pillars, industries, productHrefs, cardArt }: Catalog & { productHrefs: Record<string, string>; cardArt: Record<string, string> }) {
  const [open, setOpen] = useState<MenuId | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [searching, setSearching] = useState(false);
  const [tab, setTab] = useState<"products" | "industry">("products");
  const [pillarId, setPillarId] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);

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
      <header className="sv-header" ref={ref}>
        <div className="sv-wrap sv-header__bar">
          <Logo />
          <nav className="sv-nav" aria-label="Main">
            <ul>
              {mainNav.map((m) => (
                <li key={m.id}>
                  <button type="button" aria-expanded={open === m.id} aria-controls="sv-mx" onClick={() => setOpen(open === m.id ? null : m.id)}>
                    {m.label}<Chevron />
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="sv-header__actions">
            <button type="button" className="sv-search" aria-label="Search" aria-haspopup="dialog" onClick={() => { setSearching(true); setOpen(null); setDrawer(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
              <span className="sv-search__lbl">Search</span>
            </button>
            <Button href="/contact">Contact us</Button>
            <button type="button" className="sv-icon-btn" aria-label={drawer ? "Close menu" : "Open menu"} aria-expanded={drawer} aria-controls="sv-drawer" onClick={() => { setDrawer(!drawer); setOpen(null); }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                {drawer ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
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
                        <b>{t.title}</b><span>{t.text}</span>
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
                            <button type="button" aria-current={pillarId === p.id} onClick={() => setPillarId(p.id)} onMouseEnter={() => setPillarId(p.id)}>{p.short}</button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="sv-mx__list">
                        {industries.map((i) => <li key={i.id}><SmartLink href={`#ind-${i.id}`} onClick={close}>{i.name}</SmartLink></li>)}
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
                <div className="sv-mx__split">
                  <div className="sv-mx__side">
                    <span className="sv-mx__k">{servicesMenu.heading}</span>
                    <LinkList links={servicesMenu.links} onNavigate={close} />
                    <SmartLink href={servicesMenu.all.href} className="sv-mx__more" onClick={close}>{servicesMenu.all.label}</SmartLink>
                    <SmartLink href={servicesMenu.talk.href} className="sv-mx__more" onClick={close}>{servicesMenu.talk.label}</SmartLink>
                  </div>
                  <div><span className="sv-mx__k">Featured</span><Cards cards={servicesMenu.cards} art={cardArt} onNavigate={close} /></div>
                </div>
              )}

              {open === "insights" && (
                <div className="sv-mx__split sv-mx__split--insights">
                  <div>
                    <span className="sv-mx__k">Latest</span>
                    <div className="sv-mx__news">
                      {insightsMenu.latest.map((n) => (
                        <SmartLink key={n.title} href={n.href} className="sv-mx__item" onClick={close}>
                          <em>{n.tag}</em><time>{n.date}</time><b>{n.title}</b>
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
                  <div><span className="sv-mx__k">Featured resources</span><Cards cards={resourcesMenu.cards} art={cardArt} onNavigate={close} /></div>
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
                  <div><span className="sv-mx__k">Featured</span><Cards cards={companyMenu.cards} art={cardArt} onNavigate={close} /></div>
                </div>
              )}
            </div>
          </div>
        )}

        {drawer && (
          <div className="sv-drawer" id="sv-drawer">
            <div className="sv-wrap">
              <details open>
                <summary>Solutions &amp; Products<Chevron /></summary>
                <ul aria-label="Solution pillars">{pillars.map((p) => <li key={p.id}><SmartLink href={`#pillar-${p.id}`} onClick={close}>{p.n} · {p.name}</SmartLink></li>)}</ul>
                <ul aria-label="Industries">{industries.map((i) => <li key={i.id}><SmartLink href={`#ind-${i.id}`} onClick={close}>{i.name}</SmartLink></li>)}</ul>
              </details>
              {([["Services", servicesMenu.links], ["Insights", insightsMenu.links], ["Resources", resourcesMenu.links], ["Company", companyMenu.links]] as Array<[string, Link[]]>).map(([label, links]) => (
                <details key={label}>
                  <summary>{label}<Chevron /></summary>
                  <ul>{links.map((l) => <li key={l.label}><SmartLink href={l.href} onClick={close}>{l.label}</SmartLink></li>)}</ul>
                </details>
              ))}
              <div className="sv-drawer__cta"><Button href="/contact">Contact us</Button></div>
            </div>
          </div>
        )}
      </header>
      <SearchOverlay open={searching} onClose={closeSearch} />
    </>
  );
}
