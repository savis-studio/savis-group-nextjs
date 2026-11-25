"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui";
import { SmartLink } from "@/components/ui/SmartLink";

export interface ChallengePanel {
  id: string;
  title: string;
  problem: string;
  solution: string;
  steps: string[];
  useCaseHref: string;
  products: Array<{ name: string; blurb: string; href: string; datasheetHref?: string }>;
}

/** Pick a challenge, see the problem, the SAVIS answer, the flow and the products behind it. Tabs follow the WAI-ARIA pattern. */
export function ChallengePicker({ panels }: { panels: ChallengePanel[] }) {
  const [active, setActive] = useState(panels[0]?.id);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const move = (from: number, step: number) => {
    const next = panels[(from + step + panels.length) % panels.length];
    setActive(next.id);
    refs.current[next.id]?.focus();
  };

  return (
    <>
      <div className="sv-chal__tabs" role="tablist" aria-label="Choose a challenge">
        {panels.map((p, i) => (
          <button
            key={p.id}
            ref={(el) => { refs.current[p.id] = el; }}
            type="button"
            role="tab"
            id={`chal-t-${p.id}`}
            aria-controls={`chal-p-${p.id}`}
            aria-selected={p.id === active}
            tabIndex={p.id === active ? 0 : -1}
            onClick={() => setActive(p.id)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); move(i, 1); }
              if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); move(i, -1); }
            }}
          >
            {p.title}
          </button>
        ))}
      </div>
      {panels.map((p) => (
        <div key={p.id} className="sv-chal__panel" role="tabpanel" id={`chal-p-${p.id}`} aria-labelledby={`chal-t-${p.id}`} hidden={p.id !== active}>
          <div>
            <span className="sv-chal__k">The challenge</span>
            <p>{p.problem}</p>
            <span className="sv-chal__k">How SAVIS solves it</span>
            <p className="sv-chal__sol">{p.solution}</p>
            <ol className="sv-chal__steps">
              {p.steps.map((s, i) => <li key={i}><i>{i + 1}</i>{s}</li>)}
            </ol>
            <div className="sv-chal__ctas">
              <Button href="/contact">Request a demo</Button>
              <Button href={p.useCaseHref} variant="ghost">See the full use case</Button>
            </div>
          </div>
          <div>
            <span className="sv-chal__k">Products behind it</span>
            {p.products.map((x) => (
              <div key={x.href} className="sv-chal__prod">
                <SmartLink href={x.href} className="sv-chal__pn">{x.name}</SmartLink>
                <p>{x.blurb}</p>
                <div>
                  {x.datasheetHref && <SmartLink href={x.datasheetHref}>Datasheet</SmartLink>}
                  <SmartLink href={x.href}>Details →</SmartLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
