import { buildMetadata, clip, breadcrumbLd, articleLd } from "../src/lib/seo";
import { hashToPath } from "../src/lib/routes";
const eq = (n: string, a: unknown, b: unknown) => { const ok = JSON.stringify(a) === JSON.stringify(b); console.log(ok ? "ok  " : "FAIL", n, ok ? "" : `\n   got ${JSON.stringify(a)}\n   exp ${JSON.stringify(b)}`); if (!ok) process.exitCode = 1; };

const long = "National Root CA for Vietnam’s digital signature ecosystem, for NEAC and the wider trust community";
const m = buildMetadata({ title: long, description: "x ".repeat(200), path: "/customers/neac-national-pki" });
console.log("title:", m.title, `(${String(m.title).length}+12 suffix)`);
eq("title fits 60 with suffix", String(m.title).length + " | SAVIS Group".length <= 60, true);
eq("description <= 160", String(m.description).length <= 160, true);
eq("canonical", (m.alternates as any).canonical, "https://savis-group.com/customers/neac-national-pki");
eq("short title untouched", clip("Hello world", 40), "Hello world");
eq("noindex", (buildMetadata({ title: "a", description: "b", path: "/x", noindex: true }).robots as any).index, false);
eq("breadcrumb positions", (breadcrumbLd([{ name: "Solutions", path: "/solutions" }, { name: "Identity", path: "/solutions/identity" }]) as any).itemListElement.map((i: any) => i.position + ":" + i.item), ["1:https://savis-group.com/","2:https://savis-group.com/solutions","3:https://savis-group.com/solutions/identity"]);
eq("article date", (articleLd({ title: "t", description: "d", path: "/insights/a", published: "2026-11-22" }) as any).datePublished, "2026-11-22");

// route mapper
const cases: Array<[string, string]> = [
  ["#home", "/"], ["#solutions", "/solutions"], ["#p-trustpass", "/products/trustpass"], ["#ds-econtract", "/products/econtract/datasheet"],
  ["#case-neac-national-pki", "/customers/neac-national-pki"], ["#uc-zero-trust", "/use-cases/zero-trust"], ["#ind-bfsi", "/industries/bfsi"],
  ["#news-asocio-smart-city-2026", "/insights/asocio-smart-city-2026"], ["#pillar-gov", "/solutions/gov"], ["#grp-zero-trust", "/solutions#zero-trust"],
  ["#pqc-lab", "/innovation/pqc-lab"], ["#culture", "/about/culture"], ["#partners", "/partners"], ["#partner-portal", "/partners"],
  ["#p-smart-ekyc", "/products/trustonboard"], ["#ds-digital-id-mobile", "/products/national-eid-trust/datasheet"],
  ["#services-advise", "/services#advise"], ["#resources-blog", "/insights"], ["#services-pro", "/services#professional"], ["#report-nd-case-2026", "/insights"], ["#use-cases-matrix", "/use-cases#matrix"], ["/already/a/path", "/already/a/path"], ["mailto:a@b.c", "mailto:a@b.c"],
];
for (const [h, p] of cases) eq(`route ${h}`, hashToPath(h), p);

// site search
import { fold, search as siteSearch, type SearchEntry } from "../src/lib/search";
const idx: SearchEntry[] = [
  { t: "Digital Identity & Trust", u: "/solutions/identity", k: "Solution", s: "Verify people and sign.", x: "Định danh số eKYC" },
  { t: "TrustOnboard", u: "/products/trustonboard", k: "Product", s: "Remote onboarding with liveness." },
  { t: "National Root CA for NEAC", u: "/customers/neac", k: "Customer story", s: "Root CA and PKI.", x: "NEAC VietNam" },
  { t: "Passkey payments", u: "/use-cases/passkey-payments", k: "Use case", s: "Strong customer authentication." },
];
eq("fold accents", fold("Định danh số"), "dinh danh so");
eq("search by title", siteSearch(idx, "trustonboard").map((e) => e.u), ["/products/trustonboard"]);
eq("search by accented keyword", siteSearch(idx, "dinh danh").map((e) => e.u), ["/solutions/identity"]);
eq("search needs every word", siteSearch(idx, "root pki neac").map((e) => e.u), ["/customers/neac"]);
eq("search no match", siteSearch(idx, "zzz"), []);
eq("search empty query", siteSearch(idx, "  "), []);
eq("title word beats summary", siteSearch(idx, "identity")[0]?.u, "/solutions/identity");
