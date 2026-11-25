import type { Metadata } from "next";
import { PageShell } from "@/components/page/PageShell";
import { JumpBar } from "@/components/solutions/Blocks";
import { Button, Card, Section, SectionHead } from "@/components/ui";
import { getPillars, getUseCases } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

const PATH = "/use-cases";

export const metadata: Metadata = buildMetadata({
  title: "Use cases",
  description: `${getUseCases().length} real-world journeys, step by step: the problem, the user flow and the products behind it.`,
  path: PATH,
});

export default function UseCasesPage() {
  const pillars = getPillars();
  const all = getUseCases();
  return (
    <PageShell
      path={PATH}
      eyebrow="Solutions by use case"
      title="See it work before you buy it."
      label="Use cases"
      lead="Real-world journeys, step by step — the problem, the flow, the products behind it."
      trail={[{ label: "Solutions & Products", href: "/solutions" }]}
      actions={
        <>
          <Button href="/contact" onBand>Discuss Your Project</Button>
          <Button href="/industries" variant="ghost" onBand>Browse industries</Button>
        </>
      }
    >
      <JumpBar links={pillars.map((p) => ({ href: `#${p.id}`, label: p.name }))} />
      {pillars.map((p, i) => {
        const items = all.filter((u) => u.pillar === p.id);
        if (!items.length) return null;
        return (
          <Section key={p.id} id={p.id} tone={i % 2 ? "surface" : "default"}>
            <SectionHead eyebrow={`Pillar ${p.n}`} title={p.name} />
            <div className="sv-cols3">
              {items.map((u) => (
                <Card key={u.id} title={u.name} href={`/use-cases/${u.id}`} cta={`${u.flow.length} steps`}>
                  {u.tagline}
                </Card>
              ))}
            </div>
          </Section>
        );
      })}
    </PageShell>
  );
}
