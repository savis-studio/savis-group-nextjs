import type { FieldHook } from "payload";
import { slugFromTitle } from "../lib/slug";

/** Fills an empty article slug from the title; a number is added when another article already uses it. */
export const fillSlug: FieldHook = async ({ value, data, originalDoc, operation, req }) => {
  if (typeof value === "string" && value.trim() !== "") return value;
  // An update that does not mention the slug keeps it: the address of a page never changes by itself.
  const ownId = operation === "update" ? originalDoc?.id : undefined;
  if (value === undefined && ownId !== undefined && originalDoc?.slug) return originalDoc.slug;

  const base = slugFromTitle(data?.title ?? originalDoc?.title) || "article";
  for (let n = 1; ; n++) {
    const slug = n === 1 ? base : `${base}-${n}`;
    const { totalDocs } = await req.payload.count({
      collection: "insights",
      where: { and: [{ slug: { equals: slug } }, ...(ownId === undefined ? [] : [{ id: { not_equals: ownId } }])] },
      req,
    });
    if (totalDocs === 0) return slug;
  }
};
