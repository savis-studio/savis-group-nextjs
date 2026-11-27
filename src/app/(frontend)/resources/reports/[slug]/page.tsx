import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { seriesLabel, ReportCover } from "@/components/resources/ReportCover";
import { Button, Card, Section, SectionHead } from "@/components/ui";
import { JsonLd } from "@/components/seo/JsonLd";
import { SmartLink } from "@/components/ui/SmartLink";
import { PhotoThumb, Thumb } from "@/components/ui/Thumb";
import { getProduct } from "@/lib/content";
import { getArticles } from "@/lib/insights";
import { getReport, reportPath } from "@/lib/reports";
import { blogPosts } from "@/lib/resources";
import { breadcrumbLd, buildMetadata } from "@/lib/seo";
import { newsThumb } from "@/lib/thumbs";
import { RequestForm } from "./RequestForm";

// Reports are published in the CMS, so no address is known while building: each page is rendered when first asked for.
export const generateStaticParams = () => [];

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = await getReport((await params).slug);
  if (!r) return {};
  return buildMetadata({ title: r.title, description: r.subtitle.length < 50 ? r.lead : r.subtitle, path: reportPath(r.slug) });
}

const Bullets = ({ items }: { items: string[] }) => <ul className="sv-rp__ul">{items.map((x) => <li key={x}>{x}</li>)}</ul>;

export default async function ReportPage({ params }: Props) {
  const r = await getReport((await params).slug);
  if (!r) notFound();
  const noun = r.kind.toLowerCase();
  const products = r.products.flatMap((slug) => getProduct(slug) ?? []);
  const posts = blogPosts(await getArticles()).slice(0, 3);
  const trail = [{ name: "Resources", path: "/resources" }, { name: "Reports", path: "/resources/reports" }];
  return (
    <main>
      <JsonLd data={breadcrumbLd([...trail, { name: r.title, path: reportPath(r.slug) }])} />
      <header className="sv-rphero" data-pal={r.palette}>
        <div className="sv-wrap">
          <div>
            <nav className="sv-rphero__crumbs" aria-label="Breadcrumb">
              <SmartLink href="/">Home</SmartLink>
              {trail.map((t) => <SmartLink key={t.path} href={t.path}>{t.name}</SmartLink>)}
              <span aria-current="page">{r.title}</span>
            </nav>
            <span className="sv-rphero__k">{r.series ? seriesLabel(r.series) : `${r.kind} · ${r.topic}`}</span>
            <h1>{r.title}</h1>
            {r.hook && <p className="sv-rphero__hook">{r.hook}</p>}
            <p className="sv-rphero__lead">{r.lead}</p>
            <a className="sv-rphero__go" href="#request">Request the {noun}</a>
            {r.credit && <p className="sv-rphero__credit">{r.credit}</p>}
          </div>
          <ReportCover report={r} />
        </div>
      </header>

      <div className="sv-rp">
        <div className="sv-wrap">
          <div className="sv-rp__in">
            {r.stats.length > 0 && (
              <ul className="sv-rp__stats">{r.stats.map((s) => <li key={s.label}><b>{s.value}</b><span>{s.label}</span></li>)}</ul>
            )}
            {r.why.length > 0 && <section><h2>Why it matters now</h2>{r.why.map((x) => <p key={x}>{x}</p>)}</section>}
            {r.editions.length > 0 && (
              <section>
                <h2>{r.editions.length === 2 ? "Two audiences. One plan." : "Who it is for"}</h2>
                {r.editions.length === 2 && <p>The {noun} is written for the two groups who have to get this right together.</p>}
                <div className="sv-rp__boxes">{r.editions.map((x) => <div key={x.audience}><h3>{x.audience}</h3><p>{x.text}</p></div>)}</div>
              </section>
            )}
            {r.learn.length > 0 && <section><h2>What you will learn</h2><Bullets items={r.learn} /></section>}
            {r.previews.length > 0 && (
              <section>
                <h2>A look inside</h2>
                <p>{r.previews.length === 1 ? "A diagram" : "Diagrams"} from the {noun}.</p>
                <div className="sv-rp__figs">
                  {r.previews.map((p) => (
                    <figure key={p.caption}>
                      {p.image
                        ? <img src={p.image.src} alt={p.image.alt} loading="lazy" decoding="async" />
                        // Filtered in lib/reports.ts.
                        : <div dangerouslySetInnerHTML={{ __html: p.svg ?? "" }} />}
                      <figcaption>{p.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            )}
            {products.length > 0 && (
              <section>
                <h2>SAVIS products in this {noun}</h2>
                <div className="sv-rp__boxes">
                  {products.map((p) => (
                    <div key={p.slug}><h3>{p.name}</h3><p>{p.desc}</p><SmartLink href={`/products/${p.slug}`}>View {p.name.replace(/^SAVIS /, "")} →</SmartLink></div>
                  ))}
                </div>
              </section>
            )}
            {r.chapters.length > 0 && (
              <section><h2>Inside the {noun}</h2><ul className="sv-rp__toc">{r.chapters.map((c) => <li key={c}>{c}</li>)}</ul></section>
            )}
            {r.questions.items.length > 0 && (
              <section>
                <h2>{r.questions.heading ?? "Built around the questions regulators ask first"}</h2>
                {r.questions.intro && <p>{r.questions.intro}</p>}
                <div className="sv-rp__qs">{r.questions.items.map((q) => <div key={q.title}><h3>{q.title}</h3><p>{q.text}</p></div>)}</div>
              </section>
            )}
            {r.path.title && r.path.text && <section><h2>{r.path.title}</h2><p>{r.path.text}</p></section>}
            {r.board.length > 0 && (
              <section>
                <h2>Questions for the board</h2>
                <p>A board that gets a documented answer to each question is governing the risk. From the {noun}:</p>
                <Bullets items={r.board} />
              </section>
            )}
          </div>
        </div>
        <div className="sv-rp__request" id="request"><div className="sv-wrap"><RequestForm slug={r.slug} kind={r.kind} /></div></div>
      </div>

      {posts.length > 0 && (
        <Section tone="surface">
          <SectionHead eyebrow="Related reading" title="Go deeper on the blog"><Button href="/insights#insights" variant="ghost">All blog posts</Button></SectionHead>
          <div className="sv-grid">
            {posts.map((n) => (
              <Card key={n.id} thumb={n.cover ? <PhotoThumb src={n.cover.src} big={false} /> : <Thumb spec={newsThumb(n)} />} title={n.title} href={`/insights/${n.id}`} cta="Read the post">{n.sum}</Card>
            ))}
          </div>
        </Section>
      )}
    </main>
  );
}
