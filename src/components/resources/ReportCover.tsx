import type { ReportSummary } from "@/lib/reports";

/** The cover of a report, drawn from its details: the documents themselves are not on the website. */
export function ReportCover({ report }: { report: ReportSummary }) {
  const { kind, year, title, subtitle, series, palette } = report;
  return (
    <span className="sv-rpc" data-pal={palette} aria-hidden="true">
      <span>
        <em>SAVIS {kind}{year ? ` · ${year}` : ""}</em>
        <b>{title}</b>
        {series && <small>{seriesLabel(series)}</small>}
      </span>
      <span className="sv-rpc__sub">{subtitle}</span>
      <i>SAVIS Group</i>
    </span>
  );
}

/** "Digital ID Wallet series · Part 1 of 3" */
export const seriesLabel = (s: NonNullable<ReportSummary["series"]>) =>
  s.part && s.parts ? `${s.name} · Part ${s.part} of ${s.parts}` : s.name;
