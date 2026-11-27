/**
 * Reports and whitepapers on the website: only what has been published in the CMS. Unlike articles there is no bundled
 * copy, so nothing shows before a person publishes it (and nothing during `next build`, which has no database).
 */
import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import type { Report } from "@/payload-types";
import { REPORTS_TAG } from "./cache-tags";
import { REPORT_KINDS } from "./report-options";
import { sanitizeHtml } from "./sanitize";

export interface ReportSummary {
  slug: string;
  title: string;
  subtitle: string;
  /** "Report" or "Whitepaper". */
  kind: string;
  topic: string;
  palette: string;
  series?: { name: string; part?: number; parts?: number; summary?: string };
  featured: boolean;
  /** Year on the cover, when the publication date, the credit line or the slug gives one. */
  year?: string;
}

export interface ReportDetail extends ReportSummary {
  hook?: string;
  lead: string;
  credit?: string;
  stats: Array<{ value: string; label: string }>;
  why: string[];
  editions: Array<{ audience: string; text: string }>;
  learn: string[];
  /** A picture from Media, or filtered diagram markup. */
  previews: Array<{ caption: string; image?: { src: string; alt: string }; svg?: string }>;
  products: string[];
  chapters: string[];
  questions: { heading?: string; intro?: string; items: Array<{ title: string; text: string }> };
  path: { title?: string; text?: string };
  board: string[];
}

type SummaryFields = Pick<Report, "slug" | "title" | "subtitle" | "kind" | "topic" | "palette" | "series" | "featured" | "publishedAt" | "credit">;

function summary(d: SummaryFields): ReportSummary {
  const s = d.series;
  return {
    slug: d.slug,
    title: d.title,
    subtitle: d.subtitle,
    kind: REPORT_KINDS.find((k) => k.value === d.kind)?.label ?? "Report",
    topic: d.topic,
    palette: d.palette,
    series: s?.name ? { name: s.name, part: s.part ?? undefined, parts: s.parts ?? undefined, summary: s.summary ?? undefined } : undefined,
    featured: !!d.featured,
    year: d.publishedAt?.slice(0, 4) ?? `${d.credit ?? ""} ${d.slug}`.match(/\b20\d\d\b/)?.[0],
  };
}

function toPreview(p: NonNullable<Report["previews"]>[number]): ReportDetail["previews"] {
  const media = p.image && typeof p.image === "object" ? p.image : undefined;
  if (media?.url) return [{ caption: p.caption, image: { src: media.sizes?.card?.url || media.url, alt: media.alt } }];
  const svg = p.diagram ? sanitizeHtml(p.diagram).trim() : "";
  return svg ? [{ caption: p.caption, svg }] : [];
}

const published = { _status: { equals: "published" } } as const;
const building = () => process.env.NEXT_PHASE === "phase-production-build";

/** Throws when the database is unreachable, so a failure is never cached. */
const readList = unstable_cache(
  async (): Promise<ReportSummary[]> => {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "reports",
      where: published,
      sort: ["order", "title"],
      depth: 0,
      pagination: false,
      select: { slug: true, title: true, subtitle: true, kind: true, topic: true, palette: true, series: true, featured: true, publishedAt: true, credit: true },
    });
    return res.docs.map((d) => summary(d as SummaryFields));
  },
  ["report-list"],
  { tags: [REPORTS_TAG], revalidate: 60 },
);

const readOne = unstable_cache(
  async (slug: string): Promise<ReportDetail | null> => {
    const payload = await getPayload({ config });
    const res = await payload.find({ collection: "reports", where: { and: [published, { slug: { equals: slug } }] }, limit: 1, depth: 1 });
    const d = res.docs[0];
    if (!d) return null;
    return {
      ...summary(d),
      hook: d.hook ?? undefined,
      lead: d.lead,
      credit: d.credit ?? undefined,
      stats: (d.stats ?? []).map(({ value, label }) => ({ value, label })),
      why: (d.why ?? []).map((x) => x.text),
      editions: (d.editions ?? []).map(({ audience, text }) => ({ audience, text })),
      learn: (d.learn ?? []).map((x) => x.text),
      previews: (d.previews ?? []).flatMap(toPreview),
      products: d.products ?? [],
      chapters: (d.chapters ?? []).map((c) => c.title),
      questions: {
        heading: d.questions?.heading ?? undefined,
        intro: d.questions?.intro ?? undefined,
        items: (d.questions?.items ?? []).map(({ title, text }) => ({ title, text })),
      },
      path: { title: d.path?.title ?? undefined, text: d.path?.text ?? undefined },
      board: (d.board ?? []).map((x) => x.text),
    };
  },
  ["report"],
  { tags: [REPORTS_TAG], revalidate: 60 },
);

/** Published reports in library order; empty while building or when the CMS cannot be read. */
export async function getReports(): Promise<ReportSummary[]> {
  if (building()) return [];
  try {
    return await readList();
  } catch (err) {
    console.warn("CMS unavailable, showing no reports:", err instanceof Error ? err.message : err);
    return [];
  }
}

/** One published report, or null. Throws when the CMS cannot be read, so a cached page stays instead of turning into a 404. */
export async function getReport(slug: string): Promise<ReportDetail | null> {
  return building() ? null : readOne(slug);
}

export const reportPath = (slug: string) => `/resources/reports/${slug}`;
