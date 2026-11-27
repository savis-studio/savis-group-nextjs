import type { Metadata } from "next";
import { PageShell } from "@/components/page/PageShell";
import { Button, Card, CtaBanner, Section, SectionHead } from "@/components/ui";
import { SmartLink } from "@/components/ui/SmartLink";
import { INTEGRITY_PRINCIPLES, MANAGEMENT_SYSTEMS } from "@/data/company-pages";
import { buildMetadata } from "@/lib/seo";
import { SALES_EMAIL } from "@/lib/site";

const PATH = "/about/integrity";
const REPORT = `mailto:${SALES_EMAIL}?subject=Concern`;

export const metadata: Metadata = buildMetadata({
  title: "Integrity & Compliance",
  description: "How SAVIS does business: code of conduct, anti-corruption, data protection, information security, export control and independently certified management systems.",
  path: PATH,
});

export default function IntegrityPage() {
  return (
    <PageShell
      path={PATH}
      eyebrow="Integrity & Compliance"
      title="Integrity is part of the trust we build."
      label="Integrity & Compliance"
      trail={[{ label: "About", href: "/about" }]}
      lead="Governments and banks trust us with national roots of trust, identities and keys. That trust depends on how we behave as much as on our technology."
      actions={
        <>
          <Button href={REPORT} onBand>Report a concern</Button>
          <Button href="/about/esg" variant="ghost" onBand>ESG &amp; Sustainability</Button>
        </>
      }
      cta={false}
    >
      <Section>
        <SectionHead eyebrow="Our principles" title="How we do business" />
        <div className="sv-cols3">{INTEGRITY_PRINCIPLES.map(([t, d]) => <Card key={t} title={t}>{d}</Card>)}</div>
      </Section>
      <Section tone="surface">
        <SectionHead eyebrow="Certified management systems" title="Independently certified" />
        <div className="sv-grid">{MANAGEMENT_SYSTEMS.map(([t, d]) => <Card key={t} title={t}>{d}</Card>)}</div>
        <p style={{ marginTop: "var(--space-30)" }}>
          Product certifications, conformity assessments and security documentation are listed in the <SmartLink href="/trust-center">Trust Center</SmartLink>.
        </p>
      </Section>
      <Section>
        <CtaBanner title="Speak up" action={<Button href={REPORT} onBand>Report a concern</Button>}>
          If you see conduct that may break the law or these principles - by SAVIS staff, partners or suppliers - tell us. Reports are handled confidentially and without retaliation against anyone who reports in good faith.
        </CtaBanner>
      </Section>
    </PageShell>
  );
}
