import type { Metadata } from "next";
import { PageShell } from "@/components/page/PageShell";
import { InfoCard, JumpBar, LinkPills, NextSteps } from "@/components/solutions/Blocks";
import { Button, Card, Section, SectionHead } from "@/components/ui";
import { SmartLink } from "@/components/ui/SmartLink";
import {
  LEADERS, MEMBER_COMPANIES, MILESTONES, MISSION, NAME_MEANING, RESEARCH_LABS, SECTORS_SERVED, SIGNATURE,
  STORY_ERAS, STORY_INTRO, STRATEGY_DIRECTIONS, TRACK_RECORD, VALUES,
} from "@/data/company-pages";
import company from "@/data/mockup/company.json";
import { buildMetadata } from "@/lib/seo";
import { DeferredGlobe } from "@/components/home/Deferred";
import { getOffices } from "@/lib/content";

const PATH = "/about";

export const metadata: Metadata = buildMetadata({
  title: "About SAVIS Group",
  description: "A global technology company built on digital trust: founded in Hanoi in 2004, 700+ engineers, ten offices on four continents and national PKI since 2006.",
  path: PATH,
});

type Region = { k: string; hub: string; cities: string[][]; mk: string };
type BizLine = [string, string, string, string, string, string[]];

export default function AboutPage() {
  const regions = company.regions as Region[];
  return (
    <PageShell
      path={PATH}
      eyebrow="Company"
      title="A global technology company built on digital trust."
      label="About"
      lead="SAVIS Group is a technology group founded in Vietnam in 2004, delivering national-grade projects for central banks, ministries, cities, banks and enterprises."
      actions={
        <>
          <Button href="/contact" onBand>Contact SAVIS</Button>
          <Button href="/careers" variant="ghost" onBand>Join us</Button>
        </>
      }
      aside={<DeferredGlobe offices={getOffices()} label="Globe showing SAVIS offices connected to Hanoi headquarters" />}
      cta={false}
    >
      <JumpBar
        links={[
          { href: "#story", label: "Our story" },
          { href: "#strategy", label: "Global strategy 2026–2030" },
          { href: "#name", label: "Our name" },
          { href: "#milestones", label: "Milestones" },
          { href: "#leadership", label: "Leadership" },
          { href: "#presence", label: "Global presence" },
        ]}
        actions={<Button href="/contact">Contact SAVIS</Button>}
      />

      <Section id="glance">
        <SectionHead eyebrow="SAVIS Group at a glance" title="A track record built on national programs" />
        <p style={{ margin: "0 0 var(--space-30)", maxWidth: 760, color: "var(--muted)" }}>
          More than 700 engineers, technology specialists, professors, PhDs and researchers work across our member companies and research labs, in Vietnam and Southeast Asia, Asia-Pacific, the Middle East, Africa and the Americas.
        </p>
        <div className="sv-cols3">{TRACK_RECORD.map(([t, d]) => <Card key={t} title={t}>{d}</Card>)}</div>
        <div className="sv-cols3" style={{ marginTop: "var(--space-30)" }}>
          <InfoCard label="Member companies" items={MEMBER_COMPANIES} />
          <InfoCard label="Research labs" items={RESEARCH_LABS} />
          <InfoCard label="Sectors served" chips={SECTORS_SERVED} />
        </div>
      </Section>

      <Section tone="surface" id="story">
        <SectionHead eyebrow="Our story" title="From the nation’s root of trust to a global digital trust company" />
        <div style={{ maxWidth: 820 }}>{STORY_INTRO.map((p) => <p key={p} style={{ lineHeight: 1.65 }}>{p}</p>)}</div>
        <div className="sv-cols3" style={{ marginTop: "var(--space-30)" }}>
          {STORY_ERAS.map((e) => (
            <div key={e.years} className="sv-card sv-info">
              <span className="sv-eyebrow">{e.years}</span>
              <h3 style={{ margin: 0 }}>{e.title}</h3>
              <p style={{ margin: 0, color: "var(--muted)" }}>{e.text}</p>
            </div>
          ))}
        </div>
        <div className="sv-grid" style={{ marginTop: "var(--space-30)" }}>
          <InfoCard label="Mission" items={[MISSION]} />
          <InfoCard label="Signature" items={[SIGNATURE]} />
        </div>
        <div style={{ marginTop: "var(--space-30)" }}>
          <InfoCard label="Values" items={VALUES.map(([t, d]) => `${t} — ${d}`)} />
        </div>
      </Section>

      <Section id="strategy">
        <SectionHead eyebrow="Global strategy 2026–2030" title="Six core business lines, one Digital Trust platform" />
        <div className="sv-grid">
          {(company.bizLines as BizLine[]).map(([n, title, text, mode]) => (
            <div key={n} className="sv-card sv-info">
              <span className="sv-eyebrow">{n} · {mode}</span>
              <h3 style={{ margin: 0 }}>{title}</h3>
              <p style={{ margin: 0, color: "var(--muted)" }}>{text}</p>
            </div>
          ))}
        </div>
        <div style={{ margin: "var(--space-48) 0 var(--space-18)" }}>
          <SectionHead eyebrow="Strategic directions 2026–2030" title="Where we are taking the business" />
        </div>
        <div className="sv-cols3">{STRATEGY_DIRECTIONS.map(([t, d]) => <Card key={t} title={t}>{d}</Card>)}</div>
        <div style={{ marginTop: "var(--space-30)" }}><SmartLink href="/solutions" className="sv-go">All solutions →</SmartLink></div>
      </Section>

      <Section tone="surface" id="name">
        <SectionHead eyebrow="Our name" title="The meaning of SAVIS" />
        <p style={{ maxWidth: 820, lineHeight: 1.65 }}>{NAME_MEANING.text}</p>
        <LinkPills>{NAME_MEANING.letters.map(([l, w]) => <span key={l + w}><b>{l}</b> {w}</span>)}</LinkPills>
      </Section>

      <Section id="milestones">
        <SectionHead eyebrow="Milestones" title="Our journey" />
        <ol className="sv-steps">
          {MILESTONES.map(([y, t]) => (
            <li key={y}><span className="sv-steps__n">{y}</span><div><p style={{ margin: 0 }}>{t}</p></div></li>
          ))}
        </ol>
      </Section>

      <Section tone="surface" id="leadership">
        <SectionHead eyebrow="Leadership" title="Board of Management and global sales leadership" />
        {LEADERS.map((g) => (
          <div key={g.group} style={{ marginBottom: "var(--space-30)" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 18 }}>{g.group}</h3>
            <div className="sv-cols3">
              {g.people.map(([name, role, focus]) => (
                <div key={name} className="sv-card sv-info">
                  <span className="sv-eyebrow">{focus}</span>
                  <h4 style={{ margin: 0 }}>{name}</h4>
                  <p style={{ margin: 0, color: "var(--muted)" }}>{role}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>

      <Section id="presence">
        <SectionHead eyebrow="Global presence" title="Where we work" />
        <div className="sv-grid">
          <div className="sv-card sv-info">
            <span className="sv-eyebrow">Global headquarters</span>
            <h3 style={{ margin: 0 }}>Hanoi, Vietnam</h3>
            <p style={{ margin: 0 }}>Viet A Tower, 9 Duy Tan<br />Ho Chi Minh City: Winhome, 25 Dao Duy Anh</p>
            <p style={{ margin: 0 }}>Hotline 1900 636156 · sales@savis-group.com</p>
          </div>
          {regions.map((r) => (
            <div key={r.k} className="sv-card sv-info">
              <span className="sv-eyebrow">{r.k} · Hub {r.hub}</span>
              <h3 style={{ margin: 0 }}>{r.mk}</h3>
              <p style={{ margin: 0 }}>{r.cities.map((c) => c[0]).join(" · ")}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "var(--space-30)" }}><SmartLink href="/contact" className="sv-go">Contact an office →</SmartLink></div>
      </Section>

      <Section tone="surface">
        <SectionHead eyebrow="Inside SAVIS" title="People, culture and our place on the global stage" />
        <div className="sv-cols3">
          <Card title="A culture built on trust and craft" href="/about/culture" cta="Our culture">Life at SAVIS.</Card>
          <Card title="Join the S-ers" href="/careers" cta="See open roles">Careers.</Card>
          <Card title="Grow with the partner ecosystem" href="/partners" cta="Partner program">Partners.</Card>
        </div>
      </Section>
      <NextSteps />
    </PageShell>
  );
}
