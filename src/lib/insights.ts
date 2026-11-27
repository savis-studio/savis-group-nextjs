import config from "@payload-config";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import { INSIGHTS_TAG } from "./cache-tags";
import { articleHtml, getNews as bundledNews, getNewsDetail as bundledDetail, type Cover, type NewsItem } from "./content";

export interface ArticleDetail extends NewsItem {
  tags: string[];
  sources: Array<{ name: string; url: string }>;
  /** CMS rich text, or null when the article comes from the bundled data. */
  body: SerializedEditorState | null;
  /** Bundled HTML, used only when `body` is null. */
  html: string;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const label = (iso: string) => {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

/** The cover relation, once populated. */
function toCover(value: unknown): Cover | undefined {
  const m = value as { url?: string | null; alt?: string | null; width?: number | null; height?: number | null; sizes?: { card?: { url?: string | null } } } | null | undefined;
  if (!m || typeof m !== "object" || !m.url) return undefined;
  return { src: m.sizes?.card?.url || m.url, full: m.url, alt: m.alt ?? "", width: m.width ?? undefined, height: m.height ?? undefined };
}

/** Reads every published article from the CMS; null when the CMS holds no article at all. Throws when the database is unreachable, so a failure is never cached. */
const readAll = unstable_cache(
  async (): Promise<ArticleDetail[] | null> => {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "insights",
      where: { _status: { equals: "published" } },
      limit: 500,
      sort: ["order", "-publishedAt"],
      depth: 1, // the cover, images and internal links inside the body
      pagination: false,
    });
    // Everything unpublished means an empty list, not a fall back to the bundled articles.
    if (res.docs.length === 0 && (await payload.count({ collection: "insights" })).totalDocs === 0) return null;
    return res.docs.map((d) => ({
      id: d.slug,
      cat: d.cat,
      type: d.type,
      date: d.dateLabel || (d.publishedAt ? label(d.publishedAt) : ""),
      iso: d.publishedAt ? d.publishedAt.slice(0, 10) : undefined,
      scene: d.scene,
      cover: toCover(d.cover),
      title: d.title,
      sum: d.summary,
      tags: (d.tags ?? []).map((t) => t.tag),
      sources: (d.sources ?? []).map((s) => ({ name: s.name, url: s.url })),
      body: d.body as unknown as SerializedEditorState,
      html: "",
    }));
  },
  ["insights"],
  { tags: [INSIGHTS_TAG], revalidate: 60 },
);

const bundled = (): ArticleDetail[] =>
  bundledNews().map((n) => {
    const d = bundledDetail(n.id)!;
    return { ...d, body: null, html: articleHtml(d.body) };
  });

/**
 * All articles. While `next build` runs there is no database, so the bundled mockup data is used; the first refresh
 * after deploy brings in the CMS content. Falls back to the bundled data when the CMS is empty or unreachable.
 */
export async function getArticles(): Promise<ArticleDetail[]> {
  if (process.env.NEXT_PHASE === "phase-production-build") return bundled();
  try {
    const all = await readAll();
    if (all) return all;
  } catch (err) {
    console.warn("CMS unavailable, using bundled articles:", err instanceof Error ? err.message : err);
  }
  return bundled();
}

export const getArticle = async (id: string) => (await getArticles()).find((a) => a.id === id);
/** Ids known at build time, for static generation. Articles added later render on demand. */
export const bundledArticleIds = () => bundledNews().map((n) => n.id);
