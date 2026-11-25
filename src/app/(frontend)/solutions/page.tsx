import type { Metadata } from "next";
import { PageShell } from "@/components/page/PageShell";
import { NextSteps } from "@/components/solutions/Blocks";
import { ChallengePicker, type ChallengePanel } from "@/components/solutions/ChallengePicker";
import { Button, PillarCard, Section, SectionHead } from "@/components/ui";
import { CHALLENGES } from "@/data/challenges";
import {
  getPillars, getProduct, getProductDetail, getProducts, getUseCase, getUseCases, groupsOfPillar, productsOfGroup,
} from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

const PATH = "/solutions";

export const metadata: Metadata = buildMetadata({
  title: "Solutions & Products",
  description: `${getProducts().length} products in five solution pillars, designed, delivered and operated by SAVIS. Start with your challenge and see the products behind it.`,
  path: PATH,
});

/** First sentence of a product description, for compact cards. */
const blurb = (d: string) => (d.match(/^[^.:;]*/)?.[0] ?? d).trim() + ".";

function panels(): ChallengePanel[] {
  return CHALLENGES.flatMap((c) => {
    const u = getUseCase(c.useCase);
    if (!u) return [];
    return [{
      id: c.useCase,
      title: c.title,
      problem: u.problem,
      solution: u.tagline,
      steps: u.flow.slice(0, 4).map((f) => f[1]),
      useCaseHref: `/use-cases/${u.id}`,
      products: c.products.flatMap((slug) => {
        const p = getProduct(slug);
        return p
          ? [{
              name: p.name,
              blurb: blurb(p.desc),
              href: `/products/${slug}`,
              ...(getProductDetail(slug) ? { datasheetHref: `/products/${slug}/datasheet` } : {}),
            }]
          : [];
      }),
    }];
  });
}

export default function SolutionsPage() {
  const pillars = getPillars();
  const products = getProducts();
  const total = products.length;
  return (
    <PageShell
      path={PATH}
      eyebrow="Solutions & Products"
      title="Digital trust, from identity to payments."
      label="Solutions & Products"
      lead={`${total} products in five solution pillars — designed, delivered and operated by SAVIS. Start with your challenge; we’ll show you the products, the demo and the people behind them.`}
      actions={
        <>
          <Button href="#challenges" onBand>Find your challenge ↓</Button>
          <Button href="/contact" variant="ghost" onBand>Request a demo</Button>
        </>
      }
      aside={
        <ul className="sv-stats">
          <li><b>{pillars.length}</b>pillars</li>
          <li><b>{total}</b>products</li>
          <li><b>{getUseCases().length}</b>use cases</li>
        </ul>
      }
      cta={false}
    >
      <Section id="challenges">
        <SectionHead eyebrow="Start with your challenge" title="What do you need to solve?" />
        <ChallengePicker panels={panels()} />
      </Section>

      <Section tone="surface" id="pillars">
        <SectionHead eyebrow="Five solution pillars" title="Explore by pillar" />
        <div className="sv-pillars">
          {pillars.map((p, i) => (
            <PillarCard
              key={p.id}
              lead={i === 0}
              number={p.n}
              title={p.name}
              subtitle={`${products.filter((x) => x.pillar === p.slug).length} products`}
              href={`/solutions/${p.id}`}
              tags={p.tags.slice(0, 6)}
            >
              {p.pitch}
            </PillarCard>
          ))}
        </div>
      </Section>

      <Section id="all-products">
        <SectionHead eyebrow="Full catalogue" title={`All ${total} products, by pillar and group`} />
        <details className="sv-az">
          <summary>Browse all {total} products<em>by pillar and group</em></summary>
          {pillars.map((p) => (
            <div key={p.id}>
              <h4><a href={`/solutions/${p.id}`}>{p.n} · {p.name}</a></h4>
              {groupsOfPillar(p.slug).map((g) => (
                <div key={g.slug} id={g.slug}>
                  <p style={{ margin: "10px 0 6px", fontWeight: 600, color: "var(--ink)" }}>{g.name}</p>
                  <div className="sv-az__list">
                    {productsOfGroup(g).map((x) => <a key={x.slug} href={`/products/${x.slug}`}>{x.name}</a>)}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </details>
      </Section>

      <NextSteps />
    </PageShell>
  );
}
