import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { PageShell } from "@/components/page/PageShell";
import { LibraryCta, LibraryTabs } from "@/components/resources/LibraryParts";
import { ReportCover } from "@/components/resources/ReportCover";
import { Section } from "@/components/ui";
import { SmartLink } from "@/components/ui/SmartLink";
import { getReports, reportPath, type ReportSummary } from "@/lib/reports";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Reports and whitepapers",
  description: "SAVIS reports and whitepaper series on digital identity, AI security, post-quantum readiness, digital banking and trust services.",
  path: "/resources/reports",
});

interface Row { key: string; eyebrow: string; title: string; summary?: string; reports: ReportSummary[] }

/** The reports first, then one row per whitepaper series in library order, its parts in sequence. */
function rows(reports: ReportSummary[]): Row[] {
  const single = reports.filter((r) => !r.series);
  const series = new Map<string, ReportSummary[]>();
  for (const r of reports) if (r.series) series.set(r.series.name, [...(series.get(r.series.name) ?? []), r]);
  return [
    ...(single.length ? [{ key: "reports", eyebrow: "Reports", title: "In-depth reports from SAVIS experts", summary: "Annual reports on AI security, post-quantum readiness and digital trust.", reports: single }] : []),
    ...[...series].map(([name, parts]) => ({
      key: name,
      eyebrow: "Whitepaper series",
      title: name,
      summary: parts.find((p) => p.series?.summary)?.series?.summary,
      reports: [...parts].sort((a, b) => (a.series?.part ?? 0) - (b.series?.part ?? 0)),
    })),
  ];
}

export default async function ReportsPage() {
  // Built at request time: `next build` has no database, and a prerendered empty list would be served after a release.
  await connection();
  const reports = await getReports();
  // Until the first report is published, a visitor asks for a document through the contact form, as before.
  if (!reports.length) redirect("/contact");
  return (
    <PageShell
      path="/resources/reports"
      eyebrow="Resources"
      title="Reports"
      label="Reports"
      trail={[{ label: "Resources", href: "/resources" }]}
      lead="Reports and whitepaper series from SAVIS experts. Ask for a document and a SAVIS specialist will send it to you."
      cta={false}
    >
      <LibraryTabs current="reports" />
      <Section>
        {rows(reports).map((row) => (
          <section key={row.key} className="sv-rprow">
            <div className="sv-rprow__head">
              <span>{row.eyebrow}</span>
              <h2>{row.title}</h2>
              {row.summary && <p>{row.summary}</p>}
              <small>{row.reports.length} {row.reports.length === 1 ? "title" : "titles"}</small>
            </div>
            <div className="sv-rprow__grid">
              {row.reports.map((r) => (
                <SmartLink key={r.slug} href={reportPath(r.slug)} className="sv-rpcard">
                  <ReportCover report={r} />
                  <em>{r.kind} · {r.topic}</em>
                  <h3>{r.title}</h3>
                  <p>{r.subtitle}</p>
                  <i>Request the {r.kind.toLowerCase()} →</i>
                </SmartLink>
              ))}
            </div>
          </section>
        ))}
      </Section>
      <LibraryCta title="Let’s talk about your project" text="Our experts can walk you through the findings for your organization." action="Contact sales" />
    </PageShell>
  );
}
