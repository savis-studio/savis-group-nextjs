import audience from "@/data/mockup/audience.json";
import cases from "@/data/mockup/cases.json";
import graphics from "@/data/mockup/graphics.json";
import news from "@/data/mockup/news.json";
import pillars from "@/data/mockup/pillars.json";
import { hashToPath } from "./routes";

/** Typed access to the mockup data. Phase 1 reads JSON files; later this can move to the CMS without changing callers. */

export interface Pillar { id: string; n: string; name: string; vi: string; slug: string; pitch: string; tags: string[] }
export interface CaseStudy { id: string; cat: string; featured?: boolean; client: string; country: string; title: string; summary: string }
export interface CaseCategory { id: string; name: string }
export interface NewsItem { id: string; cat: string; type: string; date: string; iso?: string; title: string; sum: string }
export interface AudienceLink { kind: string; label: string; href: string }
export interface Audience {
  id: string; label: string; title: string; lead: string;
  page: { label: string; href: string };
  links: AudienceLink[];
}
export interface Office { name: string; lat: number; lon: number; hq: boolean }

export const getPillars = (): Pillar[] => pillars as Pillar[];

export const getCaseCategories = (): CaseCategory[] => cases.categories as CaseCategory[];
export const getCases = (): CaseStudy[] => cases.items as CaseStudy[];
export const getCase = (id: string) => getCases().find((c) => c.id === id);

export const getNews = (): NewsItem[] => news as NewsItem[];
export const getNewsItem = (id: string) => getNews().find((n) => n.id === id);

export const getStandards = (): string[] => audience.standards;

/** The mockup stores each link as [kind, label, hash]. */
export const getAudiences = (): Audience[] =>
  audience.audiences.map((a) => ({
    id: a.id,
    label: a.label,
    title: a.title,
    lead: a.lead,
    page: { label: a.page[0], href: hashToPath(a.page[1]) },
    links: a.links.map(([kind, label, href]) => ({ kind, label, href: hashToPath(href) })),
  }));

export const getAudienceIcons = (): Record<string, string> => audience.icons;

/** Offices for the globe: the first entry is the headquarters. */
export const getOffices = (): Office[] =>
  (graphics.globe as Array<[string, number, number, number?]>).map(([name, lat, lon, hq]) => ({ name, lat, lon, hq: !!hq }));
