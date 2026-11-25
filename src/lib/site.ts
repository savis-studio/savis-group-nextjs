export const SITE_NAME = "SAVIS Group";
export const SITE_TAGLINE = "Trusted Digital Infrastructure for a Smarter World";
export const SITE_DESCRIPTION =
  "Identity, trust and secure platforms for nations, banks, smart cities and enterprises, built on core technology SAVIS designs itself.";
export const SALES_EMAIL = "sales@savis-group.com";

/**
 * Canonical origin of the public site. A constant on purpose: pages are prerendered at build time, so anything read
 * from a runtime environment variable would be baked in wrong. Staging hosts still point their canonical here and are
 * kept out of search by the noindex header in src/proxy.ts.
 */
export const SITE_ORIGIN = "https://savis-group.com";

/** Absolute URL for a site path. */
export const absoluteUrl = (path: string): string => new URL(path, SITE_ORIGIN).toString();
