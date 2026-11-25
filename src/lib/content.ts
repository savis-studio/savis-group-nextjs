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

/* ===================== Solutions, products, industries, use cases ===================== */
import groups from "@/data/mockup/groups.json";
import groupTemplates from "@/data/mockup/group-templates.json";
import industries from "@/data/mockup/industries.json";
import journeys from "@/data/mockup/journeys.json";
import productDetails from "@/data/mockup/product-detail.json";
import products from "@/data/mockup/products.json";
import useCases from "@/data/mockup/use-cases.json";
import company from "@/data/mockup/company.json";

/** A pair [label, icon key]. */
export type IconLabel = [label: string, icon: string];

export interface Arch {
  users: IconLabel[];
  ch: IconLabel[];
  mods: string[];
  core: IconLabel[];
  ent: IconLabel[];
  tag?: string;
  steps?: string[];
}

/** Narrative for the products that have a hand-written page (12 of 114). */
export interface ProductNarrative {
  lead: string;
  blocks?: Array<[title: string, items: string[]]>;
  standards?: string[];
  specs?: Array<[string, string]>;
  fit?: string;
  visual?: string;
}

export interface Product {
  slug: string;
  name: string;
  desc: string;
  /** SY = SAVIS core technology, S = SAVIS, SP = SAVIS partner product. */
  role: "SY" | "S" | "SP";
  isNew: boolean;
  /** Pillar slug (long form). Use pillarBySlug() to get the short id used in URLs. */
  pillar: string;
  group: string;
  tags: string[] | null;
  detail: ProductNarrative | null;
}

export interface ProductDetail {
  sum: string;
  feat: Array<[title: string, text: string]>;
  int: string[];
  dep: string[];
  std: string[];
  pre: string[];
  /** One sentence per roadmap step: Assess, Design, Pilot, Roll out, Operate. */
  go: string[];
  arch: Arch;
}

export interface Group {
  name: string;
  vi: string;
  slug: string;
  pillar: string;
  /** [name, slug, description, role, flags] for each product in the group. */
  items: Array<[name: string, slug: string, desc: string, role: string, flags?: Record<string, boolean>]>;
}

export interface GroupTemplate {
  intro: string;
  users: IconLabel[];
  ch: IconLabel[];
  core: IconLabel[];
  ent: IconLabel[];
  int: string[];
  dep: string[];
  std: string[];
  pre: string[];
  go: string[];
}

export interface UseCase {
  id: string;
  pillar: string;
  name: string;
  tagline: string;
  problem: string;
  industries: string[];
  cases: string[];
  products: string[];
  ui: "mobile" | "web" | "console" | "desktop";
  /** [icon, title, text] */
  flow: Array<[string, string, string]>;
  logical: Array<[layer: string, items: string[]]>;
  system: Array<[zone: string, items: string[]]>;
  benefits: string[];
  scene?: string | null;
}

export interface Industry { id: string; name: string; pitch: string; pillars: string[]; picks: string[] }

export interface JourneyStep { href: string | null; title: string; text: string; products: string[] }
export interface Journey { eyebrow: string; title: string; steps: JourneyStep[] }

export const getProducts = (): Product[] => products as unknown as Product[];
export const getProduct = (slug: string) => getProducts().find((p) => p.slug === slug);
export const getProductDetail = (slug: string): ProductDetail | undefined =>
  (productDetails as unknown as Record<string, ProductDetail>)[slug];

/** Architecture for any product: hand-written detail first, then the 8 products that only have a diagram. */
export const getProductArch = (slug: string): Arch | undefined =>
  getProductDetail(slug)?.arch ?? ((company.pxa as unknown as Record<string, Arch>)[slug]);

export const roleTags = (p: Pick<Product, "role" | "isNew">): string[] => [
  "SAVIS",
  ...(p.role === "SY" ? ["CORE TECHNOLOGY"] : p.role === "SP" ? ["PARTNER · VERIFY"] : []),
  ...(p.isNew ? ["New"] : []),
];

export const getGroups = (): Group[] => groups as unknown as Group[];
export const getGroup = (slug: string) => getGroups().find((g) => g.slug === slug);
export const getGroupTemplate = (slug: string): GroupTemplate | undefined =>
  (groupTemplates as unknown as Record<string, GroupTemplate>)[slug];
export const groupsOfPillar = (pillarSlug: string) => getGroups().filter((g) => g.pillar === pillarSlug);
export const productsOfGroup = (g: Group): Product[] =>
  g.items.flatMap(([, slug]) => getProduct(slug) ?? []);

export const pillarById = (id: string) => getPillars().find((p) => p.id === id);
export const pillarBySlug = (slug: string) => getPillars().find((p) => p.slug === slug);
export const pillarOfProduct = (p: Pick<Product, "pillar">) => pillarBySlug(p.pillar);

export const getUseCases = (): UseCase[] => useCases as unknown as UseCase[];
export const getUseCase = (id: string) => getUseCases().find((u) => u.id === id);

export const getIndustries = (): Industry[] => industries.items as Industry[];
export const getIndustry = (id: string) => getIndustries().find((i) => i.id === id);

/** The mockup's home-page grouping of industries. */
export const INDUSTRY_GROUPS: Array<[title: string, ids: string[]]> = [
  ["Government & public sector", ["government", "education", "healthcare"]],
  ["Financial services", ["bfsi", "payments", "trust-providers"]],
  ["Telco & enterprise", ["telco", "enterprise", "media", "retail"]],
  ["Mobility & infrastructure", ["automotive", "transport", "energy-utilities"]],
];

export const getJourney = (pillarId: string): Journey | undefined =>
  (journeys as unknown as Record<string, Journey>)[pillarId];
