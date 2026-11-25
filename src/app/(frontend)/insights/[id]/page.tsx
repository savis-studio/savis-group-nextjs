import "@/styles/article.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsTile } from "@/components/home/NewsTile";
import { ArticleBody } from "@/components/page/ArticleBody";
import { ArticleRichText } from "@/components/page/ArticleRichText";
import { OrbitDiagram } from "@/components/ui/HeroDiagrams";
import { INSIGHT_GROUPS } from "@/lib/insight-groups";
import { PageShell } from "@/components/page/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { NextSteps } from "@/components/solutions/Blocks";
import { Button, Chip, Section, SectionHead } from "@/components/ui";
import { bundledArticleIds, getArticle, getArticles } from "@/lib/insights";
import { articleLd, buildMetadata } from "@/lib/seo";

// Articles from the build are prerendered; ones added in the CMS later render on first visit, then refresh with ISR.
export const generateStaticParams = () => bundledArticleIds().map((id) => ({ id }));

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = await getArticle((await params).id);
  if (!n) return {};
  return buildMetadata({ title: n.title, description: n.sum, path: `/insights/${n.id}`, type: "article", published: n.iso });
}

export default async function ArticlePage({ params }: Props) {
  const n = await getArticle((await params).id);
  if (!n) notFound();
  const path = `/insights/${n.id}`;
  const group = INSIGHT_GROUPS.find((g) => g.pick(n));
  const related = (await getArticles()).filter((x) => x.cat === n.cat && x.id !== n.id).slice(0, 3);

  return (
    <PageShell
      path={path}
      eyebrow={`${n.cat} · ${n.date}`}
      title={n.title}
      lead={n.sum}
      aside={<OrbitDiagram />}
      trail={[{ label: "Insights", href: "/insights" }, ...(group ? [{ label: group.label, href: `/insights#${group.id}` }] : [])]}
      actions={<Button href="/contact" onBand>Talk to our team</Button>}
      cta={false}
    >
      <JsonLd data={articleLd({ title: n.title, description: n.sum, path, published: n.iso })} />
      <Section>
        {n.body ? (
          <ArticleRichText data={n.body} />
        ) : n.html ? (
          <ArticleBody html={n.html} />
        ) : (
          <p style={{ maxWidth: 820, margin: "0 auto" }}>{n.sum}</p>
        )}
        {n.tags.length > 0 && (
          <div style={{ maxWidth: 820, margin: "var(--space-30) auto 0", display: "flex", gap: 8, flexWrap: "wrap" }}>
            {n.tags.map((t) => <Chip key={t}>{t}</Chip>)}
          </div>
        )}
        {n.sources.length > 0 && (
          <aside style={{ maxWidth: 820, margin: "var(--space-30) auto 0" }}>
            <h2 style={{ fontSize: 16, margin: "0 0 8px" }}>Sources</h2>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {n.sources.map((s) => (
                <li key={s.url}><a href={s.url} rel="noopener noreferrer nofollow" target="_blank">{s.name}</a></li>
              ))}
            </ul>
          </aside>
        )}
      </Section>
      {related.length > 0 && (
        <Section tone="surface">
          <SectionHead eyebrow="Keep reading" title={`More in ${n.cat}`} />
          <div className="sv-cols3">{related.map((x) => <NewsTile key={x.id} item={x} />)}</div>
        </Section>
      )}
      <NextSteps />
    </PageShell>
  );
}
