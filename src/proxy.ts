import { NextResponse, type NextRequest } from "next/server";
import { accessMode, verifyAccessJwt } from "@/lib/access";

const PROTECTED = /^\/(admin|api)(\/|$)/;

function refuse(status: number, message: string): NextResponse {
  return NextResponse.json({ errors: [{ message }] }, { status, headers: { "Cache-Control": "no-store" } });
}

/**
 * 1. Second line of defence behind Cloudflare Access: /admin and /api need a valid Access JWT.
 * 2. Any host other than INDEXABLE_HOST (the staging hostname) is marked noindex.
 *
 * Public media is served from /media, which Next rewrites to /api/media/file after this runs,
 * so it never passes through the check above.
 */
export async function proxy(request: NextRequest) {
  let response: NextResponse | undefined;

  if (PROTECTED.test(request.nextUrl.pathname)) {
    const access = accessMode();
    if (access.mode === "misconfigured") {
      response = refuse(503, "Access is not configured.");
    } else if (access.mode === "enforce") {
      const token = request.headers.get("cf-access-jwt-assertion") ?? "";
      if (!(await verifyAccessJwt(token, access.config, request.nextUrl.pathname))) response = refuse(403, "Forbidden");
    }
  }

  response ??= NextResponse.next();

  const indexable = (process.env.INDEXABLE_HOST ?? "").trim().toLowerCase();
  const host = (request.headers.get("host") ?? "").toLowerCase().split(":")[0];
  if (indexable && host !== indexable) response.headers.set("X-Robots-Tag", "noindex, nofollow");

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
