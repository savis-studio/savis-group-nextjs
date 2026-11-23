import type { CollectionConfig } from "payload";
import { isAdmin, isStaff, publicRead } from "../access";
import { auditChange, auditDelete } from "./audit";

export const Media: CollectionConfig = {
  slug: "media",
  access: { read: publicRead, create: isStaff, update: isStaff, delete: isAdmin },
  hooks: { afterChange: [auditChange], afterDelete: [auditDelete] },
  upload: {
    // No SVG or HTML: both can carry scripts. Add formats here deliberately.
    mimeTypes: ["image/png", "image/jpeg", "image/webp", "image/avif", "application/pdf"],
  },
  fields: [{ name: "alt", type: "text", required: true }],
};
