import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseCard } from "@/components/home/CaseCard";
import { HeroCard } from "@/components/ui/HeroMosaic";
import { PageShell } from "@/components/page/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { Architecture } from "@/components/solutions/Architecture";
import { Faq, FeatureGrid, InfoCard, JumpBar, LinkPills, Roadmap } from "@/components/solutions/Blocks";
import { Button, Card, Chip, KeyValueList, ProductCard, Section, SectionHead } from "@/components/ui";
import { SmartLink } from "@/components/ui/SmartLink";
import { Thumb } from "@/components/ui/Thumb";
import { productThumb, useCaseThumb } from "@/lib/thumbs";
import {
  casesOfProduct, getCaseCategories, getGroup, getProduct, getProductArch, getProductDetail, getProducts, industriesOfProduct,
  pillarOfProduct, productFaq, productsOfGroup, roleTags, useCasesOfProduct,
} from "@/lib/content";
import { buildMetadata, softwareLd } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => getProducts().map((p) => ({ slug: p.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const d = getProductDetail(p.slug);
  return buildMetadata({ title: p.name, description: p.detail?.lead ?? d?.sum ?? p.desc, path: `/products/${p.slug}` });
}

export default async function ProductPage({ params }: Props) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const path = `/products/${p.slug}`;
  const pillar = pillarOfProduct(p);
  const group = getGroup(p.group);
  const d = getProductDetail(p.slug);
  const arch = getProductArch(p.slug);
  const story = p.detail;
  const related = group ? productsOfGroup(group).filter((x) => x.slug !== p.slug).slice(0, 6) : [];
  const ucs = useCasesOfProduct(p.slug).slice(0, 6);
  const cases = casesOfProduct(p.slug).slice(0, 3);
  const inds = industriesOfProduct(p.slug);
  const categories = new Map(getCaseCategories().map((c) => [c.id, c.name]));

  const links = [
    ...(d ? [{ href: "#features", label: "Features" }] : story ? [{ href: "#overview", label: "Overview" }] : []),
    ...(arch ? [{ href: "#architecture", label: "Architecture" }] : []),
    ...(d ? [{ href: "#faq", label: "FAQ" }] : []),
  ];

  return (
    <PageShell
      path={path}
      eyebrow={pillar && group ? `${pillar.n} · ${group.name}` : undefined}
      title={p.name}
      aside={<HeroCard spec={productThumb(p)} />}
      lead={p.desc}
      trail={[
        { label: "Solutions & Products", href: "/solutions" },
        ...(pillar ? [{ label: pillar.name, href: `/solutions/${pillar.id}` }] : []),
        ...(group ? [{ label: group.name, href: `/solutions#${group.slug}` }] : []),
      ]}
      actions={
        <>
          <Button href="/contact" onBand>Request a Consultation</Button>
          <Button href="/contact" variant="ghost" onBand>Download Brochure</Button>
        </>
      }
    >
      <JsonLd data={softwareLd({ name: p.name, description: p.desc, path })} />
      <JumpBar
        title={p.name}
        links={links}
        actions={
          <>
            {d && <Button href={`${path}/datasheet`} variant="ghost">Datasheet</Button>}
            <Button href="/contact" variant="ghost">Get a quote</Button>
            <Button href="/contact">Request a demo</Button>
          </>
        }
      />

      <Section id="overview">
        <div className="sv-grid">
          <Card title={`What ${p.name} does`}>{story?.lead ?? p.desc} Delivered by SAVIS with consulting, integration and managed operations.</Card>
          <div className="sv-card sv-info">
            <span className="sv-eyebrow">Product master record</span>
            <div className="sv-info__chips">{roleTags(p).map((t) => <Chip key={t}>{t}</Chip>)}</div>
            <p style={{ margin: 0 }}>Built on SAVIS core technology. Technical datasheet, API and deployment documentation are available on request.</p>
            <SmartLink href="/contact" className="sv-go">Request the technical datasheet →</SmartLink>
          </div>
        </div>
        {story?.fit && <p style={{ margin: "var(--space-26) 0 0", maxWidth: 760, color: "var(--muted)" }}><b style={{ color: "var(--ink)" }}>Best fit: </b>{story.fit}</p>}
      </Section>

      {story?.blocks && story.blocks.length > 0 && (
        <Section tone="surface">
          <SectionHead eyebrow="Scope" title={`What ${p.name} covers`} />
          <div className="sv-grid">
            {story.blocks.map(([title, items]) => <InfoCard key={title} label={title} items={items} />)}
          </div>
          {story.specs && story.specs.length > 0 && <div style={{ marginTop: "var(--space-30)" }}><KeyValueList items={story.specs} /></div>}
          {story.standards && story.standards.length > 0 && (
            <div style={{ marginTop: "var(--space-30)" }}>
              <InfoCard label="Standards" chips={story.standards} />
            </div>
          )}
        </Section>
      )}

      {d && (
        <>
          <Section tone="surface" id="features">
            <SectionHead eyebrow="Why it matters" title="Key features" />
            <p style={{ margin: "0 0 var(--space-30)", maxWidth: 760, color: "var(--muted)", lineHeight: 1.6 }}>{d.sum}</p>
            <FeatureGrid items={d.feat} />
          </Section>
        </>
      )}

      {arch && (
        <Section id="architecture">
          <SectionHead eyebrow="Architecture" title={`How ${p.name} works in your environment`} />
          <Architecture arch={arch} name={p.name.replace(/^SAVIS /, "")} />
        </Section>
      )}

      {d && (
        <Section tone="surface" id="implementation">
          <SectionHead eyebrow="Implementation" title="Integration, deployment and compliance" />
          <div className="sv-grid">
            <InfoCard label="Integration" items={d.int} />
            <InfoCard label="Deployment options" items={d.dep} />
            <InfoCard label="Standards & regulation" chips={d.std} />
            <InfoCard label="What you need" items={d.pre} />
          </div>
          <Roadmap title={`Deployment roadmap for ${p.name}`} notes={d.go} />
          <div className="sv-cta" style={{ marginTop: "var(--space-30)" }}>
            <div>
              <b>{p.name} datasheet &amp; architecture pack</b>
              <span>Technical datasheet, integration guide and reference architecture, shared under NDA.</span>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Button href={`${path}/datasheet`} variant="ghost" onBand>View datasheet</Button>
              <Button href="/contact" onBand>Request the pack</Button>
            </div>
          </div>
        </Section>
      )}

      {d && (
        <Section id="faq">
          <SectionHead eyebrow="FAQ" title="Frequently asked questions" />
          <Faq items={productFaq(p.name, d)} />
        </Section>
      )}

      {ucs.length > 0 && (
        <Section tone="surface">
          <SectionHead eyebrow="Applied in" title="Use cases with this product" />
          <div className="sv-cols3">
            {ucs.map((u) => (
              <Card key={u.id} thumb={<Thumb spec={useCaseThumb(u)} />} title={u.name} href={`/use-cases/${u.id}`} cta="See how it works">{u.tagline}</Card>
            ))}
          </div>
        </Section>
      )}

      {cases.length > 0 && (
        <Section>
          <SectionHead eyebrow="Used in" title="Proven in production" />
          <div className="sv-cols3">
            {cases.map((c) => <CaseCard key={c.id} item={c} category={categories.get(c.cat) ?? ""} />)}
          </div>
        </Section>
      )}

      {inds.length > 0 && (
        <Section tone="surface">
          <SectionHead eyebrow="Industries" title={`Where ${p.name} is used`} />
          <LinkPills>{inds.map((i) => <SmartLink key={i.id} href={`/industries/${i.id}`}>{i.name}</SmartLink>)}</LinkPills>
        </Section>
      )}

      {related.length > 0 && (
        <Section>
          <SectionHead eyebrow="Related products" title={group ? `More in ${group.name}` : "Related products"} />
          <div className="sv-grid">
            {related.map((x) => (
              <ProductCard key={x.slug} thumb={<Thumb spec={productThumb(x)} />} name={x.name} description={x.desc} tags={roleTags(x)} href={`/products/${x.slug}`} />
            ))}
          </div>
        </Section>
      )}
    </PageShell>
  );
}
