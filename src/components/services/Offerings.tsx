import type { ReactNode } from "react";
import { OpenOnHash } from "@/components/services/OpenOnHash";
import { SectionHead } from "@/components/ui";
import { cn } from "@/components/ui/cn";
import { LineIcon } from "@/components/ui/LineIcon";
import { Thumb } from "@/components/ui/Thumb";
import type { LineIconName } from "@/lib/line-icons";
import type { ThumbSpec } from "@/lib/thumbs";

export interface Offering {
  /** Anchor of the item; the mega menu links to it. */
  id: string;
  name: string;
  text: string;
  bullets: string[];
  icon: LineIconName;
}

/** Bullets that open with a regulation heading show it in bold. */
const LEAD_IN = /^((?:Regulatory compliance|Compliance assessment)[^:]*:)\s(.*)$/;

function Bullet({ text }: { text: string }) {
  const m = LEAD_IN.exec(text);
  return m ? <li className="sv-acc__long"><b>{m[1]}</b> {m[2]}</li> : <li>{text}</li>;
}

export interface OfferingsProps {
  eyebrow: string;
  title: string;
  lead?: string;
  items: Offering[];
  /** One large illustration and the small ones under it. */
  art: { big: ThumbSpec; minis: ThumbSpec[] };
  /** Count shown on the large illustration, such as "4 offerings". */
  badge: string;
  /** Puts the illustrations on the right on wide screens. */
  reverse?: boolean;
  action?: ReactNode;
}

/** Illustrations that stay in view next to an expandable list of offerings. The first item starts open. */
export function Offerings({ eyebrow, title, lead, items, art, badge, reverse, action }: OfferingsProps) {
  return (
    <div className={cn("sv-offer", reverse && "sv-offer--reverse")}>
      <div className="sv-offer__art" aria-hidden="true">
        <Thumb spec={{ ...art.big, left: badge }} big />
        <div className="sv-offer__minis">{art.minis.map((m, i) => <Thumb key={i} spec={m} />)}</div>
      </div>
      <div className="sv-offer__body">
        <SectionHead eyebrow={eyebrow} title={title} />
        {lead && <p className="sv-offer__lead">{lead}</p>}
        <div className="sv-offer__list">
          {items.map((item, i) => (
            <details key={item.id} id={item.id} open={i === 0} className="sv-acc">
              <summary>
                <span className="sv-acc__ic"><LineIcon name={item.icon} /></span>
                <b>{item.name}</b>
                <i aria-hidden="true">+</i>
              </summary>
              <p>{item.text}</p>
              {item.bullets.length > 0 && <ul>{item.bullets.map((b) => <Bullet key={b} text={b} />)}</ul>}
            </details>
          ))}
        </div>
        {action}
      </div>
      <OpenOnHash ids={items.map((i) => i.id)} />
    </div>
  );
}
