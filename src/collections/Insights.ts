import { BlocksFeature, LinkFeature, UploadFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { revalidatePath, revalidateTag } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionBeforeChangeHook, CollectionConfig } from "payload";
import { isAdmin, isStaff, publishedOrStaff } from "../access";
import { insightBlocks } from "../blocks/insights";
import { INSIGHTS_TAG } from "../lib/cache-tags";
import { INSIGHT_SECTIONS, validateCategory } from "../lib/insight-categories";
import { validateSlug } from "../lib/slug";
import { draftOnlyForMcp, keepHtmlBlocks } from "../mcp";
import { auditChange, auditDelete } from "./audit";
import { fillSlug } from "./fill-slug";

const purge = (slug?: string, context?: Record<string, unknown>) => {
  if (context?.disableRevalidate) return;
  try {
    revalidateTag(INSIGHTS_TAG, { expire: 0 });
    revalidatePath("/insights");
    revalidatePath("/");
    if (slug) revalidatePath(`/insights/${slug}`);
  } catch {
    /* not inside a Next.js request (import script) */
  }
};
const afterChange: CollectionAfterChangeHook = ({ doc, context }) => { purge(doc.slug, context); return doc; };
const afterDelete: CollectionAfterDeleteHook = ({ doc, context }) => { purge(doc?.slug, context); };

/** New articles go to the top of the list; the editor can still set an order by hand. */
const placeFirst: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  if (operation !== "create" || data.order != null) return data;
  const first = await req.payload.find({ collection: "insights", sort: "order", limit: 1, depth: 0, req });
  return { ...data, order: (first.docs[0]?.order ?? 1) - 1 };
};

/** Insight articles, regulatory news and press. Body is rich text; diagrams are editor blocks. */
export const Insights: CollectionConfig = {
  slug: "insights",
  labels: { singular: "Article", plural: "Articles (Insights & News)" },
  admin: { useAsTitle: "title", defaultColumns: ["title", "_status", "type", "cat", "publishedAt"] },
  defaultSort: "-publishedAt",
  access: { read: publishedOrStaff, readVersions: isStaff, create: isStaff, update: isStaff, delete: isAdmin },
  // "Save draft" keeps work off the site until "Publish changes". Drafts are validated like published articles.
  versions: { drafts: { validate: true }, maxPerDoc: 25 },
  // What an internal link needs to know about the article it points at (not its whole body).
  defaultPopulate: { slug: true, title: true, _status: true },
  hooks: { beforeOperation: [draftOnlyForMcp], beforeChange: [keepHtmlBlocks, placeFirst], afterChange: [afterChange, auditChange], afterDelete: [afterDelete, auditDelete] },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "slug", type: "text", required: true, unique: true, index: true,
      // Empty passes here because the hook fills it before the article is saved.
      validate: (value: unknown) => (value ? validateSlug(value) : true),
      hooks: { beforeValidate: [fillSlug], beforeDuplicate: [() => ""] },
      admin: { description: "URL: /insights/<slug>. Leave empty to make it from the title when you save. Changing it later breaks existing links." },
    },
    {
      type: "row",
      fields: [
        {
          // No default: a pre-filled section put press releases on the Blog tab without anyone choosing it.
          name: "type", label: "Section", type: "select", required: true,
          options: INSIGHT_SECTIONS.map(({ label, value }) => ({ label, value })),
          admin: { description: "The tab of /insights that shows the article." },
        },
        {
          name: "cat", label: "Category", type: "text", required: true,
          validate: (value: unknown, { siblingData }: { siblingData: unknown }) => validateCategory(value, (siblingData as { type?: unknown }).type),
          admin: {
            components: { Field: "/components/admin/CategorySelect#CategorySelect" },
            description: "In News & Regulation, “Regulation” shows under Regulation & Policy.",
          },
        },
        { name: "publishedAt", label: "Published", type: "date", admin: { date: { pickerAppearance: "dayOnly" } } },
        { name: "dateLabel", label: "Date label", type: "text", admin: { description: "Shown on cards when no exact date is known, e.g. “Mar 2026”." } },
      ],
    },
    { name: "summary", type: "textarea", required: true, admin: { description: "Card text and meta description (about 150 characters)." } },
    {
      name: "cover", label: "Cover image", type: "upload", relationTo: "media",
      filterOptions: { mimeType: { contains: "image" } },
      admin: { description: "Photo on cards and at the top of the article (landscape works best). Left empty, cards show an illustration." },
    },
    { name: "order", type: "number", admin: { position: "sidebar", description: "Lower numbers show first in lists such as “Keep reading”. Left empty, a new article goes to the top. The Insights page sorts by date instead." } },
    { name: "scene", type: "text", admin: { description: "Illustration key from the design (optional)." } },
    { name: "tags", type: "array", labels: { singular: "Tag", plural: "Tags" }, fields: [{ name: "tag", type: "text", required: true }] },
    {
      name: "sources", type: "array", labels: { singular: "Source", plural: "Sources" },
      fields: [{ name: "name", type: "text", required: true }, { name: "url", type: "text", required: true }],
    },
    {
      name: "body", type: "richText",
      // Only what the article page can show: no relationship nodes, images from Media, internal links to articles.
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures.filter((f) => !["relationship", "upload", "link"].includes(f.key)),
          UploadFeature({ enabledCollections: ["media"] }),
          LinkFeature({ enabledCollections: ["insights"] }),
          BlocksFeature({ blocks: insightBlocks }),
        ],
      }),
    },
  ],
};
