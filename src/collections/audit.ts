import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";

type Doc = Record<string, unknown> & { id: string | number };

const labelOf = (doc: Doc): string =>
  String(doc.name ?? doc.email ?? doc.filename ?? doc.title ?? doc.id).slice(0, 200);

/** Records who created or changed a document. Never stores field values (no passwords or secrets). */
export const auditChange: CollectionAfterChangeHook = async ({ doc, operation, req, collection, context }) => {
  if (context?.skipAudit) return doc;
  await req.payload.create({
    collection: "audit-logs",
    data: {
      action: operation === "create" ? "create" : "update",
      collection: collection.slug,
      docId: String(doc.id),
      label: labelOf(doc as Doc),
      actor: req.user?.email ?? "system",
    },
    context: { skipAudit: true },
    overrideAccess: true,
    req,
  });
  return doc;
};

export const auditDelete: CollectionAfterDeleteHook = async ({ doc, req, collection, context }) => {
  if (context?.skipAudit) return doc;
  await req.payload.create({
    collection: "audit-logs",
    data: {
      action: "delete",
      collection: collection.slug,
      docId: String(doc.id),
      label: labelOf(doc as Doc),
      actor: req.user?.email ?? "system",
    },
    context: { skipAudit: true },
    overrideAccess: true,
    req,
  });
  return doc;
};
