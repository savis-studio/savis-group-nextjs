import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page/PageShell";
import { JumpBar, LinkPills, NextSteps } from "@/components/solutions/Blocks";
import { Journey } from "@/components/solutions/Journey";
import { Button, Card, Section, SectionHead } from "@/components/ui";
import { SmartLink } from "@/components/ui/SmartLink";
import { getJourney, getPillars, getUseCases, groupsOfPillar, pillarById, productsOfGroup } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => getPillars().map((p) => ({ pillar: p.id }));

type Props = { params: Promise<{ pillar: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = pillarById((await params).pillar);
  if (!p) return {};
  return buildMetadata({ title: p.name, description: p.pitch, path: `/solutions/${p.id}` });
}

export default async function PillarPage({ params }: Props) {
  const p = pillarById((await params).pillar);
  if (!p) notFound();
  const ucs = getUseCases().filter((u) => u.pillar === p.id).slice(0, 6);
  const journey = getJourney(p.id);
  const groups = groupsOfPillar(p.slug);
  const links = [
    ...(ucs.length ? [{ href: "#challenges", label: "Challenges" }] : []),
    ...(journey ? [{ href: "#journey", label: "Journey" }] : []),
    { href: "#products", label: "Products" },
  ];
  return (
    <PageShell
      path={`/solutions/${p.id}`}
      eyebrow={`Pillar ${p.n}`}
      title={p.name}
      lead={p.pitch}
      trail={[{ label: "Solutions & Products", href: "/solutions" }]}
      actions={
        <>
          <Button href="/contact" onBand>Talk to a Solution Expert</Button>
          <Button href="#products" variant="ghost" onBand>View Related Products</Button>
        </>
      }
      cta={false}
    >
      <JumpBar links={links} actions={<Button href="/contact">Request a demo</Button>} />

      {ucs.length > 0 && (
        <Section id="challenges">
          <SectionHead eyebrow="Challenges we solve" title={`Where ${p.name} makes the difference`} />
          <div className="sv-cols3">
            {ucs.map((u) => (
              <Card key={u.id} title={u.name} href={`/use-cases/${u.id}`} cta="See how it works">
                {u.problem} <b style={{ color: "var(--ink)" }}>{u.tagline}</b>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {journey && <div id="journey"><Journey journey={journey} /></div>}

      <Section tone="surface" id="products">
        <SectionHead eyebrow="Products" title="Products by group">
          <SmartLink href="/solutions" className="sv-more">All pillars →</SmartLink>
        </SectionHead>
        {groups.map((g) => (
          <div key={g.slug} className="sv-group">
            <h3><SmartLink href={`/solutions#${g.slug}`}>{g.name}</SmartLink></h3>
            <LinkPills>
              {productsOfGroup(g).map((x) => <SmartLink key={x.slug} href={`/products/${x.slug}`}>{x.name}</SmartLink>)}
            </LinkPills>
          </div>
        ))}
      </Section>

      <NextSteps />
    </PageShell>
  );
}
