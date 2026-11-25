import type { Metadata } from "next";
import { PageShell } from "@/components/page/PageShell";
import { Section } from "@/components/ui";
import company from "@/data/mockup/company.json";
import { buildMetadata } from "@/lib/seo";

type LegalKey = "privacy" | "terms" | "cookies";
type Doc = { t: string; lead: string; s: Array<[heading: string, text: string]> };

const doc = (key: LegalKey) => (company.legal as unknown as Record<LegalKey, Doc>)[key];

/** Metadata for a legal page. Legal pages stay indexable but are low priority in the sitemap. */
export const legalMetadata = (key: LegalKey): Metadata =>
  buildMetadata({ title: doc(key).t, description: doc(key).lead, path: `/${key}` });

/** Privacy, terms and cookies share one layout: numbered headings with plain paragraphs. */
export function LegalPage({ docKey }: { docKey: LegalKey }) {
  const d = doc(docKey);
  return (
    <PageShell path={`/${docKey}`} eyebrow="Legal" title={d.t} lead={d.lead} cta={false}>
      <Section>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          {d.s.map(([h, p], i) => (
            <section key={h} style={{ marginBottom: "var(--space-30)" }}>
              <h2 style={{ fontSize: 22, margin: "0 0 8px" }}>{i + 1}. {h}</h2>
              <p style={{ margin: 0, lineHeight: 1.65 }}>{p}</p>
            </section>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
