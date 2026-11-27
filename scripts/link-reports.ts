/* Points the report links inside articles at the report pages. They lead to /insights since before reports had pages.
   Only links to published reports change, so run it again after publishing more.

     npm run link:reports            lists what would change
     WRITE=1 npm run link:reports    saves the changes (take a database backup first)

   An article with unpublished changes waiting is left alone and listed, so that nobody's draft is buried under a new
   published version. */
import config from "@payload-config";
import { getPayload } from "payload";
import news from "../src/data/mockup/news.json" with { type: "json" };
import { relink, reportLinks } from "../src/lib/report-links";

const write = process.env.WRITE === "1";
const payload = await getPayload({ config });
const context = { disableRevalidate: true, skipAudit: true };

const published = new Set(
  (await payload.find({ collection: "reports", where: { _status: { equals: "published" } }, limit: 0, pagination: false, depth: 0, select: { slug: true } })).docs.map((d) => d.slug),
);
const addressOf = (target: string): string | undefined => {
  if (target === "resources-reports") return published.size ? "/resources/reports" : undefined;
  const slug = target.slice("report-".length);
  return published.has(slug) ? `/resources/reports/${slug}` : undefined;
};

const docs = (await payload.find({ collection: "insights", limit: 0, pagination: false, depth: 0 })).docs;
const waiting: string[] = [];
let articles = 0;
let links = 0;
for (const doc of docs) {
  const source = (news as unknown as Array<{ id: string; body?: string[] }>).find((n) => n.id === doc.slug);
  const targets = reportLinks((source?.body ?? []).join(""));
  if (!targets.size || !doc.body) continue;
  const changed: string[] = [];
  const body = relink(doc.body, (words) => { const t = targets.get(words); return t ? addressOf(t) : undefined; }, changed);
  if (!changed.length) continue;
  const latest = await payload.findByID({ collection: "insights", id: doc.id, draft: true, depth: 0 });
  if (latest._status === "draft" && doc._status === "published") {
    waiting.push(doc.slug);
    continue;
  }
  articles++;
  links += changed.length;
  console.log(`${doc.slug}\n  ${changed.join("\n  ")}`);
  if (write) {
    const draft = doc._status === "draft";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await payload.update({ collection: "insights", id: doc.id, data: { body, ...(draft ? { _status: "draft" } : {}) } as any, draft, context, depth: 0 });
  }
}
console.log(`${published.size} reports published. ${links} links in ${articles} articles ${write ? "changed" : "would change"}.`);
if (waiting.length) console.log(`LEFT ALONE, unpublished changes waiting (${waiting.length}): ${waiting.join(", ")}`);
process.exit(0);
