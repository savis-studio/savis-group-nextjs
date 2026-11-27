import { revalidatePath, revalidateTag } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig, Field } from "payload";
import { adminOnlyField, isAdmin, isStaff, publishedOrStaff } from "../access";
import products from "../data/mockup/products.json";
import { REPORTS_TAG } from "../lib/cache-tags";
import { REPORT_KINDS, REPORT_PALETTES } from "../lib/report-options";
import { validateSlug } from "../lib/slug";
import { auditChange, auditDelete } from "./audit";
import { fillSlug } from "./fill-slug";

const purge = (slug?: string, context?: Record<string, unknown>) => {
  if (context?.disableRevalidate) return;
  try {
    revalidateTag(REPORTS_TAG, { expire: 0 });
    // The menus on every page show reports.
    revalidatePath("/", "layout");
    if (slug) revalidatePath(`/resources/reports/${slug}`);
  } catch {
    /* not inside a Next.js request (import script) */
  }
};
const afterChange: CollectionAfterChangeHook = ({ doc, context }) => { purge(doc.slug, context); return doc; };
const afterDelete: CollectionAfterDeleteHook = ({ doc, context }) => { purge(doc?.slug, context); };

const PRODUCT_SLUGS = new Set((products as Array<{ slug: string }>).map((p) => p.slug));

/** True, or a message naming the product slugs the website does not have. */
export function validateProducts(value: unknown): true | string {
  const unknown = (Array.isArray(value) ? value : []).filter((slug) => !PRODUCT_SLUGS.has(String(slug)));
  return unknown.length ? `Not a product page: ${unknown.join(", ")}. Use the last part of its address, e.g. “trustonboard”.` : true;
}

/** A list of short texts, such as the points a reader will learn. */
const textList = (name: string, label: string, singular: string, description?: string): Field => ({
  name, label, type: "array", labels: { singular, plural: label },
  admin: description ? { description } : undefined,
  fields: [{ name: "text", type: "textarea", required: true }],
});

/**
 * Reports and whitepapers: what their web page shows. The documents themselves are not on the website; a visitor asks
 * for one with a form (collection "document-requests") and a SAVIS specialist sends it.
 */
export const Reports: CollectionConfig = {
  slug: "reports",
  labels: { singular: "Report or whitepaper", plural: "Reports & whitepapers" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "_status", "kind", "series.name", "publishedAt"],
    description: "The web pages under /resources/reports. Do not upload the documents here: files in Media are public.",
  },
  defaultSort: "order",
  access: { read: publishedOrStaff, readVersions: isStaff, create: isStaff, update: isStaff, delete: isAdmin },
  versions: { drafts: { validate: true }, maxPerDoc: 25 },
  defaultPopulate: { slug: true, title: true, _status: true },
  hooks: { afterChange: [afterChange, auditChange], afterDelete: [afterDelete, auditDelete] },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "slug", type: "text", required: true, unique: true, index: true,
      validate: (value: unknown) => (value ? validateSlug(value) : true),
      hooks: { beforeValidate: [fillSlug], beforeDuplicate: [() => ""] },
      admin: { description: "URL: /resources/reports/<slug>. Leave empty to make it from the title when you save. Changing it later breaks existing links." },
    },
    {
      type: "row",
      fields: [
        { name: "kind", type: "select", required: true, options: [...REPORT_KINDS] },
        { name: "topic", type: "text", required: true, admin: { description: "Label on cards, e.g. “AI security”." } },
        { name: "palette", label: "Cover colour", type: "select", required: true, options: REPORT_PALETTES },
        { name: "publishedAt", label: "Published", type: "date", admin: { date: { pickerAppearance: "dayOnly" } } },
      ],
    },
    { name: "order", type: "number", admin: { position: "sidebar", description: "Lower numbers show first in the library." } },
    { name: "featured", type: "checkbox", defaultValue: false, admin: { position: "sidebar", description: "Show in the Resources menu, which has room for three: untick one before ticking another." } },
    {
      type: "tabs",
      tabs: [
        {
          label: "Introduction",
          fields: [
            { name: "subtitle", type: "textarea", required: true, admin: { description: "Line under the title, on the cover and on cards." } },
            { name: "hook", type: "text", admin: { description: "One short sentence above the introduction." } },
            { name: "lead", label: "Introduction", type: "textarea", required: true },
            {
              name: "series", type: "group",
              fields: [{
                type: "row",
                fields: [
                  { name: "name", type: "text", admin: { description: "Empty for a document that is not part of a series." } },
                  { name: "part", type: "number", min: 1 },
                  { name: "parts", label: "Number of parts", type: "number", min: 1 },
                ],
              },
              { name: "summary", type: "textarea", admin: { description: "Line under the series heading in the library. Taken from the first part that has one." } }],
            },
            { name: "credit", type: "text", admin: { description: "e.g. “SAVIS Research. November 2026.”" } },
            {
              name: "stats", type: "array", labels: { singular: "Key figure", plural: "Key figures" }, maxRows: 4,
              fields: [{ type: "row", fields: [{ name: "value", type: "text", required: true }, { name: "label", type: "text", required: true }] }],
            },
          ],
        },
        {
          label: "Contents",
          description: "A part left empty is not shown on the page.",
          fields: [
            textList("why", "Why it matters now", "Paragraph"),
            {
              name: "editions", type: "array", labels: { singular: "Audience", plural: "Audiences" },
              fields: [{ name: "audience", type: "text", required: true }, { name: "text", type: "textarea", required: true }],
            },
            textList("learn", "What you will learn", "Point"),
            {
              name: "previews", type: "array", labels: { singular: "Preview", plural: "Previews (“A look inside”)" }, maxRows: 2,
              admin: { description: "An image, or a diagram from the design. Do not show more of the document than its page should give away." },
              fields: [
                { name: "image", type: "upload", relationTo: "media", filterOptions: { mimeType: { contains: "image" } } },
                {
                  // Raw markup, filtered again when shown (lib/sanitize.ts). Only administrators may write it.
                  name: "diagram", label: "Diagram (SVG)", type: "code", admin: { language: "html" },
                  access: { create: adminOnlyField, update: adminOnlyField },
                },
                { name: "caption", type: "text", required: true },
              ],
            },
            {
              name: "products", label: "SAVIS products in it", type: "text", hasMany: true, validate: validateProducts,
              admin: { description: "The last part of each product page address, e.g. “trustonboard”." },
            },
            {
              name: "chapters", type: "array", labels: { singular: "Chapter", plural: "Chapter titles" },
              admin: { description: "Titles only. The text of a chapter belongs in the document, not on the website." },
              fields: [{ name: "title", type: "text", required: true }],
            },
          ],
        },
        {
          label: "Questions",
          fields: [
            {
              name: "questions", type: "group", label: "Questions the document answers",
              fields: [
                { name: "heading", type: "text", admin: { description: "Empty: “Built around the questions regulators ask first”." } },
                { name: "intro", type: "textarea" },
                {
                  name: "items", type: "array", labels: { singular: "Question", plural: "Questions" },
                  fields: [{ name: "title", type: "text", required: true }, { name: "text", type: "textarea", required: true }],
                },
              ],
            },
            {
              name: "path", type: "group", label: "The way forward",
              fields: [{ name: "title", type: "text" }, { name: "text", type: "textarea" }],
            },
            textList("board", "Questions for the board", "Question"),
          ],
        },
      ],
    },
  ],
};
