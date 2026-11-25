import { getCases, getNews, getPillars } from "./content";
import products from "@/data/mockup/products.json";
import useCases from "@/data/mockup/use-cases.json";
import industries from "@/data/mockup/industries.json";

/**
 * Every public route, with `ready` set once its page exists. The sitemap lists only ready routes, so crawlers are never
 * pointed at a 404. Flip a flag in the same change that adds the page (see docs/ROUTES.md for the phase of each).
 */
export interface SitemapRoute {
  path: string;
  ready: boolean;
  lastModified?: string;
  priority?: number;
}

const staticRoute = (path: string, ready: boolean, priority = 0.6): SitemapRoute => ({ path, ready, priority });

export const STATIC_ROUTES: SitemapRoute[] = [
  staticRoute("/", true, 1),
  // Phase 3
  staticRoute("/solutions", true, 0.9),
  staticRoute("/industries", true, 0.8),
  staticRoute("/use-cases", true, 0.8),
  // Phase 4
  staticRoute("/customers", true, 0.8),
  staticRoute("/insights", true, 0.8),
  staticRoute("/resources", false, 0.7),
  // Phase 5
  staticRoute("/services", true, 0.8),
  staticRoute("/innovation", true, 0.7),
  staticRoute("/innovation/pqc-lab", true, 0.6),
  staticRoute("/about", true, 0.7),
  staticRoute("/about/culture", true, 0.4),
  staticRoute("/about/esg", true, 0.4),
  staticRoute("/about/integrity", true, 0.4),
  staticRoute("/partners", true, 0.6),
  staticRoute("/careers", true, 0.6),
  staticRoute("/contact", true, 0.7),
  staticRoute("/investors", true, 0.5),
  staticRoute("/trust-center", true, 0.6),
  staticRoute("/privacy", true, 0.2),
  staticRoute("/terms", true, 0.2),
  staticRoute("/cookies", true, 0.2),
];

/** Dynamic collections: one entry per record. Flip `ready` with the phase that builds the detail page. */
export function dynamicRoutes(): SitemapRoute[] {
  const out: SitemapRoute[] = [];
  const add = (ready: boolean, base: string, ids: string[], priority: number) => {
    for (const id of ids) out.push({ path: `${base}/${id}`, ready, priority });
  };
  add(true, "/solutions", getPillars().map((p) => p.id), 0.8); // Phase 3a
  add(true, "/products", products.map((p) => p.slug), 0.7); // Phase 3
  add(true, "/industries", industries.items.map((i) => i.id), 0.7); // Phase 3
  add(true, "/use-cases", useCases.map((u) => u.id), 0.6); // Phase 3
  add(true, "/customers", getCases().map((c) => c.id), 0.6); // Phase 4
  for (const n of getNews()) {
    out.push({ path: `/insights/${n.id}`, ready: true, lastModified: n.iso, priority: 0.5 }); // Phase 4
  }
  return out;
}

export const readyRoutes = (): SitemapRoute[] => [...STATIC_ROUTES, ...dynamicRoutes()].filter((r) => r.ready);
