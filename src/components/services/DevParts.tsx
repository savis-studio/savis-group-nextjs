import { Fragment, type ReactNode } from "react";
import { LineIcon } from "@/components/ui/LineIcon";
import { SmartLink } from "@/components/ui/SmartLink";
import type { DevCell, DevNode, DevSample, DevTable } from "@/data/developers";
import { LINE_ICONS, type LineIconName } from "@/lib/line-icons";
import { hashToPath } from "@/lib/routes";

const TAGS = new Set(["div", "span", "b", "em", "i", "p", "code"]);

/** Renders the text trees of developers.json. Only the tags above and links are produced. */
export function DevNodes({ nodes }: { nodes: DevNode[] }): ReactNode {
  return nodes.map((n, i) => {
    if (typeof n === "string") return <Fragment key={i}>{n}</Fragment>;
    if ("icon" in n) return n.icon in LINE_ICONS ? <LineIcon key={i} name={n.icon as LineIconName} size={28} /> : null;
    const children = n.c ? <DevNodes nodes={n.c} /> : null;
    if (n.t === "a" && n.href) return <SmartLink key={i} href={hashToPath(n.href)}>{children}</SmartLink>;
    const Tag = (TAGS.has(n.t) ? n.t : "span") as "span";
    return <Tag key={i} className={n.cls} style={n.width ? { width: n.width } : undefined}>{children}</Tag>;
  });
}

/** JSON keys and the request line, colored. */
function highlight(code: string): ReactNode {
  return code.split("\n").map((line, i) => {
    const key = /^(\s*)("[A-Za-z]+")(:.*)$/.exec(line);
    return (
      <Fragment key={i}>
        {i > 0 && "\n"}
        {key ? <>{key[1]}<em>{key[2]}</em>{key[3]}</> : /^(GET|POST) /.test(line) ? <b>{line}</b> : line}
      </Fragment>
    );
  });
}

/** A code sample in a window frame. */
export function CodeWindow({ sample, note, color }: { sample: DevSample; note?: string; color?: boolean }) {
  return (
    <figure className="sv-code">
      <figcaption><i /><i /><i /><span>{sample.title}</span></figcaption>
      <pre tabIndex={0} role="group" aria-label={sample.title}><code>{color ? highlight(sample.code) : sample.code}</code></pre>
      {note && <p>{note}</p>}
    </figure>
  );
}

function Cell({ cell }: { cell: DevCell }) {
  if (typeof cell === "string") return cell;
  if ("code" in cell) return <code>{cell.code}</code>;
  return <span className={`sv-method sv-method--${cell.kind}`}>{cell.method}</span>;
}

/** Table that scrolls sideways on narrow screens. */
export function DevGrid({ table, label, className }: { table: DevTable; label: string; className: string }) {
  return (
    <div className={className} tabIndex={0} role="group" aria-label={label}>
      <table>
        <thead><tr>{table.columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
        <tbody>
          {table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}><Cell cell={cell} /></td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}
