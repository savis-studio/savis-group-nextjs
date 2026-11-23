import { Chip } from "./Chip";
import { cn } from "./cn";
import { SmartLink } from "./SmartLink";

export interface NewsCardProps {
  title: string;
  href: string;
  /** ISO date, shown as e.g. "21 Nov 2026". */
  date: string;
  category?: string;
  excerpt?: string;
  image?: { src: string; alt: string };
  className?: string;
}

const fmt = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** Insights / news list item. The whole card is the link. */
export function NewsCard({ title, href, date, category, excerpt, image, className }: NewsCardProps) {
  return (
    <SmartLink href={href} className={cn("sv-news", className)}>
      {image && <div className="sv-news__img"><img src={image.src} alt={image.alt} loading="lazy" /></div>}
      <div className="sv-news__body">
        <div className="sv-news__meta">
          {category && <Chip>{category}</Chip>}
          <time dateTime={date}>{fmt(date)}</time>
        </div>
        <h3>{title}</h3>
        {excerpt && <p>{excerpt}</p>}
      </div>
    </SmartLink>
  );
}
