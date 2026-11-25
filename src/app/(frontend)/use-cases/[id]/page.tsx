import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseCard } from "@/components/home/CaseCard";
import { PageShell } from "@/components/page/PageShell";
import { InfoCard, JumpBar, LinkPills, NextSteps } from "@/components/solutions/Blocks";
import { Layers, Steps } from "@/components/solutions/Layers";
import { Button, Card, ProductCard, Section, SectionHead } from "@/components/ui";
import { SmartLink } from "@/components/ui/SmartLink";
import {
  getCase, getCaseCategories, getIndustry, getProduct, getUseCase, getUseCases, pillarById, roleTags,
} from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => getUseCases().map((u) => ({ id: u.id }));

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const u = getUseCase((await params).id);
  if (!u) return {};
  return buildMetadata({ title: u.name, description: u.tagline.length < 110 ? `${u.tagline} ${u.problem}` : u.tagline, path: `/use-cases/${u.id}` });
}

export default async function UseCasePage({ params }: Props) {
  const u = getUseCase((await params).id);
  if (!u) notFound();
  const pillar = pillarById(u.pillar);
  const products = u.products.flatMap((s) => getProduct(s) ?? []);
  const inds = u.industries.flatMap((i) => getIndustry(i) ?? []);
  const cases = u.cases.flatMap((c) => getCase(c) ?? []);
  const categories = new Map(getCaseCategories().map((c) => [c.id, c.name]));
  const related = getUseCases().filter((x) => x.pillar === u.pillar && x.id !== u.id).slice(0, 3);

  return (
    <PageShell
      path={`/use-cases/${u.id}`}
      eyebrow={pillar ? `Use case · Pillar ${pillar.n}` : "Use case"}
      title={u.name}
      lead={u.tagline}
      trail={[
        { label: "Solutions & Products", href: "/solutions" },
        { label: "Use cases", href: "/use-cases" },
        ...(pillar ? [{ label: pillar.name, href: `/use-cases#${pillar.id}` }] : []),
      ]}
      actions={
        <>
          <Button href="/contact" onBand>Discuss This Use Case</Button>
          <Button href="/use-cases" variant="ghost" onBand>All use cases</Button>
        </>
      }
      cta={false}
    >
      <JumpBar
        title={u.name}
        links={[
          { href: "#problem", label: "Problem" },
          { href: "#journey", label: "User journey" },
          { href: "#architecture", label: "Architecture" },
          { href: "#products", label: "Products" },
        ]}
        actions={<Button href="/contact">Request a demo</Button>}
      />

      <Section id="problem">
        <div className="sv-grid">
          <InfoCard label="The problem" items={[u.problem]} />
          <InfoCard label="Outcomes" items={u.benefits} />
        </div>
        {inds.length > 0 && (
          <div style={{ marginTop: "var(--space-30)" }}>
            <p style={{ margin: "0 0 10px", color: "var(--muted)" }}>Industries</p>
            <LinkPills>{inds.map((i) => <SmartLink key={i.id} href={`/industries/${i.id}`}>{i.name}</SmartLink>)}</LinkPills>
          </div>
        )}
      </Section>

      <Section tone="surface" id="journey">
        <SectionHead eyebrow="User journey · UI/UX flow" title="What the user sees, step by step" />
        <Steps steps={u.flow} />
      </Section>

      <Section id="architecture">
        <SectionHead eyebrow="Logical architecture" title="How the pieces fit" />
        <Layers layers={u.logical} label="Logical architecture" />
        <div style={{ marginTop: "var(--space-40)" }}>
          <SectionHead eyebrow="System architecture" title="Where it runs" />
          <Layers layers={u.system} label="System architecture by network zone" />
        </div>
      </Section>

      <Section tone="surface" id="products">
        <SectionHead eyebrow="Products behind it" title="What powers this use case" />
        <div className="sv-grid">
          {products.map((p) => (
            <ProductCard key={p.slug} name={p.name} description={p.desc} tags={roleTags(p)} href={`/products/${p.slug}`} />
          ))}
        </div>
      </Section>

      {cases.length > 0 && (
        <Section>
          <SectionHead eyebrow="Customers" title="Proven in production" />
          <div className="sv-cols3">
            {cases.map((c) => <CaseCard key={c.id} item={c} category={categories.get(c.cat) ?? ""} />)}
          </div>
        </Section>
      )}

      {related.length > 0 && (
        <Section tone="surface">
          <SectionHead eyebrow="Related" title="More in this pillar" />
          <div className="sv-cols3">
            {related.map((x) => <Card key={x.id} title={x.name} href={`/use-cases/${x.id}`} cta="See how it works">{x.tagline}</Card>)}
          </div>
        </Section>
      )}

      <NextSteps />
    </PageShell>
  );
}
