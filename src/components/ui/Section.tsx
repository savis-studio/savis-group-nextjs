import type { ReactNode } from "react";
import { cn } from "./cn";

export interface SectionProps {
  /** default = bg, surface = alternating light section. Use Hero for band backgrounds. */
  tone?: "default" | "surface";
  id?: string;
  className?: string;
  children: ReactNode;
}

/** Page section: 72px vertical rhythm and the page wrap. Alternate default and surface down the page. */
export function Section({ tone = "default", id, className, children }: SectionProps) {
  return (
    <section id={id} className={cn("sv-section", tone === "surface" && "sv-section--surface", className)}>
      <div className="sv-wrap">{children}</div>
    </section>
  );
}
