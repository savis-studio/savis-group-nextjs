import type { Metadata } from "next";
import { Button, Hero, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main>
      <Hero eyebrow="Error 404" title="We can’t find that page." lead="It may have moved, or the link may be out of date.">
        <Button href="/" onBand>Back to home</Button>
        <Button href="/contact" variant="ghost" onBand>Contact us</Button>
      </Hero>
      <Section>
        <p style={{ margin: 0, color: "var(--muted)" }}>
          Try the main menu, or start from our <a href="/solutions" style={{ color: "var(--brand)" }}>solutions</a>.
        </p>
      </Section>
    </main>
  );
}
