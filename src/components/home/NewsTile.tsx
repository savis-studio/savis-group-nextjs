import { SmartLink } from "@/components/ui/SmartLink";
import { PhotoThumb, Thumb } from "@/components/ui/Thumb";
import type { NewsItem } from "@/lib/content";
import { newsThumb } from "@/lib/thumbs";

/**
 * News teaser for items that only carry a display date (the shared NewsCard needs an ISO date). The card is the
 * mockup's Insights card: picture with its category, then category and date, then the title. The home page boxes it.
 */
export function NewsTile({ item, boxed }: { item: NewsItem; tone?: string; boxed?: boolean }) {
  return (
    <SmartLink href={`/insights/${item.id}`} className={boxed ? "sv-tile" : "sv-story"}>
      {item.cover ? <PhotoThumb src={item.cover.src} label={item.cat} big={Boolean(boxed)} /> : <Thumb spec={newsThumb(item)} big={boxed} />}
      {boxed ? (
        <span className="sv-eyebrow" style={{ color: "var(--muted)" }}>{item.cat} · {item.date}</span>
      ) : (
        <span className="sv-story__meta">{item.cat} · {item.date}</span>
      )}
      <h3>{item.title}</h3>
    </SmartLink>
  );
}
