import type { Metadata } from "next";
import { TreeDiagram } from "@/components/ui/HeroDiagrams";
import { PageShell } from "@/components/page/PageShell";
import { InfoCard, JumpBar } from "@/components/solutions/Blocks";
import { Button, Card, DataTable, KeyValueList, Section, SectionHead } from "@/components/ui";
import { OPEN_STANDARDS, SECURITY_PRACTICES, TRUST_CERTS, TRUST_FEATURED } from "@/data/company-pages-2";
import company from "@/data/mockup/company.json";
import { SALES_EMAIL } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";

const PATH = "/trust-center";
const DOCS = `mailto:${SALES_EMAIL}?subject=Compliance%20documents`;

export const metadata: Metadata = buildMetadata({
  title: "Trust Center",
  description: "Security, compliance and certifications: TrustCA eIDAS and NIS2 certification, ISO 27001, 9001 and 14001, FIDO2 server certification, memberships and responsible disclosure.",
  path: PATH,
});

export default function TrustCenterPage() {
  return (
    <PageShell
      path={PATH}
      aside={<TreeDiagram />}
      eyebrow="Trust Center"
      title="Security, compliance and certifications."
      label="Trust Center"
      lead="How SAVIS protects the trust services, keys and data our customers rely on."
      actions={<Button href={DOCS} onBand>Request compliance documents</Button>}
      cta={false}
    >
      <JumpBar
        links={[
          { href: "#certifications", label: "Certifications" },
          { href: "#memberships", label: "Memberships" },
          { href: "#practices", label: "Security practices" },
          { href: "#standards", label: "Open standards" },
        ]}
        actions={<Button href={DOCS}>Request documents</Button>}
      />

      <Section id="certifications">
        <SectionHead eyebrow="Certifications & compliance" title="Independent assurance" />
        <div className="sv-card sv-info">
          <span className="sv-eyebrow">{TRUST_FEATURED.label}</span>
          <h3 style={{ margin: 0 }}>{TRUST_FEATURED.title}</h3>
          <p style={{ margin: 0 }}>{TRUST_FEATURED.text}</p>
          <KeyValueList items={TRUST_FEATURED.facts} />
          <p style={{ margin: 0, color: "var(--muted)" }}>{TRUST_FEATURED.verify}</p>
          <div><Button href={DOCS}>Request the certificate and audit summary →</Button></div>
        </div>
        <div className="sv-grid" style={{ marginTop: "var(--space-30)" }}>
          {TRUST_CERTS.map(([tag, t, d]) => <Card key={t} title={t}>{tag}. {d}</Card>)}
        </div>
      </Section>

      <Section tone="surface" id="memberships">
        <SectionHead eyebrow="Memberships" title="Standards bodies and associations" />
        <div className="sv-grid">
          {(company.memberships as Array<[string, string]>).map(([n, d]) => <Card key={n} title={n}>{d}</Card>)}
        </div>
      </Section>

      <Section id="practices">
        <SectionHead eyebrow="Security practices" title="Built in, not bolted on" />
        <div className="sv-grid">
          <InfoCard label="How we operate" items={SECURITY_PRACTICES} />
          <div className="sv-card sv-info">
            <span className="sv-eyebrow">Report a vulnerability</span>
            <h3 style={{ margin: 0 }}>Responsible disclosure</h3>
            <p style={{ margin: 0 }}>
              Found a security issue in a SAVIS product or service? Contact our team at{" "}
              <a href="mailto:info@savis-group.com?subject=Security%20report">info@savis-group.com</a> with the subject line “Security report”.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="surface" id="standards">
        <SectionHead eyebrow="Open standards" title="The whole portfolio is built on open standards — no vendor lock-in" />
        <DataTable
          caption="Standards and protocols by layer, with the SAVIS products that implement them"
          columns={["Layer", "Standards & protocols", "SAVIS products"]}
          rows={OPEN_STANDARDS}
        />
      </Section>
    </PageShell>
  );
}
