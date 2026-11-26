import type { CollectionAfterReadHook, CollectionConfig } from "payload";
import { isAdmin, isStaff, publicRead } from "../access";
import { auditChange, auditDelete } from "./audit";

// Payload prefixes file URLs with serverURL, so match both "/api/media/file/x" and "https://host/api/media/file/x".
const API_URL = /^(?:https?:\/\/[^/]+)?\/api\/media\/file\//;

const toPublicUrl = (url: unknown): unknown => (typeof url === "string" ? url.replace(API_URL, "/media/") : url);

/** Point file URLs at /media/*, the public path. /api/* is protected by Cloudflare Access. */
const publicFileUrls: CollectionAfterReadHook = ({ doc }) => {
  doc.url = toPublicUrl(doc.url);
  doc.thumbnailURL = toPublicUrl(doc.thumbnailURL);
  for (const size of Object.values<{ url?: unknown } | undefined>(doc.sizes ?? {})) {
    if (size) size.url = toPublicUrl(size.url);
  }
  return doc;
};

export const Media: CollectionConfig = {
  slug: "media",
  access: { read: publicRead, create: isStaff, update: isStaff, delete: isAdmin },
  hooks: { afterChange: [auditChange], afterDelete: [auditDelete], afterRead: [publicFileUrls] },
  upload: {
    // No SVG or HTML: both can carry scripts. Add formats here deliberately.
    mimeTypes: ["image/png", "image/jpeg", "image/webp", "image/avif", "application/pdf"],
    // A smaller copy for cards. Served by app/(frontend)/media/[filename], which looks its name up too.
    imageSizes: [{ name: "card", width: 800 }],
  },
  fields: [{ name: "alt", type: "text", required: true }],
};
