#!/usr/bin/env node
// Builds the design-system preview bundle (components/bundle.js + bundle.css) from the same
// TSX sources the Next.js app uses, so the preview can never drift from production code.
// Usage: node scripts/build-preview.mjs <outDir>
import { build } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";

const out = resolve(process.argv[2] ?? "dist/preview");
mkdirSync(out, { recursive: true });
const shims = {
  react: "module.exports = window.React;",
  "react-dom": "module.exports = window.ReactDOM;",
  "react/jsx-runtime": `const R = window.React;
function jsx(type, props, key) { const { children, ...rest } = props || {}; if (key !== undefined) rest.key = key;
  return Array.isArray(children) ? R.createElement(type, rest, ...children) : children === undefined ? R.createElement(type, rest) : R.createElement(type, rest, children); }
module.exports = { jsx, jsxs: jsx, Fragment: R.Fragment };`,
};
const plugin = {
  name: "globals",
  setup(b) {
    b.onResolve({ filter: /^(react|react-dom|react\/jsx-runtime)$/ }, (a) => ({ path: a.path, namespace: "g" }));
    b.onLoad({ filter: /.*/, namespace: "g" }, (a) => ({ contents: shims[a.path], loader: "js" }));
    b.onResolve({ filter: /^next\/link$/ }, () => ({ path: resolve("scripts/next-link-shim.tsx") }));
  },
};
const res = await build({
  entryPoints: ["src/components/ui/index.ts"], bundle: true, format: "iife", globalName: "SavisDS",
  jsx: "automatic", target: "es2018", minify: false, write: false, plugins: [plugin], logLevel: "warning",
});
let js = res.outputFiles[0].text.replace(/<\/script/gi, "<\\/script").replace(/<!--/g, "<\\!--");
const names = [...readFileSync("src/components/ui/index.ts", "utf8").matchAll(/\.\/(\w+)"/g)].map((m) => m[1])
  .filter((n) => !["cn", "SmartLink", "Logo"].includes(n));
const header = { format: 4, namespace: "SavisDS", components: names.map((name) => ({ name })) };
js = `/* @ds-bundle: ${JSON.stringify(header)} */\n/* Generated from savis-ui/src/components/ui by scripts/build-preview.mjs. Do not edit. */\n${js}\nwindow.SavisDS = SavisDS;\n`;
writeFileSync(join(out, "bundle.js"), js);
writeFileSync(join(out, "bundle.css"),
  `@import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Inter:wght@400;500;600&display=swap');\n` +
  readFileSync("src/styles/savis.css", "utf8"));
console.log(`preview bundle: ${names.length} components, ${(js.length / 1024).toFixed(1)} KB → ${out}`);
