import type { Metadata } from "next";
import { DeferredNetwork } from "@/components/home/Deferred";
import { NewsTile } from "@/components/home/NewsTile";
import { BulletinRow, CaseStory, ExpertCard, LatestCard, ListCard } from "@/components/insights/InsightCards";
import { InsightListing, type ListingItem } from "@/components/insights/InsightListing";
import { InsightsTabs } from "@/components/insights/InsightsTabs";
import { InsightsViews, JumpPills } from "@/components/insights/InsightsViews";
import { MediaEnquiries } from "@/components/insights/MediaEnquiries";
import { JsonLd } from "@/components/seo/JsonLd";
import { NextSteps } from "@/components/solutions/Blocks";
import { Button, Hero, Section, SectionHead } from "@/components/ui";
import { SmartLink } from "@/components/ui/SmartLink";
import { Thumb } from "@/components/ui/Thumb";
import { getCaseCategories, getCases } from "@/lib/content";
import { NEWS_REGIONS, NEWS_TOPICS, newsFacets } from "@/lib/insight-facets";
import { EXPERT_SERIES, INSIGHT_GROUPS, newestFirst, type InsightGroup } from "@/lib/insight-groups";
import { getArticles, type ArticleDetail } from "@/lib/insights";
import { listArt } from "@/lib/list-art";
import { breadcrumbLd, buildMetadata } from "@/lib/seo";

const PATH = "/insights";

export const metadata: Metadata = buildMetadata({
  title: "Insights & News",
  description: "Research, reference architectures, regulation updates and press releases from SAVIS on digital identity, PKI, fraud prevention and post-quantum security.",
  path: PATH,
});

/** The order of the overview's rows. It differs from the tab bar: Blog comes before Regulation. */
const OVERVIEW: Array<InsightGroup["id"]> = ["news", "press", "insights", "regulation"];

const href = (n: ArticleDetail) => `/insights/${n.id}`;

/** A tab's articles. News and regulation are filed by topic and region, the rest by their category. */
function listing(group: InsightGroup, articles: ArticleDetail[]) {
  const rows = group.id === "bulletins";
  const byTopic = rows || group.id === "news" || group.id === "regulation";
  const filed = articles.map((n) => {
    const facets = byTopic ? newsFacets(n) : null;
    return { n, category: facets?.topic ?? n.cat, region: facets?.region };
  });
  const art = rows ? [] : listArt(filed.map(({ n, category }) => ({ category, title: n.title, text: `${n.title} ${n.sum}`, photo: Boolean(n.cover) })));
  const items: ListingItem[] = filed.map(({ n, category, region }, i) => ({
    id: n.id,
    category,
    region,
    text: [n.title, n.sum, category, region, n.date, ...n.sources.map((s) => s.name)].filter(Boolean).join(" "),
    node: rows ? <BulletinRow item={n} /> : <ListCard item={n} category={category} region={region} art={art[i]} />,
  }));
  const used = new Set(items.map((i) => i.category));
  const categories = byTopic ? NEWS_TOPICS.filter((t) => used.has(t))
    : [...used].filter((c): c is string => Boolean(c)).sort((a, b) => a.localeCompare(b));
  const regions = byTopic ? NEWS_REGIONS.filter((r) => items.some((i) => i.region === r)) : [];
  return <InsightListing items={items} categories={categories} regions={regions} rows={rows} />;
}

export default async function InsightsPage() {
  const all = await getArticles();
  const groups = INSIGHT_GROUPS
    .map((group) => ({ group, articles: all.filter(group.pick).sort(newestFirst) }))
    .filter((g) => g.articles.length > 0);
  const tabs = groups.map((g) => g.group);
  const byId = new Map(groups.map((g) => [g.group.id, g]));
  const rows = OVERVIEW.flatMap((id) => byId.get(id) ?? []);
  const bulletins = byId.get("bulletins");
  const expert = EXPERT_SERIES.flatMap(([slug, sector]) => {
    const item = all.find((n) => n.id === slug);
    return item ? [{ item, sector }] : [];
  });
  const latest = byId.get("news")?.articles[0] ?? rows[0]?.articles[0];
  const cases = getCases();
  const featured = cases.find((c) => c.featured) ?? cases[0];
  const categoryOf = new Map(getCaseCategories().map((c) => [c.id, c.name]));

  const pills = [
    ...rows.map((r) => ({ target: `in-${r.group.id}`, label: r.group.label })),
    { target: "in-cases", label: "Case Study" },
    ...(bulletins ? [{ target: "in-bulletins", label: bulletins.group.label }] : []),
  ];

  const hero = (
    <Hero
      className="sv-hero--overview"
      backdrop={<DeferredNetwork />}
      eyebrow="Insights"
      title="News, press releases, regulation and case studies."
      lead="What is changing in digital trust, what SAVIS is announcing, the rules that shape the market, and projects running in production."
      crumbs={[{ label: "Home", href: "/" }, { label: "Insights" }]}
      aside={
        <div className="sv-latest">
          {latest && <LatestCard href={href(latest)} caption="Latest news" title={latest.title} item={latest} />}
          {featured && <LatestCard href={`/customers/${featured.id}`} caption="Featured case study" title={featured.title} caseItem={featured} />}
        </div>
      }
    >
      {byId.has("news") && <Button href="#news" onBand>Read the news</Button>}
      <Button href="/customers" variant="ghost" onBand>Browse case studies</Button>
    </Hero>
  );

  // Rows alternate white and tinted; the expert row after the press releases is tinted too and does not count.
  let band = 0;
  const tone = () => (band++ % 2 ? "surface" : "default") as "surface" | "default";
  const more = (to: string, label: string) => <SmartLink className="sv-more" href={to}>{label} →</SmartLink>;

  const sections = rows.flatMap(({ group, articles }) => {
    const row = (
      <Section key={group.id} id={`in-${group.id}`} tone={tone()} className="sv-ovr">
        <SectionHead eyebrow={group.label} title={group.title}>{more(`#${group.id}`, group.more)}</SectionHead>
        <div className="sv-ovr__grid">{articles.slice(0, 4).map((n) => <NewsTile key={n.id} item={n} />)}</div>
      </Section>
    );
    if (group.id !== "press" || !expert.length) return [row];
    return [row, (
      <Section key="expert" tone="surface" className="sv-ovr sv-ovr--expert">
        <SectionHead eyebrow="Expert insights" title="AI security, quantum and side-channel attacks, by sector">
          {byId.has("insights") && more("#insights", "All blog posts")}
        </SectionHead>
        <div className="sv-xgrid">{expert.map((e) => <ExpertCard key={e.item.id} item={e.item} sector={e.sector} />)}</div>
      </Section>
    )];
  });

  const overview = (
    <>
      <JumpPills items={pills} />
      {sections}
      <Section id="in-cases" tone={tone()} className="sv-ovr">
        <SectionHead eyebrow="Case Study" title="Trust, deployed in production">{more("/customers", "All case studies")}</SectionHead>
        <div className="sv-ovr__grid sv-ovr__grid--six">
          {cases.slice(0, 8).map((c) => <CaseStory key={c.id} item={c} category={categoryOf.get(c.cat) ?? ""} />)}
        </div>
      </Section>
      {bulletins && (
        <Section id="in-bulletins" tone="surface" className="sv-ovr">
          <SmartLink href="#bulletins" className="sv-radar">
            <span className="sv-radar__txt">
              <span className="sv-eyebrow sv-eyebrow--on-band">{bulletins.group.label}</span>
              <h2>{bulletins.group.title}</h2>
              <p>{bulletins.group.intro}</p>
              <span className="sv-btn sv-btn--primary sv-btn--on-band">{bulletins.group.more} →</span>
            </span>
            <Thumb spec={{ cls: "identity", icon: "news", plain: true }} big />
          </SmartLink>
        </Section>
      )}
      <NextSteps />
    </>
  );

  const views = groups.map(({ group, articles }) => {
    // News from outside SAVIS closes with the press contact; the blog closes like other pages.
    const reported = group.id === "news" || group.id === "regulation" || group.id === "bulletins";
    return {
      id: group.id,
      hero: (
        <Hero
          key={group.id}
          backdrop={<DeferredNetwork />}
          eyebrow="Insights"
          title={group.label}
          lead={group.lead}
          crumbs={[{ label: "Home", href: "/" }, { label: "Insights", href: PATH }, { label: group.label }]}
          aside={
            <div className="sv-latest">
              <LatestCard href={href(articles[0])} caption={group.latest} title={articles[0].title} item={articles[0]} />
            </div>
          }
        >
          <Button href="/contact" onBand>Media enquiries</Button>
          {group.id !== "press" && byId.has("press") && <Button href="#press" variant="ghost" onBand>Press releases</Button>}
        </Hero>
      ),
      body: (
        <>
          <InsightsTabs groups={tabs} current={group.id} />
          <Section>
            <h2 className="sr-only">All {group.label}</h2>
            <p className="sv-view__intro">{group.intro}</p>
            {listing(group, articles)}
            {reported && <p className="sv-view__note">News items summarize reporting by third-party publishers; follow the source links for the original articles.</p>}
          </Section>
          {reported || group.id === "press" ? <MediaEnquiries /> : <NextSteps />}
        </>
      ),
    };
  });

  return (
    <main className="sv-insights">
      <JsonLd data={breadcrumbLd([{ name: "Insights", path: PATH }])} />
      <InsightsViews hero={hero} overview={overview} views={views} />
    </main>
  );
}
