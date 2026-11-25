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
| `#insights`, `#insights-*` | `/insights` (filter via `?type=`) | 4 |
| `#resources` | `/resources` | 4 |
| `#resources-blog/videos/brochures/briefs/datasheets/reports` | `/resources/[kind]` | 4 |
| `#services`, `#services-advise/developers/e2e` | `/services` (+ anchors) | 5 |
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

Hash URLs are never seen by the server, so no redirect is needed for them. Only the legacy slugs above matter.

## Data files (`src/data/mockup/`)

| File | Contents |
|---|---|
| `pillars.json` | 5 pillars (id, name, vi, slug, pitch, tags) |
| `groups.json` | 27 product groups, each with `pillar` and `items` |
| `products.json` | 114 products, normalised (`pillar` and `group` are slugs), plus `tags`, `scene`, `detail` |
| `news.json` | 81 items; the 20 `NEWS_C6` overrides are merged in |
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
- `app/sitemap.ts` (static routes + all dynamic records, with `lastModified`), `app/robots.ts` pointing at it.
- `noindex` stays on every host other than `INDEXABLE_HOST` (already in `src/proxy.ts`).
- Admin and API are already blocked by Cloudflare Access; add them to `robots.txt` as well.

**Rendering and speed**
- Public content pages must not be `force-dynamic`. Today the frontend layout is, because it reads the catalogue. Before Phase 3:
  render pages statically or with ISR (`revalidate`), and keep the header/footer catalogue on its existing 60 s cache tag.
- `next/image` for every photo, with width/height and meaningful `alt`.

## Open points

- Mockup pillar ids (`identity`, `cyber`, `gov`, `finance`, `ai`) differ from the long slugs in `pillars.json`; the
  existing CMS pillars use the short ids. Routes use the short id.
- Other inline images may still exist in the mockup's HTML templates (the `*Scene` constants and hero art). Check in Phase 1.
- `services-*`, `about-*`, `insights-*` are anchors or filters of one page, not separate pages.
