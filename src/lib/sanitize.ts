/**
 * Filter for the raw "HTML" and "Diagram (HTML)" article blocks. Only the tags and attributes listed here reach the
 * page; everything else is dropped (scripts, event handlers, iframes, forms, style sheets, `javascript:` links).
 * To let editors use something new, add it here.
 */
import sanitize from "sanitize-html";

// The parser keeps names as written, so camel-case SVG names are listed in lower case too (browsers accept both).
const both = (names: string[]): string[] => [...new Set(names.flatMap((n) => [n, n.toLowerCase()]))];

const TEXT_TAGS = [
  "a", "abbr", "b", "blockquote", "br", "caption", "cite", "code", "col", "colgroup", "dd", "del", "div", "dl", "dt",
  "em", "figcaption", "figure", "h2", "h3", "h4", "h5", "h6", "hr", "i", "img", "ins", "kbd", "li", "mark", "ol", "p",
  "pre", "q", "s", "small", "span", "strong", "sub", "sup", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "u", "ul",
];

// No <use>, <foreignObject>, <style> or <set>/<animate>: those can load other documents or rewrite attributes.
const SVG_TAGS = both([
  "svg", "g", "defs", "title", "desc", "path", "rect", "circle", "ellipse", "line", "polyline", "polygon", "text", "tspan",
  "textPath", "marker", "linearGradient", "radialGradient", "stop", "clipPath", "mask", "pattern", "animateMotion", "mpath",
]);

const GLOBAL_ATTRIBUTES = ["class", "id", "style", "title", "role", "tabindex", "lang", "dir", "aria-*"];

const SVG_ATTRIBUTES = both([
  "viewBox", "preserveAspectRatio", "xmlns", "focusable", "width", "height", "x", "y", "x1", "y1", "x2", "y2", "dx", "dy",
  "cx", "cy", "r", "rx", "ry", "d", "points", "transform", "rotate",
  "fill", "fill-opacity", "fill-rule", "stroke", "stroke-width", "stroke-opacity", "stroke-dasharray", "stroke-dashoffset",
  "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "opacity", "color", "vector-effect", "paint-order",
  "font-family", "font-size", "font-weight", "font-style", "letter-spacing", "text-anchor", "dominant-baseline",
  "marker-start", "marker-mid", "marker-end", "markerWidth", "markerHeight", "markerUnits", "refX", "refY", "orient",
  "offset", "stop-color", "stop-opacity", "gradientUnits", "gradientTransform", "clip-path", "clip-rule", "clipPathUnits",
  "mask", "maskUnits", "patternUnits", "patternTransform",
  "path", "dur", "begin", "repeatCount", "keyPoints", "keyTimes", "calcMode",
]);

const options: sanitize.IOptions = {
  allowedTags: [...TEXT_TAGS, ...SVG_TAGS],
  allowedAttributes: {
    ...Object.fromEntries(SVG_TAGS.map((tag) => [tag, SVG_ATTRIBUTES])),
    // data-ctx and data-intent open the contact form with a prefilled subject.
    a: ["href", "target", "rel", "data-ctx", "data-intent"],
    img: ["src", "alt", "width", "height", "loading"],
    ol: ["start", "reversed", "type"],
    col: ["span"],
    colgroup: ["span"],
    td: ["colspan", "rowspan", "headers"],
    th: ["colspan", "rowspan", "headers", "scope"],
    "*": GLOBAL_ATTRIBUTES,
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https"] },
  // Style attributes cannot run code; leave them exactly as the diagram wrote them.
  parseStyleAttributes: false,
  parser: { lowerCaseTags: false, lowerCaseAttributeNames: false, recognizeSelfClosing: true },
};

export const sanitizeHtml = (html: string): string => sanitize(html, options);
