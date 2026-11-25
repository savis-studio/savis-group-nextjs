import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/insights";
import { readyRoutes } from "@/lib/sitemap-routes";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return readyRoutes(await getArticles()).map((r) => ({
    url: absoluteUrl(r.path),
    ...(r.lastModified ? { lastModified: r.lastModified } : {}),
    priority: r.priority,
  }));
}
