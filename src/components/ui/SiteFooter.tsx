import type { ReactNode } from "react";
import { Logo } from "./Logo";
import type { LogoSources } from "./Logo";
import { SmartLink } from "./SmartLink";

export interface FooterColumn { heading: string; links: Array<{ label: string; href: string }> }

export interface SiteFooterProps {
  columns: FooterColumn[];
  tagline?: string;
  /** Left side of the base row: copyright, offices, hotline. */
  legal: ReactNode;
  /** Right side of the base row: social, certifications, policy links. */
  meta?: ReactNode;
  logoBasePath?: string;
  logoSources?: LogoSources;
}

export function SiteFooter({ columns, tagline, legal, meta, logoBasePath, logoSources }: SiteFooterProps) {
  return (
    <footer className="sv-footer">
      <div className="sv-wrap">
        <div className="sv-footer__top">
          <div className="sv-footer__brand">
            <Logo onDark basePath={logoBasePath} sources={logoSources} />
            {tagline && <p>{tagline}</p>}
          </div>
          <nav className="sv-footer__cols" aria-label="Footer">
            {columns.map((c) => (
              <div key={c.heading}>
                <h4>{c.heading}</h4>
                <ul>{c.links.map((l) => <li key={l.href}><SmartLink href={l.href}>{l.label}</SmartLink></li>)}</ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="sv-footer__base">
          <span>{legal}</span>
          {meta && <span>{meta}</span>}
        </div>
      </div>
    </footer>
  );
}
