"use client";
import { useEffect, useState, type ReactNode } from "react";

export interface FilterPanel { id: string; label: string; node: ReactNode }

/**
 * Pill tabs that show one panel at a time. Every panel is rendered on the server and visible, so without JavaScript the
 * page is simply a long list; once hydrated, "All" is the default and a tab hides the others. The tab follows the URL hash.
 */
export function FilterTabs({ panels, extra }: { panels: FilterPanel[]; extra?: ReactNode }) {
  const [active, setActive] = useState("all");

  useEffect(() => {
    const read = () => {
      const h = window.location.hash.slice(1);
      setActive(panels.some((p) => p.id === h) ? h : "all");
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [panels]);

  const pick = (id: string) => {
    setActive(id);
    try { window.history.replaceState(null, "", id === "all" ? window.location.pathname : `#${id}`); } catch { /* ignore */ }
  };

  return (
    <>
      <nav className="sv-jump" aria-label="Filter">
        <div className="sv-wrap">
          {[{ id: "all", label: "All" }, ...panels].map((p) => (
            <button key={p.id} type="button" className="sv-jump__a sv-jump__btn" aria-pressed={active === p.id} onClick={() => pick(p.id)}>{p.label}</button>
          ))}
          {extra}
        </div>
      </nav>
      {panels.map((p) => (
        <div key={p.id} id={p.id} hidden={active !== "all" && active !== p.id}>{p.node}</div>
      ))}
    </>
  );
}
