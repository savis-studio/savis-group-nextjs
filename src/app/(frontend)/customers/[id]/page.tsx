import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseCard } from "@/components/home/CaseCard";
import { HeroCard } from "@/components/ui/HeroMosaic";
import { caseThumb } from "@/lib/thumbs";
import { PageShell } from "@/components/page/PageShell";
import { InfoCard, JumpBar, LinkPills, NextSteps } from "@/components/solutions/Blocks";
import { Layers } from "@/components/solutions/Layers";
import { Button, Card, ProductCard, Section, SectionHead } from "@/components/ui";
import { SmartLink } from "@/components/ui/SmartLink";
import { Thumb } from "@/components/ui/Thumb";
import { productThumb, useCaseThumb } from "@/lib/thumbs";
import {
  getCaseCategories, getCaseDetail, getCases, getIndustry, getProduct, roleTags, useCasesOfCase,
} from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => getCases().map((c) => ({ id: c.id }));

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCaseDetail((await params).id);
  if (!c) return {};
  return buildMetadata({ title: `${c.client}: ${c.title}`, description: c.summary, path: `/customers/${c.id}` });
}

export default async function CasePage({ params }: Props) {
  const c = getCaseDetail((await params).id);
  if (!c) notFound();
  const cats = new Map(getCaseCategories().map((x) => [x.id, x.name]));
  const category = cats.get(c.cat) ?? "";
  const products = c.products.flatMap((s) => getProduct(s) ?? []);
  const inds = c.ind.flatMap((i) => getIndustry(i) ?? []);
  const ucs = useCasesOfCase(c.id);
  const related = getCases().filter((x) => x.cat === c.cat && x.id !== c.id).slice(0, 3);

  return (
    <PageShell
      path={`/customers/${c.id}`}
      eyebrow={`${category} · ${c.country}${c.year ? ` · ${c.year}` : ""}`}
      title={c.title}
      aside={<HeroCard spec={caseThumb(c as never)} />}
      lead={c.summary}
      trail={[{ label: "Insights", href: "/insights" }, { label: "Case studies", href: "/customers" }, ...(category ? [{ label: category, href: `/customers#${c.cat}` }] : [])]}
      actions={
        <>
          <Button href="/contact" onBand>Discuss a similar project</Button>
          <Button href="/customers" variant="ghost" onBand>All customers</Button>
        </>
      }
      cta={false}
    >
      <JumpBar
        title={c.client}
        links={[
          { href: "#challenge", label: "Challenge" },
          { href: "#solution", label: "Solution" },
          { href: "#results", label: "Results" },
          ...(products.length ? [{ href: "#products", label: "Products" }] : []),
        ]}
        actions={<Button href="/contact">Request a demo</Button>}
      />

      <Section id="challenge">
        <div className="sv-grid">
          <InfoCard label="The challenge" items={[c.challenge]} />
          <InfoCard label="Client" items={[c.clientFull, c.country]} />
        </div>
      </Section>

      <Section tone="surface" id="solution">
        <SectionHead eyebrow="Solution" title="What SAVIS delivered" />
        <p style={{ margin: "0 0 var(--space-30)", maxWidth: 760, lineHeight: 1.6 }}>{c.solution}</p>
        <div className="sv-grid">
          <InfoCard label="Scope" items={c.scope} />
          {c.standards.length > 0 && <InfoCard label="Standards" chips={c.standards} />}
        </div>
      </Section>

      {c.arch.length > 0 && (
        <Section>
          <SectionHead eyebrow="Architecture" title="How the solution is built" />
          <Layers layers={c.arch} label="Solution architecture" />
        </Section>
      )}

      <Section tone="surface" id="results">
        <SectionHead eyebrow="Results" title="Outcomes" />
        <InfoCard label="What changed" items={c.results} />
        {inds.length > 0 && (
          <div style={{ marginTop: "var(--space-30)" }}>
            <p style={{ margin: "0 0 10px", color: "var(--muted)" }}>Industries</p>
            <LinkPills>{inds.map((i) => <SmartLink key={i.id} href={`/industries/${i.id}`}>{i.name}</SmartLink>)}</LinkPills>
          </div>
        )}
      </Section>

      {products.length > 0 && (
        <Section id="products">
          <SectionHead eyebrow="Products used" title="The SAVIS products behind this program" />
          <div className="sv-grid">
            {products.map((p) => (
              <ProductCard key={p.slug} thumb={<Thumb spec={productThumb(p)} />} name={p.name} description={p.desc} tags={roleTags(p)} href={`/products/${p.slug}`} />
            ))}
          </div>
        </Section>
      )}

      {ucs.length > 0 && (
        <Section tone="surface">
          <SectionHead eyebrow="Use cases" title="See the journey" />
          <div className="sv-cols3">
            {ucs.map((u) => <Card key={u.id} thumb={<Thumb spec={useCaseThumb(u)} />} title={u.name} href={`/use-cases/${u.id}`} cta="See how it works">{u.tagline}</Card>)}
          </div>
        </Section>
      )}

      {related.length > 0 && (
        <Section>
          <SectionHead eyebrow="Related" title={`More in ${category}`} />
          <div className="sv-cols3">
            {related.map((x) => <CaseCard key={x.id} item={x} category={category} />)}
          </div>
        </Section>
      )}

      <NextSteps />
    </PageShell>
  );
}
