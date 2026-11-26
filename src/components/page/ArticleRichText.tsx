import { RichText, type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { ArticleReveal } from "./ArticleBody";
import { type BlockType, renderBlock } from "@/lib/insight-render";
import { mapHref } from "@/lib/insight-href";

const BLOCKS: BlockType[] = ["keyPoint", "note", "cardGrid", "steps", "chips", "stats", "table", "timeline", "arch", "layers", "landscape", "diagramHtml", "htmlBlock"];

interface MediaFile {
  url?: string | null;
  alt?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  width?: number | null;
  height?: number | null;
}

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  // Article headings use the design's heading style.
  heading: ({ node, nodesToJSX }) => {
    const Tag = node.tag as "h2" | "h3" | "h4";
    return <Tag className={Tag === "h2" ? "af-h" : undefined}>{nodesToJSX({ nodes: node.children })}</Tag>;
  },
  // Custom links: site hashes and the whitepaper library map to real paths. Internal links point at another article.
  link: ({ node, nodesToJSX }) => {
    const fields = node.fields as { linkType?: string; url?: string; newTab?: boolean; doc?: { value?: unknown } | null };
    const children = nodesToJSX({ nodes: node.children });
    let url = String(fields.url ?? "#");
    if (fields.linkType === "internal") {
      const target = fields.doc?.value as { slug?: string; _status?: string } | null | undefined;
      // A deleted or unpublished article has no public page: keep the words, drop the link.
      if (typeof target !== "object" || !target?.slug || target._status === "draft") return <>{children}</>;
      url = `/insights/${target.slug}`;
    }
    const external = /^https?:\/\//i.test(url) && !url.startsWith("https://savis-group.com");
    return (
      <a href={mapHref(url)} {...(external || fields.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    );
  },
  // Files from Media: pictures show in the text, anything else (PDF) becomes a download link.
  upload: ({ node }) => {
    const file = node.value as unknown as MediaFile | number | string | null;
    if (typeof file !== "object" || !file?.url) return null;
    if (!file.mimeType?.startsWith("image/")) {
      return <p><a href={file.url}>{file.alt || file.filename}</a></p>;
    }
    return (
      <figure className="af-img">
        <img src={file.url} alt={file.alt ?? ""} width={file.width ?? undefined} height={file.height ?? undefined} loading="lazy" />
      </figure>
    );
  },
  blocks: Object.fromEntries(
    BLOCKS.map((type) => [
      type,
      ({ node }: { node: { fields: unknown } }) => (
        // display: contents keeps the block a direct child of .article for the stylesheet.
        <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: renderBlock(type, node.fields) }} />
      ),
    ]),
  ),
});

/** Article body from the CMS: Lexical rich text plus the diagram blocks, styled by the article stylesheet. */
export function ArticleRichText({ data }: { data: SerializedEditorState }) {
  return (
    <ArticleReveal>
      <RichText data={data} converters={converters} disableContainer />
    </ArticleReveal>
  );
}
