import { SmartLink } from "@/components/ui/SmartLink";
import { Thumb } from "@/components/ui/Thumb";
import type { CaseStudy } from "@/lib/content";
import { caseThumb } from "@/lib/thumbs";

/** Customer story teaser with scene-art thumbnail. */
export function CaseCard({ item, category }: { item: CaseStudy; category: string; tone?: string }) {
  return (
    <SmartLink href={`/customers/${item.id}`} className="sv-case">
      <Thumb spec={caseThumb(item)} />
      <span className="sv-eyebrow" style={{ color: "var(--muted)" }}>{category}</span>
      <h3>{item.title}</h3>
      <p>{item.summary}</p>
      <span className="sv-go">Read the case study →</span>
    </SmartLink>
  );
}
