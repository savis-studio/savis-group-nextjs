import type { Metadata } from "next";
import { PageShell } from "@/components/page/PageShell";
import { InfoCard } from "@/components/solutions/Blocks";
import { Button, Card, CtaBanner, Section, SectionHead } from "@/components/ui";
import company from "@/data/mockup/company.json";
import { SALES_EMAIL } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";

const PATH = "/partners";

export const metadata: Metadata = buildMetadata({
  title: "Partners",
  description: "Grow with the SAVIS partner ecosystem: global technology partners, standards bodies and a channel program for resellers, integrators, OEMs and consortia.",
  path: PATH,
});

const APPLY = `mailto:${SALES_EMAIL}?subject=Partner%20program`;
const BENEFITS = [
  "Sales and pre-sales training",
  "Technical certification and sandbox access",
  "Joint marketing and lead sharing",
  "Regional support from ten SAVIS offices",
];

export default function PartnersPage() {
  return (
    <PageShell
      path={PATH}
      eyebrow="Partners"
      title="Grow with the SAVIS partner ecosystem."
      label="Partners"
      lead="Global technology partners, standards bodies and a channel program for resellers and integrators."
      actions={<Button href={APPLY} onBand>Become a partner</Button>}
      cta={false}
    >
      <Section>
        <SectionHead eyebrow="Partner Portal" title="One place for partners to work with SAVIS" />
        <p style={{ maxWidth: 760, color: "var(--muted)" }}>For registered SAVIS partners. New to the program? Apply to become a partner.</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: "var(--space-18)" }}>
          <Button href={`mailto:${SALES_EMAIL}?subject=Partner%20Portal%20access`}>Request Partner Portal access</Button>
          <Button href={APPLY} variant="ghost">Become a partner</Button>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHead eyebrow="Technology partners" title="Global technology partners, focused on digital trust" />
        <p style={{ margin: "0 0 var(--space-30)", color: "var(--muted)" }}>Grouped by SAVIS solution area.</p>
        <div className="sv-cols3">
          {(company.techPartners as Array<[string, string[]]>).map(([area, names]) => <InfoCard key={area} label={area} chips={names} />)}
        </div>
      </Section>

      <Section>
        <SectionHead eyebrow="Memberships" title="Standards bodies and industry associations" />
        <div className="sv-grid">
          {(company.memberships as Array<[string, string]>).map(([n, d]) => <Card key={n} title={n}>{d}</Card>)}
        </div>
      </Section>

      <Section tone="surface">
        <SectionHead eyebrow="Partner program" title="Ways to partner" />
        <div className="sv-cols3">
          {(company.partnerTiers as Array<[string, string]>).map(([n, d]) => <Card key={n} title={n} href={APPLY} cta="Become a partner">{d}</Card>)}
        </div>
        <div style={{ marginTop: "var(--space-30)" }}><InfoCard label="What partners get" items={BENEFITS} /></div>
      </Section>

      <Section>
        <CtaBanner title="Become a SAVIS partner" action={<Button href={APPLY} onBand>Become a partner</Button>}>
          Tell us about your market and customers.
        </CtaBanner>
      </Section>
    </PageShell>
  );
}
