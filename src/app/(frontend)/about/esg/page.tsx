import type { Metadata } from "next";
import { PageShell } from "@/components/page/PageShell";
import { InfoCard } from "@/components/solutions/Blocks";
import { Button, Card, CtaBanner, Section, SectionHead } from "@/components/ui";
import { ESG_IMPACT, ESG_PILLARS } from "@/data/company-pages";
import { buildMetadata } from "@/lib/seo";

const PATH = "/about/esg";

export const metadata: Metadata = buildMetadata({
  title: "ESG & Sustainability",
  description: "Digital trust that serves people and the planet: how SAVIS approaches environment, society and governance, and the UN Sustainable Development Goals its work supports.",
  path: PATH,
});

export default function EsgPage() {
  return (
    <PageShell
      path={PATH}
      eyebrow="ESG & Sustainability"
      title="Digital trust that serves people and the planet."
      label="ESG & Sustainability"
      trail={[{ label: "About", href: "/about" }]}
      lead="Our work puts identity, public services and secure transactions in people’s hands - and replaces paper, travel and waiting with trusted digital journeys. This is how we approach environment, society and governance."
      actions={
        <>
          <Button href="/about/integrity" onBand>Integrity &amp; Compliance</Button>
          <Button href="/contact" variant="ghost" onBand>Contact us</Button>
        </>
      }
      cta={false}
    >
      <Section>
        <SectionHead eyebrow="Our approach" title="Environment · Social · Governance" />
        <div className="sv-cols3">
          {ESG_PILLARS.map((p) => <InfoCard key={p.title} label={`${p.letter} · ${p.title}`} items={p.points} />)}
        </div>
      </Section>
      <Section tone="surface">
        <SectionHead eyebrow="Impact" title="Where our work contributes" />
        <div className="sv-grid">
          {ESG_IMPACT.map(([sdg, t, d]) => <Card key={sdg} title={`${sdg} · ${t}`}>{d}</Card>)}
        </div>
      </Section>
      <Section>
        <CtaBanner title="Questions about ESG at SAVIS?" action={<Button href="/contact" onBand>Contact us</Button>}>
          Customers, partners and investors can request information about our certifications, policies and sustainability practices, listed in the Trust Center.
        </CtaBanner>
      </Section>
    </PageShell>
  );
}
