import type { ArticleDetail } from "./insights";

// Mockup placeholders without a real date stay out of every tab.
const dated = (n: ArticleDetail) => !n.date.includes("[Date]");

/** Newest first, reading the display date ("October 2026", "2026") when there is no exact one. */
const time = (n: ArticleDetail) => Date.parse(n.iso ?? n.date) || 0;
export const newestFirst = (a: ArticleDetail, b: ArticleDetail) => time(b) - time(a);

export interface InsightGroup {
  /** URL hash of the tab: /insights#<id>. */
  id: "news" | "press" | "regulation" | "insights" | "bulletins";
  label: string;
  /** Preview row on the overview: its heading and the link to the tab. */
  title: string;
  more: string;
  /** Tab view: hero lead, the line above the filters, and the caption on the hero's latest article. */
  lead: string;
  intro: string;
  latest: string;
  pick: (n: ArticleDetail) => boolean;
}

/** Tabs of the Insights area, in order (case studies sit before Blog). A tab with no articles is left out. */
export const INSIGHT_GROUPS: InsightGroup[] = [
  {
    id: "news", label: "News", title: "What is changing", more: "All news",
    lead: "Industry and project news on digital identity, trust services and payments, from Vietnam and around the world.",
    intro: "Industry, regulation and project news from Vietnam and around the world - selected and summarised by SAVIS, with sources.",
    latest: "Latest news", pick: (n) => n.type === "news" && n.cat !== "Regulation" && dated(n),
  },
  {
    id: "press", label: "Press Releases", title: "News from SAVIS Group", more: "All press releases",
    lead: "Announcements, awards, partnerships and events from SAVIS Group.",
    intro: "Announcements, awards, partnerships, events and case studies from SAVIS Group.",
    latest: "Latest press release", pick: (n) => n.type === "press" && dated(n),
  },
  {
    id: "regulation", label: "Regulation & Policy", title: "Laws and standards to watch", more: "All regulation & policy",
    lead: "Laws, standards and policy shaping digital identity, trust services and payments, in Vietnam and around the world.",
    intro: "Laws, decrees, standards and policy moves that change how identity, signatures and payments work.",
    latest: "Latest on regulation", pick: (n) => n.type === "news" && n.cat === "Regulation" && dated(n),
  },
  {
    id: "insights", label: "Blog", title: "Expert analysis and guides", more: "All blog posts",
    lead: "Analysis, guides and how-to articles from SAVIS experts.",
    intro: "Analysis, reference architectures and country profiles from SAVIS experts.",
    latest: "Latest post", pick: (n) => n.type === "insight",
  },
  {
    // The daily radar: dated news with its sources. The same articles also sit under News or Regulation.
    id: "bulletins", label: "Tech bulletins", title: "The daily digital trust radar", more: "Open Tech bulletins",
    lead: "Digital identity, trust services, secure payments and cybersecurity - with every fact linked to its source.",
    intro: "A daily digital identity and trust radar. Short briefings on digital ID, wallets, eIDAS and trust services, each with its sources.",
    latest: "Latest bulletin", pick: (n) => n.type === "news" && Boolean(n.iso) && n.sources.length > 0 && dated(n),
  },
];

/** The overview's "Expert insights" row: the AI security, quantum and side-channel series, labelled by sector. */
export const EXPERT_SERIES: Array<[slug: string, sector: string]> = [
  ["ai-security-banking-2026", "Banking, FSI & enterprise"],
  ["quantum-banking-roadmap-2026", "Banking, FSI & enterprise"],
  ["side-channel-attacks-banking-2026", "Banking, FSI & enterprise"],
  ["ai-security-critical-infrastructure-2026", "Government, telco, IoT & smart city"],
  ["quantum-government-telco-2026", "Government, telco, IoT & smart city"],
  ["side-channel-attacks-iot-government-2026", "Government, telco, IoT & smart factory"],
];
