import type { Metadata } from "next";
import { SALES_EMAIL, SITE_NAME, SITE_ORIGIN, SITE_TAGLINE, absoluteUrl } from "./site";

const TITLE_MAX = 60;
const DESCRIPTION_MAX = 160;

/** Shorten to a limit at a word boundary, with an ellipsis. */
export function clip(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return cut.slice(0, Math.max(cut.lastIndexOf(" "), max * 0.6)).replace(/[\s,;:.–—-]+$/, "") + "…";
}

export interface PageMeta {
  /** Page title without the site name; the layout template appends "| SAVIS Group". */
  title: string;
  description: string;
  /** Site path, for example "/products/trustpass". Becomes the canonical URL. */
  path: string;
  type?: "website" | "article";
  /** ISO date; sets article:published_time for articles. */
  published?: string;
  /** Social sharing picture (a site path or URL). */
  image?: { url: string; alt: string };
  /** Leave the page out of search results. */
  noindex?: boolean;
}

/**
 * Metadata for one page. The title is limited so that "title | SAVIS Group" fits 60 characters, the description 160.
 * Open Graph image: the segment's opengraph-image file is picked up by Next automatically.
 */
export function buildMetadata({ title, description, path, type = "website", published, noindex, image }: PageMeta): Metadata {
  const suffix = ` | ${SITE_NAME}`;
  const t = clip(title, TITLE_MAX - suffix.length);
  const d = clip(description, DESCRIPTION_MAX);
  const url = absoluteUrl(path);
  return {
    title: t,
    description: d,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      title: `${t}${suffix}`,
      description: d,
      locale: "en_US",
      ...(type === "article" && published ? { publishedTime: published } : {}),
      ...(image ? { images: [{ url: absoluteUrl(image.url), alt: image.alt }] } : {}),
    },
    twitter: { card: "summary_large_image", title: `${t}${suffix}`, description: d, ...(image ? { images: [absoluteUrl(image.url)] } : {}) },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

/* ---------- JSON-LD builders (schema.org) ---------- */

type Json = Record<string, unknown>;

export const organizationLd = (): Json => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_ORIGIN}/#organization`,
  name: SITE_NAME,
  url: SITE_ORIGIN,
  slogan: SITE_TAGLINE,
  logo: absoluteUrl("/brand/savis-mark.png"),
  contactPoint: [{ "@type": "ContactPoint", contactType: "sales", email: SALES_EMAIL }],
});

export const websiteLd = (): Json => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_ORIGIN}/#website`,
  url: SITE_ORIGIN,
  name: SITE_NAME,
  publisher: { "@id": `${SITE_ORIGIN}/#organization` },
});

export interface BreadcrumbItem { name: string; path: string }

/** Items run from the first level below Home to the current page; Home is added here. */
export const breadcrumbLd = (items: BreadcrumbItem[]): Json => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [{ name: "Home", path: "/" }, ...items].map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: absoluteUrl(it.path),
  })),
});

export const articleLd = (a: { title: string; description: string; path: string; published?: string }): Json => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: clip(a.title, 110),
  description: clip(a.description, DESCRIPTION_MAX),
  mainEntityOfPage: absoluteUrl(a.path),
  ...(a.published ? { datePublished: a.published } : {}),
  author: { "@id": `${SITE_ORIGIN}/#organization` },
  publisher: { "@id": `${SITE_ORIGIN}/#organization` },
});

export const softwareLd = (p: { name: string; description: string; path: string; category?: string }): Json => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: p.name,
  description: clip(p.description, DESCRIPTION_MAX),
  url: absoluteUrl(p.path),
  applicationCategory: p.category ?? "SecurityApplication",
  publisher: { "@id": `${SITE_ORIGIN}/#organization` },
});
