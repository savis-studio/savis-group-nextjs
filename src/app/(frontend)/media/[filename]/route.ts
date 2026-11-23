import config from "@payload-config";
import { REST_GET } from "@payloadcms/next/routes";
import { getPayload } from "payload";

/**
 * Public path for files in the media collection: /media/<filename>.
 *
 * Payload serves the same files at /api/media/file/<filename>, but /api sits behind Cloudflare Access. This route
 * answers 404 for names that are not in the collection (Payload itself answers 500) and otherwise hands the request
 * to Payload's own file handler, so access rules, content types and range requests stay Payload's.
 * If image sizes are added to the Media collection, look their filenames up here too.
 */
const payloadGet = REST_GET(config);

export async function GET(request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  const payload = await getPayload({ config });
  const found = await payload.find({
    collection: "media",
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
    pagination: false,
    overrideAccess: false,
  });
  if (found.docs.length === 0) return new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });

  const target = new URL(request.url);
  target.pathname = `/api/media/file/${encodeURIComponent(filename)}`;
  return payloadGet(new Request(target, request), { params: Promise.resolve({ slug: ["media", "file", filename] }) });
}
