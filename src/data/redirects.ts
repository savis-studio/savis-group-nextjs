/**
 * Permanent (301) redirects, merged into next.config.ts. Add a line whenever a slug is renamed or a page is removed,
 * so old links and search rankings carry over. Slugs are the product renames recorded in the mockup's router.
 */
export const REDIRECTS: Array<{ from: string; to: string }> = [
  { from: "/products/smart-ekyc", to: "/products/trustonboard" },
  { from: "/products/ppm-media", to: "/products/mrp-ai" },
  { from: "/products/virtual-studio", to: "/products/playout-cg" },
  { from: "/products/media-superapp", to: "/products/cms-ai-hub" },
  { from: "/products/digital-id-mobile", to: "/products/national-eid-trust" },
  { from: "/products/smart-ekyc/datasheet", to: "/products/trustonboard/datasheet" },
  { from: "/products/digital-id-mobile/datasheet", to: "/products/national-eid-trust/datasheet" },
];
