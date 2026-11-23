import type { ReactNode } from "react";
import { cn } from "./cn";
import { SmartLink } from "./SmartLink";

export interface Crumb { label: string; href?: string }

export interface HeroProps {
  eyebrow?: string;
  /** The page's only h1. */
  title: ReactNode;
  /** Last word(s) of the title shown in band-eyebrow color. */
  accent?: string;
  lead?: ReactNode;
  crumbs?: Crumb[];
  /** Right column: illustration or badge, up to 420px. */
  aside?: ReactNode;
  className?: string;
  /** Buttons, each with onBand. */
  children?: ReactNode;
}

export function Hero({ eyebrow, title, accent, lead, crumbs, aside, className, children }: HeroProps) {
  return (
    <section className={cn("sv-hero", className)}>
      <div className="sv-wrap sv-hero__in">
        <div className="sv-hero__txt">
          {crumbs && crumbs.length > 0 && (
            <nav className="sv-crumbs" aria-label="Breadcrumb">
              {crumbs.map((c, i) => (
                <span key={i} style={{ display: "contents" }}>
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {c.href ? <SmartLink href={c.href}>{c.label}</SmartLink> : <span aria-current="page">{c.label}</span>}
                </span>
              ))}
            </nav>
          )}
          {eyebrow && <span className="sv-eyebrow sv-eyebrow--on-band sv-eyebrow--rule">{eyebrow}</span>}
          <h1>
            {title}
            {accent && <span className="sv-hero__accent"> {accent}</span>}
          </h1>
          {lead && <p className="sv-hero__lead">{lead}</p>}
          {children && <div className="sv-hero__actions">{children}</div>}
        </div>
        {aside && <div className="sv-hero__aside">{aside}</div>}
      </div>
    </section>
  );
}
