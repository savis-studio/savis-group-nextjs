import { Thumb } from "./Thumb";
import type { ThumbSpec } from "@/lib/thumbs";

/** Four illustrated cards beside a hero title, as in the mockup. Decorative: the page lists the same items below. */
export function HeroMosaic({ items, bare }: { bare?: boolean; items: Array<{ key?: string; spec: ThumbSpec; title: string; note?: string }> }) {
  return (
    <div className="sv-mosaic" aria-hidden="true">
      {items.slice(0, 4).map((it) => (
        <div key={it.key ?? it.title} className="sv-mosaic__c">
          <Thumb spec={bare ? { ...it.spec, left: undefined } : it.spec} />
          {!bare && <b>{it.title}</b>}
          {!bare && it.note && <span>{it.note}</span>}
        </div>
      ))}
    </div>
  );
}

/** One large illustrated card beside a hero title (detail pages). Decorative. */
export function HeroCard({ spec }: { spec: ThumbSpec }) {
  return (
    <div className="sv-mosaic sv-mosaic--one" aria-hidden="true">
      <div className="sv-mosaic__c"><Thumb spec={{ ...spec, left: undefined }} big /></div>
    </div>
  );
}
