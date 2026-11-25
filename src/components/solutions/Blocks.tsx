import "@/styles/solutions.css";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { Chip } from "@/components/ui";
import { SmartLink } from "@/components/ui/SmartLink";

/** Numbered capability cards. */
export function FeatureGrid({ items }: { items: Array<[title: string, text: string]> }) {
  return (
    <div className="sv-feat">
      {items.map(([t, d], i) => (
        <div key={t} className="sv-feat__item">
          <i>{String(i + 1).padStart(2, "0")}</i>
          <b>{t}</b>
          <span>{d}</span>
        </div>
      ))}
    </div>
  );
}

/** Card with an eyebrow label and either a bullet list or standard chips. */
export function InfoCard({ label, items, chips }: { label: string; items?: string[]; chips?: string[] }) {
  return (
    <div className="sv-card sv-info">
      <span className="sv-eyebrow">{label}</span>
      {items && <ul className="sv-ticks">{items.map((x) => <li key={x}>{x}</li>)}</ul>}
      {chips && <div className="sv-info__chips">{chips.map((x) => <Chip key={x}>{x}</Chip>)}</div>}
    </div>
  );
}

const STEPS = ["Assess", "Design", "Pilot", "Roll out", "Operate"];

/** The five-step delivery roadmap. `notes` gives one sentence per step; without it the generic wording is used. */
export function Roadmap({ title, notes }: { title: string; notes?: string[] }) {
  const generic = [
    "Map current processes, systems, users and requirements.",
    "Agree the target architecture, integrations and security controls.",
    "Prove it with real users and data in a limited scope.",
    "Scale to all users, sites and channels in planned waves.",
    "Run, monitor and improve under agreed service levels.",
  ];
  return (
    <div className="sv-roadmap">
      <h3>{title}</h3>
      <ol>
        {STEPS.map((s, i) => (
          <li key={s}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            <b>{s}</b>
            <p>{notes?.[i] ?? generic[i]}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Question list; also emits FAQPage structured data. */
export function Faq({ items }: { items: Array<[question: string, answer: string]> }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
        }}
      />
      <div className="sv-faq">
        {items.map(([q, a], i) => (
          <details key={q} open={i === 0}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </>
  );
}

/** Row of pill links, for groups, industries and related items. */
export function LinkPills({ children }: { children: ReactNode }) {
  return <div className="sv-pills">{children}</div>;
}

/** In-page navigation bar: anchor links on the left, actions on the right. */
export function JumpBar({ title, links, actions }: { title?: string; links: Array<{ href: string; label: string }>; actions?: ReactNode }) {
  return (
    <nav className="sv-jump" aria-label="On this page">
      <div className="sv-wrap">
        {title && <b>{title}</b>}
        {links.map((l) => <a key={l.href} className="sv-jump__a" href={l.href}>{l.label}</a>)}
        {actions && <div className="sv-jump__act">{actions}</div>}
      </div>
    </nav>
  );
}

/** The four "next step" options shown at the end of solution pages. */
export function NextSteps() {
  const items: Array<[string, string]> = [
    ["Request a demo", "See it live with your use case"],
    ["Get a quote", "Pricing for your scope and volumes"],
    ["Datasheets & brochure", "Technical pack by email"],
    ["Talk to an expert", "Architecture and regulation advice"],
  ];
  return (
    <section className="sv-nextsteps">
      <div className="sv-wrap">
        <div>
          <span className="sv-eyebrow">Next step</span>
          <h2>Let’s talk about your project</h2>
          <p>Tell us what you need — our experts reply with a demo slot, a datasheet pack or a quote.</p>
        </div>
        <div className="sv-nextsteps__grid">
          {items.map(([t, d]) => (
            <SmartLink key={t} href="/contact"><b>{t}</b><span>{d}</span></SmartLink>
          ))}
        </div>
      </div>
    </section>
  );
}
