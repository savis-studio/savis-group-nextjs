import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/insights";
import { getReports } from "@/lib/reports";
import { readyRoutes } from "@/lib/sitemap-routes";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, reports] = await Promise.all([getArticles(), getReports()]);
  return readyRoutes(articles, reports.map((r) => r.slug)).map((r) => ({
    url: absoluteUrl(r.path),
    ...(r.lastModified ? { lastModified: r.lastModified } : {}),
    priority: r.priority,
  }));
}
