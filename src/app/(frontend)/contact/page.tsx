import type { Metadata } from "next";
import { PageShell } from "@/components/page/PageShell";
import { Card, Section, SectionHead } from "@/components/ui";
import company from "@/data/mockup/company.json";
import { buildMetadata } from "@/lib/seo";
import { ContactForm } from "./ContactForm";

const PATH = "/contact";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Talk to a SAVIS solution expert: request a demo, a quote, datasheets or support. The nearest SAVIS team will reply.",
  path: PATH,
});

const NEXT = [
  ["We review your request", "A solution expert for your region and topic picks it up."],
  ["Discovery call", "We clarify your goals, constraints and timeline."],
  ["Demo or proposal", "You get a tailored demo, architecture or proposal."],
];

const OTHER: Array<[string, string, string]> = [
  ["Partners", "Resellers, integrators and alliances.", "/partners"],
  ["Careers", "Join the S-ers in Hanoi and worldwide.", "/careers"],
  ["Trust Center", "Certifications, security and compliance documents.", "/trust-center"],
  ["Insights & media", "News, press releases and expert insight.", "/insights"],
];

type Region = { k: string; cities: string[][] };

export default function ContactPage() {
  const regions = company.regions as Region[];
  return (
    <PageShell
      path={PATH}
      eyebrow="Contact"
      title="Talk to a solution expert."
      label="Contact"
      lead="Tell us what you need and the nearest SAVIS team will reply."
      cta={false}
    >
      <Section>
        <div className="sv-contact">
          <div>
            <SectionHead eyebrow="Send a message" title="What do you need?" />
            <ContactForm />
          </div>
          <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
            <div className="sv-card sv-info">
              <span className="sv-eyebrow">Reach us directly</span>
              <p style={{ margin: 0 }}>Hotline <a href="tel:1900636156">1900 636156</a></p>
              <p style={{ margin: 0 }}>Sales <a href="mailto:sales@savis-group.com">sales@savis-group.com</a></p>
              <p style={{ margin: 0 }}>General enquiries <a href="mailto:info@savis-group.com">info@savis-group.com</a></p>
            </div>
            <div className="sv-card sv-info">
              <span className="sv-eyebrow">Offices</span>
              <p style={{ margin: 0 }}><b>Hanoi · HQ</b> Viet A Tower, 9 Duy Tan</p>
              <p style={{ margin: 0 }}><b>Ho Chi Minh City</b> Winhome, 25 Dao Duy Anh</p>
              {regions.map((r) => (
                <p key={r.k} style={{ margin: 0 }}><b>{r.k}</b> {r.cities.map((c) => c[0]).join(" · ")}</p>
              ))}
              <p style={{ margin: 0, color: "var(--muted)" }}>ANZ: anz-sale@savis-group.com · +61 434 567 456</p>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHead eyebrow="What happens next" title="From first message to proposal" />
        <ol className="sv-steps">
          {NEXT.map(([t, d], i) => (
            <li key={t}><span className="sv-steps__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><div><b>{t}</b><p>{d}</p></div></li>
          ))}
        </ol>
      </Section>

      <Section>
        <SectionHead eyebrow="Other ways to reach us" title="Find the right team" />
        <div className="sv-grid">
          {OTHER.map(([t, d, href]) => <Card key={t} title={t} href={href} cta="Open">{d}</Card>)}
        </div>
      </Section>
    </PageShell>
  );
}
