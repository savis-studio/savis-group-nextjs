import type { CollectionConfig } from "payload";
import { isAdmin, isStaff, publicRead } from "../access";
import { auditChange, auditDelete } from "./audit";
import { revalidateSite } from "./revalidate";

/** Solution pillar with its product groups. Drives the Solutions & Products menu and the footer. */
export const Pillars: CollectionConfig = {
  slug: "pillars",
  admin: { useAsTitle: "name", defaultColumns: ["n", "name", "slug"] },
  defaultSort: "n",
  access: { read: publicRead, create: isStaff, update: isStaff, delete: isAdmin },
  versions: { maxPerDoc: 25 },
  hooks: { afterChange: [revalidateSite, auditChange], afterDelete: [auditDelete] },
  fields: [
    { name: "n", label: "Number", type: "text", required: true, admin: { description: 'Display order, e.g. "01".' } },
    { name: "name", type: "text", required: true },
    { name: "short", label: "Short name", type: "text", required: true, admin: { description: "Used in the mega-menu list." } },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "pitch", type: "textarea" },
    {
      name: "groups",
      type: "array",
      labels: { singular: "Group", plural: "Groups" },
      fields: [
        { name: "name", type: "text", required: true },
        {
          name: "items",
          label: "Products",
          type: "array",
          fields: [{ name: "name", type: "text", required: true }],
        },
      ],
    },
  ],
};
