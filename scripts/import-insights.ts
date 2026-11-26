/* Copies the bundled articles (src/data/mockup/news.json) into the Payload "insights" collection, with their photos.

   npm run import:insights                 creates the articles the CMS does not have yet; existing ones are left alone
   UPDATE=slug,slug npm run import:insights   also overwrites these from the bundled data (UPDATE=press: every press article)
   DRY=1 npm run import:insights           only prints what would happen
   FORCE=1                                 also overwrites or recreates articles that someone changed in the admin

   An article an editor has changed or deleted (see the audit log) is skipped unless FORCE=1.
   Photos and files are read from src/data/insight-media/ and listed in src/data/mockup/news-media.json. A file that is
   not there is left out, with its figure or link; run again with UPDATE=... once it has been added. */
import config from "@payload-config";
import { randomBytes } from "node:crypto";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPayload } from "payload";
import media from "../src/data/mockup/news-media.json" with { type: "json" };
import news from "../src/data/mockup/news.json" with { type: "json" };
import { localMedia } from "../src/lib/insight-href";
import { bodyToLexical, type Report } from "../src/lib/insight-import";

interface Raw { id: string; cat: string; type: string; date: string; iso?: string; title: string; sum: string; scene?: string; tags?: string[]; sources?: Array<{ name: string; url: string }>; body?: string[] }

const MEDIA_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/data/insight-media");
/** For each article, [file, caption] pairs: the first is the cover, the rest form a gallery under the text. */
const photos = media.photos as unknown as Record<string, Array<[string, string]>>;
/** Descriptions of the files that article bodies refer to. */
const fileAlts = media.files as Record<string, string>;

const dry = process.env.DRY === "1";
const force = process.env.FORCE === "1";
const rows = news as unknown as Raw[];
const requested = new Set((process.env.UPDATE ?? "").split(",").map((s) => s.trim()).filter(Boolean));
const unknown = [...requested].filter((s) => s !== "all" && s !== "press" && !rows.some((n) => n.id === s));
if (unknown.length) {
  console.error(`UPDATE names no bundled article: ${unknown.join(", ")}`);
  process.exit(1);
}
const wantsUpdate = (n: Raw) => requested.has("all") || requested.has(n.id) || (requested.has("press") && n.type === "press");

const payload = await getPayload({ config });
const context = { disableRevalidate: true, skipAudit: true };
const report: Report = { structured: {}, fallbacks: [] };
const missing = new Set<string>();
const refused = new Map<string, string>();
const done = { created: [] as string[], updated: [] as string[], skipped: [] as string[], kept: 0 };

type Upload = { id: number | string; url?: string | null };

/** The Media document for a bundled file, uploading it the first time. Undefined when the file is not in the folder. */
async function upload(file: string, alt: string): Promise<Upload | undefined> {
  const found = await payload.find({ collection: "media", where: { filename: { equals: file } }, limit: 1, depth: 0 });
  if (found.docs[0]) return found.docs[0] as Upload;
  const source = path.join(MEDIA_DIR, file);
  if (!existsSync(source)) {
    missing.add(file);
    return undefined;
  }
  if (dry) return { id: 0, url: `/media/${file}` };
  try {
    return (await payload.create({ collection: "media", data: { alt }, filePath: source, context })) as Upload;
  } catch (err) {
    // One bad file must not stop the other articles: leave it out, like a missing one, and say so at the end.
    refused.set(file, err instanceof Error ? err.message : String(err));
    return undefined;
  }
}

async function toData(n: Raw) {
  // Files the text refers to: upload them, then point the markup at the copies.
  const urls = new Map<string, string>();
  const referenced = new Set((n.body ?? []).flatMap((b) => [...b.matchAll(/(?:href|src)="media\/(?:[^"]*\/)?([^"/]+)"/g)].map((m) => m[1])));
  for (const file of referenced) {
    const url = (await upload(file, fileAlts[file] ?? n.title))?.url;
    if (url) urls.set(file, url);
  }
  const body = (n.body ?? []).map((b) => localMedia(b, (f) => urls.get(f))).filter((b) => b.trim() !== "");

  const pictures: Array<{ id: number | string; caption: string }> = [];
  for (const [file, caption] of photos[n.id] ?? []) {
    const doc = await upload(file, caption);
    if (doc) pictures.push({ id: doc.id, caption });
  }
  const [cover, ...gallery] = pictures;
  const lexical = body.length ? bodyToLexical(body, n.id, report) : undefined;
  if (lexical && gallery.length) {
    const hex = () => randomBytes(12).toString("hex");
    lexical.root.children.push({
      type: "block", version: 2, format: "",
      fields: { id: hex(), blockName: "", blockType: "gallery", photos: gallery.map((p) => ({ id: hex(), image: p.id, caption: p.caption })) },
    });
  }

  return {
    title: n.title,
    slug: n.id,
    _status: "published" as const,
    type: (["insight", "news", "press"].includes(n.type) ? n.type : "insight") as "insight" | "news" | "press",
    cat: n.cat,
    publishedAt: n.iso ? new Date(n.iso).toISOString() : undefined,
    dateLabel: n.date,
    summary: n.sum,
    scene: n.scene,
    tags: (n.tags ?? []).map((tag) => ({ tag })),
    sources: (n.sources ?? []).map((s) => ({ name: s.name, url: s.url })),
    // Left unset without a photo, so a cover chosen in the admin is not cleared.
    ...(cover ? { cover: cover.id } : {}),
    body: lexical,
  };
}

const logged = async (where: Record<string, { equals: string }>) =>
  (await payload.count({ collection: "audit-logs", where: { and: [{ collection: { equals: "insights" } }, where] } })).totalDocs > 0;

const present = await payload.find({ collection: "insights", limit: 0, pagination: false, depth: 0, select: { slug: true, order: true } });
const orders = new Map(present.docs.map((d) => [d.slug, d.order]));

/** A new article goes just before the next one in the bundled list that the CMS already has, else at its list position. */
function placeAt(index: number): number {
  for (let j = index + 1; j < rows.length; j++) {
    const next = orders.get(rows[j].id);
    if (next != null) return next - (j - index) / 1000;
  }
  return index;
}

for (const [index, n] of rows.entries()) {
  const found = await payload.find({ collection: "insights", where: { slug: { equals: n.id } }, limit: 1, depth: 0 });
  const current = found.docs[0];
  if (current && !wantsUpdate(n)) {
    done.kept++;
    continue;
  }
  if (!force) {
    // The import itself writes no audit entries, so any entry means a person (or their assistant) did this.
    if (current && (await logged({ docId: { equals: String(current.id) } }))) {
      done.skipped.push(`${n.id} (changed in the admin)`);
      continue;
    }
    if (!current && (await logged({ action: { equals: "delete" }, label: { equals: n.title.slice(0, 200) } }))) {
      done.skipped.push(`${n.id} (deleted in the admin)`);
      continue;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (await toData(n)) as any;
  // An existing article keeps its place in the lists.
  if (!dry) {
    if (current) await payload.update({ collection: "insights", id: current.id, data, context });
    else await payload.create({ collection: "insights", data: { ...data, order: placeAt(index) }, context });
  }
  (current ? done.updated : done.created).push(n.id);
}

console.log("Converted blocks:", report.structured);
console.log(`Fallbacks to HTML blocks: ${report.fallbacks.length}`);
if (dry) console.log("DRY RUN: nothing was written.");
console.log(`Created ${done.created.length}: ${done.created.join(", ") || "-"}`);
console.log(`Updated ${done.updated.length}: ${done.updated.join(", ") || "-"}`);
console.log(`Left as they are: ${done.kept}`);
if (done.skipped.length) console.log(`SKIPPED ${done.skipped.length}: ${done.skipped.join(", ")}`);
if (missing.size) console.log(`Files not in src/data/insight-media (left out): ${missing.size}\n  ${[...missing].join("\n  ")}`);
if (refused.size) console.log(`REFUSED by the upload check (left out): ${refused.size}\n  ${[...refused].map(([file, why]) => `${file}: ${why}`).join("\n  ")}`);
process.exit(refused.size ? 1 : 0);
