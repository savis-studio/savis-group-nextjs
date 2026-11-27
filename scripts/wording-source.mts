/* Applies the house style (src/lib/wording.ts) to the bundled data and to the text written in the source files.

     npx tsx scripts/wording-source.mts          lists what would change
     WRITE=1 npx tsx scripts/wording-source.mts  rewrites the files

   In .ts and .tsx files only string literals and JSX text change, never identifiers, comments or regular expressions.
   Strings that look like keys, paths or class names are left alone and listed, to be checked by hand. */
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
import { fixWording } from "../src/lib/wording";

const root = path.resolve(import.meta.dirname, "../src");
const write = process.env.WRITE === "1";
const SKIP_FILES = /(^|\/)(lib\/wording\.ts|payload-types\.ts|migrations\/|data\/insight-media\/|app\/\(payload\)\/|styles\/)/;
/** One word in lower case, a path, an anchor or a file name: possibly a key that code or another file relies on. */
const identifier = (s: string) => !/\s/.test(s.trim()) && (/^[a-z0-9]+(?:[-_.:][a-z0-9]+)*$/.test(s) || /^[#./]|^https?:|\.(?:jpg|png|svg|mp4|pdf|webp)$/.test(s));

const files: string[] = [];
const walk = (dir: string) => {
  for (const name of readdirSync(dir)) {
    const file = path.join(dir, name);
    if (statSync(file).isDirectory()) walk(file);
    else if (/\.(tsx?|json)$/.test(name) && !SKIP_FILES.test(path.relative(root, file).replace(/\\/g, "/"))) files.push(file);
  }
};
walk(root);

const left: string[] = [];
const keys: string[] = [];
const short: string[] = [];
let total = 0;

for (const file of files) {
  const rel = path.relative(root, file).replace(/\\/g, "/");
  const source = readFileSync(file, "utf8");
  let out = source;
  let count = 0;
  const change = (value: string): string => {
    const next = fixWording(value);
    if (next === value) return value;
    if (identifier(value)) {
      left.push(`${rel}: ${value}`);
      return value;
    }
    count++;
    if (value.length < 40) short.push(`${rel}: ${JSON.stringify(value)} -> ${JSON.stringify(next)}`);
    return next;
  };

  if (file.endsWith(".json")) {
    const visit = (v: unknown): unknown => {
      if (typeof v === "string") return change(v);
      if (Array.isArray(v)) return v.map(visit);
      if (v && typeof v === "object") {
        return Object.fromEntries(Object.entries(v).map(([k, x]) => {
          const key = fixWording(k);
          if (key !== k) keys.push(`${rel}: ${k} -> ${key}`);
          return [identifier(k) ? k : key, visit(x)];
        }));
      }
      return v;
    };
    const data = visit(JSON.parse(source));
    if (count) {
      // Same layout as the file already has: indentation, final newline and line endings.
      const indent = /\n( +)\S/.exec(source)?.[1].length ?? 0;
      out = JSON.stringify(data, null, indent) + (source.endsWith("\n") ? "\n" : "");
      if (source.includes("\r\n")) out = out.replace(/\r?\n/g, "\r\n");
    }
  } else {
    const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const edits: Array<[number, number, string]> = [];
    const visit = (node: ts.Node) => {
      const literal = ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node) || ts.isJsxText(node);
      if (literal) {
        const parent = node.parent;
        const specifier = ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent);
        // The raw source text changes, so escapes stay as written. A dash written as an escape is listed instead.
        const start = ts.isJsxText(node) ? node.pos : node.getStart(tree);
        const raw = source.slice(start, node.end);
        if (!specifier) {
          if (/\\u2014/i.test(raw)) left.push(`${rel}: escaped dash in ${raw.slice(0, 60)}`);
          const inner = ts.isJsxText(node) ? raw : null;
          const next = inner !== null ? change(inner) : (identifier(node.text) ? (fixWording(node.text) !== node.text && left.push(`${rel}: ${node.text}`), raw) : change(raw));
          if (next !== raw) edits.push([start, node.end, next]);
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(tree);
    for (const [from, to, text] of edits.sort((a, b) => b[0] - a[0])) out = out.slice(0, from) + text + out.slice(to);
  }

  if (out !== source) {
    total += count;
    console.log(`${rel}: ${count}`);
    if (write) writeFileSync(file, out);
  }
}
console.log(`\n${write ? "Changed" : "Would change"} ${total} strings.`);
console.log(`\nKEYS (${keys.length}):\n${keys.join("\n")}`);
console.log(`\nLEFT ALONE, looks like a key or path (${left.length}):\n${[...new Set(left)].join("\n")}`);
console.log(`\nSHORT strings that change (${short.length}):\n${[...new Set(short)].join("\n")}`);
