# Route map: mockup (hash) → Next.js

Source of truth for Phase 1–6. Data lives in `src/data/mockup/*.json`, extracted from the mockup by running it in jsdom
(the mockup patches its own constants, so only the final state is correct).

## Static pages

| Mockup | Next.js route | Phase |
|---|---|---|
| `#home`, `#who` | `/` | 1 |
| `#solutions` | `/solutions` (canonical) | 3 |
| `#grp-<group>` | `/solutions#<group>`; the mockup renders the same page as `#solutions`, so no separate URL | 3 |
| `#pillar-<id>` | `/solutions/[pillar]` (5 pillars) | 3 |
| `#industries` | `/industries` | 3 |
| `#use-cases`, `#use-cases-matrix` | `/use-cases` | 3 |
| `#customers`, `#customers-*` | `/customers` | 4 |
| `#insights`, `#insights-*` | `/insights` (overview; tabs are the hashes `#news`, `#press`, `#regulation`, `#insights` = Blog) | 4 |
| `#resources` | `/resources` | 4 |
| `#resources-datasheets/brochures/briefs/videos` | `/resources/[kind]` | 4 |
| `#resources-blog` | `/insights#insights` (the Blog tab) | 4 |
| `#resources-reports` | `/resources/reports` (redirects to `/contact` while no report is published) | 4 |
| `#report-<id>` | report pages are `/resources/reports/[slug]`; links in the bundled articles map to `/insights` until `npm run link:reports` points them at published reports | 4 |
| `#services`, `#services-pro/support/watch` | `/services` (+ anchors); the older `#services-advise/build/operate/e2e` go to `#professional` | 5 |
| `#developers`, `#services-developers` | `/services/developers` | 5 |
| `#innovation` | `/innovation` | 5 |
| `#pqc-lab` | `/innovation/pqc-lab` | 5 |
| `#about`, `#about-story/strategy/presence`, `#company` | `/about` (+ anchors) | 5 |
| `#culture` `#esg` `#integrity` | `/about/culture`, `/about/esg`, `/about/integrity` | 5 |
| `#partners`, `#partner-portal` | `/partners` | 5 |
| `#careers` | `/careers` | 5 |
| `#contact` | `/contact` | 5 |
| `#investors` | `/investors` | 5 |
| `#trust-center` | `/trust-center` | 5 |
| `#privacy`, `#terms`, `#cookies` | `/privacy`, `/terms`, `/cookies` | 5 |

## Dynamic pages

| Mockup | Next.js route | Records |
|---|---|---|
| `#p-<slug>` | `/products/[slug]` | 114 (12 have rich `detail`) |
| `#ds-<slug>` | `/products/[slug]/datasheet` | 12 |
| `#ind-<id>` | `/industries/[id]` | 13 |
| `#uc-<id>` | `/use-cases/[id]` | 43 |
| `#case-<id>` | `/customers/[id]` | 32 |
| `#news-<id>` | `/insights/[id]` | 81 |

## Redirects (301)

Old product aliases from `route()`:

| From | To |
|---|---|
| `p-smart-ekyc` | `/products/trustonboard` |
| `p-ppm-media` | `/products/mrp-ai` |
| `p-virtual-studio` | `/products/playout-cg` |
| `p-media-superapp` | `/products/cms-ai-hub` |
| `p-digital-id-mobile` | `/products/national-eid-trust` |
| `ds-smart-ekyc` | `/products/trustonboard/datasheet` |
| `ds-digital-id-mobile` | `/products/national-eid-trust/datasheet` |

Hash URLs are never seen by the server, so no redirect is needed for them. The product renames are implemented in `src/data/redirects.ts`
(Next answers `308`, a permanent redirect that search engines treat like a 301). Add a line there whenever a slug changes.

## Data files (`src/data/mockup/`)

| File | Contents |
|---|---|
| `pillars.json` | 5 pillars (id, name, vi, slug, pitch, tags) |
| `groups.json` | 27 product groups, each with `pillar` and `items` |
| `products.json` | 114 products, normalised (`pillar` and `group` are slugs), plus `tags`, `scene`, `detail` |
| `news.json` | 129 items (research and blog, news with sources, press releases, regulation); photos listed in `news-media.json` |
| `cases.json` | `categories`, 32 `items`, `useCaseLinks`, `clientGroups` |
| `use-cases.json` | 43 use cases |
| `industries.json` | 13 `items` and `groupIndustries` |
| `company.json` | offices, legal text, services, partners, business lines, solution packs |
| `graphics.json` | icons, globe points, camera spec and mechanism, and `dev` (12 device photos, now files in `public/images/devices/`) |

## SEO rules (apply from Phase 2, so every page ships compliant)

**URLs**
- Lowercase, hyphenated, no trailing slash (`trailingSlash: false`). One URL per content: anything else redirects 301 or sets a canonical.
- Slugs come from the data ids. All current ones match `[a-z0-9-]+` and are at most 44 characters; keep new ones under 60.
- Renaming a slug requires a 301 from the old one (kept in `src/data/redirects`, merged into `next.config.ts`).
- Query parameters (`?type=`, `?page=`) are for filtering only. Filtered and paginated views carry a canonical to the unfiltered page, except `?page=n`, which is self-canonical.

**Per page (helper `buildMetadata()`)**
- Unique `title` (≤ 60 characters, `Page | SAVIS Group`) and `description` (≤ 160), from existing fields: `desc`, `sum`, `tagline`, `pitch`.
- Canonical on `INDEXABLE_HOST`, OpenGraph and Twitter cards, `og:image` fallback.
- Breadcrumb in the UI and `BreadcrumbList` JSON-LD: Solutions › Pillar › Product, Insights › Article, Customers › Case.

**Structured data (JSON-LD)**
- `Organization` + `WebSite` on `/`.
- `Article` / `NewsArticle` on `/insights/[id]` (dates from `iso`).
- `SoftwareApplication` on `/products/[slug]`.
- `BreadcrumbList` everywhere below the top level.

**Crawling**
- `app/sitemap.ts` lists only routes marked `ready` in `src/lib/sitemap-routes.ts`; flip the flag in the same change that adds a page. `app/robots.ts` points at it.
- `noindex` stays on every host other than `INDEXABLE_HOST` (already in `src/proxy.ts`).
- Admin and API are already blocked by Cloudflare Access; add them to `robots.txt` as well.

**Rendering and speed**
- Done in Phase 2: the frontend layout is no longer `force-dynamic`. Pages are prerendered and refreshed every 60 s (ISR). While `next build`
  runs there is no database, so `getCatalog()` returns the bundled catalogue; the first refresh after deploy brings in the CMS data.
  Admin edits still purge the cache at once. New pages must not read cookies, headers or search params unless they need to, or they become dynamic again.
- The canonical origin is the constant `SITE_ORIGIN` in `src/lib/site.ts` (not an env var), because prerendered HTML cannot read runtime env.
- `next/image` for every photo, with width/height and meaningful `alt`.

## Open points

- Mockup pillar ids (`identity`, `cyber`, `gov`, `finance`, `ai`) differ from the long slugs in `pillars.json`; the
  existing CMS pillars use the short ids. Routes use the short id.
- Other inline images may still exist in the mockup's HTML templates (the `*Scene` constants and hero art). Check in Phase 1.
- `services-*`, `about-*`, `insights-*` are anchors or filters of one page, not separate pages.

## Status after Phase 6 (2026-11-25)

All routes above are built. `/resources` and its four category pages (2026-11-27) list datasheets, solution brochures and briefs
(from the catalogue) and the videos (`src/data/films.ts`). Reports and whitepapers (`/resources/reports` and
`/resources/reports/[slug]`) come only from the CMS collection `reports`: nothing is bundled, and only published ones are shown,
listed in the sitemap and searchable. Their pages ask for the document through a form (collection `document-requests` and
HubSpot); the website holds no PDF. See `DEPLOY.md`.

Checks, run against a production build (for example `CF_ACCESS_ENFORCE=off npx next start -p 3150`):

- `npm run check`: route mapper and SEO helpers (unit level).
- `npm run audit [baseUrl]`: crawls every sitemap URL for status, title and description length, canonical, one `<h1>`, `lang`,
  Open Graph, JSON-LD validity, image `alt`, duplicate ids, placeholder `href="#"`, and every internal link and `#anchor`.
  Last run: 309 pages, 0 errors, 0 warnings.
- Lighthouse 12 (local, default mobile settings): SEO 100 on all sampled pages; accessibility 98 to 100; best practices 96 to 100;
  performance 84 to 95 (home is lowest: LCP about 3.4 s and about 400 ms blocking time from the hero canvases).

Site search: the header button opens an overlay that filters `/search-index` (JSON built from bundled data plus CMS articles, titles, summaries and keywords only) in the browser; `/search?q=` is the no-JS results page (noindex). Shortcuts: Ctrl/Cmd+K, `/`.

Known gaps: no cookie-consent UI (the "Cookie settings" footer link
was removed, but the cookie policy text still describes analytics and marketing consent); contact messages are stored in Payload
(`inquiries`) with no email notification.

## Previous site (`/en/...`)

savis-group.com used to serve a site with every page under `/en`. `src/data/legacy-redirects.ts` sends those URLs (301) to the
pages here: `/en/x` to `/x`, `/en/solutions/<pillar>/<group>/<product>` to `/products/<product>` (or to the solution page for
products that no longer exist), and `/en/insights/<title-slug>` to `/insights/<id>`. `www` redirects to the apex.
`npx tsx scripts/check-legacy.ts` checks the 140 URLs crawled from the old site (`scripts/fixtures/legacy-urls.txt`): all land on an existing page.
