import { SmartLink } from "@/components/ui/SmartLink";
import { Thumb } from "@/components/ui/Thumb";
import type { NewsItem } from "@/lib/content";
import { newsThumb } from "@/lib/thumbs";

/** News teaser for items that only carry a display date (the shared NewsCard needs an ISO date). */
export function NewsTile({ item }: { item: NewsItem; tone?: string }) {
  return (
    <SmartLink href={`/insights/${item.id}`} className="sv-tile">
      <Thumb spec={newsThumb(item)} big />
      <span className="sv-eyebrow" style={{ color: "var(--muted)" }}>{item.cat} · {item.date}</span>
      <h3>{item.title}</h3>
    </SmartLink>
  );
}
