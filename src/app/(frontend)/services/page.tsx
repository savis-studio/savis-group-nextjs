import type { Metadata } from "next";
import { PageShell } from "@/components/page/PageShell";
import { JumpBar, NextSteps } from "@/components/solutions/Blocks";
import { Journey } from "@/components/solutions/Journey";
import { Button, Card, Section, SectionHead } from "@/components/ui";
import { SmartLink } from "@/components/ui/SmartLink";
import { Thumb } from "@/components/ui/Thumb";
import { CHALLENGES } from "@/data/challenges";
import { PROFESSIONAL_SERVICES, PROJECT_STEPS, SERVICE_STAGES, SUPPORT_SERVICES } from "@/data/company-pages";
import { getUseCase } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

const PATH = "/services";

export const metadata: Metadata = buildMetadata({
  title: "Services: assess, design, deploy, operate",
  description: "One accountable team takes you from regulation and readiness to integration and 24/7 operations: consulting, integration, engineering, managed and trust services, and support.",
  path: PATH,
});

const STAGE_LINK = ["#professional", "#professional", "#professional"];

/** The four stages drawn beside the title: a ring around "24/7". */
function StagesDiagram() {
  const nodes: Array<[string, string, string]> = [["01", "Assess", "n1"], ["02", "Design", "n2"], ["03", "Deploy", "n3"], ["04", "Operate", "n4"]];
  return (
    <div className="sv-ring" aria-hidden="true">
      <span className="sv-ring__core">24/7</span>
      {nodes.map(([n, label, cls]) => <span key={n} className={`sv-ring__n sv-ring__${cls}`}><em>{n}</em>{label}</span>)}
    </div>
  );
}

/** Expandable list of offerings next to a block of illustrations. The first item starts open. */
function Offerings({ name, items, art }: { name: string; items: Array<[string, string, string[]]>; art: { cls: string; icon: string; lbl: string }[] }) {
  return (
    <div className="sv-offer">
      <div className="sv-offer__art" aria-hidden="true">
        <Thumb spec={art[0]!} big />
        <div>{art.slice(1).map((a) => <Thumb key={a.lbl} spec={a} />)}</div>
        <span className="sv-offer__n">{items.length} offerings</span>
      </div>
      <div className="sv-offer__list">
        {items.map(([title, text, bullets], i) => (
          <details key={title} name={name} open={i === 0} className="sv-acc">
            <summary>{title}</summary>
            <p>{text}</p>
            <ul>{bullets.map((b) => <li key={b}>{b}</li>)}</ul>
          </details>
        ))}
      </div>
    </div>
  );
}

const PROJECT = {
  eyebrow: "How a project runs",
  title: "One accountable team, from first advice to daily operation",
  steps: PROJECT_STEPS.map(([title, text]) => ({ href: "#professional", title, text, products: [] as string[] })),
};

export default function ServicesPage() {
  const challenges = CHALLENGES.slice(0, 6).flatMap((c) => {
    const u = getUseCase(c.useCase);
    return u ? [{ title: c.title, text: u.problem, href: `/use-cases/${u.id}` }] : [];
  });
  return (
    <PageShell
      path={PATH}
      eyebrow="Services"
      title="Assess. Design. Deploy. Operate."
      label="Services"
      lead="One accountable team takes you from regulation and readiness to integration and 24/7 operations — the same people who design the technology."
      aside={<StagesDiagram />}
      actions={
        <>
          <Button href="/contact" onBand>Talk to an expert</Button>
          <Button href="#advise" variant="ghost" onBand>See the four stages ↓</Button>
        </>
      }
      cta={false}
    >
      <JumpBar
        links={[
          { href: "#advise", label: "Stages" },
          { href: "#challenges", label: "Challenges" },
          { href: "#professional", label: "Professional Services" },
          { href: "#support", label: "Customer Support" },
        ]}
      />

      <Section id="advise">
        <SectionHead eyebrow="How we work with you" title="Three stages, from first advice to daily operation" />
        <div className="sv-cols3" id="developers">
          {SERVICE_STAGES.map((s, i) => (
            <div key={s.title} className="sv-card sv-info">
              <h3 style={{ margin: 0 }}>{s.n}</h3>
              <p style={{ margin: 0, color: "var(--muted)" }}>{s.text}</p>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{s.items.join(" · ")}</p>
              <SmartLink href={STAGE_LINK[i] ?? "#professional"} className="sv-home__more">See the services →</SmartLink>
            </div>
          ))}
        </div>
      </Section>

      <Journey journey={PROJECT as never} />

      <Section id="professional">
        <SectionHead eyebrow="Services" title="Professional Services" />
        <p style={{ margin: "0 0 var(--space-30)", maxWidth: 760, color: "var(--muted)" }}>
          Advisory, integration, engineering, cloud, managed and trust services, delivered by the team that makes the technology.
        </p>
        <Offerings
          name="pro"
          items={PROFESSIONAL_SERVICES}
          art={[
            { cls: "ai", icon: "border", lbl: "Cross-border|svc-0" },
            { cls: "ai", icon: "shield", lbl: "~svc-1" },
            { cls: "ai", icon: "shield", lbl: "~svc-2" },
            { cls: "ai", icon: "chip", lbl: "~svc-3" },
          ]}
        />
        <div style={{ marginTop: "var(--space-30)" }}><Button href="/contact">Talk to an expert</Button></div>
      </Section>

      <Section tone="surface" id="support">
        <SectionHead eyebrow="Services" title="Customer Support" />
        <p style={{ margin: "0 0 var(--space-30)", maxWidth: 760, color: "var(--muted)" }}>
          One support team for every SAVIS product — from first ticket to root cause.
        </p>
        <Offerings
          name="sup"
          items={SUPPORT_SERVICES}
          art={[
            { cls: "finance", icon: "shield", lbl: "24/7 SOC|svc-s0" },
            { cls: "finance", icon: "headset", lbl: "~svc-s1" },
            { cls: "finance", icon: "shield", lbl: "~svc-s2" },
            { cls: "finance", icon: "chip", lbl: "~svc-s3" },
          ]}
        />
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
