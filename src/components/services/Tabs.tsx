"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export interface TabItem { id: string; tab: ReactNode; panel: ReactNode }

/** Tab buttons with their panels. Every panel is in the page (hidden until chosen), so search engines read them all. */
export function Tabs({ label, items }: { label: string; items: TabItem[] }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const list = useRef<HTMLDivElement>(null);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    const next = e.key === "Home" ? 0 : e.key === "End" ? items.length - 1 : step ? (active + step + items.length) % items.length : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    list.current?.querySelectorAll<HTMLButtonElement>("[role=tab]")[next]?.focus();
  };

  return (
    <>
      <div className="sv-devtabs" role="tablist" aria-label={label} ref={list} onKeyDown={onKey}>
        {items.map((item, i) => (
          <button
            key={item.id} type="button" role="tab" id={`${base}-t-${item.id}`} aria-controls={`${base}-p-${item.id}`}
            aria-selected={i === active} tabIndex={i === active ? 0 : -1} onClick={() => setActive(i)}
          >
            {item.tab}
          </button>
        ))}
      </div>
      {items.map((item, i) => (
        <div key={item.id} role="tabpanel" id={`${base}-p-${item.id}`} aria-labelledby={`${base}-t-${item.id}`} hidden={i !== active}>
          {item.panel}
        </div>
      ))}
    </>
  );
}
