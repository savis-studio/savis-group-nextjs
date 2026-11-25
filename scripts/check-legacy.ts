/* Every URL of the previous site (scripts/fixtures/legacy-urls.txt, crawled from savis-group.com) must redirect to a page that exists.
   Usage: npx tsx scripts/check-legacy.ts */
import { readFileSync } from "node:fs";
import { LEGACY_REDIRECTS } from "../src/data/legacy-redirects";
import { REDIRECTS } from "../src/data/redirects";
import { readyRoutes } from "../src/lib/sitemap-routes";

const live = new Set(readyRoutes().map((r) => r.path));
const urls = readFileSync(new URL("./fixtures/legacy-urls.txt", import.meta.url), "utf8").split("\n").map((l) => l.trim()).filter(Boolean);

/** First matching rule, the way Next applies them: exact paths, a trailing `:name` segment, and a trailing `:name*` rest. */
function resolve(path: string): string | null {
  for (const r of [...REDIRECTS, ...LEGACY_REDIRECTS]) {
    const rest = r.from.match(/^(.*)\/:(\w+)\*$/);
    const one = r.from.match(/^(.*)\/:(\w+)$/);
    if (rest) {
      if (path.startsWith(rest[1] + "/")) return r.to.replace(`:${rest[2]}*`, path.slice(rest[1].length + 1));
    } else if (one) {
      const tail = path.slice(one[1].length + 1);
      if (path.startsWith(one[1] + "/") && tail && !tail.includes("/")) return r.to;
    } else if (r.from === path) return r.to;
  }
  return null;
}

let bad = 0;
for (const u of urls) {
  let to = resolve(u);
  if (to) to = resolve(to.split("#")[0]) ?? to; // a destination may itself be a renamed path
  const page = to?.split("#")[0];
  const ok = !!page && live.has(page);
  if (!ok) { bad++; console.log("FAIL", u, "->", to ?? "(no rule)"); }
}
console.log(`${urls.length - bad}/${urls.length} legacy URLs land on an existing page.`);
process.exit(bad ? 1 : 0);
