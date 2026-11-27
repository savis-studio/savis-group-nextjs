import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "@/styles/generated/tokens.css";
import "@/styles/savis.css";
import "@/styles/layout.css";
import "@/styles/vx.css";
// Shared page classes (.sv-grid, .sv-steps, ...). Global, so a page never depends on which components it happens to import.
import "@/styles/solutions.css";
import "@/styles/insights.css";
import "@/styles/resources.css";
import "@/styles/reports.css";
import "./globals.css";
import { newsThumb, thumbArt, vxArt } from "@/lib/thumbs";
import { companyMenu, servicesMenu } from "@/components/layout/nav-data";
import { AppHeader, type MenuStory } from "@/components/layout/AppHeader";
import type { ServiceGroup } from "@/components/layout/ServicesMenu";
import type { Sector, SolutionPillar } from "@/components/layout/SolutionsMenu";
import { AppFooter } from "@/components/layout/AppFooter";
import { VxActivate } from "@/components/ui/VxActivate";
import { PROFESSIONAL_SERVICES, SUPPORT_SERVICES, serviceOfferings } from "@/data/company-pages";
import { DEVELOPER_APIS } from "@/data/developers";
import { INDUSTRY_GROUPS, groupsOfPillar, pillarById } from "@/lib/content";
import { getCatalog, type Catalog } from "@/lib/cms";
import { INSIGHT_GROUPS, newestFirst } from "@/lib/insight-groups";
import { getArticles } from "@/lib/insights";
import { getReports, reportPath } from "@/lib/reports";
import { resourceSets } from "@/lib/resources";
import { SITE_DESCRIPTION, SITE_NAME, SITE_ORIGIN, SITE_TAGLINE } from "@/lib/site";

const sora = Sora({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-sora", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-inter", display: "swap" });

// Public pages are prerendered and refreshed in the background every 60 s (ISR). While the Docker image is built the CMS is
// not reachable, so getCatalog() returns the bundled catalogue then; the first refresh after deploy brings in the CMS data.
// Catalogue edits in the admin purge this cache at once (see collections/revalidate.ts).
export const revalidate = 60;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: { default: `${SITE_NAME} - ${SITE_TAGLINE}`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  icons: { icon: "/brand/savis-mark.png", apple: "/brand/savis-mark.png" },
};

/**
 * The Solutions menu's pillars, each with its product groups. The groups come from the same list as the pillar page,
 * so every group link has its section there.
 */
const solutionPillars = (pillars: Catalog["pillars"]): SolutionPillar[] =>
  pillars.map(({ id, name, short }) => {
    const slug = pillarById(id)?.slug;
    return { id, name, short, groups: slug ? groupsOfPillar(slug).map((g) => ({ slug: g.slug, name: g.name })) : [] };
  });

/** Industries by sector. One added in the admin that no sector lists yet is kept under "More industries". */
function bySector(industries: Catalog["industries"]): Sector[] {
  const listed = new Set(INDUSTRY_GROUPS.flatMap(([, ids]) => ids));
  const sectors = INDUSTRY_GROUPS.map(([name, ids]) => ({ name, industries: ids.flatMap((id) => industries.find((i) => i.id === id) ?? []) }));
  return [...sectors, { name: "More industries", industries: industries.filter((i) => !listed.has(i.id)) }].filter((s) => s.industries.length > 0);
}

/** Scene art for the mega-menu feature cards, rendered here so the art code stays out of the client bundle. */
const cardArt: Record<string, string> = Object.fromEntries(
  [...servicesMenu.cards, ...companyMenu.cards].flatMap((c) => (c.art ? [[c.title, vxArt(c.art.icon, undefined, undefined, c.art.lbl)]] : [])),
);

/** Services listed in each panel of the Services menu, linking to the item that opens on its page. */
const serviceLines = {
  pro: serviceOfferings(PROFESSIONAL_SERVICES),
  support: serviceOfferings(SUPPORT_SERVICES),
  developers: DEVELOPER_APIS,
} as Record<string, Array<{ id: string; name: string; icon: ServiceGroup["lines"][number]["icon"] }>>;

const serviceGroups: ServiceGroup[] = servicesMenu.groups.map((g) => ({
  ...g,
  card: { ...g.card, art: g.card.art.cls, svg: vxArt(g.card.art.icon, undefined, undefined, g.card.art.lbl) },
  lines: (serviceLines[g.id] ?? []).map((l) => ({ name: l.name, icon: l.icon, href: `${g.id === "developers" ? "/services/developers" : "/services"}#${l.id}` })),
}));

/** The two newest news items, for the Insights menu. */
async function latestNews(): Promise<MenuStory[]> {
  const news = INSIGHT_GROUPS.find((g) => g.id === "news")!;
  return (await getArticles()).filter(news.pick).sort(newestFirst).slice(0, 2).map((n) => {
    const spec = newsThumb(n);
    return { id: n.id, title: n.title, cat: n.cat, date: n.date, photo: n.cover?.src, cls: spec.cls, art: n.cover ? "" : thumbArt(spec) };
  });
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [catalog, latest, articles, reports] = await Promise.all([getCatalog(), latestNews(), getArticles(), getReports()]);
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body style={{ margin: 0, background: "var(--bg)", color: "var(--text)", font: "400 16px/1.6 var(--font-body)" }}>
        <a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>
        <AppHeader pillars={solutionPillars(catalog.pillars)} sectors={bySector(catalog.industries)} cardArt={cardArt} latest={latest} serviceGroups={serviceGroups} resources={resourceSets(articles, reports)} reportLinks={Object.fromEntries(reports.map((r) => [r.slug, reportPath(r.slug)]))} />
        <div id="main">{children}</div>
        <AppFooter {...catalog} />
        <VxActivate />
      </body>
    </html>
  );
}
