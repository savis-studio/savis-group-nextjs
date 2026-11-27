/**
 * Everything the resource library and the Resources menu show: datasheets, solution brochures and briefs, videos and
 * blog posts. Server only, so the illustration code stays out of the client bundle.
 */
import { pillars as catalogPillars } from "@/components/layout/catalog";
import { resourcesMenu, type Link, type ResourceKind } from "@/components/layout/nav-data";
import { FILMS, type FilmId } from "@/data/films";
import { getDetailSlugs, getPillars, getProduct, getProductDetail, getUseCases, pillarOfProduct, type Product, type UseCase } from "./content";
import { newestFirst } from "./insight-groups";
import type { ArticleDetail } from "./insights";
import { newsThumb, PILLAR_ICON, productThumb, thumbArt, useCaseThumb } from "./thumbs";

/** The picture of a resource card: a drawing, a photo, or a document cover. */
export type ResourceArt =
  | { kind: "art"; cls: string; svg: string }
  | { kind: "photo"; src: string }
  | { kind: "cover"; pal: string; eyebrow?: string; title: string; svg?: string };

export interface ResourceCard {
  tag: string;
  title: string;
  text: string;
  cta: string;
  art: ResourceArt;
  /** Where the card leads. A video card has `film` instead and opens the player. */
  href?: string;
  film?: FilmId;
}

export interface ResourceSet {
  id: ResourceKind | "featured";
  heading: string;
  more: Link;
  cards: ResourceCard[];
}

export const pillarShort = (id: string) => catalogPillars.find((p) => p.id === id)?.short ?? "";

/** Only products with a detail record have a datasheet; they are listed in the order of those records. */
export const datasheetProducts = (): Product[] => getDetailSlugs().flatMap((slug) => getProduct(slug) ?? []);

export function datasheetArt(p: Product): ResourceArt {
  const cls = pillarOfProduct(p)?.id ?? "identity";
  return { kind: "art", cls, svg: thumbArt({ ...productThumb({ slug: p.slug, name: p.name, pillar: cls }), plain: true }) };
}

export const briefArt = (u: UseCase): ResourceArt => ({ kind: "art", cls: u.pillar, svg: thumbArt(useCaseThumb(u)) });

export const brochureArt = (pillar: { id: string; name: string }): ResourceArt => ({
  kind: "cover", pal: pillar.id, eyebrow: "Solution brochure", title: pillar.name,
  svg: thumbArt({ cls: pillar.id, icon: PILLAR_ICON[pillar.id] ?? "shield", lbl: `~pillar-${pillar.id}`, plain: true }),
});

/** The large line drawing on a report cover, by palette. */
const mark = (shapes: string) => `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${shapes}</svg>`;
const REPORT_MARKS: Record<string, string> = {
  wallet: mark('<path d="M50 14 90 33 50 52 10 33z"/><path d="m10 50 40 19 40-19M10 67l40 19 40-19"/>'),
  ai: mark('<circle cx="14" cy="28" r="6"/><circle cx="14" cy="74" r="6"/><circle cx="50" cy="17" r="6"/><circle cx="50" cy="51" r="8"/><circle cx="50" cy="85" r="6"/><circle cx="86" cy="34" r="6"/><circle cx="86" cy="68" r="6"/><path d="m20 26 24-8M19 32l24 15M19 70l24-15M20 76l24 8M56 20l24 12M57 48l23-12M57 55l23 11M56 82l24-12"/>'),
  cyber: mark('<circle cx="50" cy="50" r="8" fill="currentColor"/><ellipse cx="50" cy="50" rx="44" ry="17"/><ellipse cx="50" cy="50" rx="44" ry="17" transform="rotate(60 50 50)"/><ellipse cx="50" cy="50" rx="44" ry="17" transform="rotate(120 50 50)"/>'),
};

export function postArt(n: ArticleDetail): ResourceArt {
  if (n.cover) return { kind: "photo", src: n.cover.src };
  const spec = newsThumb(n);
  return { kind: "art", cls: spec.cls, svg: thumbArt(spec) };
}

export const blogPosts = (articles: ArticleDetail[]) => articles.filter((n) => n.type === "insight").sort(newestFirst);

const filmCard = (id: FilmId): ResourceCard => ({ tag: "Video", title: FILMS[id].title, text: FILMS[id].text, cta: "Watch the video →", film: id, art: { kind: "photo", src: FILMS[id].poster } });

function datasheetCard(slug: string): ResourceCard[] {
  const p = getProduct(slug);
  if (!p || !getProductDetail(slug)) return [];
  return [{ tag: "Datasheet", title: p.name, text: p.desc, cta: "View datasheet →", href: `#ds-${slug}`, art: datasheetArt(p) }];
}

const brochureCard = (p: { id: string; name: string; pitch: string }): ResourceCard => ({ tag: "Brochure", title: p.name, text: p.pitch, cta: "Read the brochure →", href: `#pillar-${p.id}`, art: brochureArt(p) });

/** The three cards shown beside the Resources menu: the featured set, then one set per category. */
export function resourceSets(articles: ArticleDetail[]): ResourceSet[] {
  const { featured, categories, all } = resourcesMenu;
  const pillars = getPillars();
  const cards: Record<ResourceKind, ResourceCard[]> = {
    reports: resourcesMenu.reports.map((r) => ({ tag: r.kind, title: r.title, text: r.text, cta: `Request the ${r.kind.toLowerCase()} →`, href: "#contact", art: { kind: "cover", pal: r.pal, title: r.tag, svg: REPORT_MARKS[r.pal] } })),
    datasheets: resourcesMenu.datasheets.flatMap(datasheetCard),
    brochures: pillars.slice(0, 3).map(brochureCard),
    briefs: getUseCases().slice(0, 3).map((u) => ({ tag: "Solution brief", title: u.name, text: u.tagline, cta: "Read the brief →", href: `#uc-${u.id}`, art: briefArt(u) })),
    videos: [filmCard("brand"), filmCard("services")],
    blog: blogPosts(articles).slice(0, 3).map((n) => ({ tag: "Blog", title: n.title, text: n.sum, cta: "Read the post →", href: `/insights/${n.id}`, art: postArt(n) })),
  };
  const cyber = pillars.find((p) => p.id === featured.brochure);
  return [
    { id: "featured", heading: featured.panel, more: all, cards: [filmCard("brand"), ...datasheetCard(featured.datasheet), ...(cyber ? [brochureCard(cyber)] : [])] },
    ...categories.map((c) => ({ id: c.id, heading: c.panel, more: c.more, cards: cards[c.id] })),
  ];
}
