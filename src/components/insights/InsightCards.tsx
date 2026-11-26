import { SmartLink } from "@/components/ui/SmartLink";
import { PhotoThumb, Thumb } from "@/components/ui/Thumb";
import type { CaseStudy } from "@/lib/content";
import type { ArticleDetail } from "@/lib/insights";
import { caseThumb, newsThumb } from "@/lib/thumbs";

/** The article's photo, or its illustration. `chip` shows the category on the picture. */
function Art({ item, chip }: { item: ArticleDetail; chip?: boolean }) {
  if (item.cover) return <PhotoThumb src={item.cover.src} label={chip ? item.cat : undefined} big={false} />;
  const spec = newsThumb(item);
  return <Thumb spec={chip ? spec : { ...spec, left: undefined }} />;
}

/** Boxed card of a tab's listing: banner, category and date, title, summary and sources. */
export function ListCard({ item, category, region }: { item: ArticleDetail; category: string; region?: string }) {
  const names = [...new Set(item.sources.map((s) => s.name))].slice(0, 2).join(", ");
  const more = item.sources.length - 2;
  return (
    <SmartLink href={`/insights/${item.id}`} className="sv-lcard">
      <span className="sv-lcard__ban"><Art item={item} /></span>
      <span className="sv-lcard__meta">
        <b>{category}</b>
        {region && <i>{region}</i>}
        <span>{item.date}</span>
      </span>
      <h3>{item.title}</h3>
      <p>{item.sum}</p>
      {names && <span className="sv-lcard__src">Source: {names}{more > 0 ? ` +${more}` : ""}</span>}
      <span className="sv-go">Read more →</span>
    </SmartLink>
  );
}

/** Card of the overview's "Expert insights" row, labelled by topic and sector. */
export function ExpertCard({ item, sector }: { item: ArticleDetail; sector: string }) {
  return (
    <SmartLink href={`/insights/${item.id}`} className="sv-xcard">
      <span className="sv-xcard__th"><Art item={item} chip /></span>
      <span className="sv-xcard__body">
        <span className="sv-xcard__chips"><span>{item.cat}</span><span>{sector}</span></span>
        <h3>{item.title}</h3>
        <p>{item.sum}</p>
        <span className="sv-go">Read the analysis →</span>
      </span>
    </SmartLink>
  );
}

/** Case study teaser in the overview's style (the case study library keeps its own card). */
export function CaseStory({ item, category }: { item: CaseStudy; category: string }) {
  return (
    <SmartLink href={`/customers/${item.id}`} className="sv-story">
      <Thumb spec={caseThumb(item)} />
      <span className="sv-story__meta">{category}</span>
      <h3>{item.title}</h3>
      <span className="sv-story__sub">{item.client}</span>
    </SmartLink>
  );
}

/** Large picture card in a hero: the latest article, and on the overview a featured case study under it. */
export function LatestCard({ href, caption, title, item, caseItem }: { href: string; caption: string; title: string; item?: ArticleDetail; caseItem?: CaseStudy }) {
  return (
    <SmartLink href={href} className={caseItem ? "sv-latest__c sv-latest__c--s" : "sv-latest__c"}>
      {caseItem ? <Thumb spec={caseThumb(caseItem)} big /> : item && <Art item={item} />}
      <span><em>{caption}</em><b>{title}</b></span>
    </SmartLink>
  );
}
