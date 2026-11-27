/** Mockup hash route → real URL. See docs/ROUTES.md. Unknown hashes fall back to "/". */

const ALIASES: Record<string, string> = {
  "p-smart-ekyc": "p-trustonboard",
  "p-ppm-media": "p-mrp-ai",
  "p-virtual-studio": "p-playout-cg",
  "p-media-superapp": "p-cms-ai-hub",
  "p-digital-id-mobile": "p-national-eid-trust",
  "ds-smart-ekyc": "ds-trustonboard",
  "ds-digital-id-mobile": "ds-national-eid-trust",
  "partner-portal": "partners",
  "customers-stories": "customers",
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
  "services-pro": "/services#professional",
  // Stage anchors of the earlier services page.
  "services-advise": "/services#professional",
  "services-build": "/services#professional",
  "services-operate": "/services#professional",
  "services-e2e": "/services#professional",
  developers: "/services/developers",
  "services-developers": "/services/developers",
  // No report pages yet: a copy is requested through the contact form.
  "resources-reports": "/contact",
  "resources-datasheets": "/resources/datasheets",
  "resources-brochures": "/resources/brochures",
  "resources-briefs": "/resources/briefs",
  "resources-videos": "/resources/videos",
  "resources-blog": "/insights#insights",
  "tech-bulletins": "/insights#bulletins",
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

/** `services-pricing` → `/services#pricing`, an unknown `resources-*` → `/resources`, etc. */
function anchorFamily(key: string): string | null {
  const m = /^(services|about|insights|customers|use-cases)-(.+)$/.exec(key);
  if (m) return `/${m[1]}#${m[2]}`;
  if (key.startsWith("resources-")) return "/resources";
  // A single report has no page yet.
  if (key.startsWith("report-")) return "/insights";
  return null;
}
