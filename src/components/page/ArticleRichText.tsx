import { RichText, type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { ArticleReveal } from "./ArticleBody";
import { type BlockType, renderBlock } from "@/lib/insight-render";
import { mapHref } from "@/lib/insight-href";

const BLOCKS: BlockType[] = ["keyPoint", "note", "cardGrid", "steps", "chips", "stats", "table", "timeline", "arch", "layers", "landscape", "diagramHtml", "htmlBlock"];

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  // Article headings use the design's heading style.
  heading: ({ node, nodesToJSX }) => {
    const Tag = node.tag as "h2" | "h3" | "h4";
    return <Tag className={Tag === "h2" ? "af-h" : undefined}>{nodesToJSX({ nodes: node.children })}</Tag>;
  },
  // Custom links: site hashes and the whitepaper library map to real paths.
  link: ({ node, nodesToJSX }) => {
    const url = String((node.fields as { url?: string }).url ?? "#");
    const external = /^https?:\/\//i.test(url) && !url.startsWith("https://savis-group.com");
    return (
      <a href={mapHref(url)} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {nodesToJSX({ nodes: node.children })}
      </a>
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
