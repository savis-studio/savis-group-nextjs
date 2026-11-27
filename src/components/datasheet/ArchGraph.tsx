import type { ReactNode } from "react";
import type { Arch } from "@/lib/content";

/** 24x24 line icons named in the architecture records. */
const ICONS: Record<string, string> = {
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3.5 3.5-5 6.5-5s5.5 1.5 6.5 5"/><circle cx="17" cy="7" r="2.8"/><path d="M16 13.2c2.6.2 4.6 1.8 5.5 4.8"/>',
  gov: '<path d="M3 9 12 4l9 5"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>',
  bank: '<path d="M3 9 12 4l9 5H3z"/><path d="M6 11v7M10 11v7M14 11v7M18 11v7M3 20h18"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  web: '<rect x="2.5" y="4" width="19" height="15" rx="2"/><path d="M2.5 8.5h19M6 6.3h.01M8.5 6.3h.01"/>',
  kiosk: '<rect x="6" y="2.5" width="12" height="13" rx="2"/><path d="M9 21.5h6M12 15.5v6"/>',
  server: '<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><path d="M7 7h.01M7 17h.01"/>',
  key: '<circle cx="8" cy="12" r="4"/><path d="M12 12h9M18 12v3M21 12v2"/>',
  shield: '<path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  db: '<ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  cloud: '<path d="M7 19h10a4.5 4.5 0 0 0 .5-9A6 6 0 0 0 6 9.5 4.8 4.8 0 0 0 7 19z"/>',
  card: '<rect x="2.5" y="5.5" width="19" height="13" rx="2"/><path d="M2.5 10h19M6 15h4"/>',
  cam: '<rect x="3" y="7" width="13" height="10" rx="2"/><path d="m16 11 5-3v8l-5-3"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  doc: '<path d="M6 2.5h8l4 4v15H6z"/><path d="M14 2.5v4h4M9 12h6M9 16h6"/>',
  api: '<path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>',
  qr: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v7h-4M14 21h.01"/>',
  media: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="m10 9 5 3-5 3z"/>',
  health: '<path d="M3 12h4l2-5 3 10 2-5h7"/>',
  net: '<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M12 7.5v4M12 11.5 6.5 17M12 11.5l5.5 5.5"/>',
  soc: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 12 18 6"/>',
};

const WIDTH = 1120;
/** Left edge and width of the four columns: users, channels, the product, trust core and systems. */
const X = [30, 262, 494, 820];
const W = [200, 200, 286, 270];

/** Rough width of a bold label: there is no way to measure text while the page is rendered on the server. */
const textWidth = (text: string, size: number) => text.length * size * 0.58;

/** Splits a label into two lines of about the same length. */
function halves(text: string): string[] {
  const words = text.split(" ");
  const cuts = words.slice(1).map((_, i) => [words.slice(0, i + 1).join(" "), words.slice(i + 1).join(" ")]);
  const longest = (c: string[]) => Math.max(c[0].length, c[1].length);
  return cuts.sort((a, b) => longest(a) - longest(b))[0] ?? [text];
}

/** How to keep a label inside `max`: set it smaller first, then break it into two lines. */
function fitLabel(text: string, size: number, max: number): { lines: string[]; font: number } {
  const fit = (s: string) => Math.min(size, max / textWidth(s, 1));
  if (fit(text) >= size * 0.82 || !text.includes(" ")) return { lines: [text], font: fit(text) };
  const lines = halves(text);
  return { lines, font: Math.max(9, Math.min(size * 0.9, ...lines.map(fit))) };
}

/** An SVG label fitted to `max`. `y` is the one-line baseline; two lines sit around it. */
function Label({ x, y, text, size, max, className }: { x: number; y: number; text: string; size: number; max: number; className?: string }) {
  const { lines, font } = fitLabel(text, size, max);
  const style = font < size ? { fontSize: `${font.toFixed(1)}px` } : undefined;
  return (
    <text className={className} x={x} y={y} style={style}>
      {lines.length === 1 ? text : lines.map((line, i) => <tspan key={line} x={x} dy={i ? "1.15em" : "-0.55em"}>{i ? ` ${line}` : line}</tspan>)}
    </text>
  );
}

/** Top edge and height of `n` boxes stacked in the middle of the band from `top` to `bottom`. */
function stack(n: number, top: number, bottom: number): Array<[y: number, h: number]> {
  const h = Math.min(64, (bottom - top - (n - 1) * 14) / n);
  const y0 = top + (bottom - top - (n * h + (n - 1) * 14)) / 2;
  return Array.from({ length: n }, (_, i) => [y0 + i * (h + 14), h]);
}

/** One animated flow between two boxes, with the number of the step it belongs to. */
function flow(key: string, [x1, y1]: [number, number], [x2, y2]: [number, number], step: number, delay: number): ReactNode {
  const mx = (x1 + x2) / 2;
  const d = `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
  return (
    <g key={key}>
      <path className="ag-l" d={d} />
      <path className="ag-f" d={d} style={{ animationDelay: `${delay.toFixed(1)}s` }} />
      {step > 0 && (
        <g className="ag-b"><circle cx={mx} cy={(y1 + y2) / 2} r="11" /><text x={mx} y={(y1 + y2) / 2 + 4}>{step}</text></g>
      )}
    </g>
  );
}

/**
 * Reference architecture as a drawing: users, channels, the product and the trust core and systems it connects to,
 * with numbered flows that the list below spells out. `name` is the product name without "SAVIS".
 */
export function ArchGraph({ arch, name }: { arch: Arch; name: string }) {
  const { users, ch, mods, core, ent } = arch;
  const height = Math.max(380, Math.max(users.length, ch.length) * 78 + 120, (core.length + ent.length) * 72 + 150);
  const middle = 70 + (height - 110) / 2;
  const U = stack(users.length, 70, height - 40);
  const C = stack(ch.length, 70, height - 40);
  const K = stack(core.length, 70, middle - 14);
  const E = stack(ent.length, middle + 28, height - 40);
  const [px, py, pw, ph] = [X[2], 70, W[2], height - 110];
  // A product name on two lines starts higher and moves the line under it down.
  const longName = fitLabel(name, 19, pw - 24).lines.length > 1;
  const step = (ph - 96) / mods.length;
  const modHeight = Math.min(40, step - 8);
  const mid = ([y, h]: [number, number]) => y + h / 2;

  const boxes = (items: Arch["users"], at: Array<[number, number]>, col: number, kind: string) =>
    items.map(([label, icon], i) => {
      const [y, h] = at[i];
      return (
        <g key={label} className={`ag-n ${kind}`}>
          <rect x={X[col]} y={y} width={W[col]} height={h} rx="12" />
          <g transform={`translate(${X[col] + 12} ${y + h / 2 - 11})`} className="ag-i">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: ICONS[icon] ?? ICONS.server }} />
          </g>
          <Label x={X[col] + 44} y={y + h / 2 + 4.5} text={label} size={13.5} max={W[col] - 52} />
        </g>
      );
    });

  const names = (items: Array<[string, string] | string>) => items.map((x) => (typeof x === "string" ? x : x[0])).join(", ");
  const summary = `Architecture of ${name}. Users: ${names(users)}. Channels: ${names(ch)}. ${name}: ${names(mods)}. Trust core: ${names(core)}. Connected systems: ${names(ent)}.`;

  return (
    <figure className="ag">
      <div className="ag-scroll" role="region" tabIndex={0} aria-label="Architecture diagram">
        <svg className="ag-svg" viewBox={`0 0 ${WIDTH} ${height}`} role="img" aria-label={summary}>
          {["USERS", "CHANNELS", "SAVIS", "TRUST CORE · SYSTEMS"].map((t, i) => <text key={t} className="ag-h" x={X[i] + W[i] / 2} y="44">{t}</text>)}
          {U.map((u, i) => {
            const to = C[Math.min(i, C.length - 1)];
            return flow(`u${i}`, [X[0] + W[0], mid(u)], [X[1], mid(to)], i === 0 ? 1 : 0, i * 0.2);
          })}
          {C.map((c, i) => flow(`c${i}`, [X[1] + W[1], mid(c)], [px, py + (ph * (i + 1)) / (C.length + 1)], i === 0 ? 2 : 0, 0.4 + i * 0.2))}
          {K.map((k, i) => flow(`k${i}`, [px + pw, py + ph * 0.25 + i * 10], [X[3], mid(k)], i === 0 ? 3 : 0, 0.8 + i * 0.2))}
          {E.map((e, i) => flow(`e${i}`, [px + pw, py + ph * 0.72 + i * 10], [X[3], mid(e)], i === 0 ? 4 : 0, 1 + i * 0.2))}
          {boxes(users, U, 0, "u")}
          {boxes(ch, C, 1, "c")}
          <g className="ag-p">
            <rect x={px} y={py} width={pw} height={ph} rx="18" />
            <Label className="ag-pt" x={px + pw / 2} y={py + (longName ? 32 : 34)} text={name} size={19} max={pw - 24} />
            <Label className="ag-ps" x={px + pw / 2} y={py + (longName ? 62 : 54)} text={arch.tag || "SAVIS platform"} size={11.5} max={pw - 24} />
            {mods.map((m, i) => {
              const y = py + 74 + i * step;
              return (
                <g key={m} className="ag-m" style={{ animationDelay: `${(i * 0.15).toFixed(2)}s` }}>
                  <rect x={px + 18} y={y} width={pw - 36} height={modHeight} rx="8" />
                  <Label x={px + pw / 2} y={y + modHeight / 2 + 4.5} text={m} size={13} max={pw - 52} />
                </g>
              );
            })}
          </g>
          {boxes(core, K, 3, "k")}
          {boxes(ent, E, 3, "e")}
        </svg>
      </div>
      {arch.steps && arch.steps.length > 0 && (
        <ol className="ag-steps">
          {arch.steps.map((s, i) => <li key={i}><b>{i + 1}</b><span>{s}</span></li>)}
        </ol>
      )}
      <figcaption>Reference architecture of {name}. Components and integrations are confirmed during solution design.</figcaption>
    </figure>
  );
}
