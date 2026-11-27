import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page/PageShell";
import { Architecture } from "@/components/solutions/Architecture";
import { FeatureGrid, InfoCard, Roadmap } from "@/components/solutions/Blocks";
import { Button, Section, SectionHead } from "@/components/ui";
import { getGroup, getProduct, getProductArch, getProductDetail, getProducts, pillarOfProduct } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;
/** Only products with a detail record have a datasheet. */
export const generateStaticParams = () => getProducts().filter((p) => getProductDetail(p.slug)).map((p) => ({ slug: p.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  const d = p && getProductDetail(p.slug);
  if (!p || !d) return {};
  return buildMetadata({ title: `${p.name} datasheet`, description: d.sum, path: `/products/${p.slug}/datasheet` });
}

export default async function DatasheetPage({ params }: Props) {
  const p = getProduct((await params).slug);
  const d = p && getProductDetail(p.slug);
  if (!p || !d) notFound();
  const arch = getProductArch(p.slug);
  const pillar = pillarOfProduct(p);
  const group = getGroup(p.group);
  return (
    <PageShell
      path={`/products/${p.slug}/datasheet`}
      eyebrow="Datasheet"
      title={p.name}
      label="Datasheet"
      lead={d.sum}
      trail={[
        { label: "Solutions & Products", href: "/solutions" },
        ...(pillar ? [{ label: pillar.name, href: `/solutions/${pillar.id}` }] : []),
        ...(pillar && group ? [{ label: group.name, href: `/solutions/${pillar.id}#${group.slug}` }] : []),
        { label: p.name, href: `/products/${p.slug}` },
      ]}
      actions={
        <>
          <Button href="/contact" onBand>Request the full pack</Button>
          <Button href={`/products/${p.slug}`} variant="ghost" onBand>Product page</Button>
        </>
      }
    >
      <Section>
        <SectionHead eyebrow="Capabilities" title="Key features" />
        <FeatureGrid items={d.feat} />
      </Section>
      {arch && (
        <Section tone="surface">
          <SectionHead eyebrow="Architecture" title="Reference architecture" />
          <Architecture arch={arch} name={p.name.replace(/^SAVIS /, "")} />
        </Section>
      )}
      <Section>
        <SectionHead eyebrow="Specification" title="Integration, deployment and standards" />
        <div className="sv-grid">
          <InfoCard label="Integration" items={d.int} />
          <InfoCard label="Deployment" items={d.dep} />
          <InfoCard label="Standards & regulation" chips={d.std} />
          <InfoCard label="Prerequisites" items={d.pre} />
        </div>
        <Roadmap title="Deployment roadmap" notes={d.go} />
      </Section>
    </PageShell>
  );
}
