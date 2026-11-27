import "@/styles/arch-graph.css";
import "@/styles/article.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeferredGlobe, DeferredNetwork } from "@/components/home/Deferred";
import { ListCard } from "@/components/insights/InsightCards";
import { MEDIA_EMAIL } from "@/components/insights/MediaEnquiries";
import { ArticleBody } from "@/components/page/ArticleBody";
import { ArticleRichText } from "@/components/page/ArticleRichText";
import { PageShell } from "@/components/page/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { Section, SectionHead } from "@/components/ui";
import { SmartLink } from "@/components/ui/SmartLink";
import { Thumb } from "@/components/ui/Thumb";
import { getOffices } from "@/lib/content";
import { newsFacets } from "@/lib/insight-facets";
import { INSIGHT_GROUPS, newestFirst } from "@/lib/insight-groups";
import { bundledArticleIds, getArticle, getArticles, type ArticleDetail } from "@/lib/insights";
import { listArt } from "@/lib/list-art";
import { articleLd, buildMetadata } from "@/lib/seo";
import { newsThumb } from "@/lib/thumbs";

// Articles from the build are prerendered; ones added in the CMS later render on first visit, then refresh with ISR.
export const generateStaticParams = () => bundledArticleIds().map((id) => ({ id }));

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = await getArticle((await params).id);
  if (!n) return {};
  return buildMetadata({ title: n.title, description: n.sum, path: `/insights/${n.id}`, type: "article", published: n.iso, image: n.cover && { url: n.cover.full, alt: n.cover.alt } });
}

/** A long title cut at a word, for the breadcrumb. */
const shortTitle = (t: string) => (t.length > 64 ? `${t.slice(0, t.lastIndexOf(" ", 62))}…` : t);

/** Right side of the hero: the cover photo, the globe for worldwide stories, otherwise the article's illustration. */
function HeroArt({ item }: { item: ArticleDetail }) {
  const { cover } = item;
  if (cover) {
    // The photo keeps its own shape so nothing in a wide one is cut off; a tall one is trimmed to 4:3.
    const ratio = cover.width && cover.height ? Math.max(4 / 3, cover.width / cover.height) : 4 / 3;
    return (
      <figure className="sv-arthero" style={{ aspectRatio: ratio }}>
        <img src={cover.full} alt={cover.alt} fetchPriority="high" />
      </figure>
    );
  }
  if (item.scene === "globe") return <DeferredGlobe offices={getOffices()} label="Globe showing SAVIS offices connected to Hanoi headquarters" />;
  return <div className="sv-arthero" aria-hidden="true"><Thumb spec={{ ...newsThumb(item), left: undefined }} big /></div>;
}

export default async function ArticlePage({ params }: Props) {
  const n = await getArticle((await params).id);
  if (!n) notFound();
  const path = `/insights/${n.id}`;
  const group = INSIGHT_GROUPS.find((g) => g.pick(n));
  const latest = (await getArticles()).filter((x) => x.id !== n.id).sort(newestFirst).slice(0, 3);
  // As in the mockup, these pictures follow the words alone, so no category is passed.
  const art = listArt(latest.map((x) => ({ category: "", title: x.title, text: `${x.title} ${x.sum}`, photo: Boolean(x.cover) })));
  const sources = [...new Map(n.sources.map((s) => [s.url, s])).values()];
  // News names its sources in a strip under the hero; other articles list them after the text.
  const strip = n.type === "news" && sources.length > 0;
  const facets = strip ? newsFacets(n) : null;
  const link = (s: ArticleDetail["sources"][number]) => <a href={s.url} rel="noopener noreferrer nofollow" target="_blank">{s.name}</a>;

  return (
    <PageShell
      path={path}
      className="sv-insights sv-article"
      eyebrow={[n.cat, n.date].filter(Boolean).join(" · ")}
      title={n.title}
      shortLabel={shortTitle(n.title)}
      lead={n.sum}
      backdrop={<DeferredNetwork />}
      aside={<HeroArt item={n} />}
      trail={[{ label: "Insights", href: "/insights" }, ...(group ? [{ label: group.label, href: `/insights#${group.id}` }] : [])]}
      cta={false}
    >
      <JsonLd data={articleLd({ title: n.title, description: n.sum, path, published: n.iso })} />
      {facets && (
        <div className="sv-srcbar">
          <div className="sv-wrap">
            <b>News · {facets.region} · {facets.topic}</b>
            <span>Sources: {sources.map((s, i) => <span key={s.url}>{i > 0 && ", "}{link(s)}</span>)}</span>
          </div>
        </div>
      )}
      <Section>
        {n.body ? (
          <ArticleRichText data={n.body} />
        ) : n.html ? (
          <ArticleBody html={n.html} />
        ) : (
          <div className="article"><p>{n.sum}</p></div>
        )}
        {!strip && sources.length > 0 && (
          <aside className="sv-art-extra">
            <h2>Sources</h2>
            <ul>{sources.map((s) => <li key={s.url}>{link(s)}</li>)}</ul>
          </aside>
        )}
        <p className="sv-art-contact">Media contact: <a href={`mailto:${MEDIA_EMAIL}`}>{MEDIA_EMAIL}</a></p>
      </Section>
      {latest.length > 0 && (
        <Section tone="surface" className="sv-keep">
          <SectionHead eyebrow="More news" title="Keep reading">
            <SmartLink className="sv-more" href="/insights">All news →</SmartLink>
          </SectionHead>
          <div className="sv-lgrid">
            {latest.map((x, i) => <div key={x.id}><ListCard item={x} category={x.cat} art={art[i]} sources={false} /></div>)}
          </div>
        </Section>
      )}
    </PageShell>
  );
}
