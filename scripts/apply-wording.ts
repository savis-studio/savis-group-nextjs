/* Applies the house style (src/lib/wording.ts) to the content already in the CMS, keeping every other edit.

     npm run wording:cms           lists what would change
     WRITE=1 npm run wording:cms   saves the changes (take a database backup first)

   Only text changes: slugs, links and settings stay as they are. An article with unpublished changes waiting is left
   alone and listed, so that nobody's draft is buried under a new published version. */
import config from "@payload-config";
import { getPayload } from "payload";
import { fixWording } from "../src/lib/wording";

const write = process.env.WRITE === "1";
const payload = await getPayload({ config });
const context = { disableRevalidate: true, skipAudit: true };

/** Keys that hold prose, in documents, rich text and editor blocks. Everything else is left as it is. */
const TEXT_KEYS = new Set([
  "title", "summary", "cat", "dateLabel", "name", "short", "pitch", "alt",
  "text", "caption", "label", "tag", "value", "html", "heading", "baseTitle", "baseText", "date",
]);

const samples: string[] = [];

/** A copy with the house style applied to the text; `hits` counts the strings that changed. */
function restyle(value: unknown, key: string, hits: { n: number }): unknown {
  if (typeof value === "string") {
    if (!TEXT_KEYS.has(key)) return value;
    const next = fixWording(value);
    if (next !== value) {
      hits.n++;
      let at = 0;
      while (value[at] === next[at]) at++;
      samples.push(`${key}: …${value.slice(Math.max(0, at - 30), at + 30)}… -> …${next.slice(Math.max(0, at - 30), at + 30)}…`.replace(/\s+/g, " "));
    }
    return next;
  }
  if (Array.isArray(value)) return value.map((v) => restyle(v, key, hits));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, restyle(v, k, hits)]));
  return value;
}

const COLLECTIONS = [
  { collection: "insights", fields: ["title", "summary", "cat", "dateLabel", "tags", "sources", "body"], drafts: true },
  { collection: "media", fields: ["alt"], drafts: false },
  { collection: "pillars", fields: ["name", "short", "pitch", "groups"], drafts: false },
  { collection: "industries", fields: ["name"], drafts: false },
] as const;

for (const { collection, fields, drafts } of COLLECTIONS) {
  const docs = (await payload.find({ collection, limit: 0, pagination: false, depth: 0 })).docs as unknown as Array<Record<string, unknown> & { id: number }>;
  let changed = 0;
  const waiting: string[] = [];
  for (const doc of docs) {
    const hits = { n: 0 };
    const data: Record<string, unknown> = {};
    for (const field of fields) {
      const before = hits.n;
      const next = restyle(doc[field], field, hits);
      if (hits.n > before) data[field] = next;
    }
    if (!hits.n) continue;
    const name = String(doc.slug ?? doc.filename ?? doc.id);
    if (drafts) {
      const latest = (await payload.findByID({ collection, id: doc.id, draft: true, depth: 0 })) as unknown as { _status?: string };
      if (latest._status === "draft" && doc._status === "published") {
        waiting.push(name);
        continue;
      }
    }
    changed++;
    if (write) {
      const draft = drafts && doc._status === "draft";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await payload.update({ collection, id: doc.id, data: (draft ? { ...data, _status: "draft" } : data) as any, draft, context, depth: 0 });
    }
  }
  console.log(`${collection}: ${changed} of ${docs.length} ${write ? "changed" : "would change"}`);
  if (waiting.length) console.log(`  LEFT ALONE, unpublished changes waiting (${waiting.length}): ${waiting.join(", ")}`);
}

if (process.env.VERBOSE === "1") console.log(samples.join("\n"));
else console.log(`${samples.length} strings, for example:\n${samples.slice(0, 15).join("\n")}\n(VERBOSE=1 lists them all)`);
if (!write) console.log("DRY RUN: nothing was written.");
process.exit(0);
