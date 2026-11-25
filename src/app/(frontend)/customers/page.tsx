import type { Metadata } from "next";
import { CaseCard } from "@/components/home/CaseCard";
import { PageShell } from "@/components/page/PageShell";
import { JumpBar } from "@/components/solutions/Blocks";
import { Button, Section, SectionHead } from "@/components/ui";
import { getCaseCategories, getCases, getClientGroups } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { HeroMosaic } from "@/components/ui/HeroMosaic";
import { caseThumb } from "@/lib/thumbs";

const PATH = "/customers";

export const metadata: Metadata = buildMetadata({
  title: "Customers",
  description: `${getCases().length} customer stories: national trust infrastructure, bank CAs, remote signing, eKYC, open banking and digital government delivered by SAVIS.`,
  path: PATH,
});

export default function CustomersPage() {
  const cases = getCases();
  const cats = getCaseCategories() as Array<{ id: string; name: string; lead?: string }>;
  return (
    <PageShell
      path={PATH}
      eyebrow="Customers"
      title="Trusted by institutions that cannot afford to fail."
      label="Customers"
      aside={<HeroMosaic bare items={cases.slice(0, 4).map((c) => ({ spec: caseThumb(c as never), title: (c as { client: string }).client }))} />}
      lead="Central banks, ministries, banks and telcos run their digital trust on SAVIS. Read how each programme was designed, delivered and operated."
      actions={
        <>
          <Button href="/contact" onBand>Discuss Your Project</Button>
          <Button href="/industries" variant="ghost" onBand>Browse industries</Button>
        </>
      }
    >
      <JumpBar links={cats.map((c) => ({ href: `#${c.id}`, label: c.name }))} />
      {cats.map((c, i) => {
        const items = cases.filter((x) => x.cat === c.id);
        if (!items.length) return null;
        return (
          <Section key={c.id} id={c.id} tone={i % 2 ? "surface" : "default"}>
            <SectionHead eyebrow={`${items.length} stories`} title={c.name} />
            {c.lead && <p style={{ margin: "0 0 var(--space-30)", maxWidth: 760, color: "var(--muted)" }}>{c.lead}</p>}
            <div className="sv-cols3">
              {items.map((x) => <CaseCard key={x.id} item={x} category={c.name} />)}
            </div>
          </Section>
        );
      })}
      <Section tone="surface" id="clients">
        <SectionHead eyebrow="Our clients" title="Organizations we serve" />
        {getClientGroups().map(([group, names]) => (
          <div key={group} style={{ marginBottom: "var(--space-30)" }}>
            <h3 style={{ margin: "0 0 10px", fontSize: 16 }}>{group}</h3>
            <ul className="sv-pills" style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {names.map((n) => <li key={n}>{n}</li>)}
            </ul>
          </div>
        ))}
      </Section>
    </PageShell>
  );
}
