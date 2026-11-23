import config from "@payload-config";
import { getPayload } from "payload";
import { industries as fallbackIndustries, pillars as fallbackPillars } from "@/components/layout/catalog";
import type { CatalogPillar } from "@/components/layout/catalog";

export interface Catalog {
  pillars: CatalogPillar[];
  industries: Array<{ id: string; name: string }>;
}

/** Pillars and industries for the header and footer. Falls back to the bundled catalogue when the CMS is empty or unreachable. */
export async function getCatalog(): Promise<Catalog> {
  try {
    const payload = await getPayload({ config });
    const [p, i] = await Promise.all([
      payload.find({ collection: "pillars", limit: 50, sort: "n", depth: 0 }),
      payload.find({ collection: "industries", limit: 100, sort: "createdAt", depth: 0 }),
    ]);
    if (p.docs.length > 0) {
      return {
        pillars: p.docs.map((d) => ({
          id: d.slug,
          n: d.n,
          name: d.name,
          short: d.short,
          pitch: d.pitch ?? "",
          groups: (d.groups ?? []).map((g) => ({ name: g.name, items: (g.items ?? []).map((it) => it.name) })),
        })),
        industries: i.docs.length > 0 ? i.docs.map((d) => ({ id: d.slug, name: d.name })) : fallbackIndustries,
      };
    }
  } catch (err) {
    console.warn("CMS unavailable, using bundled catalogue:", err instanceof Error ? err.message : err);
  }
  return { pillars: fallbackPillars, industries: fallbackIndustries };
}
