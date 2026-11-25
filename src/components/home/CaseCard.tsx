import { SmartLink } from "@/components/ui/SmartLink";
import type { CaseStudy } from "@/lib/content";

/** Customer story teaser. `tone` picks the pillar colour of the thumbnail. */
export function CaseCard({ item, category, tone = "identity" }: { item: CaseStudy; category: string; tone?: string }) {
  return (
    <SmartLink href={`/customers/${item.id}`} className="sv-case">
      <span className={`sv-case__th sv-case__th--${tone}`} aria-hidden="true">
        <em>{item.country}</em>
      </span>
      <span className="sv-eyebrow" style={{ color: "var(--muted)" }}>{category}</span>
      <h3>{item.title}</h3>
      <p>{item.summary}</p>
      <span className="sv-go">Read the case study →</span>
    </SmartLink>
  );
}
