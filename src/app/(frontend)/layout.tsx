import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "@/styles/generated/tokens.css";
import "@/styles/savis.css";
import "@/styles/layout.css";
import "@/styles/vx.css";
// Shared page classes (.sv-grid, .sv-steps, ...). Global, so a page never depends on which components it happens to import.
import "@/styles/solutions.css";
import "@/styles/insights.css";
import "./globals.css";
import { newsThumb, thumbArt, vxArt } from "@/lib/thumbs";
import { companyMenu, resourcesMenu, servicesMenu } from "@/components/layout/nav-data";
import { AppHeader, type MenuStory } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { VxActivate } from "@/components/ui/VxActivate";
import { getProducts } from "@/lib/content";
import { getCatalog } from "@/lib/cms";
import { INSIGHT_GROUPS, newestFirst } from "@/lib/insight-groups";
import { getArticles } from "@/lib/insights";
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

/** Product name → page, so the mega menu links each product to its own page. */
const productHrefs = Object.fromEntries(getProducts().map((p) => [p.name, `/products/${p.slug}`]));

/** Scene art for the mega-menu feature cards, rendered here so the art code stays out of the client bundle. */
const cardArt: Record<string, string> = Object.fromEntries(
  [...servicesMenu.cards, ...resourcesMenu.cards, ...companyMenu.cards].flatMap((c) => (c.art ? [[c.title, vxArt(c.art.icon, undefined, undefined, c.art.lbl)]] : [])),
);

/** The two newest news items, for the Insights menu. */
async function latestNews(): Promise<MenuStory[]> {
  const news = INSIGHT_GROUPS.find((g) => g.id === "news")!;
  return (await getArticles()).filter(news.pick).sort(newestFirst).slice(0, 2).map((n) => {
    const spec = newsThumb(n);
    return { id: n.id, title: n.title, cat: n.cat, date: n.date, photo: n.cover?.src, cls: spec.cls, art: n.cover ? "" : thumbArt(spec) };
  });
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [catalog, latest] = await Promise.all([getCatalog(), latestNews()]);
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body style={{ margin: 0, background: "var(--bg)", color: "var(--text)", font: "400 16px/1.6 var(--font-body)" }}>
        <a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>
        <AppHeader {...catalog} productHrefs={productHrefs} cardArt={cardArt} latest={latest} />
        <div id="main">{children}</div>
        <AppFooter {...catalog} />
        <VxActivate />
      </body>
    </html>
  );
}
