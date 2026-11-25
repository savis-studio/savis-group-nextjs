import type { Metadata } from "next";
import { Thumb } from "@/components/ui/Thumb";
import { PageShell } from "@/components/page/PageShell";
import { InfoCard } from "@/components/solutions/Blocks";
import { Button, Card, CtaBanner, Section, SectionHead } from "@/components/ui";
import { STRATEGY_DIRECTIONS } from "@/data/company-pages";
import { INVESTOR_EMAIL, INVESTOR_GOVERNANCE, INVESTOR_HIGHLIGHTS } from "@/data/company-pages-2";
import { buildMetadata } from "@/lib/seo";

const PATH = "/investors";
const IR = `mailto:${INVESTOR_EMAIL}?subject=Investor%20materials`;

export const metadata: Metadata = buildMetadata({
  title: "Investors",
  description: "Investing in trusted digital infrastructure: SAVIS Group's investment highlights, 2026–2030 strategy, governance and how to request investor materials.",
  path: PATH,
});

export default function InvestorsPage() {
  return (
    <PageShell
      path={PATH}
      aside={<div className="sv-mosaic" style={{ gridTemplateColumns: "1fr", width: 380 }}><div className="sv-mosaic__c"><Thumb spec={{ cls: "finance", icon: "growth", lbl: "~inv-growth", left: "Long-term growth" }} big /></div></div>}
      eyebrow="Investors"
      title="Investing in trusted digital infrastructure."
      label="Investors"
      lead="SAVIS Group builds the identity, trust and security platforms that nations and enterprises run on. This page is for investors and strategic partners interested in our long-term growth."
      actions={
        <>
          <Button href={IR} onBand>Contact Investor Relations</Button>
          <Button href="/about#strategy" variant="ghost" onBand>Strategy 2026–2030</Button>
        </>
      }
      cta={false}
    >
      <Section>
        <SectionHead eyebrow="Why SAVIS" title="Investment highlights" />
        <div className="sv-grid">
          {INVESTOR_HIGHLIGHTS.map(([tag, t, d, href, cta]) => <Card key={t} title={t} href={href} cta={cta}>{tag}: {d}</Card>)}
        </div>
      </Section>

      <Section tone="surface">
        <SectionHead eyebrow="Strategy 2026–2030" title="Where we are taking the business" />
        <div className="sv-cols3">{STRATEGY_DIRECTIONS.map(([t, d]) => <Card key={t} title={t}>{d}</Card>)}</div>
      </Section>

      <Section>
        <SectionHead eyebrow="Financial advisory" title="Capital raising and M&A" />
        <InfoCard
          label="Strategic financial adviser · Singapore"
          items={[
            "Square Associates",
            "SAVIS works with Square Associates in Singapore, together with other international financial advisers, on its financial strategy, capital raising and M&A.",
          ]}
        />
        <div className="sv-grid" style={{ marginTop: "var(--space-30)" }}>
          <Card title="Strategic and growth investment" href={IR} cta="Contact investor relations">
            Long-term partners who share our view of digital trust as critical national and enterprise infrastructure.
          </Card>
          <Card title="M&A and joint ventures" href={IR} cta="Contact investor relations">
            Acquisitions, joint ventures and alliances that extend our platform, certifications or regional reach.
          </Card>
          <Card title="Technology and channel partnerships" href="/partners" cta="Partner program">
            Partners who bring SAVIS platforms to new markets and industries.
          </Card>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHead eyebrow="Governance" title="How we run the company" />
        <div className="sv-grid">
          {INVESTOR_GOVERNANCE.map(([tag, t, d, href]) => <Card key={t} title={t} href={href} cta="Learn more">{tag}: {d}</Card>)}
        </div>
      </Section>

      <Section>
        <CtaBanner title="Investor materials" action={<Button href={IR} onBand>Request investor materials</Button>}>
          Company presentations, financial information and data-room access are shared with qualified investors under a non-disclosure agreement. Investor Relations: {INVESTOR_EMAIL}
        </CtaBanner>
        <p style={{ marginTop: "var(--space-30)", color: "var(--muted)", fontSize: 14, maxWidth: 820 }}>
          This page is for information only. It does not constitute an offer to sell, or a solicitation of an offer to buy, any securities of SAVIS Group or its affiliates in any jurisdiction.
        </p>
      </Section>
    </PageShell>
  );
}
