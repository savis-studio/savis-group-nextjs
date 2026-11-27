import type { DeveloperData } from "@/data/developers";

const LANE = 190;
const x = (actor: number) => 90 + actor * LANE;
const y = (message: number) => 96 + message * 46;

/** Sequence diagram: one lane per actor, one arrow per message. It scrolls sideways on narrow screens. */
export function SequenceDiagram({ data }: { data: DeveloperData["flow"]["sequence"] }) {
  const bottom = y(data.messages.length - 1) + 56;
  const width = x(data.actors.length - 1) + 90;
  return (
    <div className="sv-seq" tabIndex={0} role="group" aria-label={data.title}>
      <svg viewBox={`0 0 ${width} ${bottom + 10}`} role="img" aria-label={data.label}>
        {data.actors.map((name, i) => (
          <g key={name}>
            <rect x={x(i) - 80} y="14" width="160" height="44" rx="10" className="sv-seq__head" />
            <text x={x(i)} y="41" textAnchor="middle" className="sv-seq__who">{name}</text>
            <line x1={x(i)} y1="58" x2={x(i)} y2={bottom} className="sv-seq__lane" />
          </g>
        ))}
        {data.messages.map((m, i) => {
          const dir = m.to > m.from ? 1 : -1;
          const tip = x(m.to);
          return (
            <g key={m.text} className={m.reply ? "sv-seq__reply" : undefined}>
              <line x1={x(m.from)} y1={y(i)} x2={tip - 6 * dir} y2={y(i)} className="sv-seq__line" />
              <path d={`M${tip} ${y(i)} l${-9 * dir} -5 v10z`} className="sv-seq__tip" />
              <text x={Math.min(x(m.from), tip) + 8} y={y(i) - 8} className="sv-seq__text">
                {m.text}
                {m.result && <tspan className="sv-seq__result"> {m.result}</tspan>}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
