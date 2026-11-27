/* Creates the report pages in the Payload "reports" collection as drafts, from src/data/report-import/reports.json
   (made by scripts/extract-reports.mjs; not in git). A person reviews and publishes each one in the admin.

   npm run import:reports                       creates the reports the CMS does not have yet; existing ones are left alone
   UPDATE=slug,slug npm run import:reports      also overwrites these drafts from the file (UPDATE=all: every draft)
   DRY=1 npm run import:reports                 only prints what would happen
   FILE=/path/reports.json                      reads another file

   Never overwritten or recreated: a published report, and one that a person changed or deleted (see the audit log). */
import config from "@payload-config";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPayload } from "payload";

type Row = Record<string, unknown> & { slug: string; title: string };

const here = path.dirname(fileURLToPath(import.meta.url));
const file = process.env.FILE || path.resolve(here, "../src/data/report-import/reports.json");
const dry = process.env.DRY === "1";
const { reports } = JSON.parse(readFileSync(file, "utf8")) as { reports: Row[] };

const requested = new Set((process.env.UPDATE ?? "").split(",").map((s) => s.trim()).filter(Boolean));
const unknown = [...requested].filter((s) => s !== "all" && !reports.some((r) => r.slug === s));
if (unknown.length) {
  console.error(`UPDATE names no report in the file: ${unknown.join(", ")}`);
  process.exit(1);
}

const payload = await getPayload({ config });
// The import writes no audit entries, so an entry in the audit log means that a person did something.
const context = { disableRevalidate: true, skipAudit: true };
const done = { created: [] as string[], updated: [] as string[], kept: 0, skipped: [] as string[], failed: [] as string[] };

const touched = async (where: Array<Record<string, { equals: string }>>) =>
  (await payload.count({ collection: "audit-logs", where: { and: [{ collection: { equals: "reports" } }, ...where] } })).totalDocs > 0;

for (const row of reports) {
  try {
    const current = (await payload.find({ collection: "reports", where: { slug: { equals: row.slug } }, limit: 1, depth: 0, draft: true })).docs[0];
    if (current) {
      if (!requested.has("all") && !requested.has(row.slug)) { done.kept++; continue; }
      const live = (await payload.count({ collection: "reports", where: { and: [{ slug: { equals: row.slug } }, { _status: { equals: "published" } }] } })).totalDocs > 0;
      if (live) { done.skipped.push(`${row.slug} (published)`); continue; }
      if (await touched([{ docId: { equals: String(current.id) } }])) { done.skipped.push(`${row.slug} (changed in the admin)`); continue; }
    } else if (await touched([{ action: { equals: "delete" } }, { label: { equals: row.title.slice(0, 200) } }])) {
      done.skipped.push(`${row.slug} (deleted in the admin)`);
      continue;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = { ...row, _status: "draft" } as any;
    if (!dry) {
      if (current) await payload.update({ collection: "reports", id: current.id, data, draft: true, context });
      else await payload.create({ collection: "reports", data, draft: true, context });
    }
    (current ? done.updated : done.created).push(row.slug);
  } catch (err) {
    // One report that the CMS refuses must not stop the others.
    const detail = (err as { data?: unknown }).data;
    done.failed.push(`${row.slug}: ${err instanceof Error ? err.message : String(err)}${detail ? ` ${JSON.stringify(detail)}` : ""}`);
  }
}

if (dry) console.log("DRY RUN: nothing was written.");
console.log(`Created as drafts ${done.created.length}: ${done.created.join(", ") || "-"}`);
console.log(`Updated ${done.updated.length}: ${done.updated.join(", ") || "-"}`);
console.log(`Left as they are: ${done.kept}`);
if (done.skipped.length) console.log(`SKIPPED ${done.skipped.length}: ${done.skipped.join(", ")}`);
if (done.failed.length) console.log(`FAILED ${done.failed.length}:\n  ${done.failed.join("\n  ")}`);
process.exit(done.failed.length ? 1 : 0);
