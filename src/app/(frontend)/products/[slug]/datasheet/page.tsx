import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchGraph } from "@/components/datasheet/ArchGraph";
import { NextStepBar } from "@/components/datasheet/NextStepBar";
import { PdfButton } from "@/components/datasheet/PdfButton";
import { hotline } from "@/components/layout/nav-data";
import { JsonLd } from "@/components/seo/JsonLd";
import { ROADMAP_STEPS } from "@/components/solutions/Blocks";
import { SmartLink } from "@/components/ui/SmartLink";
import { getGroup, getProduct, getProductDetail, getProducts, pillarOfProduct } from "@/lib/content";
import { breadcrumbLd, buildMetadata } from "@/lib/seo";
import { SALES_EMAIL, SITE_NAME, SITE_ORIGIN, SITE_TAGLINE } from "@/lib/site";
import "@/styles/arch-graph.css";
import "@/styles/datasheet.css";

export const dynamicParams = false;
/** Only products with a detail record have a datasheet. */
export const generateStaticParams = () => getProducts().filter((p) => getProductDetail(p.slug)).map((p) => ({ slug: p.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  const d = p && getProductDetail(p.slug);
  if (!p || !d) return {};
  return buildMetadata({ title: `${p.name} datasheet`, description: d.sum, path: `/products/${p.slug}/datasheet` });
}

export default async function DatasheetPage({ params }: Props) {
  const p = getProduct((await params).slug);
  const d = p && getProductDetail(p.slug);
  if (!p || !d) notFound();
  const product = `/products/${p.slug}`;
  const pillar = pillarOfProduct(p);
  const group = getGroup(p.group);
  const specs: Array<[title: string, items: string[]]> = [
    ["Integration", d.int], ["Deployment", d.dep], ["Standards & regulation", d.std], ["Prerequisites", d.pre],
  ];
  return (
    <main>
      <JsonLd data={breadcrumbLd([
        { name: "Solutions & Products", path: "/solutions" },
        ...(pillar ? [{ name: pillar.name, path: `/solutions/${pillar.id}` }] : []),
        ...(pillar && group ? [{ name: group.name, path: `/solutions/${pillar.id}#${group.slug}` }] : []),
        { name: p.name, path: product },
        { name: "Datasheet", path: `${product}/datasheet` },
      ])} />
      <div className="sv-ds">
        <div className="sv-wrap">
          <div className="sv-ds__bar">
            <SmartLink href={product} className="sv-ds__back">← Back to {p.name}</SmartLink>
            <PdfButton fileName={`${p.name.replace(/[^\w]+/g, "-")}-Datasheet`} />
          </div>
          <article className="sv-ds__page">
            <header className="sv-ds__hd">
              <div>
                <span>{SITE_NAME} · Product datasheet</span>
                <h1>{p.name}</h1>
                <p>{p.desc}</p>
              </div>
              {pillar && <div className="sv-ds__pill">{pillar.n} · {pillar.name}{group && <b>{group.name}</b>}</div>}
            </header>
            <div className="sv-ds__why"><b>Why it matters</b><p>{d.sum}</p></div>
            <section>
              <h2>Key features</h2>
              <div className="sv-ds__feat">{d.feat.map(([title, text]) => <div key={title}><b>{title}</b><span>{text}</span></div>)}</div>
            </section>
            <section>
              <h2>Reference architecture</h2>
              <ArchGraph arch={d.arch} name={p.name.replace(/^SAVIS /, "")} />
            </section>
            <section className="sv-ds__cols">
              {specs.map(([title, items]) => (
                <div key={title}><h2>{title}</h2><ul>{items.map((x) => <li key={x}>{x}</li>)}</ul></div>
              ))}
            </section>
            <section>
              <h2>Deployment roadmap</h2>
              <ol className="sv-ds__go">{ROADMAP_STEPS.map((step, i) => <li key={step}><b>{step}</b><span>{d.go[i]}</span></li>)}</ol>
            </section>
            <p className="sv-ds__ft">
              <b>{SITE_NAME}</b> · {SITE_TAGLINE} · {hotline.label} · {SALES_EMAIL} · {new URL(SITE_ORIGIN).host}
              <span>Product information is indicative; specifications and certification status are confirmed per version in the technical datasheet shared under NDA.</span>
            </p>
          </article>
        </div>
      </div>
      <NextStepBar />
    </main>
  );
}
