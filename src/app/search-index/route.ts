import { getSearchIndex } from "@/lib/search-index";

export const revalidate = 3600;

/** JSON index the header search loads the first time it opens. */
export async function GET() {
  return Response.json(await getSearchIndex(), { headers: { "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" } });
}
