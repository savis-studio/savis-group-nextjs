import type { Metadata } from "next";
import { productThumb } from "@/lib/thumbs";
import { Thumb } from "@/components/ui/Thumb";
import { PageShell } from "@/components/page/PageShell";
import { InfoCard, LinkPills } from "@/components/solutions/Blocks";
import { Steps } from "@/components/solutions/Layers";
import { Button, Card, KeyValueList, ProductCard, Section, SectionHead } from "@/components/ui";
import { LAB_CAPABILITIES, LAB_STANDARDS, LAB_STEPS, LAB_WHY_NOW, QUANTUM_TESTBED } from "@/data/company-pages-2";
import { getProduct, roleTags } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

const PATH = "/innovation/pqc-lab";

export const metadata: Metadata = buildMetadata({
  title: "Quantum PQC Lab",
  description: "A hands-on lab where banks, government agencies and partners test post-quantum cryptography (ML-KEM, ML-DSA, SLH-DSA, hybrid certificates and QKD) before it reaches production.",
  path: PATH,
});

const RELATED = ["quantum-readiness", "pqc-suite", "sam-appliance", "qkd"];

export default function PqcLabPage() {
  const related = RELATED.flatMap((s) => getProduct(s) ?? []);
  return (
    <PageShell
      path={PATH}
      eyebrow="Innovation · R&D"
      title="Quantum PQC Lab"
      label="Quantum PQC Lab"
      trail={[{ label: "Innovation", href: "/innovation" }]}
      lead="A hands-on lab where banks, government agencies and partners test post-quantum cryptography before it reaches production."
      actions={
        <>
          <Button href="/contact" onBand>Book a lab session</Button>
          <Button href="/products/quantum-readiness" variant="ghost" onBand>Quantum Readiness Program</Button>
        </>
      }
    >
      <Section>
        <SectionHead eyebrow="Inside the lab" title="Quantum communication & secure digital infrastructure" />
        <p style={{ maxWidth: 760, color: "var(--muted)", lineHeight: 1.6 }}>
          QKD, secure OTN, high-speed encryption and post-quantum cryptography, side by side with the AI &amp; IoT Lab.
        </p>
        <div className="sv-grid" style={{ marginTop: "var(--space-30)" }}>
          <div className="sv-card sv-info">
            <span className="sv-eyebrow">Quantum testbed</span>
            <h3 style={{ margin: 0 }}>QKD-secured OTN, end to end</h3>
            <p style={{ margin: 0 }}>
              A QKD transmitter and receiver share keys over a dedicated quantum channel. The keys reach the encryptors on both ends through the ETSI GS QKD 014 API and encrypt traffic on a regular OTN link, so an intruder on the line sees only ciphertext.
            </p>
          </div>
          <KeyValueList items={QUANTUM_TESTBED} />
        </div>
      </Section>

      <Section tone="surface">
        <SectionHead eyebrow="How a lab engagement works" title="Four steps from inventory to roadmap" />
        <Steps steps={LAB_STEPS.map(([t, d]) => ["", t, d])} />
        <div style={{ marginTop: "var(--space-30)" }}>
          <LinkPills>{LAB_STANDARDS.map((s) => <span key={s}>{s}</span>)}</LinkPills>
        </div>
      </Section>

      <Section>
        <SectionHead eyebrow="What you can do in the lab" title="Prove it works before you migrate." />
        <div className="sv-grid">
          {LAB_CAPABILITIES.map(([tag, title, text, product, href]) => (
            <Card key={title} title={title} href={href} cta={product}>{tag}: {text}</Card>
          ))}
        </div>
      </Section>

      {related.length > 0 && (
        <Section tone="surface">
          <SectionHead eyebrow="From lab to production" title="Related solutions" />
          <div className="sv-grid">
            {related.map((p) => <ProductCard key={p.slug} thumb={<Thumb spec={productThumb(p)} />} name={p.name} description={p.desc} tags={roleTags(p)} href={`/products/${p.slug}`} />)}
          </div>
        </Section>
      )}

      <Section>
        <SectionHead eyebrow="Why now" title="Harvest now, decrypt later" />
        <div className="sv-cols3">
          {LAB_WHY_NOW.map(([t, d, href, cta]) => <Card key={t} title={t} href={href} cta={cta}>{d}</Card>)}
        </div>
      </Section>
    </PageShell>
  );
}
