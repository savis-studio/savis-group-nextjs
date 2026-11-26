import type { ReactNode } from "react";
import { Logo } from "./Logo";
import type { LogoSources } from "./Logo";
import { SmartLink } from "./SmartLink";

export interface FooterItem {
  label: string;
  /** Omit for plain text (e.g. office locations). */
  href?: string;
  /** Bold with extra space above: cross-links such as "Use case library". */
  strong?: boolean;
}
export interface FooterColumn { heading: string; items: FooterItem[] }

export interface SiteFooterProps {
  columns: FooterColumn[];
  tagline?: string;
  /** Left side of the base row: copyright, offices, hotline. */
  legal: ReactNode;
  /** Right side of the base row: social, ISO certificates, Privacy · Terms · Cookies. */
  meta?: ReactNode;
  logoBasePath?: string;
  logoSources?: LogoSources;
}

/** Footer from mockup v6.6: navy gradient, brand column + link columns in one grid, legal base row. */
export function SiteFooter({ columns, tagline = "Trusted Digital Infrastructure for a Smarter World.", legal, meta, logoBasePath, logoSources }: SiteFooterProps) {
  return (
    <footer className="sv-footer">
      <div className="sv-wrap">
        <div className="sv-footer__cols">
          <div className="sv-footer__brand">
            <Logo onDark href={null} basePath={logoBasePath} sources={logoSources} />
            {tagline && <span>{tagline}</span>}
          </div>
          {columns.map((c) => (
            <nav key={c.heading} aria-label={c.heading}>
              <h4>{c.heading}</h4>
              {c.items.map((it) =>
                it.href ? (
                  <SmartLink key={it.label} href={it.href} className={it.strong ? "is-strong" : undefined}>{it.label}</SmartLink>
                ) : (
                  <span key={it.label} className="sv-footer__text">{it.label}</span>
                ),
              )}
            </nav>
          ))}
        </div>
        <div className="sv-footer__base">
          <span>{legal}</span>
          {meta && <span>{meta}</span>}
        </div>
      </div>
    </footer>
  );
}
