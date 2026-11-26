import { mcpPlugin } from "@payloadcms/plugin-mcp";
import { APIError, type CollectionBeforeChangeHook, type CollectionBeforeOperationHook, type Field, type PayloadRequest } from "payload";
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

/** Blocks whose content is raw markup. Only people may write them. */
const RAW_HTML_BLOCKS = new Set(["htmlBlock", "diagramHtml"]);

/** Every raw-markup block anywhere in an editor body, as a comparable string. */
function rawHtmlBlocks(node: unknown, found: string[] = []): string[] {
  if (!node || typeof node !== "object") return found;
  const { blockType, html } = node as { blockType?: unknown; html?: unknown };
  if (typeof blockType === "string" && RAW_HTML_BLOCKS.has(blockType)) found.push(JSON.stringify([blockType, html]));
  for (const child of Object.values(node)) rawHtmlBlocks(child, found);
  return found;
}

/**
 * An assistant may keep, move or remove the HTML blocks an article already has, but not add one, copy one or change its
 * markup: text it read elsewhere must not be able to put markup on the site.
 */
export const keepHtmlBlocks: CollectionBeforeChangeHook = ({ data, originalDoc, req }) => {
  if (!isMcpRequest(req) || data.body === undefined || data.body === null) return data;
  if (typeof data.body !== "object") throw new APIError("body must be a Lexical JSON object.", 400, undefined, true);
  const left = rawHtmlBlocks(originalDoc?.body);
  for (const block of rawHtmlBlocks(data.body)) {
    const at = left.indexOf(block);
    if (at < 0) {
      throw new APIError("Assistants cannot add or change HTML blocks. Send the article's existing HTML blocks back exactly as they are, or leave them out.", 403, undefined, true);
    }
    left.splice(at, 1);
  }
  return data;
};

const ARTICLES = [
  "SAVIS website articles (research, regulatory news, press), written in English and shown at /insights/<slug>.",
  "Everything saved here is a draft: a person reviews and publishes it in the admin panel. Deleting is not possible.",
  "Required: title; slug (lowercase letters, digits and single hyphens, unique); type (insight, news or press);",
  "cat (category, e.g. Event, Award, Corporate, Partnership, Press release, Regulation, Insight); summary (about 150 characters).",
  "body is Lexical JSON: paragraph, heading (h2 or h3), list and link nodes; links use linkType custom.",
  "htmlBlock and diagramHtml blocks are for people only: never add or edit one; when updating, send existing ones back unchanged.",
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
