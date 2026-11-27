import { unstable_cache } from "next/cache";
import industries from "@/data/mockup/industries.json";
import products from "@/data/mockup/products.json";
import useCases from "@/data/mockup/use-cases.json";
import { getCases, getPillars } from "./content";
import { getArticles } from "./insights";
import { INSIGHTS_TAG } from "./cache-tags";
import { clip } from "./seo";
import type { SearchEntry } from "./search";

const PAGES: Array<[title: string, path: string, summary: string, extra?: string]> = [
  ["Solutions", "/solutions", "Products grouped by the trust problem they solve.", "pillars products"],
  ["Industries", "/industries", "How SAVIS serves government, banking, telecom and more.", "sector"],
  ["Use cases", "/use-cases", "Reference architectures for common digital trust scenarios."],
  ["Customers", "/customers", "Case studies from national and enterprise deployments.", "case studies clients references"],
  ["Insights & News", "/insights", "Research, regulation updates and press releases.", "blog articles"],
  ["Services", "/services", "Advisory, integration, engineering, managed services and customer support.", "professional services support developers"],
  ["Innovation", "/innovation", "Research and engineering in post-quantum cryptography, AI and identity.", "r&d research"],
  ["PQC Lab", "/innovation/pqc-lab", "Post-quantum cryptography lab and migration program.", "quantum pqc"],
  ["About SAVIS", "/about", "Who we are: 22 years of digital trust from Vietnam.", "company history"],
  ["Culture", "/about/culture", "How we work and what we value."],
  ["ESG and responsibility", "/about/esg", "Our environmental, social and governance commitments.", "sustainability"],
  ["Integrity", "/about/integrity", "Ethics, compliance and how to raise a concern.", "compliance whistleblower"],
  ["Partners", "/partners", "Technology, channel and delivery partners.", "partner portal"],
  ["Careers", "/careers", "Join our team of engineers, experts and researchers.", "jobs hiring"],
  ["Contact us", "/contact", "Talk to an expert or send us a message.", "sales support enquiry"],
  ["Investors", "/investors", "Investor information.", "shareholders"],
  ["Trust Center", "/trust-center", "Security, privacy and compliance information.", "certifications iso soc"],
  ["Privacy policy", "/privacy", "How we handle personal data."],
  ["Terms of use", "/terms", "Terms for using this website."],
  ["Cookie policy", "/cookies", "Which cookies we use and why."],
];

const KIND: Record<string, string> = { insight: "Insight", news: "News", press: "Press" };

/** Builds the whole index from bundled data and the CMS. Kept small: no article bodies. */
async function build(): Promise<SearchEntry[]> {
  const out: SearchEntry[] = PAGES.map(([t, u, s, x]) => ({ t, u, k: "Page", s, x }));
  for (const p of getPillars()) out.push({ t: p.name, u: `/solutions/${p.id}`, k: "Solution", s: clip(p.pitch, 140), x: [p.vi, ...p.tags].join(" ") });
  for (const p of products) out.push({ t: p.name, u: `/products/${p.slug}`, k: "Product", s: clip(p.desc, 140), x: (p.tags ?? []).join(" ") });
  for (const i of industries.items) out.push({ t: i.name, u: `/industries/${i.id}`, k: "Industry", s: clip(i.pitch, 140) });
  for (const u of useCases) out.push({ t: u.name, u: `/use-cases/${u.id}`, k: "Use case", s: clip(u.tagline, 140) });
  for (const c of getCases()) out.push({ t: c.title, u: `/customers/${c.id}`, k: "Customer story", s: clip(c.summary, 140), x: `${c.client} ${c.country}` });
  for (const a of await getArticles()) out.push({ t: a.title, u: `/insights/${a.id}`, k: KIND[a.type] ?? "Insight", s: clip(a.sum, 140), x: `${a.cat} ${a.tags.join(" ")}` });
  return out;
}

const cached = unstable_cache(build, ["search-index"], { tags: [INSIGHTS_TAG], revalidate: 3600 });

/** The search index. While `next build` runs there is no database, so it is built uncached from the bundled data. */
export const getSearchIndex = (): Promise<SearchEntry[]> =>
  process.env.NEXT_PHASE === "phase-production-build" ? build() : cached();
