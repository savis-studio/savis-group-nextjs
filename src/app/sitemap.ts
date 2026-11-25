import type { MetadataRoute } from "next";
import { readyRoutes } from "@/lib/sitemap-routes";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return readyRoutes().map((r) => ({
    url: absoluteUrl(r.path),
    ...(r.lastModified ? { lastModified: r.lastModified } : {}),
    priority: r.priority,
  }));
}
