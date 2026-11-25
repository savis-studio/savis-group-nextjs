/* Opens pages in a real browser and checks that the layout classes actually have their styles, that nothing overflows
   sideways, and that images load. It catches what the HTML audit cannot: a page whose grid collapsed into one column.
   Usage: npx tsx scripts/check-styles.ts [baseUrl]   (default http://localhost:3000)
   Set CHROME_PATH to a Chrome/Chromium executable if the default is not found. All sitemap pages are checked with `--all`;
   otherwise one page per template. */
import { chromium } from "playwright-core";
import { existsSync } from "node:fs";
import { readyRoutes } from "../src/lib/sitemap-routes";

const base = (process.argv.find((a) => a.startsWith("http")) ?? "http://localhost:3000").replace(/\/$/, "");
const all = process.argv.includes("--all");

const CHROME = [process.env.CHROME_PATH, "C:/Program Files/Google/Chrome/Application/chrome.exe", "/usr/bin/google-chrome", "/usr/bin/chromium", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].find((p) => p && existsSync(p));

/** Class → what its `display` must be once styled. */
const EXPECT: Record<string, string> = {
  "sv-grid": "grid", "sv-grid--3": "grid", "sv-contact": "grid", "sv-next": "grid", "sv-steps": "grid", "sv-row2": "grid",
  "sv-card": "flex", "sv-mx__cards": "grid",
};

const routes = readyRoutes().map((r) => r.path);
const firstOfEach = new Map<string, string>();
for (const p of routes) { const k = p.split("/").slice(0, 2).join("/") || "/"; if (!firstOfEach.has(k)) firstOfEach.set(k, p); }
const pages = all ? routes : [...firstOfEach.values()];

const browser = await chromium.launch({ executablePath: CHROME });
let bad = 0;
for (const width of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  for (const path of pages) {
    const res = await page.goto(base + path, { waitUntil: "load", timeout: 90_000 }).catch(() => null);
    if (!res || !res.ok()) { bad++; console.log(`FAIL ${width} ${path}: HTTP ${res?.status() ?? "no response"}`); continue; }
    await page.waitForTimeout(150);
    const problems = await page.evaluate((expect) => {
      const out: string[] = [];
      for (const [cls, display] of Object.entries(expect)) {
        const el = document.querySelector(`main .${cls}:not(form)`);
        if (el && getComputedStyle(el).display !== display) out.push(`.${cls} is ${getComputedStyle(el).display}, expected ${display}`);
      }
      if (document.documentElement.scrollWidth > window.innerWidth + 1) out.push(`sideways overflow (${document.documentElement.scrollWidth}px > ${window.innerWidth}px)`);
      const broken = Array.from(document.images).filter((i) => i.complete && i.naturalWidth === 0 && i.currentSrc).length;
      if (broken) out.push(`${broken} broken image(s)`);
      return out;
    }, EXPECT);
    if (problems.length) { bad++; console.log(`FAIL ${width} ${path}\n   ${problems.join("\n   ")}`); }
  }
  await page.close();
}
await browser.close();
console.log(`${pages.length} page(s) x 2 widths checked, ${bad} problem page(s).`);
process.exit(bad ? 1 : 0);
