import "@/styles/solutions.css";
import { SmartLink } from "@/components/ui/SmartLink";
import type { Journey as JourneyData } from "@/lib/content";
import { hashToPath } from "@/lib/routes";

/** Dark band that walks through the steps of a customer journey, each linking to its main product. */
export function Journey({ journey, lead }: { journey: JourneyData; lead?: string }) {
  return (
    <section className="sv-journey">
      <div className="sv-wrap">
        <div className="sv-sec-head">
          <div>
            <span className="sv-eyebrow sv-eyebrow--rule">{journey.eyebrow}</span>
            <h2>{journey.title}</h2>
          </div>
        </div>
        {lead && <p className="sv-journey__lead">{lead}</p>}
        <ol className="sv-journey__steps" style={{ "--n": journey.steps.length } as React.CSSProperties}>
          {journey.steps.map((s, i) => {
            const inner = (
              <>
                <em>{String(i + 1).padStart(2, "0")}</em>
                <b>{s.title}</b>
                <span className="sv-journey__t">{s.text}</span>
                {s.products.length > 0 && <span className="sv-journey__pr">{s.products.map((p) => <i key={p}>{p}</i>)}</span>}
              </>
            );
            return (
              <li key={s.title}>
                {s.href ? <SmartLink href={hashToPath(s.href)}>{inner}</SmartLink> : <div>{inner}</div>}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
