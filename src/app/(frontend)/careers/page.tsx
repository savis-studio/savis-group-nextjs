import type { Metadata } from "next";
import { OrbitDiagram } from "@/components/ui/HeroDiagrams";
import { PageShell } from "@/components/page/PageShell";
import { InfoCard } from "@/components/solutions/Blocks";
import { Button, Card, CtaBanner, Section, SectionHead } from "@/components/ui";
import { CAREERS_URL, CAREER_BUILD, CAREER_PERKS, CAREER_TEAMS } from "@/data/company-pages-2";
import { buildMetadata } from "@/lib/seo";

const PATH = "/careers";

export const metadata: Metadata = buildMetadata({
  title: "Careers",
  description: "Build the trust layer with the S-ers: work on technology that protects identities, signatures and payments for millions of people, from Hanoi and offices on four continents.",
  path: PATH,
});

export default function CareersPage() {
  return (
    <PageShell
      path={PATH}
      aside={<OrbitDiagram />}
      eyebrow="Careers"
      title="Build the trust layer with the S-ers."
      label="Careers"
      lead="Work on technology that protects identities, signatures and payments for millions of people, from Hanoi and offices on four continents."
      actions={
        <>
          <Button href={CAREERS_URL} onBand>View open roles ↗</Button>
          <Button href="/about/culture" variant="ghost" onBand>Explore our culture</Button>
        </>
      }
      cta={false}
    >
      <Section>
        <SectionHead eyebrow="What you would build" title="Technology that protects millions of people" />
        <div className="sv-cols3">
          {CAREER_BUILD.map(([t, d, href]) => <Card key={t} title={t} href={href} cta="Explore">{d}</Card>)}
        </div>
      </Section>

      <Section tone="surface">
        <SectionHead eyebrow="Teams" title="Where you could work" />
        <div className="sv-grid">
          {CAREER_TEAMS.map(([tag, t, d, href]) => <Card key={t} title={t} href={href} cta="Explore">{tag}: {d}</Card>)}
        </div>
      </Section>

      <Section>
        <SectionHead eyebrow="Why SAVIS" title="What you get" />
        <InfoCard label="At SAVIS" items={CAREER_PERKS} />
        <div style={{ marginTop: "var(--space-30)" }}><Button href={CAREERS_URL}>Open roles: career.savis.vn ↗</Button></div>
      </Section>

      <Section tone="surface">
        <CtaBanner title="Life at SAVIS: work hard, play hard — and look after each other" action={<Button href="/about/culture" onBand>Explore our culture</Button>}>
          Teambuilding, S-Awards, S-Health Care Day and the stories behind our culture.
        </CtaBanner>
      </Section>
    </PageShell>
  );
}
