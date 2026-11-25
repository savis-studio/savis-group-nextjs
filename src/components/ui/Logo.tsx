import { cn } from "./cn";

export interface LogoSources { mark: string; word: string; wordWhite: string }

export interface LogoProps {
  /** Use the white wordmark on band, hero and footer. */
  onDark?: boolean;
  /** Folder holding logo-mark.svg, logo-word.svg, logo-word-white.svg (default /brand → public/brand/). */
  basePath?: string;
  /** Explicit URLs; overrides basePath. */
  sources?: LogoSources;
  href?: string;
  className?: string;
}

/** SAVIS mark + wordmark. Never redraw or recolor; pick the light/dark wordmark by background. */
export function Logo({ onDark, basePath = "/brand", sources, href = "/", className }: LogoProps) {
  const s = sources ?? { mark: `${basePath}/logo-mark.svg`, word: `${basePath}/logo-word.svg`, wordWhite: `${basePath}/logo-word-white.svg` };
  return (
    <a href={href} className={cn("sv-logo", className)} aria-label="SAVIS Group home">
      <img className="sv-logo__mark" src={s.mark} alt="" width={48} height={48} />
      <img className="sv-logo__word" src={onDark ? s.wordWhite : s.word} alt="" width={83} height={34} />
    </a>
  );
}
