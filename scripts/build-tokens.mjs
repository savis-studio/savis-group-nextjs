#!/usr/bin/env node
// Generates CSS variables, a Tailwind preset (v3), a Tailwind v4 @theme file and a typed
// token object from the design system's tokens.json. tokens.json is the only source of truth:
// never edit the generated files by hand.
//
// Usage: node scripts/build-tokens.mjs [path/to/tokens.json] [outDir]
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

const src = resolve(process.argv[2] ?? "design-system/tokens.json");
const out = resolve(process.argv[3] ?? "src/styles/generated");
const t = JSON.parse(readFileSync(src, "utf8"));
mkdirSync(out, { recursive: true });

const firstTheme = t.color.themes[0].id;
const val = (tok) => (typeof tok.value === "string" ? tok.value : tok.value[firstTheme]);
const ALIAS = /^\{([A-Za-z0-9_.-]+)\}$/;
const colors = t.color.tokens;
const byName = Object.fromEntries(colors.map((c) => [c.name, val(c)]));
const resolveColor = (v, depth = 0) => {
  const m = ALIAS.exec(v);
  if (!m) return v;
  if (depth > 16 || !(m[1] in byName)) throw new Error(`Bad alias ${v}`);
  return resolveColor(byName[m[1]], depth + 1);
};
const cssVal = (v) => { const m = ALIAS.exec(v); return m ? `var(--${m[1]})` : v; };
const isPalette = (c) => !ALIAS.test(val(c));
const semantic = colors.filter((c) => !isPalette(c));
const otherFamilies = Object.entries(t).filter(
  ([k, v]) => !["name", "version", "color", "type", "meta"].includes(k) && v && Array.isArray(v.tokens)
);
// next/font exposes --font-sora / --font-inter; fall back to the plain family name elsewhere.
const NEXT_FONT = { Sora: "--font-sora", Inter: "--font-inter" };
const family = (stack) =>
  stack.replace(/"([^"]+)"/, (m, name) => (NEXT_FONT[name] ? `var(${NEXT_FONT[name]}, "${name}")` : m));

// tokens.css
let css = `/* ${t.name} — generated from tokens.json v${t.version}. Do not edit. */\n:root {\n`;
css += "  /* palette */\n" + colors.filter(isPalette).map((c) => `  --${c.name}: ${val(c)};`).join("\n");
css += "\n  /* semantic */\n" + semantic.map((c) => `  --${c.name}: ${cssVal(val(c))};`).join("\n");
for (const [fam, { tokens }] of otherFamilies) css += `\n  /* ${fam} */\n` + tokens.map((x) => `  --${x.name}: ${val(x)};`).join("\n");
css += "\n  /* fonts */\n" + Object.entries(t.type.families).map(([k, v]) => `  --font-${k}: ${family(v)};`).join("\n");
css += "\n}\n";
for (const g of t.type.groups)
  for (const s of g.styles) {
    css += `.type-${s.name} { font-family: var(--font-${s.family ?? g.family}); font-size: ${s.fontSize}; line-height: ${s.lineHeight}; font-weight: ${s.fontWeight}${s.letterSpacing ? `; letter-spacing: ${s.letterSpacing}` : ""}; }\n`;
  }
writeFileSync(join(out, "tokens.css"), css);

// Tailwind v3 preset: semantic colors only, so pages cannot reach for raw palette steps.
const fam = (name) => Object.fromEntries((t[name]?.tokens ?? []).map((x) => [x.name, `var(--${x.name})`]));
const strip = (obj, prefix) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k.replace(prefix, ""), v]));
const preset = {
  theme: {
    extend: {
      colors: Object.fromEntries(semantic.map((c) => [c.name, `var(--${c.name})`])),
      fontFamily: { display: ["var(--font-display)"], sans: ["var(--font-body)"] },
      fontSize: strip(Object.fromEntries((t.fluid?.tokens ?? []).filter((x) => x.name.startsWith("fs-")).map((x) => [x.name, `var(--${x.name})`])), "fs-"),
      spacing: Object.fromEntries((t.spacing?.tokens ?? []).map((x) => [x.name.replace("space-", "sv-"), `var(--${x.name})`])),
      borderRadius: strip(fam("radius"), "radius-"),
      boxShadow: strip(fam("shadow"), "shadow-"),
      maxWidth: { wrap: "var(--wrap-max)" },
      minHeight: { touch: "var(--touch-min)", btn: "var(--btn-h)" },
    },
  },
};
writeFileSync(join(out, "tailwind.preset.js"),
  `/* Generated from tokens.json v${t.version}. Do not edit. */\n/** @type {import('tailwindcss').Config} */\nmodule.exports = ${JSON.stringify(preset, null, 2)};\n`);

// Tailwind v4 @theme
let v4 = `/* Generated from tokens.json v${t.version}. Do not edit. Import after tokens.css. */\n@theme inline {\n`;
v4 += semantic.map((c) => `  --color-${c.name}: var(--${c.name});`).join("\n");
v4 += `\n  --font-display: var(--font-display);\n  --font-sans: var(--font-body);\n`;
v4 += (t.radius?.tokens ?? []).map((x) => `  --${x.name}: var(--${x.name});`).join("\n");
v4 += "\n" + (t.shadow?.tokens ?? []).map((x) => `  --${x.name}: var(--${x.name});`).join("\n");
v4 += "\n" + (t.spacing?.tokens ?? []).map((x) => `  --spacing-${x.name.replace("space-", "sv-")}: var(--${x.name});`).join("\n");
v4 += "\n}\n";
writeFileSync(join(out, "tailwind-v4.css"), v4);

// Typed resolved values for JS (charts, canvas, emails).
const resolved = {
  version: t.version,
  color: Object.fromEntries(colors.map((c) => [c.name, resolveColor(val(c))])),
  ...Object.fromEntries(otherFamilies.map(([k, v]) => [k, Object.fromEntries(v.tokens.map((x) => [x.name, x.value]))])),
};
writeFileSync(join(out, "tokens.ts"), `/* Generated from tokens.json v${t.version}. Do not edit. */\nexport const tokens = ${JSON.stringify(resolved, null, 2)} as const;\nexport type ColorToken = keyof typeof tokens.color;\n`);

console.log(`tokens v${t.version}: ${colors.length} colors (${semantic.length} semantic) → ${out}`);
