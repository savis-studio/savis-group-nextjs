import type { Metadata } from "next";
import { NewsTile } from "@/components/home/NewsTile";
import { PageShell } from "@/components/page/PageShell";
import { Button, Section, SectionHead } from "@/components/ui";
import { SmartLink } from "@/components/ui/SmartLink";
import { Thumb } from "@/components/ui/Thumb";
import { getCases } from "@/lib/content";
import { caseThumb, newsThumb } from "@/lib/thumbs";
import { FilterTabs } from "@/components/page/FilterTabs";
import { getArticles, type ArticleDetail } from "@/lib/insights";
import { buildMetadata } from "@/lib/seo";

const PATH = "/insights";

export const metadata: Metadata = buildMetadata({
  title: "Insights & News",
  description: "Research, reference architectures, regulation updates and press releases from SAVIS on digital identity, PKI, fraud prevention and post-quantum security.",
  path: PATH,
});

/** Tabs of the page, in order. A tab with no articles is left out. Blog and tech bulletins will appear once there are any. */
const GROUPS: Array<{ id: string; label: string; eyebrow: string; title: string; pick: (n: ArticleDetail) => boolean }> = [
  { id: "news", label: "News", eyebrow: "News", title: "What is changing", pick: (n) => n.type === "press" && n.cat !== "Press release" },
  { id: "press", label: "Press Releases", eyebrow: "Press", title: "Press releases", pick: (n) => n.type === "press" && n.cat === "Press release" },
  { id: "regulation", label: "Regulation & Policy", eyebrow: "Regulation", title: "Regulation & policy", pick: (n) => n.type === "news" },
  { id: "insights", label: "Research", eyebrow: "Insights", title: "Research & reference architectures", pick: (n) => n.type === "insight" },
];

export default async function InsightsPage() {
  const all = await getArticles();
  const latest = [...all].filter((n) => n.type !== "insight").sort((a, b) => (b.iso ?? "").localeCompare(a.iso ?? ""))[0];
  const featured = getCases()[0];
  const panels = GROUPS.flatMap((g, i) => {
    const items = all.filter(g.pick);
    if (!items.length) return [];
    return [{
      id: g.id,
      label: g.label,
      node: (
        <Section tone={i % 2 ? "surface" : "default"}>
          <SectionHead eyebrow={`${g.eyebrow} · ${items.length}`} title={g.title} />
          <div className="sv-cols3">{items.map((n) => <NewsTile key={n.id} item={n} />)}</div>
        </Section>
      ),
    }];
  });
  return (
    <PageShell
      path={PATH}
      eyebrow="Insights & News"
      title="News, press releases, regulation and case studies."
      label="Insights"
      lead="What is changing in digital trust, what SAVIS is announcing, the rules that shape the market, and projects running in production."
      aside={
        <div className="sv-feat">
          {latest && (
            <SmartLink href={`/insights/${latest.id}`} className="sv-feat__c">
              <Thumb spec={newsThumb(latest)} big />
              <span><em>Latest news</em><b>{latest.title}</b></span>
            </SmartLink>
          )}
          {featured && (
            <SmartLink href={`/customers/${featured.id}`} className="sv-feat__c sv-feat__c--s">
              <Thumb spec={caseThumb(featured)} big />
              <span><em>Featured case study</em><b>{featured.title}</b></span>
            </SmartLink>
          )}
        </div>
      }
      actions={
        <>
          <Button href="#news" onBand>Read the news</Button>
          <Button href="/customers" variant="ghost" onBand>Browse case studies</Button>
        </>
      }
    >
      <FilterTabs
        panels={panels}
        extra={<a className="sv-jump__a" href="/customers">Case studies</a>}
      />
    </PageShell>
  );
}
