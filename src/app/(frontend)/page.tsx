import type { Metadata } from "next";
import "@/styles/home.css";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, organizationLd, websiteLd } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import { AudienceTabs } from "@/components/home/AudienceTabs";
import { CaseCard } from "@/components/home/CaseCard";
import { FilmSection } from "@/components/home/FilmSection";
import { HomeHero } from "@/components/home/HomeHero";
import { NewsTile } from "@/components/home/NewsTile";
import { StandardsMarquee } from "@/components/home/StandardsMarquee";
import { Button, PillarCard, Section, SectionHead } from "@/components/ui";
import { SmartLink } from "@/components/ui/SmartLink";
import { Thumb } from "@/components/ui/Thumb";
import { getArticles } from "@/lib/insights";
import {
  getAudienceIcons, getAudiences, getCase, getCaseCategories, getOffices, getPillars, getStandards,
} from "@/lib/content";

const PILLAR_ICON: Record<string, string> = { identity: "face", cyber: "shield", gov: "gov", finance: "root", ai: "chip" };

export const metadata: Metadata = {
  ...buildMetadata({ title: SITE_TAGLINE, description: SITE_DESCRIPTION, path: "/" }),
  // The home title stands alone; the layout template would repeat the site name.
  title: { absolute: `${SITE_NAME} — Digital Trust, Identity & Secure Platforms` },
};

const STATS = [
  { value: "22+", label: "years of digital trust" },
  { value: "200+", label: "international partners" },
  { value: "5,000+", label: "customers" },
];

/** Curated for the home page, in display order. */
const FEATURED_CASES = ["neac-national-pki", "neac-webtrust-ca", "sbv-rootca"];
const FEATURED_NEWS: Array<[id: string, tone: string]> = [
  ["trustca-eidas-certification-what-it-means", "amber"],
  ["asocio-smart-city-2026", "indigo"],
  ["auth-rules-2025-2028", "blue"],
  ["one-core-national-profiles", "teal"],
];

/** Set to the video's URL (for example "/media/brand-film.mp4") to show the film section. The file is not in the repo yet. */
const BRAND_FILM: { src: string; poster?: string; caption: string } | null = null;

export default async function Home() {
  const articles = await getArticles();
  const pillars = getPillars();
  const categories = new Map(getCaseCategories().map((c) => [c.id, c.name]));
  const cases = FEATURED_CASES.flatMap((id) => getCase(id) ?? []);
  const news = FEATURED_NEWS.flatMap(([id, tone]) => {
    const item = articles.find((a) => a.id === id);
    return item ? [{ item, tone }] : [];
  });

  return (
    <main>
      <JsonLd data={[organizationLd(), websiteLd()]} />
      <HomeHero offices={getOffices()} stats={STATS} />
      <StandardsMarquee items={getStandards()} />

      <section className="sv-aud" id="audience" aria-labelledby="aud-h">
        <div className="sv-wrap">
          <div className="sv-aud__head">
            <div>
              <span className="sv-eyebrow sv-eyebrow--rule">Who are you?</span>
              <h2 id="aud-h">Find what matters to you</h2>
            </div>
            <p>Choose your organisation to see the solutions, use cases and case studies that fit it best.</p>
          </div>
          <AudienceTabs audiences={getAudiences()} icons={getAudienceIcons()} />
        </div>
      </section>

      <Section>
        <SectionHead eyebrow="Solutions & Products" title="Five pillars. One trust ecosystem.">
          <SmartLink className="sv-home__more" href="/solutions">Product catalog →</SmartLink>
        </SectionHead>
        <div className="sv-home__pillars">
          {pillars.map((p, i) => (
            <PillarCard key={p.id} art={<Thumb spec={{ cls: p.id, icon: PILLAR_ICON[p.id] ?? "shield", lbl: `~home-${p.id}` }} />} number={p.n} title={p.name} href={`/solutions/${p.id}`} tags={p.tags}>
              {p.pitch}
            </PillarCard>
          ))}
        </div>
      </Section>

      {BRAND_FILM && (
        <section className="sv-section sv-home__film">
          <div className="sv-wrap">
            <SectionHead eyebrow="SAVIS in motion" title="Watch the SAVIS Group video" />
            <FilmSection {...BRAND_FILM} />
          </div>
        </section>
      )}

      <Section tone="surface">
        <SectionHead eyebrow="Customers" title="Trust, deployed in production.">
          <SmartLink className="sv-home__more" href="/customers">View Success Stories →</SmartLink>
        </SectionHead>
        <div className="sv-home__grid3">
          {cases.map((c) => <CaseCard key={c.id} item={c} category={categories.get(c.cat) ?? ""} />)}
        </div>
      </Section>

      <Section>
        <SectionHead eyebrow="Insights" title="News and press releases.">
          <SmartLink className="sv-home__more" href="/insights">Read Insights →</SmartLink>
        </SectionHead>
        <div className="sv-home__grid4">
          {news.map(({ item, tone }) => <NewsTile key={item.id} item={item} tone={tone} />)}
        </div>
      </Section>

      <section className="sv-section sv-home__cta">
        <div className="sv-wrap">
          <div>
            <span className="sv-eyebrow">Let’s build trust together</span>
            <h2>Talk to a SAVIS solution expert</h2>
            <p>From a first workshop to 24/7 operation — in Vietnam and across ten offices worldwide.</p>
          </div>
          <div className="sv-home__cta-actions">
            <Button href="/contact">Contact sales</Button>
            <Button href="mailto:sales@savis-group.com" variant="ghost" onBand>sales@savis-group.com</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
