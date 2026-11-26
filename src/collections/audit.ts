import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";

type Doc = Record<string, unknown> & { id: string | number };

const labelOf = (doc: Doc): string =>
  String(doc.name ?? doc.email ?? doc.filename ?? doc.title ?? doc.id).slice(0, 200);

/** Email of the signed-in person (an MCP request carries the account its key acts as). */
const actorOf = (user: unknown): string => (user as { email?: string | null } | null)?.email ?? "system";

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
      actor: actorOf(req.user),
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
      actor: actorOf(req.user),
    },
    context: { skipAudit: true },
    overrideAccess: true,
    req,
  });
  return doc;
};
