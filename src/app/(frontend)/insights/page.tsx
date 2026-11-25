import type { Metadata } from "next";
import { NewsTile } from "@/components/home/NewsTile";
import { PageShell } from "@/components/page/PageShell";
import { JumpBar } from "@/components/solutions/Blocks";
import { Section, SectionHead } from "@/components/ui";
import { getNews } from "@/lib/content";
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

export default function InsightsPage() {
  const all = getNews();
  return (
    <PageShell
      path={PATH}
      eyebrow="Insights & News"
      title="What we are learning, building and announcing."
      label="Insights"
      lead="Research on digital trust, reference architectures, regulatory changes and company news."
    >
      <JumpBar links={SECTIONS.map(([, id, title]) => ({ href: `#${id}`, label: title }))} />
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
