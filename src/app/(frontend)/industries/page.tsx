import type { Metadata } from "next";
import "@/styles/solutions.css";
import { PageShell } from "@/components/page/PageShell";
import { Button, Card, Section, SectionHead } from "@/components/ui";
import { INDUSTRY_GROUPS, getIndustry } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { IndustryThumb } from "@/components/ui/Thumb";
import { industryThumb } from "@/lib/thumbs";

const PATH = "/industries";

export const metadata: Metadata = buildMetadata({
  title: "Industries",
  description: "Solutions shaped by sector: government, banking, payments, telco, enterprise, healthcare and more. See the products, use cases and case studies that matter most.",
  path: PATH,
});

export default function IndustriesPage() {
  return (
    <PageShell
      path={PATH}
      eyebrow="Industries"
      title="Solutions shaped by sector."
      label="Industries"
      lead="Pick your sector to see the products, use cases and case studies that matter most."
      trail={[{ label: "Solutions & Products", href: "/solutions" }]}
      actions={
        <>
          <Button href="/contact" onBand>Discuss Your Project</Button>
          <Button href="/use-cases" variant="ghost" onBand>Browse use cases</Button>
        </>
      }
    >
      {INDUSTRY_GROUPS.map(([title, ids], i) => (
        <Section key={title} tone={i % 2 ? "surface" : "default"}>
          <SectionHead eyebrow="Sector" title={title} />
          <div className="sv-grid">
            {ids.flatMap((id, i) => {
              const ind = getIndustry(id);
              if (!ind) return [];
              return [
                <Card key={id} thumb={<IndustryThumb {...industryThumb(ind.name, i)} />} title={ind.name} href={`/industries/${id}`} cta="Explore">
                  {ind.pitch}
                </Card>,
              ];
            })}
          </div>
        </Section>
      ))}
    </PageShell>
  );
}
