"use client";
import { useEffect, useState, type ReactNode } from "react";

export interface InsightsView { id: string; hero: ReactNode; body: ReactNode }

/**
 * /insights shows an overview, or one tab when the URL hash names it. Heroes are mounted one at a time, so the page
 * has a single h1; every listing is rendered on the server and only hidden. Without JavaScript all of them show.
 */
export function InsightsViews({ hero, overview, views }: { hero: ReactNode; overview: ReactNode; views: InsightsView[] }) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const ids = views.map((v) => v.id);
    const read = () => {
      const h = window.location.hash.slice(1);
      setActive(ids.includes(h) ? h : "");
    };
    // next/link changes the URL without a hashchange event, so links to a view on this page are followed here.
    const click = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target) return;
      const url = new URL(a.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return;
      if (url.hash && !ids.includes(url.hash.slice(1))) return;
      e.preventDefault();
      if (url.hash !== window.location.hash) window.history.pushState(null, "", url.pathname + url.hash);
      read();
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    read();
    window.addEventListener("hashchange", read);
    window.addEventListener("popstate", read);
    document.addEventListener("click", click, true);
    return () => {
      window.removeEventListener("hashchange", read);
      window.removeEventListener("popstate", read);
      document.removeEventListener("click", click, true);
    };
  }, [views]);

  // A hero mounted after the first load is unknown to VxActivate, which looks once per page: start its art here.
  useEffect(() => { document.querySelectorAll(".sv-latest .vx").forEach((e) => e.classList.add("on")); }, [active]);

  const view = views.find((v) => v.id === active);
  return (
    <>
      {view ? view.hero : hero}
      <div hidden={Boolean(view)}>{overview}</div>
      {views.map((v) => (
        <div key={v.id} data-view={v.id} className="sv-view" hidden={v.id !== active}>
          {/* The anchor exists only without JavaScript: otherwise the browser would scroll past the hero to it. */}
          <noscript><span id={v.id} /></noscript>
          {v.body}
        </div>
      ))}
      <noscript><style>{".sv-view[hidden],.sv-view .sv-lgrid>[hidden]{display:block!important}"}</style></noscript>
    </>
  );
}

/** "On this page" buttons of the overview. They only scroll: the URL hash belongs to the tabs. */
export function JumpPills({ items }: { items: Array<{ target: string; label: string }> }) {
  const go = (id: string) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };
  return (
    <nav className="sv-pillbar" aria-label="On this page">
      <div className="sv-wrap">
        {items.map((i) => <button key={i.target} type="button" onClick={() => go(i.target)}>{i.label}</button>)}
      </div>
    </nav>
  );
}
