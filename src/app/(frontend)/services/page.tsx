import type { Metadata } from "next";
import { PageShell } from "@/components/page/PageShell";
import { InfoCard, JumpBar, NextSteps } from "@/components/solutions/Blocks";
import { Steps } from "@/components/solutions/Layers";
import { Button, Card, Section, SectionHead } from "@/components/ui";
import { CHALLENGES } from "@/data/challenges";
import { PROFESSIONAL_SERVICES, PROJECT_STEPS, SERVICE_STAGES, SUPPORT_SERVICES } from "@/data/company-pages";
import { getUseCase } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

const PATH = "/services";

export const metadata: Metadata = buildMetadata({
  title: "Services: advise, build, operate",
  description: "One accountable team takes you from regulation and readiness to integration and 24/7 operations: consulting, integration, engineering, managed and trust services, and support.",
  path: PATH,
});

function ServiceCards({ items }: { items: Array<[string, string, string[]]> }) {
  return (
    <div className="sv-grid">
      {items.map(([name, text, bullets]) => (
        <div key={name} className="sv-card sv-info">
          <h3 style={{ margin: 0 }}>{name}</h3>
          <p style={{ margin: 0, color: "var(--muted)" }}>{text}</p>
          <ul className="sv-ticks">{bullets.map((b) => <li key={b}>{b}</li>)}</ul>
        </div>
      ))}
    </div>
  );
}

export default function ServicesPage() {
  const challenges = CHALLENGES.slice(0, 6).flatMap((c) => {
    const u = getUseCase(c.useCase);
    return u ? [{ title: c.title, text: u.problem, href: `/use-cases/${u.id}` }] : [];
  });
  return (
    <PageShell
      path={PATH}
      eyebrow="Services"
      title="Advise. Build. Operate."
      label="Services"
      lead="One accountable team takes you from regulation and readiness to integration and 24/7 operations — the same people who design the technology."
      actions={
        <>
          <Button href="/contact" onBand>Talk to an expert</Button>
          <Button href="#advise" variant="ghost" onBand>See the three stages ↓</Button>
        </>
      }
      cta={false}
    >
      <JumpBar
        links={[
          { href: "#advise", label: "Stages" },
          { href: "#e2e", label: "How a project runs" },
          { href: "#professional", label: "Professional services" },
          { href: "#support", label: "Customer support" },
          { href: "#challenges", label: "Challenges" },
        ]}
      />

      <Section id="advise">
        <SectionHead eyebrow="How we work with you" title="Three stages, from first advice to daily operation" />
        <div className="sv-cols3" id="developers">
          {SERVICE_STAGES.map((s) => <InfoCard key={s.title} label={s.n} items={[s.text, ...s.items]} />)}
        </div>
      </Section>

      <Section tone="surface" id="e2e">
        <SectionHead eyebrow="How a project runs" title="One accountable team, from first advice to daily operation" />
        <Steps steps={PROJECT_STEPS.map(([t, d]) => ["", t, d])} />
      </Section>

      <Section id="professional">
        <SectionHead eyebrow={`${PROFESSIONAL_SERVICES.length} offerings`} title="Professional Services" />
        <p style={{ margin: "0 0 var(--space-30)", maxWidth: 760, color: "var(--muted)" }}>
          Advisory, integration, engineering, cloud, managed and trust services, delivered by the team that makes the technology.
        </p>
        <ServiceCards items={PROFESSIONAL_SERVICES} />
      </Section>

      <Section tone="surface" id="support">
        <SectionHead eyebrow={`${SUPPORT_SERVICES.length} offerings`} title="Customer Support" />
        <p style={{ margin: "0 0 var(--space-30)", maxWidth: 760, color: "var(--muted)" }}>
          One support team for every SAVIS product — from first ticket to root cause.
        </p>
        <ServiceCards items={SUPPORT_SERVICES} />
        <div style={{ marginTop: "var(--space-30)" }}><Button href="/contact">Contact support</Button></div>
      </Section>

      <Section id="challenges">
        <SectionHead eyebrow="Challenges we deliver" title="From the customer’s problem to the team that solves it" />
        <div className="sv-cols3">
          {challenges.map((c) => <Card key={c.href} title={c.title} href={c.href} cta="See how it works">{c.text}</Card>)}
        </div>
      </Section>

      <NextSteps />
    </PageShell>
  );
}
