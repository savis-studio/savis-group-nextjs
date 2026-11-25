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
          <ContactForm />
          <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
            <div className="sv-card sv-info">
              <span className="sv-info__ico sv-info__ico--blue" aria-hidden="true">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinejoin="round"><path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Z" /><path d="m4 7.5 8 4.5 8-4.5M12 12v9" /></svg>
              </span>
              <span className="sv-eyebrow">Hotline</span>
              <a className="sv-info__big" href="tel:1900636156">1900 636156</a>
              <span className="sv-eyebrow">Sales</span>
              <a className="sv-info__link" href="mailto:sales@savis-group.com">sales@savis-group.com</a>
              <span className="sv-eyebrow">General enquiries</span>
              <a className="sv-info__plain" href="mailto:info@savis-group.com">info@savis-group.com</a>
            </div>
            <div className="sv-card sv-info">
              <span className="sv-info__ico sv-info__ico--green" aria-hidden="true">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="12" r="3.2" /><path d="M12 3.5v2.3M12 18.2v2.3M3.5 12h2.3M18.2 12h2.3M6 6l1.6 1.6M16.4 16.4 18 18M18 6l-1.6 1.6M7.6 16.4 6 18" /></svg>
              </span>
              <span className="sv-eyebrow">Offices</span>
              <div className="sv-offices">
                <div><b>Hanoi · HQ</b><span>Viet A Tower, 9 Duy Tan</span><a href="mailto:sales@savis-group.com">sales@savis-group.com</a></div>
                <div><b>Ho Chi Minh City</b><span>Winhome, 25 Dao Duy Anh</span><a href="mailto:sales@savis-group.com">sales@savis-group.com</a></div>
                {regions.map((r) => (
                  <div key={r.k}>
                    <b>{r.k}</b>
                    <span>{r.cities.map((c) => c[0]).join(" · ")}</span>
                    <a href="mailto:sales@savis-group.com">sales@savis-group.com</a>
                    {r.k === "Asia-Pacific" && <a href="mailto:anz-sale@savis-group.com">ANZ: anz-sale@savis-group.com · +61 434 567 456</a>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHead eyebrow="What happens next" title="From first message to proposal" />
        <ol className="sv-next">
          {NEXT.map(([t, d], i) => (
            <li key={t}>
              <span className="sv-next__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <b>{t}</b>
              <p>{d}</p>
            </li>
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
