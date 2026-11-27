import type { Metadata } from "next";
import "@/styles/services.css";
import "@/styles/developers.css";
import { DeferredNetwork } from "@/components/home/Deferred";
import { PageShell } from "@/components/page/PageShell";
import { CodeWindow, DevGrid, DevNodes } from "@/components/services/DevParts";
import { Offerings } from "@/components/services/Offerings";
import { SequenceDiagram } from "@/components/services/SequenceDiagram";
import { Tabs } from "@/components/services/Tabs";
import { JumpBar, NextSteps } from "@/components/solutions/Blocks";
import { Button, Section, SectionHead } from "@/components/ui";
import { LineIcon } from "@/components/ui/LineIcon";
import { SmartLink } from "@/components/ui/SmartLink";
import { Thumb } from "@/components/ui/Thumb";
import { DEVELOPERS, DEVELOPER_APIS } from "@/data/developers";
import { hashToPath } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

const PATH = "/services/developers";

export const metadata: Metadata = buildMetadata({
  title: "Developers: signing, identity and eKYC APIs",
  description: "APIs and SDKs for partners who build Digital Trust as a Service on TrustCA QTSP and SAVIS Paperless: CSC API remote signing, FAPI 2.0, FIDO2 passkeys, eKYC and partner onboarding.",
  path: PATH,
});

/** Illustration of each "what you can build" card, in card order. */
const BUILD_ART = ["pen", "sign", "face", "key"];
const SANDBOX = "Request sandbox access";

export default function DevelopersPage() {
  const { hero, cert, jump, build, apis, apiRef, ux, flow } = DEVELOPERS;
  return (
    <PageShell
      path={PATH}
      className="sv-developers"
      eyebrow={hero.eyebrow}
      title={hero.title}
      label="Developers"
      trail={[{ label: "Services", href: "/services" }]}
      lead={hero.lead}
      backdrop={<DeferredNetwork />}
      aside={<CodeWindow sample={hero.code} note={hero.code.note} color />}
      actions={
        <>
          <Button href="/contact" onBand>{SANDBOX}</Button>
          <Button href="#dev-apis" variant="ghost" onBand>Explore the APIs ↓</Button>
          <ul className="sv-standards" aria-label="Standards">{hero.standards.map((s) => <li key={s}>{s}</li>)}</ul>
        </>
      }
      cta={false}
    >
      <div className="sv-cert">
        <div className="sv-wrap">
          <span className="sv-cert__ic"><LineIcon name="shield" /></span>
          <p><b>{cert.title}</b><span>{cert.text}</span></p>
          <SmartLink href="/trust-center">{cert.link}</SmartLink>
        </div>
      </div>

      <JumpBar pills links={jump.map((j) => ({ href: `#${j.id}`, label: j.label }))} actions={<Button href="/contact">{SANDBOX}</Button>} />

      <Section id="dev-build">
        <SectionHead eyebrow={build.eyebrow} title={build.title} />
        <ul className="sv-build">
          {build.cards.map((c, i) => (
            <li key={c.href}>
              <SmartLink href={hashToPath(c.href)} className="sv-story">
                <Thumb spec={{ cls: c.cls, icon: BUILD_ART[i] ?? "api" }} />
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </SmartLink>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="dev-apis" tone="surface">
        <Offerings
          eyebrow={apis.eyebrow}
          title={apis.title}
          items={DEVELOPER_APIS}
          badge={apis.badge}
          art={{ big: { cls: "identity", icon: "code" }, minis: DEVELOPER_APIS.slice(1, 4).map((a) => ({ cls: "identity", icon: a.icon })) }}
        />
      </Section>

      <Section id="dev-api" tone="surface">
        <SectionHead eyebrow={apiRef.eyebrow} title={apiRef.title} />
        <p className="sv-dev-lead">{apiRef.lead}</p>
        <Tabs
          label="APIs"
          items={apiRef.tabs.map((t) => ({
            id: t.id,
            tab: <><b>{t.title}</b><em>{t.org}</em></>,
            panel: (
              <>
                <p className="sv-api__lead"><DevNodes nodes={t.lead} /></p>
                <div className="sv-api">
                  <DevGrid table={t.table} label={t.title} className="sv-api__table" />
                  <div className="sv-api__samples">{t.examples.map((e) => <CodeWindow key={e.title} sample={e} />)}</div>
                </div>
              </>
            ),
          }))}
        />
        <div className="sv-sad">
          <div>
            <span className="sv-eyebrow">{apiRef.sad.eyebrow}</span>
            <h3>{apiRef.sad.title}</h3>
            <p><DevNodes nodes={apiRef.sad.lead} /></p>
          </div>
          <ol className="sv-sad__steps">
            {apiRef.sad.steps.map((s, i) => (
              <li key={s.title}><i aria-hidden="true">{i + 1}</i><b>{s.title}</b><span><DevNodes nodes={s.text} /></span></li>
            ))}
          </ol>
          <div className="sv-sad__flows">
            {apiRef.sad.flows.map((f) => <div key={f.title}><b>{f.title}</b><span><DevNodes nodes={f.text} /></span></div>)}
          </div>
        </div>
      </Section>

      <Section id="dev-ux">
        <SectionHead eyebrow={ux.eyebrow} title={ux.title} />
        <p className="sv-dev-lead"><DevNodes nodes={ux.lead} /></p>
        <Tabs
          label="User journeys"
          items={ux.tabs.map((t) => ({
            id: t.id,
            tab: <b>{t.title}</b>,
            panel: (
              <>
                <p className="sv-api__lead">{t.lead}</p>
                <ol className="sv-phones" tabIndex={0} aria-label={t.title}>
                  {t.steps.map((s, i) => (
                    <li key={s.title}>
                      <div className="sv-phone" aria-hidden="true"><div className="sv-phone__screen"><DevNodes nodes={s.screen} /></div></div>
                      <div className="sv-phone__cap"><i aria-hidden="true">{i + 1}</i><b>{s.title}</b><code>{s.call}</code></div>
                    </li>
                  ))}
                </ol>
              </>
            ),
          }))}
        />
      </Section>

      <Section id="dev-flow" tone="surface">
        <SectionHead eyebrow={flow.eyebrow} title={flow.title} />
        <p className="sv-dev-lead">{flow.lead}</p>
        <ol className="sv-onb">
          {flow.stages.map((s, i) => (
            <li key={s.title}>
              <div className="sv-onb__head"><i aria-hidden="true">{i + 1}</i><h3>{s.title}</h3><em>{s.time}</em></div>
              <div className="sv-onb__body">
                <span className="sv-onb__who">{s.who[0]}</span>
                <ul>{s.you.map((x) => <li key={x}>{x}</li>)}</ul>
                <span className="sv-onb__who">{s.who[1]}</span>
                <ul className="sv-onb__savis">{s.savis.map((x) => <li key={x}>{x}</li>)}</ul>
                <div className="sv-onb__std">{s.standards.map((x) => <span key={x}>{x}</span>)}</div>
              </div>
              {s.gate && <div className="sv-onb__gate"><span>Gate</span>{s.gate}</div>}
            </li>
          ))}
        </ol>
        <div className="sv-signing">
          <span className="sv-eyebrow">{flow.sequence.eyebrow}</span>
          <h3>{flow.sequence.title}</h3>
          <SequenceDiagram data={flow.sequence} />
          <p>{flow.sequence.note}</p>
        </div>
        <div className="sv-signing">
          <h3>{flow.requirements.title}</h3>
          <DevGrid table={flow.requirements} label={flow.requirements.title} className="sv-req" />
        </div>
      </Section>

      <NextSteps />
    </PageShell>
  );
}
