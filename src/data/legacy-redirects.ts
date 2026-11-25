import groups from "./mockup/groups.json";
import pillars from "./mockup/pillars.json";
import news from "./mockup/news.json";
import products from "./mockup/products.json";
import { REDIRECTS } from "./redirects";

/**
 * Redirects for the URLs of the site that savis-group.com served before this one (everything under `/en`, with product
 * pages at `/en/solutions/<pillar>/<group>/<product>`). They are generated from the data so they cannot drift from it.
 * Order matters: Next uses the first match, so the specific rules come before the `/en/:path*` catch-all.
 */
const rename = new Map(REDIRECTS.map((r) => [r.from, r.to]));
const pillarId = new Map(pillars.map((p) => [p.slug, p.id]));

/** Where a product lives now, following the renames. */
const productPath = (slug: string) => rename.get(`/products/${slug}`) ?? `/products/${slug}`;

/** The old site built article URLs from the title, cut at 90 characters. */
const slugify = (t: string) => t.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
/** Articles whose title changed since the old site went live. */
const RETITLED: Record<string, string> = { "savis-egov-superapp-wins-the-asocio-smart-city-awards-2026": "asocio-smart-city-2026" };

export const LEGACY_REDIRECTS: Array<{ from: string; to: string }> = [
  { from: "/en", to: "/" },
  { from: "/en/solutions", to: "/solutions" },
  ...pillars.map((p) => ({ from: `/en/solutions/${p.slug}`, to: `/solutions/${p.id}` })),
  ...groups.map((g) => ({ from: `/en/solutions/${g.pillar}/${g.slug}`, to: `/solutions/${pillarId.get(g.pillar) ?? ""}#${g.slug}` })),
  ...products.map((p) => ({ from: `/en/solutions/${p.pillar}/${p.group}/${p.slug}`, to: productPath(p.slug) })),
  // Products that were renamed: the old URL still has the old slug.
  ...products.flatMap((p) =>
    [...rename].filter(([, to]) => to === `/products/${p.slug}`).map(([from, to]) => ({ from: `/en/solutions/${p.pillar}/${p.group}/${from.split("/")[2]}`, to })),
  ),
  ...news.map((a) => ({ from: `/en/insights/${slugify(a.title).slice(0, 90).replace(/-$/, "")}`, to: `/insights/${a.id}` })),
  ...Object.entries(RETITLED).map(([old, id]) => ({ from: `/en/insights/${old}`, to: `/insights/${id}` })),
  // Products the old site had and this one does not: send people to the group, then the solution.
  ...groups.map((g) => ({ from: `/en/solutions/${g.pillar}/${g.slug}/:product`, to: `/solutions/${pillarId.get(g.pillar) ?? ""}#${g.slug}` })),
  ...pillars.map((p) => ({ from: `/en/solutions/${p.slug}/:rest*`, to: `/solutions/${p.id}` })),
  // Everything else under /en keeps its path (about, contact, customers/<id>, use-cases/<id>, ...).
  { from: "/en/:path*", to: "/:path*" },
];
