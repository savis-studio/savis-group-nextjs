import type { CSSProperties } from "react";
import { Button, Stat } from "@/components/ui";
import type { Office } from "@/lib/content";
import { Globe } from "./Globe";
import { HeroNetwork } from "./HeroNetwork";

const WORDS = ["nations.", "banks.", "smart cities.", "enterprises."];

export interface HomeHeroProps {
  offices: Office[];
  stats: Array<{ value: string; label: string }>;
}

/** Home hero: animated backdrop, rotating audience word, globe and key figures. The only h1 on the page. */
export function HomeHero({ offices, stats }: HomeHeroProps) {
  return (
    <section className="sv-hero sv-home__hero">
      <div className="sv-home__bg" aria-hidden="true">
        <i className="sv-home__orb sv-home__orb--1" />
        <i className="sv-home__orb sv-home__orb--2" />
        <i className="sv-home__orb sv-home__orb--3" />
        <i className="sv-home__grid" />
        <HeroNetwork />
      </div>
      <div className="sv-wrap sv-home__hero-in">
        <div className="sv-home__hero-row">
          <div className="sv-home__hero-txt">
            <span className="sv-eyebrow sv-eyebrow--on-band sv-eyebrow--rule">Trusted Digital Infrastructure for a Smarter World</span>
            <h1>
              Identity, trust and secure platforms for{" "}
              <span className="sv-home__rot" aria-label="nations, banks, smart cities and enterprises">
                {WORDS.map((w, i) => (
                  <b key={w} style={{ "--i": i } as CSSProperties} aria-hidden="true">{w}</b>
                ))}
              </span>
            </h1>
            <p className="sv-hero__lead">
              Five solution pillars, delivered end to end — from consulting and integration to 24/7 operations — on core
              technology we design and build ourselves.
            </p>
            <div className="sv-hero__actions">
              <Button href="/solutions" onBand>Explore Solutions</Button>
              <Button href="/contact" variant="ghost" onBand>Talk to an Expert</Button>
            </div>
          </div>
          <div className="sv-home__globe">
            <Globe offices={offices} label={`Globe showing ${offices.length} SAVIS offices connected to Hanoi headquarters`} />
          </div>
        </div>
        <div className="sv-home__kpi">
          {stats.map((s) => <Stat key={s.label} value={s.value} label={s.label} />)}
        </div>
      </div>
    </section>
  );
}
