import type { ReactNode } from "react";

export interface SectionHeadProps {
  eyebrow?: string;
  title: ReactNode;
  /** Heading level; keep one h1 per page (the Hero). */
  as?: "h2" | "h3";
  /** Action on the right, usually a ghost Button. */
  children?: ReactNode;
}

export function SectionHead({ eyebrow, title, as: H = "h2", children }: SectionHeadProps) {
  return (
    <div className="sv-sec-head">
      <div>
        {eyebrow && <span className="sv-eyebrow sv-eyebrow--rule">{eyebrow}</span>}
        <H>{title}</H>
      </div>
      {children && <div>{children}</div>}
    </div>
  );
}
