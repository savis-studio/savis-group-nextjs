import { SmartLink } from "@/components/ui/SmartLink";
import type { NewsItem } from "@/lib/content";

/** News teaser for items that only carry a display date (the shared NewsCard needs an ISO date). */
export function NewsTile({ item, tone = "blue" }: { item: NewsItem; tone?: string }) {
  return (
    <SmartLink href={`/insights/${item.id}`} className="sv-tile">
      <span className={`sv-tile__ban sv-tile__ban--${tone}`} aria-hidden="true" />
      <span className="sv-eyebrow" style={{ color: "var(--muted)" }}>{item.cat} · {item.date}</span>
      <h3>{item.title}</h3>
    </SmartLink>
  );
}
