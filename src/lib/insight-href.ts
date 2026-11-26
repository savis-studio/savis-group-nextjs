import { hashToPath } from "./routes";

/**
 * Points the mockup's relative `media/...` files at their uploaded copies. A file without a URL is removed together
 * with the figure or link around it, so a page never shows a broken picture or a dead download.
 */
export function localMedia(html: string, url: (file: string) => string | undefined): string {
  return html
    .replace(/(href|src)="media\/(?:[^"]*\/)?([^"\/]+)"/g, (m, attr: string, file: string) => {
      const to = url(file);
      return to ? `${attr}="${to}"` : m;
    })
    .replace(/<figure\b(?:(?!<\/figure>)[\s\S])*?src="media\/(?:(?!<\/figure>)[\s\S])*<\/figure>/g, "")
    .replace(/<a\s[^>]*href="media\/[^>]*>[\s\S]*?<\/a>/g, "");
}

/** Mockup in-app hashes become real paths; the whitepaper library (no pages yet) points at /insights. */
export function mapHref(href: string): string {
  if (!href.startsWith("#")) return href;
  const key = href.slice(1);
  return /^(report-|resources)/.test(key) ? "/insights" : hashToPath(href);
}
