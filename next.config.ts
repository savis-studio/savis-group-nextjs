import type { NextConfig } from "next";
import path from "node:path";
import { withPayload } from "@payloadcms/next/withPayload";

const isProd = process.env.NODE_ENV === "production";

// Headers that need no per-request nonce. A script-src CSP is a separate step (Next and Payload both inject inline scripts).
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
  },
  ...(isProd ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }] : []),
];

const nextConfig: NextConfig = {
  output: "standalone",
  // The file tracer copies a native addon (.node) but not the shared libraries next to it (libvips for sharp).
  // Without these the standalone server fails with "Could not load the sharp module".
  outputFileTracingIncludes: {
    "/*": ["./node_modules/@img/**/*", "./node_modules/@libsql/**/*", "./node_modules/libsql/**/*"],
  },
  turbopack: { root: path.resolve(__dirname) },
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/media/:filename", headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }] },
      // Keep admin and API responses out of shared caches.
      { source: "/admin/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] },
      { source: "/api/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] },
    ];
  },
};

export default withPayload(nextConfig);
