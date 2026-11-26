import { mcpPlugin } from "@payloadcms/plugin-mcp";
import { APIError, type CollectionBeforeOperationHook, type Field, type PayloadRequest } from "payload";
import { adminOnlyField, isAdmin } from "./access";
import { auditChange, auditDelete } from "./collections/audit";

/** True when the request comes from an AI assistant through /api/mcp. */
export const isMcpRequest = (req: PayloadRequest): boolean =>
  req.payloadAPI === "MCP" || (req.user as { _strategy?: string } | null)?._strategy === "mcp-api-key";

/**
 * An assistant may only save drafts; publishing stays with a person in the admin panel. Forced before Payload reads
 * the draft flag, so a draft saved over a published article leaves the live page as it is. It also may not write over
 * an article that someone has open in the editor.
 */
export const draftOnlyForMcp: CollectionBeforeOperationHook = ({ args, operation, req }) => {
  if (!isMcpRequest(req)) return args;
  if (operation === "delete") throw new APIError("Assistants cannot delete articles.", 403);
  if (operation !== "create" && operation !== "update") return args;
  const incoming = args as { data?: Record<string, unknown> };
  return {
    ...args,
    draft: true,
    overrideLock: false,
    publishAllLocales: false,
    unpublishAllLocales: false,
    data: { ...incoming.data, _status: "draft" },
  };
};

const ARTICLES = [
  "SAVIS website articles (research, regulatory news, press), written in English and shown at /insights/<slug>.",
  "Everything saved here is a draft: a person reviews and publishes it in the admin panel. Deleting is not possible.",
  "Required: title; slug (lowercase letters, digits and single hyphens, unique); type (insight, news or press);",
  "cat (category, e.g. Event, Award, Corporate, Partnership, Press release, Regulation, Insight); summary (about 150 characters).",
  "body is Lexical JSON: paragraph, heading (h2 or h3), list and link nodes; links use linkType custom.",
  "Never invent facts, figures, quotes or sources. Pass draft: true when finding, to see unpublished changes.",
].join(" ");

/**
 * MCP server at /api/mcp. Nothing can be reached until an administrator creates an API key.
 *
 * The plugin builds each tool's input schema with TypeScript's JavaScript API. Keep `typescript` below version 7 (which
 * has no such API): otherwise create and update silently accept no article fields at all.
 */
export const savisMcp = mcpPlugin({
  collections: { insights: { description: ARTICLES, enabled: { find: true, create: true, update: true } } },
  // Only administrators issue keys, and they choose which account a key acts as.
  overrideApiKeyCollection: (collection) => ({
    ...collection,
    access: { create: isAdmin, read: isAdmin, update: isAdmin, delete: isAdmin, unlock: isAdmin },
    hooks: { ...collection.hooks, afterChange: [auditChange], afterDelete: [auditDelete] },
    fields: collection.fields.map((field): Field =>
      field.type === "relationship" && field.name === "user"
        ? ({
            ...field,
            access: { create: adminOnlyField, update: adminOnlyField },
            admin: { ...field.admin, description: "The account the assistant acts as. Use an Editor account made for it." },
          } as Field)
        : field,
    ),
  }),
});
