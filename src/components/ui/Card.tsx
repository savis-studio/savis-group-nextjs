import type { ReactNode } from "react";
import { cn } from "./cn";
import { SmartLink } from "./SmartLink";

export interface CardProps {
  title: ReactNode;
  /** Makes the whole card a link; do not put other links inside. */
  href?: string;
  /** One verb shown at the bottom of a linked card, e.g. "Explore". */
  cta?: string;
  /** Thumbnail shown above the title. */
  thumb?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function Card({ title, href, cta, thumb, className, children }: CardProps) {
  const body = (
    <>
      {thumb}
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {href && cta && <span className="sv-go">{cta} →</span>}
    </>
  );
  if (href) return <SmartLink href={href} className={cn("sv-card", "sv-card--link", className)}>{body}</SmartLink>;
  return <div className={cn("sv-card", className)}>{body}</div>;
}
