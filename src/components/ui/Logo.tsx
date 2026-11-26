import { cn } from "./cn";

export interface LogoSources {
  /** Full-colour lockup for light backgrounds (savis-logo.png). */
  light: string;
  /** White lockup for band, hero, footer (savis-logo-white.png). */
  dark: string;
}

export interface LogoProps {
  /** White lockup on dark backgrounds (footer, band). */
  onDark?: boolean;
  /** Folder holding savis-logo.png and savis-logo-white.png (default /brand → public/brand/). */
  basePath?: string;
  /** Explicit URLs; overrides basePath. */
  sources?: LogoSources;
  /** Link target; pass null to render a non-link (e.g. footer). */
  href?: string | null;
  className?: string;
}

/** SAVIS Group lockup (mark + wordmark in one image, mockup v6.6). Height comes from logo-h tokens. Never redraw or recolor. */
export function Logo({ onDark, basePath = "/brand", sources, href = "/", className }: LogoProps) {
  const s = sources ?? { light: `${basePath}/savis-logo.png`, dark: `${basePath}/savis-logo-white.png` };
  const img = <img src={onDark ? s.dark : s.light} alt="SAVIS Group" width={130} height={46} />;
  if (href === null) return <span className={cn("sv-logo", className)}>{img}</span>;
  return (
    <a href={href} className={cn("sv-logo", className)} aria-label="SAVIS Group home">
      {img}
    </a>
  );
}
