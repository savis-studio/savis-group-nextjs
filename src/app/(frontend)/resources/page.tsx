import type { Metadata } from "next";
import { PageShell } from "@/components/page/PageShell";
import { LibraryTabs } from "@/components/resources/LibraryParts";
import { ResourceArt } from "@/components/resources/ResourceArt";
import { VideoButton } from "@/components/resources/VideoDialog";
import { Button, Card, Section, SectionHead } from "@/components/ui";
import { SmartLink } from "@/components/ui/SmartLink";
import { PhotoThumb, Thumb } from "@/components/ui/Thumb";
import { FILMS, type FilmId } from "@/data/films";
import { getPillars, getUseCases, pillarOfProduct } from "@/lib/content";
import { getArticles } from "@/lib/insights";
import { blogPosts, brochureArt, datasheetProducts, resourceSets, type ResourceCard } from "@/lib/resources";
import { hashToPath } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { newsThumb, useCaseThumb } from "@/lib/thumbs";

export const metadata: Metadata = buildMetadata({
  title: "Resource library",
  description: "Datasheets, solution brochures and briefs, videos and expert articles to evaluate SAVIS products and solutions.",
  path: "/resources",
});

/** One of the three picks under "Start here". */
function Pick({ card }: { card: ResourceCard }) {
  const body = (
    <>
      <span className="sv-libpick__th"><ResourceArt art={card.art} />{card.film && <span className="sv-mx__play" aria-hidden="true" />}</span>
      <span className="sv-libpick__body"><em>{card.tag}</em><b>{card.title}</b><i>{card.cta}</i></span>
    </>
  );
  return card.film
    ? <VideoButton film={card.film} className="sv-libpick">{body}</VideoButton>
    : <SmartLink href={hashToPath(card.href ?? "#resources")} className="sv-libpick">{body}</SmartLink>;
}

export default async function ResourcesPage() {
  const articles = await getArticles();
  const posts = blogPosts(articles).slice(0, 8);
  const featured = resourceSets(articles)[0];
  const pillars = getPillars();
  const datasheets = datasheetProducts();
  const briefs = getUseCases();
  return (
    <PageShell
      path="/resources"
      eyebrow="Resources"
      title="Everything you need to evaluate SAVIS."
      label="Resources"
      lead="Datasheets, solution brochures and briefs, videos and expert articles - in one library."
    >
      <LibraryTabs />

      <section className="sv-libband">
        <div className="sv-wrap">
          <div className="sv-libband__head">
            <div><span>{featured.heading}</span><h2>Start here</h2></div>
            <SmartLink href="/contact">Request any document →</SmartLink>
          </div>
          <div className="sv-libband__grid">{featured.cards.map((c) => <Pick key={c.title} card={c} />)}</div>
        </div>
      </section>

      <Section id="datasheets">
        <SectionHead eyebrow="Datasheets" title="Product datasheets"><Button href="/resources/datasheets" variant="ghost">All datasheets</Button></SectionHead>
        {pillars.map((p) => {
          const list = datasheets.filter((d) => pillarOfProduct(d)?.id === p.id);
          if (!list.length) return null;
          return (
            <div key={p.id} className="sv-libgroup">
              <h3>{p.name} <span>{list.length}</span></h3>
              <ul>
                {list.slice(0, 4).map((d) => (
                  <li key={d.slug}>
                    <SmartLink href={`/products/${d.slug}/datasheet`}>
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true"><path d="M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5" /></svg>
                      <span><b>{d.name}</b><em>{p.name}</em></span>
                      <i>PDF</i>
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </Section>

      <Section id="brochures" tone="surface">
        <SectionHead eyebrow="Solution brochures" title="One brochure per solution pillar"><Button href="/resources/brochures" variant="ghost">All brochures</Button></SectionHead>
        <div className="sv-libcovers">
          {pillars.map((p) => (
            <div key={p.id}>
              <SmartLink href={`/solutions/${p.id}`} tabIndex={-1} aria-label={`Read online: ${p.name}`}><ResourceArt art={brochureArt(p)} /></SmartLink>
              <span>
                <Button href="/contact" aria-label={`Request: ${p.name}`}>Request</Button>
                <SmartLink href={`/solutions/${p.id}`} aria-label={`Read online: ${p.name}`}>Read online →</SmartLink>
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section id="briefs">
        <SectionHead eyebrow="Solution briefs" title="How each solution works, step by step"><Button href="/resources/briefs" variant="ghost">All solution briefs</Button></SectionHead>
        <div className="sv-grid">
          {briefs.slice(0, 8).map((u) => (
            <Card key={u.id} thumb={<Thumb spec={useCaseThumb(u)} />} title={u.name} href={`/use-cases/${u.id}`} cta="Read brief">{u.tagline}</Card>
          ))}
        </div>
      </Section>

      <Section id="videos" tone="surface">
        <SectionHead eyebrow="Videos" title="Our story and our services"><Button href="/resources/videos" variant="ghost">All videos</Button></SectionHead>
        <div className="sv-libband__grid sv-libband__grid--light">
          {(Object.keys(FILMS) as FilmId[]).map((id) => (
            <Pick key={id} card={{ tag: "Video", title: FILMS[id].title, text: FILMS[id].text, cta: "Watch the video →", film: id, art: { kind: "photo", src: FILMS[id].poster } }} />
          ))}
        </div>
      </Section>

      {posts.length > 0 && (
        <Section id="blog">
          <SectionHead eyebrow="Blog" title="Analysis, reference architectures and country profiles"><Button href="/insights#insights" variant="ghost">All blog posts</Button></SectionHead>
          <div className="sv-grid">
            {posts.map((n) => (
              <Card key={n.id} thumb={n.cover ? <PhotoThumb src={n.cover.src} big={false} /> : <Thumb spec={newsThumb(n)} />} title={n.title} href={`/insights/${n.id}`} cta="Read the post">{n.sum}</Card>
            ))}
          </div>
          <SmartLink href="/insights#bulletins" className="sv-libbull">
            <span><b>Tech bulletins</b><span>Daily digital identity and trust radar with sources.</span></span>
            <i>Open bulletins →</i>
          </SmartLink>
        </Section>
      )}
    </PageShell>
  );
}
