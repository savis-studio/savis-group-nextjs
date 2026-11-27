import type { Metadata } from "next";
import { PageShell } from "@/components/page/PageShell";
import { NextSteps } from "@/components/solutions/Blocks";
import { ChallengePicker, type ChallengePanel } from "@/components/solutions/ChallengePicker";
import { Journey } from "@/components/solutions/Journey";
import { Button, PillarCard, Section, SectionHead } from "@/components/ui";
import { SmartLink } from "@/components/ui/SmartLink";
import { Thumb } from "@/components/ui/Thumb";
import { CHALLENGES } from "@/data/challenges";
import {
  getPillars, getProduct, getProductDetail, getProducts, getUseCase, getUseCases, groupsOfPillar, productsOfGroup,
} from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { JOURNEY_ICONS } from "@/lib/line-icons";

const PATH = "/solutions";

const PILLAR_ICON: Record<string, string> = { identity: "face", cyber: "shield", gov: "gov", finance: "root", ai: "chip" };

/** One digital life end to end: which SAVIS products sit behind each step. */
const LIFE = {
  eyebrow: "One customer journey",
  title: "Every step of a digital life, secured by SAVIS",
  steps: [
    { href: "/solutions/identity", title: "Enroll & verify", text: "Prove who you are remotely: chip ID, face match and liveness.", products: ["SAVIS TrustOnboard", "SAVIS Liveness & Deepfake Defense"] },
    { href: "/solutions/identity", title: "Log in", text: "Passwordless, phishing-resistant authentication on any device.", products: ["FIDO2 Passwordless Identity", "SAM Appliance"] },
    { href: "/solutions/identity", title: "Sign", text: "Legally binding remote signatures with keys kept in the HSM.", products: ["TrustCA Remote Signing", "Smart eContract"] },
    { href: "/solutions/finance", title: "Pay & transact", text: "Open APIs, consent, 3-D Secure and transaction signing.", products: ["Open Banking Suite", "3D Secure 2.0"] },
    { href: "/solutions/gov", title: "Use public services", text: "One-stop services and a super app for citizens.", products: ["SAVIS SuperApp platform", "One-Stop-Shop"] },
    { href: "/solutions/cyber", title: "Protected 24/7", text: "Zero Trust, key protection and round-the-clock monitoring.", products: ["Zero Trust Gateway Appliance", "SAVIS AI SOC"] },
  ],
};

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
      lead={`${total} products in five solution pillars - designed, delivered and operated by SAVIS. Start with your challenge; we’ll show you the products, the demo and the people behind them.`}
      actions={
        <>
          <Button href="#challenges" onBand>Find your challenge ↓</Button>
          <Button href="/contact" variant="ghost" onBand>Request a demo</Button>
        </>
      }
      aside={
        <ul className="sv-hero__list">
          {pillars.map((p) => (
            <li key={p.id}><SmartLink href={`/solutions/${p.id}`}><em>{p.n}</em>{p.name}<span aria-hidden="true">→</span></SmartLink></li>
          ))}
        </ul>
      }
      cta={false}
    >
      <Section id="challenges">
        <SectionHead eyebrow="Start with your challenge" title="What do you need to solve?" />
        <ChallengePicker panels={panels()} />
      </Section>

      <Journey journey={LIFE as never} icons={JOURNEY_ICONS.solutions!} />

      <Section tone="surface" id="pillars">
        <SectionHead eyebrow="Five solution pillars" title="Explore by pillar" />
        <div className="sv-pillars sv-pillars--5">
          {pillars.map((p) => (
            <PillarCard
              key={p.id}
              art={<Thumb spec={{ cls: p.id, icon: PILLAR_ICON[p.id] ?? "shield", lbl: `~sol-${p.id}` }} />}
              number={p.n}
              title={p.name}
              href={`/solutions/${p.id}`}
            >
              {p.pitch}
            </PillarCard>
          ))}
        </div>
        <div className="sv-deliver">
          <div>
            <b>Need a team to deliver it?</b>
            <span>Services · From assessment to 24/7 operations, by the team that makes the technology.</span>
          </div>
          <SmartLink href="/services">Explore services →</SmartLink>
        </div>
      </Section>

      <Section id="all-products">
        <SectionHead eyebrow="Full catalog" title={`All ${total} products, by pillar and group`} />
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
