import type { Metadata } from "next";
import { NewsTile } from "@/components/home/NewsTile";
import { PageShell } from "@/components/page/PageShell";
import { JumpBar } from "@/components/solutions/Blocks";
import { Button, Section, SectionHead } from "@/components/ui";
import { SmartLink } from "@/components/ui/SmartLink";
import { Thumb } from "@/components/ui/Thumb";
import { getCases } from "@/lib/content";
import { caseThumb, newsThumb } from "@/lib/thumbs";
import { getArticles } from "@/lib/insights";
import { buildMetadata } from "@/lib/seo";

const PATH = "/insights";

export const metadata: Metadata = buildMetadata({
  title: "Insights & News",
  description: "Research, reference architectures, regulation updates and press releases from SAVIS on digital identity, PKI, fraud prevention and post-quantum security.",
  path: PATH,
});

const SECTIONS: Array<[type: string, id: string, title: string, eyebrow: string]> = [
  ["insight", "insights", "Research & reference architectures", "Insights"],
  ["news", "regulation", "Regulation & policy", "Regulation"],
  ["press", "press", "Press releases & company news", "Press"],
];

export default async function InsightsPage() {
  const all = await getArticles();
  const latest = [...all].filter((n) => n.type !== "insight").sort((a, b) => (b.iso ?? "").localeCompare(a.iso ?? ""))[0];
  const featured = getCases()[0];
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
          <Button href="#press" onBand>Read the news</Button>
          <Button href="/customers" variant="ghost" onBand>Browse case studies</Button>
        </>
      }
    >
      <JumpBar links={[...SECTIONS.map(([, id, title]) => ({ href: `#${id}`, label: title })), { href: "/customers", label: "Case studies" }]} />
      {SECTIONS.map(([type, id, title, eyebrow], i) => {
        const items = all.filter((n) => n.type === type);
        if (!items.length) return null;
        return (
          <Section key={id} id={id} tone={i % 2 ? "surface" : "default"}>
            <SectionHead eyebrow={`${eyebrow} · ${items.length}`} title={title} />
            <div className="sv-cols3">
              {items.map((n) => <NewsTile key={n.id} item={n} />)}
            </div>
          </Section>
        );
      })}
    </PageShell>
  );
}
