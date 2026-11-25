/** Mockup hash route → real URL. See docs/ROUTES.md. Unknown hashes fall back to "/". */

const ALIASES: Record<string, string> = {
  "p-smart-ekyc": "p-trustonboard",
  "p-ppm-media": "p-mrp-ai",
  "p-virtual-studio": "p-playout-cg",
  "p-media-superapp": "p-cms-ai-hub",
  "p-digital-id-mobile": "p-national-eid-trust",
  "ds-smart-ekyc": "ds-trustonboard",
  "ds-digital-id-mobile": "ds-national-eid-trust",
};

/** Top-level pages that keep their name. */
const SAME = new Set([
  "solutions", "industries", "use-cases", "customers", "insights", "resources", "services", "innovation",
  "about", "partners", "careers", "contact", "investors", "trust-center", "privacy", "terms", "cookies",
]);

const NESTED: Record<string, string> = {
  "pqc-lab": "/innovation/pqc-lab",
  culture: "/about/culture",
  esg: "/about/esg",
  integrity: "/about/integrity",
};

const PREFIXES: Array<[prefix: string, base: string, suffix?: string]> = [
  ["p-", "/products/"],
  ["ds-", "/products/", "/datasheet"],
  ["case-", "/customers/"],
  ["uc-", "/use-cases/"],
  ["ind-", "/industries/"],
  ["news-", "/insights/"],
  ["pillar-", "/solutions/"],
];

export function hashToPath(href: string): string {
  if (!href.startsWith("#")) return href;
  const raw = href.slice(1);
  const key = ALIASES[raw] ?? raw;
  if (key === "" || key === "home" || key === "who") return "/";
  if (SAME.has(key)) return `/${key}`;
  if (NESTED[key]) return NESTED[key];
  if (key.startsWith("grp-")) return `/solutions#${key.slice(4)}`;
  for (const [prefix, base, suffix = ""] of PREFIXES) {
    if (key.startsWith(prefix)) return `${base}${key.slice(prefix.length)}${suffix}`;
  }
  const family = anchorFamily(key);
  return family ?? "/";
}

/** `services-advise` → `/services#advise`, `resources-blog` → `/resources/blog`, etc. */
function anchorFamily(key: string): string | null {
  const m = /^(services|about|insights|customers|use-cases)-(.+)$/.exec(key);
  if (m) return `/${m[1]}#${m[2]}`;
  const r = /^resources-(.+)$/.exec(key);
  if (r) return `/resources/${r[1]}`;
  return null;
}
