import type { CollectionConfig } from "payload";
import { isAdmin, isStaff, publicRead } from "../access";
import { auditChange, auditDelete } from "./audit";
import { revalidateSite } from "./revalidate";

export const Industries: CollectionConfig = {
  slug: "industries",
  admin: { useAsTitle: "name" },
  defaultSort: "createdAt",
  access: { read: publicRead, create: isStaff, update: isStaff, delete: isAdmin },
  versions: { maxPerDoc: 25 },
  hooks: { afterChange: [revalidateSite, auditChange], afterDelete: [auditDelete] },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
  ],
};
