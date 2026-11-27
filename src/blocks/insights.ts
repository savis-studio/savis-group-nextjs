import type { Block, Field } from "payload";

const HINT = "Supports **bold**, *italic* and [link text](/path).";
const text = (name: string, label?: string, required = false, hint = true): Field => ({
  name, label, type: "text", required, ...(hint ? { admin: { description: HINT } } : {}),
});
const area = (name: string, label?: string, required = false): Field => ({
  name, label, type: "textarea", required, admin: { description: HINT },
});
const items = (name: string, label: string, fields: Field[], minRows = 1): Field => ({
  name, label, type: "array", minRows, labels: { singular: "Item", plural: "Items" }, fields,
});
const status = (name = "status"): Field => ({
  name, type: "select", required: true, defaultValue: "live",
  options: [{ label: "Live", value: "live" }, { label: "Pilot", value: "pilot" }, { label: "Planned", value: "plan" }],
});

/** Editor blocks for article diagrams. Rendered by src/lib/insight-render.ts with the site's article styles. */
export const insightBlocks: Block[] = [
  {
    slug: "gallery", labels: { singular: "Photo gallery", plural: "Photo galleries" },
    fields: [
      items("photos", "Photos", [
        { name: "image", type: "upload", relationTo: "media", required: true, filterOptions: { mimeType: { contains: "image" } } },
        text("caption", "Caption", false, false),
      ]),
    ],
  },
  { slug: "keyPoint", labels: { singular: "Key point", plural: "Key points" }, fields: [area("text", "Text", true)] },
  { slug: "note", labels: { singular: "Note", plural: "Notes" }, fields: [area("text", "Text", true)] },
  {
    slug: "cardGrid", labels: { singular: "Card grid", plural: "Card grids" },
    fields: [
      {
        name: "layout", type: "select", defaultValue: "auto",
        options: [
          { label: "Automatic", value: "auto" }, { label: "2 columns", value: "g2" }, { label: "3 columns", value: "g3" },
          { label: "2 columns (wide)", value: "x2" }, { label: "3 columns (compact)", value: "three" }, { label: "4 columns", value: "four" },
        ],
      },
      { name: "soft", label: "Soft background", type: "checkbox" },
      items("cards", "Cards", [
        text("title", "Title", true), area("text", "Text"),
        items("bullets", "Bullets", [text("text", "Bullet", true)], 0),
        text("tag", "Footnote"),
        { name: "accent", label: "Accent color (CSS)", type: "text", admin: { description: "Optional, e.g. var(--teal) or #1ba39c." } },
      ]),
    ],
  },
  { slug: "steps", labels: { singular: "Numbered steps", plural: "Numbered steps" }, fields: [items("items", "Steps", [text("title", "Title", true), area("text", "Text"), text("tag", "Tag")])] },
  { slug: "chips", labels: { singular: "Chips", plural: "Chips" }, fields: [items("items", "Chips", [text("text", "Label", true)])] },
  { slug: "stats", labels: { singular: "Stats", plural: "Stats" }, fields: [items("items", "Stats", [text("value", "Value", true), text("label", "Label", true)])] },
  {
    slug: "table", labels: { singular: "Table", plural: "Tables" },
    fields: [
      { name: "variant", type: "select", defaultValue: "plain", options: [{ label: "Plain", value: "plain" }, { label: "Comparison (x-tbl)", value: "x-tbl" }] },
      { name: "label", label: "Accessible label", type: "text", required: true, defaultValue: "Table" },
      { name: "rowHeaders", label: "First column is a header", type: "checkbox" },
      items("head", "Header cells", [text("text", "Heading")]),
      items("rows", "Rows", [items("cells", "Cells", [text("text", "Text"), { name: "tone", type: "text", admin: { description: "Optional style class, e.g. yes, no, part." } }])]),
    ],
  },
  {
    slug: "timeline", labels: { singular: "Timeline", plural: "Timelines" },
    fields: [
      items("items", "Milestones", [
        text("date", "Date", true), text("title", "Title", true), area("text", "Text"),
        { name: "state", type: "select", defaultValue: "later", options: [{ label: "Done", value: "done" }, { label: "Now", value: "now" }, { label: "Later", value: "later" }] },
      ]),
      text("caption", "Caption"),
    ],
  },
  {
    slug: "arch", labels: { singular: "Architecture diagram", plural: "Architecture diagrams" },
    fields: [
      items("cols", "Columns", [
        text("title", "Title", true), text("tag", "Tag"),
        { name: "core", label: "Highlight as core", type: "checkbox" },
        items("items", "Entries", [text("text", "Text", true)]),
      ]),
      items("links", "Link labels between columns", [text("text", "Label")], 0),
      text("baseTitle", "Base bar title"), text("baseText", "Base bar text"), text("caption", "Caption"),
    ],
  },
  { slug: "layers", labels: { singular: "Layer stack", plural: "Layer stacks" }, fields: [items("items", "Layers (top to bottom)", [text("title", "Title", true), text("text", "Text"), text("tag", "Tag")])] },
  {
    slug: "landscape", labels: { singular: "Landscape map", plural: "Landscape maps" },
    fields: [
      items("columns", "Columns", [
        text("heading", "Heading", true),
        items("items", "Entries", [status(), text("name", "Name", true), text("tag", "Tag"), text("text", "Text")]),
      ]),
      items("legend", "Legend", [status(), text("label", "Label", true)], 0),
    ],
  },
  {
    slug: "diagramHtml", labels: { singular: "Diagram (HTML)", plural: "Diagrams (HTML)" },
    fields: [
      { name: "kind", type: "text", admin: { description: "Informational: which diagram this is." } },
      { name: "html", type: "code", required: true, admin: { language: "html", description: "Generated SVG diagram, kept as markup. Only the tags allowed in src/lib/sanitize.ts reach the page." } },
    ],
  },
  {
    slug: "htmlBlock", labels: { singular: "HTML", plural: "HTML" },
    fields: [{ name: "html", type: "code", required: true, admin: { language: "html", description: "Text and drawing tags only: scripts, iframes, forms and style sheets are removed from the page." } }],
  },
];
