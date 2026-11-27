import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page/PageShell";
import { FollowLinks, LibraryCta, LibraryTabs, type LibraryCtaProps } from "@/components/resources/LibraryParts";
import { ResourceArt } from "@/components/resources/ResourceArt";
import { ResourceListing, type LibraryItem } from "@/components/resources/ResourceListing";
import { VideoButton } from "@/components/resources/VideoDialog";
import { Section } from "@/components/ui";
import { SmartLink } from "@/components/ui/SmartLink";
import { FILMS, type FilmId } from "@/data/films";
import { getPillars, getUseCases, pillarOfProduct } from "@/lib/content";
import { briefArt, brochureArt, datasheetArt, datasheetProducts, pillarShort } from "@/lib/resources";
import { buildMetadata } from "@/lib/seo";

type Kind = "datasheets" | "brochures" | "briefs" | "videos";

interface Library {
  label: string;
  title: string;
  lead: string;
  description: string;
  cta: LibraryCtaProps;
}

const LIBRARIES: Record<Kind, Library> = {
  datasheets: {
    label: "Datasheets",
    title: "Technical datasheets for every SAVIS product",
    lead: "Specifications, standards, deployment options and integrations for each product - grouped by solution pillar and ready to share with your technical team.",
    description: "Technical datasheets for SAVIS products: specifications, standards, deployment options and integrations, by solution pillar.",
    cta: { title: "Need the full technical pack?", text: "Ask for architecture diagrams, sizing guides and certification evidence for your evaluation.", action: "Contact sales" },
  },
  brochures: {
    label: "Solution brochures",
    title: "One brochure for each solution pillar",
    lead: "Five brochures that explain what each SAVIS solution pillar covers, the products inside it and the results customers achieve.",
    description: "SAVIS solution brochures: what each of the five solution pillars covers, the products inside it and the results customers achieve.",
    cta: { title: "Need a tailored proposal?", text: "Tell us about your project and we will send the brochures and references that fit.", action: "Contact sales" },
  },
  briefs: {
    label: "Solution briefs",
    title: "How each SAVIS solution works, step by step",
    lead: "Use-case briefs with the problem, the flow, the architecture and the products involved - for banks, governments, telecoms and enterprises.",
    description: "SAVIS solution briefs: the problem, the flow, the architecture and the products behind each use case.",
    cta: { title: "Want to walk through a use case?", text: "Our engineers can demo the flow on your own case.", action: "Book a demo" },
  },
  videos: {
    label: "Videos",
    title: "SAVIS on video",
    lead: "Our story and our services, in short videos.",
    description: "Watch SAVIS videos: our history, vision, growth and global reach, and how SAVIS services work.",
    cta: { title: "Want a live walkthrough?", text: "Our engineers can demo any product on your use case.", action: "Book a demo" },
  },
};

export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(LIBRARIES).map((kind) => ({ kind }));

type Props = { params: Promise<{ kind: string }> };

const libraryOf = (kind: string) => (Object.hasOwn(LIBRARIES, kind) ? LIBRARIES[kind as Kind] : undefined);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kind } = await params;
  const lib = libraryOf(kind);
  if (!lib) return {};
  return buildMetadata({ title: lib.label, description: lib.description, path: `/resources/${kind}` });
}

const topics = () => getPillars().map((p) => ({ id: p.id, label: pillarShort(p.id) || p.name }));

const datasheetItems = (): LibraryItem[] =>
  datasheetProducts().map((p) => {
    const pillar = pillarOfProduct(p)?.id;
    return {
      id: p.slug, title: p.name, text: p.desc, topic: pillar, kind: "Datasheet", about: pillar && pillarShort(pillar), art: datasheetArt(p),
      links: [{ label: "View datasheet →", href: `/products/${p.slug}/datasheet` }, { label: "Product page", href: `/products/${p.slug}` }],
    };
  });

const brochureItems = (): LibraryItem[] =>
  getPillars().map((p) => ({
    id: p.id, title: p.name, text: p.pitch, topic: p.id, kind: "Solution brochure", about: "SAVIS Group", art: brochureArt(p),
    links: [{ label: "Read online →", href: `/solutions/${p.id}` }, { label: "Request PDF", href: "/contact" }],
  }));

const briefItems = (): LibraryItem[] =>
  getUseCases().map((u) => ({
    id: u.id, title: u.name, text: u.tagline, topic: u.pillar, kind: "Solution brief", about: pillarShort(u.pillar), art: briefArt(u),
    links: [{ label: "Read brief →", href: `/use-cases/${u.id}` }],
  }));

/** The first use case, shown large above the briefs. */
function FeaturedBrief({ item }: { item: LibraryItem }) {
  return (
    <SmartLink href={item.links[0].href} className="sv-libfeat">
      <ResourceArt art={item.art} />
      <span>
        <em>Featured</em>
        <b>{item.title}</b>
        <span>{item.text}</span>
        <small>{item.kind} · {item.about}</small>
        <i>{item.links[0].label}</i>
      </span>
    </SmartLink>
  );
}

function Videos() {
  return (
    <>
      <div className="sv-lib__tools"><h2>All videos</h2></div>
      <div className="sv-lib__grid sv-lib__grid--videos">
        {(Object.keys(FILMS) as FilmId[]).map((id) => (
          <VideoButton key={id} film={id} className="sv-libcard sv-libcard--video">
            <span className="sv-libcard__th"><ResourceArt art={{ kind: "photo", src: FILMS[id].poster }} /><span className="sv-mx__play" aria-hidden="true" /></span>
            <span className="sv-libcard__meta"><b>Video</b> · SAVIS Group</span>
            <b className="sv-libcard__title">{FILMS[id].title}</b>
            <span className="sv-libcard__text">{FILMS[id].text}</span>
            <span className="sv-libcard__acts">Watch the video →</span>
          </VideoButton>
        ))}
      </div>
    </>
  );
}

export default async function LibraryPage({ params }: Props) {
  const { kind } = await params;
  const lib = libraryOf(kind);
  if (!lib) notFound();
  const briefs = kind === "briefs" ? briefItems() : [];
  return (
    <PageShell
      path={`/resources/${kind}`}
      eyebrow={lib.label}
      title={lib.title}
      label={lib.label}
      trail={[{ label: "Resources", href: "/resources" }]}
      lead={lib.lead}
      actions={<FollowLinks />}
      cta={false}
    >
      <LibraryTabs current={kind as Kind} />
      <Section>
        {kind === "datasheets" && <ResourceListing title="All datasheets" items={datasheetItems()} topics={topics()} perPage={12} />}
        {kind === "brochures" && <ResourceListing title="All brochures" items={brochureItems()} topics={topics()} perPage={9} />}
        {kind === "briefs" && (
          <>
            <FeaturedBrief item={briefs[0]} />
            <ResourceListing title="All solution briefs" items={briefs} topics={topics()} perPage={9} skip={briefs[0].id} />
          </>
        )}
        {kind === "videos" && <Videos />}
      </Section>
      <LibraryCta {...lib.cta} />
    </PageShell>
  );
}
