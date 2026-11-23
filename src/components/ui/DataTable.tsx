import type { ReactNode } from "react";
import { cn } from "./cn";

export interface DataTableProps {
  columns: string[];
  /** First cell of each row is the row label (th scope=row). */
  rows: ReactNode[][];
  caption?: string;
  className?: string;
}

export function DataTable({ columns, rows, caption, className }: DataTableProps) {
  return (
    <div className={cn("sv-table", className)} role="region" aria-label={caption} tabIndex={0}>
      <table>
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead><tr>{columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((cell, j) => (j === 0 ? <th key={j} scope="row">{cell}</th> : <td key={j}>{cell}</td>))}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
