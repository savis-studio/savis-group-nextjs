import type { Metadata } from "next";
import { PageShell } from "@/components/page/PageShell";
import { LinkPills } from "@/components/solutions/Blocks";
import { Button, Card, CtaBanner, Section, SectionHead } from "@/components/ui";
import { CULTURE_HOW, CULTURE_LIFE, CULTURE_STORIES, NAME_MEANING } from "@/data/company-pages";
import { buildMetadata } from "@/lib/seo";

const PATH = "/about/culture";

export const metadata: Metadata = buildMetadata({
  title: "Culture: life at SAVIS",
  description: "One team shaping the digital future together: how the S-ers work, grow, celebrate and look after each other, from Hanoi to offices on four continents.",
  path: PATH,
});

export default function CulturePage() {
  return (
    <PageShell
      path={PATH}
      eyebrow="Culture"
      title="One team, shaping the digital future together."
      label="Culture"
      trail={[{ label: "About", href: "/about" }]}
      lead="Behind every national root CA, remote signature and secure payment are the S-ers: engineers, consultants and builders who work hard, play hard and look after each other — from Hanoi to offices on four continents."
      actions={
        <>
          <Button href="/careers" onBand>Join the S-ers</Button>
          <Button href="/about#story" variant="ghost" onBand>Our story</Button>
        </>
      }
      cta={false}
    >
      <Section>
        <SectionHead eyebrow="What we stand for" title="Smart, Agile, Visionary, Innovative, Secure" />
        <LinkPills>{NAME_MEANING.letters.map(([l, w]) => <span key={l + w}><b>{l}</b> {w}</span>)}</LinkPills>
        <div style={{ marginTop: "var(--space-48)" }}>
          <SectionHead eyebrow="How we work" title="Creative yet determined, agile yet powerful." />
          <div className="sv-cols3">{CULTURE_HOW.map(([t, d]) => <Card key={t} title={t}>{d}</Card>)}</div>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHead eyebrow="Life at SAVIS" title="How we look after our people" />
        <div className="sv-grid">
          {CULTURE_LIFE.map(([label, title, text]) => (
            <div key={title} className="sv-card sv-info">
              <span className="sv-eyebrow">{label}</span>
              <h3 style={{ margin: 0 }}>{title}</h3>
              <p style={{ margin: 0, color: "var(--muted)" }}>{text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHead eyebrow="Culture stories" title="Moments that make us S-ers" />
        <div className="sv-grid">
          {CULTURE_STORIES.map((s) => (
            <article key={s.title} className="sv-card sv-info">
              <span className="sv-eyebrow">{s.tag} · {s.date}</span>
              <h3 style={{ margin: 0 }}>{s.title}</h3>
              <p style={{ margin: 0, color: "var(--muted)" }}>{s.text}</p>
              <p style={{ margin: 0, fontStyle: "italic" }}>“{s.quote}”</p>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <CtaBanner title="Want to build the trust layer with us?" action={<Button href="/careers" onBand>See careers</Button>}>
          Open roles in cryptography, identity, AI, delivery and sales.
        </CtaBanner>
      </Section>
    </PageShell>
  );
}
