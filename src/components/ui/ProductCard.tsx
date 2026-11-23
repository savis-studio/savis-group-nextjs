import { Chip } from "./Chip";
import { cn } from "./cn";
import { SmartLink } from "./SmartLink";

export interface ProductCardProps {
  name: string;
  description: string;
  /** Uppercase role tags: SAVIS, CORE TECHNOLOGY, PARTNER · VERIFY, or New. */
  tags?: string[];
  href?: string;
  className?: string;
}

export function ProductCard({ name, description, tags = [], href, className }: ProductCardProps) {
  const body = (
    <>
      <b>{name}</b>
      <span className="sv-prod__d">{description}</span>
      {tags.length > 0 && <span className="sv-prod__meta">{tags.map((t) => <Chip key={t}>{t}</Chip>)}</span>}
    </>
  );
  if (href) return <SmartLink href={href} className={cn("sv-prod", className)}>{body}</SmartLink>;
  return <div className={cn("sv-prod", className)}>{body}</div>;
}
