import type { ReactNode } from "react";
import { Chip } from "./Chip";
import { cn } from "./cn";
import { SmartLink } from "./SmartLink";

export interface PillarCardProps {
  number: string;
  title: ReactNode;
  /** Short descriptor under the title. */
  subtitle?: string;
  tags?: string[];
  /** One lead card per grid: band fill. */
  lead?: boolean;
  href?: string;
  /** Banner illustration at the top of the card. */
  art?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function PillarCard({ number, title, subtitle, tags = [], lead, href, art, className, children }: PillarCardProps) {
  const cls = cn("sv-pillar", lead && "sv-pillar--lead", className);
  const body = (
    <>
      {art}
      <span className="sv-pillar__num">{number}</span>
      <h3>{title}</h3>
      {subtitle && <span className="sv-pillar__sub">{subtitle}</span>}
      {children && <p>{children}</p>}
      {tags.length > 0 && <span className="sv-pillar__tags">{tags.map((t) => <Chip key={t} onBand={lead}>{t}</Chip>)}</span>}
    </>
  );
  if (href) return <SmartLink href={href} className={cls}>{body}</SmartLink>;
  return <div className={cls}>{body}</div>;
}
