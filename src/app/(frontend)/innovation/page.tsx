import type { Metadata } from "next";
import { NewsTile } from "@/components/home/NewsTile";
import { PageShell } from "@/components/page/PageShell";
import { InfoCard } from "@/components/solutions/Blocks";
import { Button, Card, Section, SectionHead } from "@/components/ui";
import { FOCUS_AREAS, INNOVATION_LABS, RND_PRINCIPLES } from "@/data/company-pages-2";
import company from "@/data/mockup/company.json";
import { getNewsItem } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

const PATH = "/innovation";

export const metadata: Metadata = buildMetadata({
  title: "Innovation and R&D",
  description: "Building the trust layer for the next decade: SAVIS R&D in post-quantum cryptography, digital identity and applied AI, with labs you can see and test.",
  path: PATH,
});

const FEATURED = ["savis-research-2026-whitepaper-guide", "national-digital-id-lessons-nigeria-nin", "fapi-2-open-banking-baseline-singapore"];

export default function InnovationPage() {
  const articles = FEATURED.flatMap((id) => getNewsItem(id) ?? []);
  return (
    <PageShell
      path={PATH}
      eyebrow="Innovation"
      title="Building the trust layer for the next decade."
      label="Innovation"
      trail={[]}
      lead="Our R&D focuses on the technology that will decide whether digital services stay trustworthy: post-quantum cryptography, digital identity and applied AI."
      actions={
        <>
          <Button href="/innovation/pqc-lab" onBand>Visit the PQC Lab</Button>
          <Button href="/partners" variant="ghost" onBand>Technology partnerships</Button>
        </>
      }
    >
      <Section>
        <SectionHead eyebrow="Labs" title="Research you can see and test" />
        <div className="sv-cols3">
          {INNOVATION_LABS.map((l) => (
            <Card key={l.title} title={l.title} href={l.href} cta={l.href ? "Explore" : undefined}>
              {l.text}
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <SectionHead eyebrow="Focus areas" title="Where we invest" />
        <div className="sv-grid">
          {FOCUS_AREAS.map(([tag, title, text, href]) => (
            <Card key={title} title={`${title}`} href={href} cta={href ? "Learn more" : undefined}>
              {tag}: {text}
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHead eyebrow="How we do R&D" title="From research to products customers can run." />
        <InfoCard label="Principles" items={RND_PRINCIPLES} />
      </Section>

      {articles.length > 0 && (
        <Section tone="surface">
          <SectionHead eyebrow="Research & insight" title="From our experts" />
          <div className="sv-cols3">{articles.map((n) => <NewsTile key={n.id} item={n} />)}</div>
        </Section>
      )}

      <Section>
        <SectionHead eyebrow="Standards & communities" title="Shaping the standards we build on" />
        <div className="sv-grid">
          {(company.memberships as Array<[string, string]>).map(([name, desc]) => <Card key={name} title={name}>{desc}</Card>)}
        </div>
      </Section>
    </PageShell>
  );
}
