import {
  Button, CtaBanner, Hero, PillarCard, Section, SectionHead, SiteFooter, SiteHeader,
} from "@/components/ui";

const nav = [
  { label: "Solutions", href: "/solutions" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "News", href: "/news" },
];

export default function Home() {
  return (
    <>
      <SiteHeader nav={nav} current="Solutions" />
      <main>
        <Hero
          eyebrow="Trusted Digital Infrastructure for a Smarter World"
          title="Identity, trust and secure platforms for"
          accent="nations."
          lead="SAVIS Group builds the digital infrastructure that governments, banks and enterprises rely on."
        >
          <Button href="/solutions" onBand>Explore Solutions</Button>
          <Button href="/contact" variant="ghost" onBand>Contact us</Button>
        </Hero>
        <Section>
          <SectionHead eyebrow="What we do" title="Three pillars of digital trust" />
          <div style={{ display: "grid", gap: "var(--space-18)", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))" }}>
            <PillarCard lead number="01" title="Digital identity" subtitle="Identity and trust services" href="/solutions">
              Secure identity for citizens and organisations.
            </PillarCard>
            <PillarCard number="02" title="Secure platforms" subtitle="Cloud and data" href="/solutions">
              Resilient platforms for critical workloads.
            </PillarCard>
            <PillarCard number="03" title="Cyber security" subtitle="Protect and respond" href="/solutions">
              Continuous protection across the digital estate.
            </PillarCard>
          </div>
        </Section>
        <Section tone="surface">
          <CtaBanner title="Talk to an Expert" action={<Button href="/contact" onBand>Contact us</Button>}>
            Tell us about your organisation and we will get back to you.
          </CtaBanner>
        </Section>
      </main>
      <SiteFooter
        tagline="Trusted Digital Infrastructure for a Smarter World"
        columns={[{ heading: "Company", links: [{ label: "About", href: "/about" }, { label: "News", href: "/news" }] }]}
        legal="© 2026 SAVIS Group"
      />
    </>
  );
}
