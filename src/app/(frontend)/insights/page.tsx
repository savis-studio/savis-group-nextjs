import type { Metadata } from "next";
import { NewsTile } from "@/components/home/NewsTile";
import { CaseStory, ExpertCard, LatestCard, ListCard } from "@/components/insights/InsightCards";
import { InsightListing, type ListingItem } from "@/components/insights/InsightListing";
import { InsightsTabs } from "@/components/insights/InsightsTabs";
import { InsightsViews, JumpPills } from "@/components/insights/InsightsViews";
import { JsonLd } from "@/components/seo/JsonLd";
import { NextSteps } from "@/components/solutions/Blocks";
import { Button, Hero, Section, SectionHead } from "@/components/ui";
import { SmartLink } from "@/components/ui/SmartLink";
import { getCaseCategories, getCases } from "@/lib/content";
import { NEWS_REGIONS, NEWS_TOPICS, newsFacets } from "@/lib/insight-facets";
import { EXPERT_SERIES, INSIGHT_GROUPS, newestFirst, type InsightGroup } from "@/lib/insight-groups";
import { getArticles, type ArticleDetail } from "@/lib/insights";
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

/** A tab's cards. News and regulation are filed by topic and region, the rest by their category. */
function listing(group: InsightGroup, articles: ArticleDetail[]) {
  const byTopic = group.id === "news" || group.id === "regulation";
  const items: ListingItem[] = articles.map((n) => {
    const facets = byTopic ? newsFacets(n) : null;
    const category = facets?.topic ?? n.cat;
    return {
      id: n.id,
      category,
      region: facets?.region,
      text: [n.title, n.sum, category, facets?.region, n.date, ...n.sources.map((s) => s.name)].filter(Boolean).join(" "),
      node: <ListCard item={n} category={category} region={facets?.region} />,
    };
  });
  const used = new Set(items.map((i) => i.category));
  // Regulation is one subject, so the design offers no category filter there.
  const categories = group.id === "regulation" ? []
    : byTopic ? NEWS_TOPICS.filter((t) => used.has(t))
    : [...used].filter((c): c is string => Boolean(c)).sort((a, b) => a.localeCompare(b));
  const regions = byTopic ? NEWS_REGIONS.filter((r) => items.some((i) => i.region === r)) : [];
  return <InsightListing items={items} categories={categories} regions={regions} />;
}

export default async function InsightsPage() {
  const all = await getArticles();
  const groups = INSIGHT_GROUPS
    .map((group) => ({ group, articles: all.filter(group.pick).sort(newestFirst) }))
    .filter((g) => g.articles.length > 0);
  const tabs = groups.map((g) => g.group);
  const byId = new Map(groups.map((g) => [g.group.id, g]));
  const rows = OVERVIEW.flatMap((id) => byId.get(id) ?? []);
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
  ];

  const hero = (
    <Hero
      eyebrow="Insights & News"
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

  // Rows alternate white and tinted, counting the expert row, which sits after the press releases.
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
      <Section key="expert" tone={tone()} className="sv-ovr">
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
    </>
  );

  const views = groups.map(({ group, articles }) => ({
    id: group.id,
    hero: (
      <Hero
        key={group.id}
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
        </Section>
      </>
    ),
  }));

  return (
    <main>
      <JsonLd data={breadcrumbLd([{ name: "Insights", path: PATH }])} />
      <InsightsViews hero={hero} overview={overview} views={views} />
      <NextSteps />
    </main>
  );
}
