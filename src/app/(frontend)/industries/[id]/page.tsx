import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseCard } from "@/components/home/CaseCard";
import { PageShell } from "@/components/page/PageShell";
import { JumpBar, LinkPills, NextSteps } from "@/components/solutions/Blocks";
import { Button, Card, ProductCard, Section, SectionHead } from "@/components/ui";
import { SmartLink } from "@/components/ui/SmartLink";
import { Thumb } from "@/components/ui/Thumb";
import { productThumb, useCaseThumb } from "@/lib/thumbs";
import {
  casesOfIndustry, getCaseCategories, getIndustries, getIndustry, getProduct, pillarById, roleTags, useCasesOfIndustry,
} from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => getIndustries().map((i) => ({ id: i.id }));

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const i = getIndustry((await params).id);
  if (!i) return {};
  return buildMetadata({ title: `${i.name} solutions`, description: i.pitch, path: `/industries/${i.id}` });
}

const FEATURED = 6;

export default async function IndustryPage({ params }: Props) {
  const ind = getIndustry((await params).id);
  if (!ind) notFound();
  const products = ind.picks.flatMap((s) => getProduct(s) ?? []);
  const featured = products.slice(0, FEATURED);
  const ucs = useCasesOfIndustry(ind.id);
  const cases = casesOfIndustry(ind.id).slice(0, 3);
  const categories = new Map(getCaseCategories().map((c) => [c.id, c.name]));
  const pillars = ind.pillars.flatMap((p) => pillarById(p) ?? []);

  const links = [
    { href: "#products", label: "Products" },
    ...(ucs.length ? [{ href: "#use-cases", label: "Use cases" }] : []),
    ...(cases.length ? [{ href: "#customers", label: "Customers" }] : []),
  ];

  return (
    <PageShell
      path={`/industries/${ind.id}`}
      eyebrow="Industry"
      title={ind.name}
      lead={ind.pitch}
      trail={[{ label: "Solutions & Products", href: "/solutions" }, { label: "Industries", href: "/industries" }]}
      actions={
        <>
          <Button href="/contact" onBand>Discuss Your Project</Button>
          <Button href="/use-cases" variant="ghost" onBand>Explore Use Cases</Button>
        </>
      }
      cta={false}
    >
      <JumpBar title={ind.name} links={links} actions={<Button href="/contact">Request a demo</Button>} />

      <Section id="products">
        <SectionHead eyebrow="Recommended" title={`Products for ${ind.name}`} />
        <div className="sv-grid">
          {featured.map((p) => (
            <ProductCard key={p.slug} thumb={<Thumb spec={productThumb(p)} />} name={p.name} description={p.desc} tags={roleTags(p)} href={`/products/${p.slug}`} />
          ))}
        </div>
        {products.length > FEATURED && (
          <details className="sv-az" style={{ marginTop: "var(--space-30)" }}>
            <summary>All {products.length} products for this sector</summary>
            <div className="sv-az__list">
              {products.slice(FEATURED).map((p) => <a key={p.slug} href={`/products/${p.slug}`}>{p.name}</a>)}
            </div>
          </details>
        )}
        {pillars.length > 0 && (
          <div style={{ marginTop: "var(--space-30)" }}>
            <p style={{ margin: "0 0 10px", color: "var(--muted)" }}>Explore by solution pillar</p>
            <LinkPills>
              {pillars.map((p) => <SmartLink key={p.id} href={`/solutions/${p.id}`}>{p.name}</SmartLink>)}
            </LinkPills>
          </div>
        )}
      </Section>

      {ucs.length > 0 && (
        <Section tone="surface" id="use-cases">
          <SectionHead eyebrow="Use cases" title={`How ${ind.name} teams apply it`} />
          <div className="sv-cols3">
            {ucs.map((u) => (
              <Card key={u.id} thumb={<Thumb spec={useCaseThumb(u)} />} title={u.name} href={`/use-cases/${u.id}`} cta="See how it works">{u.tagline}</Card>
            ))}
          </div>
        </Section>
      )}

      {cases.length > 0 && (
        <Section id="customers">
          <SectionHead eyebrow="Customers" title="Proven in production" />
          <div className="sv-cols3">
            {cases.map((c) => <CaseCard key={c.id} item={c} category={categories.get(c.cat) ?? ""} />)}
          </div>
        </Section>
      )}

      <NextSteps />
    </PageShell>
  );
}
