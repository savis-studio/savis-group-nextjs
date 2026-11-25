import type { ArticleDetail } from "./insights";

/** Tabs of the Insights area, in order. A tab with no articles is left out. Blog and tech bulletins will appear once there are any. */
export const INSIGHT_GROUPS: Array<{ id: string; label: string; eyebrow: string; title: string; pick: (n: ArticleDetail) => boolean }> = [
  { id: "news", label: "News", eyebrow: "News", title: "What is changing", pick: (n) => n.type === "press" && n.cat !== "Press release" },
  { id: "press", label: "Press Releases", eyebrow: "Press", title: "Press releases", pick: (n) => n.type === "press" && n.cat === "Press release" },
  { id: "regulation", label: "Regulation & Policy", eyebrow: "Regulation", title: "Regulation & policy", pick: (n) => n.type === "news" },
  { id: "insights", label: "Research", eyebrow: "Insights", title: "Research & reference architectures", pick: (n) => n.type === "insight" },
];
