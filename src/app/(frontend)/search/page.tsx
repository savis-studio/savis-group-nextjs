import type { Metadata } from "next";
import { PageShell } from "@/components/page/PageShell";
import { Button, Section } from "@/components/ui";
import { groupResults, search } from "@/lib/search";
import { getSearchIndex } from "@/lib/search-index";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Search",
  description: "Search SAVIS solutions, products, use cases, customer stories and articles.",
  path: "/search",
  noindex: true,
});

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const raw = (await searchParams).q;
  const q = (Array.isArray(raw) ? raw[0] : raw)?.slice(0, 120).trim() ?? "";
  const results = q ? search(await getSearchIndex(), q, 60) : [];
  return (
    <PageShell path="/search" title="Search" cta={false} lead="Solutions, products, use cases, customer stories and articles.">
      <Section>
        <div className="sv-sp">
          <form action="/search" role="search">
            <input type="search" name="q" defaultValue={q} placeholder="Search the site" aria-label="Search the site" autoComplete="off" />
            <Button type="submit">Search</Button>
          </form>
          {q && results.length === 0 && <p>No results for “{q}”. Try fewer words, or <a href="/contact">ask an expert</a>.</p>}
          {q && results.length > 0 && <p aria-live="polite">{results.length} result{results.length === 1 ? "" : "s"} for “{q}”</p>}
          {groupResults(results).map(([kind, items]) => (
            <section key={kind} aria-label={kind}>
              <h2 style={{ font: "600 12.5px var(--font-body)", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--brand)", margin: 0 }}>{kind}</h2>
              {items.map((r) => (
                <a key={r.u} href={r.u} className="sv-sp__hit"><b>{r.t}</b><span>{r.s}</span></a>
              ))}
            </section>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
