/* Imports the 81 mockup articles into the Payload "insights" collection (rich text + blocks). Safe to re-run: upserts by slug.
   Usage: npm run import:insights   (add --dry to only print the conversion report) */
import config from "@payload-config";
import { getPayload } from "payload";
import news from "../src/data/mockup/news.json" with { type: "json" };
import { bodyToLexical, type Report } from "../src/lib/insight-import";

interface Raw { id: string; cat: string; type: string; date: string; iso?: string; title: string; sum: string; scene?: string; tags?: string[]; sources?: Array<{ name: string; url: string }>; body?: string[] }

const dry = process.env.DRY === "1";
const report: Report = { structured: {}, fallbacks: [] };
const rows = (news as unknown as Raw[]).map((n, index) => ({
  slug: n.id,
  data: {
    title: n.title,
    slug: n.id,
    _status: "published" as const,
    order: index,
    type: (["insight", "news", "press"].includes(n.type) ? n.type : "insight") as "insight" | "news" | "press",
    cat: n.cat,
    publishedAt: n.iso ? new Date(n.iso).toISOString() : undefined,
    dateLabel: n.date,
    summary: n.sum,
    scene: n.scene,
    tags: (n.tags ?? []).map((tag) => ({ tag })),
    sources: (n.sources ?? []).map((s) => ({ name: s.name, url: s.url })),
    body: (n.body ?? []).length ? bodyToLexical(n.body ?? [], n.id, report) : undefined,
  },
}));

console.log("Converted blocks:", report.structured);
console.log(`Fallbacks to HTML blocks: ${report.fallbacks.length}`);
const byKind: Record<string, number> = {};
for (const f of report.fallbacks) byKind[`${f.kind}: ${f.why}`] = (byKind[`${f.kind}: ${f.why}`] ?? 0) + 1;
console.table(byKind);
if (dry) process.exit(0);

const payload = await getPayload({ config });
const context = { disableRevalidate: true, skipAudit: true };
for (const r of rows) {
  const found = await payload.find({ collection: "insights", where: { slug: { equals: r.slug } }, limit: 1, depth: 0 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = r.data as any;
  if (found.docs[0]) await payload.update({ collection: "insights", id: found.docs[0].id, data, context });
  else await payload.create({ collection: "insights", data, context });
}
console.log(`Imported ${rows.length} articles.`);
process.exit(0);
