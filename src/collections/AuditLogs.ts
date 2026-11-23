import type { CollectionConfig } from "payload";
import { isAdmin, nobody } from "../access";

/** Append-only trail of content and account changes. Written by hooks only; admins can read it. */
export const AuditLogs: CollectionConfig = {
  slug: "audit-logs",
  admin: { useAsTitle: "label", group: "Security", defaultColumns: ["createdAt", "action", "collection", "label", "actor"] },
  defaultSort: "-createdAt",
  access: { read: isAdmin, create: nobody, update: nobody, delete: nobody },
  fields: [
    {
      name: "action",
      type: "select",
      required: true,
      options: ["create", "update", "delete"],
    },
    { name: "collection", type: "text", required: true, index: true },
    { name: "docId", type: "text", required: true },
    { name: "label", type: "text" },
    { name: "actor", type: "text", required: true, index: true },
  ],
};
