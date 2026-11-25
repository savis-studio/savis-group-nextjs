import { hashToPath } from "./routes";

/** Mockup in-app hashes become real paths; the whitepaper library (no pages yet) points at /insights. */
export function mapHref(href: string): string {
  if (!href.startsWith("#")) return href;
  const key = href.slice(1);
  return /^(report-|resources)/.test(key) ? "/insights" : hashToPath(href);
}
