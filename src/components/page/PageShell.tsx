import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button, CtaBanner, Hero, Section } from "@/components/ui";
import type { Crumb } from "@/components/ui/Hero";
import { breadcrumbLd } from "@/lib/seo";

export interface PageShellProps {
  /** Path of this page, used for the last breadcrumb in structured data. */
  path: string;
  title: ReactNode;
  accent?: string;
  eyebrow?: string;
  lead?: ReactNode;
  /** Levels between Home and this page, for example [{ label: "Solutions", href: "/solutions" }]. */
  trail?: Array<{ label: string; href: string }>;
  /** Short label for this page in the breadcrumb; defaults to the title when it is a string. */
  label?: string;
  aside?: ReactNode;
  /** Page-level buttons shown in the hero. */
  actions?: ReactNode;
  /** Closing "Talk to an expert" banner. On by default. */
  cta?: boolean;
  children?: ReactNode;
}

/**
 * Frame for every sub-page: hero with visible breadcrumb, breadcrumb structured data, the page body and the closing CTA.
 * Compose the body from Section / SectionHead; alternate default and surface tones down the page.
 */
export function PageShell({ path, title, accent, eyebrow, lead, trail = [], label, aside, actions, cta = true, children }: PageShellProps) {
  const current = label ?? (typeof title === "string" ? title : "");
  const crumbs: Crumb[] = [{ label: "Home", href: "/" }, ...trail, { label: current }];
  return (
    <main>
      <JsonLd data={breadcrumbLd([...trail.map((t) => ({ name: t.label, path: t.href })), { name: current, path }])} />
      <Hero title={title} accent={accent} eyebrow={eyebrow} lead={lead} crumbs={crumbs} aside={aside}>
        {actions}
      </Hero>
      {children}
      {cta && (
        <Section tone="surface">
          <CtaBanner title="Talk to a SAVIS solution expert" action={<Button href="/contact" onBand>Contact us</Button>}>
            From a first workshop to 24/7 operation.
          </CtaBanner>
        </Section>
      )}
    </main>
  );
}
