"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui";
import { SmartLink } from "@/components/ui/SmartLink";
import type { Audience } from "@/lib/content";

export interface AudienceTabsProps {
  audiences: Audience[];
  /** Trusted inline SVG markup from our own data file, keyed by audience id. */
  icons: Record<string, string>;
}

/** "Who are you?" tabs. Arrow keys move and select, per the WAI-ARIA tabs pattern. */
export function AudienceTabs({ audiences, icons }: AudienceTabsProps) {
  const [active, setActive] = useState(audiences[0]?.id);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const move = (from: number, step: number) => {
    const next = audiences[(from + step + audiences.length) % audiences.length];
    setActive(next.id);
    refs.current[next.id]?.focus();
  };

  return (
    <>
      <div className="sv-aud__tabs" role="tablist" aria-label="Choose your organization">
        {audiences.map((a, i) => (
          <button
            key={a.id}
            ref={(el) => { refs.current[a.id] = el; }}
            type="button"
            role="tab"
            id={`aud-t-${a.id}`}
            aria-controls={`aud-p-${a.id}`}
            aria-selected={a.id === active}
            tabIndex={a.id === active ? 0 : -1}
            onClick={() => setActive(a.id)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") { e.preventDefault(); move(i, 1); }
              if (e.key === "ArrowLeft") { e.preventDefault(); move(i, -1); }
            }}
          >
            <i aria-hidden="true" dangerouslySetInnerHTML={{ __html: icons[a.id] ?? "" }} />
            {a.label}
          </button>
        ))}
      </div>
      {audiences.map((a) => (
        <div key={a.id} className="sv-aud__pane" role="tabpanel" id={`aud-p-${a.id}`} aria-labelledby={`aud-t-${a.id}`} hidden={a.id !== active}>
          <div>
            <h3>{a.title}</h3>
            <p>{a.lead}</p>
            <div className="sv-aud__ctas">
              <Button href={a.page.href}>{a.page.label} →</Button>
              <Button href="/contact" variant="ghost">Talk to an expert</Button>
            </div>
          </div>
          <div className="sv-aud__links">
            {a.links.map((l) => (
              <SmartLink key={l.href + l.label} href={l.href}>
                <em>{l.kind}</em>
                <b>{l.label}</b>
              </SmartLink>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
