import news from "@/data/mockup/news.json";
import type { ArticleDetail } from "./insights";

/**
 * Topic and region of a news item, for the filters on the News and Regulation tabs. The CMS holds neither, so this
 * follows the mockup: the value recorded for an imported article, otherwise keyword rules over title, summary and tags.
 */
const TOPIC_RULES: Array<[topic: string, words: RegExp]> = [
  ["Regulation & policy", /regulat|decree|circular|\bbill\b|policy|\blaw\b|directive|duty of care/i],
  ["Payments & open finance", /payment|bank|psd3|psr|open finance|open banking|\bqr\b|euro|card|wallet pay|transaction/i],
  ["Cybersecurity & quantum-safe", /cyber|attack|breach|deepfake|injection|quantum|pqc|fraud|zero trust/i],
  ["Digital government", /government|public service|e-gov|egov|civil regist|voter|census|myid|nzbn|epuap/i],
  ["Digital identity & trust", /./],
];
const VIETNAM = /viet\s?nam|vneid|\bsbv\b|state bank of viet|decree|circular|bac ninh|hanoi|napas/i;

export const NEWS_TOPICS = TOPIC_RULES.map(([topic]) => topic);
export const NEWS_REGIONS = ["Vietnam", "International"];

const recorded = new Map(
  (news as Array<{ id: string; topic?: string; region?: string }>).map((n) => [n.id, n]),
);

export function newsFacets(n: ArticleDetail): { topic: string; region: string } {
  const known = recorded.get(n.id);
  const text = [n.title, n.sum, n.tags.join(" ")].join(" ");
  const region = known?.region ?? (VIETNAM.test(text) ? "Vietnam" : "International");
  return {
    topic: known?.topic ?? TOPIC_RULES.find(([, words]) => words.test(text))![0],
    region: region === "VietNam" ? "Vietnam" : region,
  };
}
