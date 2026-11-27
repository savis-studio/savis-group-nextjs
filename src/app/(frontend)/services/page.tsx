import type { Metadata } from "next";
import "@/styles/film.css";
import "@/styles/services.css";
import { FilmSection } from "@/components/home/FilmSection";
import { DeferredNetwork } from "@/components/home/Deferred";
import { PageShell } from "@/components/page/PageShell";
import { Offerings } from "@/components/services/Offerings";
import { JumpBar, NextSteps } from "@/components/solutions/Blocks";
import { Journey } from "@/components/solutions/Journey";
import { Button, Section, SectionHead } from "@/components/ui";
import { LineIcon } from "@/components/ui/LineIcon";
import { SmartLink } from "@/components/ui/SmartLink";
import { CHALLENGES } from "@/data/challenges";
import { CHALLENGE_SERVICES, PROFESSIONAL_SERVICES, PROJECT_STEPS, SERVICE_STAGES, SUPPORT_SERVICES, serviceOfferings } from "@/data/company-pages";
import { getUseCase, type Journey as JourneyData } from "@/lib/content";
import { JOURNEY_ICONS } from "@/lib/line-icons";
import { buildMetadata } from "@/lib/seo";

const PATH = "/services";

export const metadata: Metadata = buildMetadata({
  title: "Services: assess, design, deploy, operate",
  description: "One accountable team takes you from regulation and readiness to integration and 24/7 operations: consulting, integration, engineering, managed and trust services, and support.",
  path: PATH,
});

const two = (n: number) => String(n).padStart(2, "0");

/** The four stages drawn beside the title, circling "24/7". */
function StageRing() {
  return (
    <div className="sv-ring" aria-hidden="true">
      <div className="sv-ring__orbit">
        {SERVICE_STAGES.map((s, i) => (
          <div key={s.title} className="sv-ring__n" style={{ "--a": `${i * 90}deg` } as React.CSSProperties}>
            <span>{two(i + 1)}<b>{s.title}</b></span>
          </div>
        ))}
        <div className="sv-ring__core">24/7</div>
      </div>
    </div>
  );
}

const PROJECT: JourneyData = {
  eyebrow: "How a project runs",
  title: "One accountable team, from first advice to daily operation",
  steps: PROJECT_STEPS.map(([title, text]) => ({ href: "#services-pro", title, text, products: [] })),
};

export default function ServicesPage() {
  const challenges = CHALLENGES.slice(0, 6).flatMap((c) => {
    const u = getUseCase(c.useCase);
    return u ? [{ title: c.title, text: u.problem, href: `/use-cases/${u.id}`, services: CHALLENGE_SERVICES[u.id] ?? [] }] : [];
  });
  return (
    <PageShell
      path={PATH}
      className="sv-services"
      eyebrow="Services"
      title="Assess. Design. Deploy. Operate."
      label="Services"
      lead="One accountable team takes you from regulation and readiness to integration and 24/7 operations - the same people who design the technology."
      backdrop={<DeferredNetwork />}
      aside={<StageRing />}
      actions={
        <>
          <Button href="/contact" onBand>Talk to an expert</Button>
          <Button href="#stages" variant="ghost" onBand>See the four stages ↓</Button>
        </>
      }
      cta={false}
    >
      <JumpBar
        pills
        links={[
          { href: "#stages", label: "Stages" },
          { href: "#challenges", label: "Challenges" },
          { href: "#professional", label: "Professional Services" },
          { href: "#support", label: "Customer Support" },
        ]}
        actions={<Button href="/contact">Talk to an expert</Button>}
      />

      <Section id="watch">
        <div className="sv-watch">
          <div>
            <SectionHead eyebrow="Watch" title="Assess, design, deploy and operate" />
            <p className="sv-watch__lead">How one accountable team takes you from readiness to 24/7 operations.</p>
          </div>
          <FilmSection src="/video/film-services.mp4" poster="/images/company/film-services.jpg" caption="SAVIS Services: Assess, design, deploy and operate" />
        </div>
      </Section>

      <Section id="stages">
        <SectionHead eyebrow="How we work with you" title="Four stages, from first assessment to daily operation" />
        <ol className="sv-linkcards sv-linkcards--stages">
          {SERVICE_STAGES.map((s, i) => (
            <li key={s.title}>
              <a href="#professional" className="sv-linkcard">
                <span className="sv-linkcard__ic"><LineIcon name={s.icon} size={26} /></span>
                <h3>{two(i + 1)} · {s.title}</h3>
                <span className="sv-linkcard__t">{s.text}</span>
                <span className="sv-linkcard__s">{s.items.join(" · ")}</span>
                <span className="sv-linkcard__go">See the services →</span>
              </a>
            </li>
          ))}
        </ol>
      </Section>

      <Journey journey={PROJECT} icons={JOURNEY_ICONS.services!} />

      <Section id="professional">
        <Offerings
          eyebrow="Services"
          title="Professional Services"
          lead="Advisory, integration, engineering, cloud, managed and trust services, delivered by the team that makes the technology."
          items={serviceOfferings(PROFESSIONAL_SERVICES)}
          badge={`${PROFESSIONAL_SERVICES.length} offerings`}
          art={{
            big: { cls: "ai", icon: "border", lbl: "~svc-pro" },
            minis: [
              { cls: "ai", icon: "shield", lbl: "~svc-1" },
              { cls: "ai", icon: "shield", lbl: "~svc-2" },
              { cls: "ai", icon: "layers", lbl: "~svc-3" },
            ],
          }}
          action={<Button href="/contact">Talk to an expert</Button>}
        />
      </Section>

      <Section tone="surface" id="support">
        <Offerings
          reverse
          eyebrow="Services"
          title="Customer Support"
          lead="One support team for every SAVIS product - from first ticket to root cause."
          items={serviceOfferings(SUPPORT_SERVICES)}
          badge={`${SUPPORT_SERVICES.length} offerings`}
          art={{
            big: { cls: "finance", icon: "shield", lbl: "~svc-support" },
            minis: [
              { cls: "finance", icon: "chip", lbl: "~svc-s1" },
              { cls: "finance", icon: "shield", lbl: "~svc-s2" },
              { cls: "finance", icon: "chip", lbl: "~svc-s3" },
            ],
          }}
          action={<Button href="/contact">Contact support</Button>}
        />
      </Section>

      <Section id="challenges">
        <SectionHead eyebrow="Challenges we deliver" title="From the customer’s problem to the team that solves it" />
        <ul className="sv-linkcards sv-linkcards--challenges">
          {challenges.map((c) => (
            <li key={c.href}>
              <SmartLink href={c.href} className="sv-linkcard">
                <h3>{c.title}</h3>
                <span className="sv-linkcard__t">{c.text}</span>
                <span className="sv-linkcard__chips">{c.services.map((s) => <i key={s}>{s}</i>)}</span>
                <span className="sv-linkcard__go">See how it works →</span>
              </SmartLink>
            </li>
          ))}
        </ul>
      </Section>

      <NextSteps />
    </PageShell>
  );
}
