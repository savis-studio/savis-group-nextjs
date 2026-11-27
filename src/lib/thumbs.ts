/** Which illustration and colour each kind of card gets. Rules ported from the design mockup (NW_*, UC_ICON, CS_TH). */
import { vxArt } from "./vx-art";

export interface ThumbSpec {
  /** Colour family: identity, cyber, gov, finance, ai. */
  cls: string;
  /** Illustration key understood by vxArt. */
  icon: string;
  /** Seed label: "~id" for no caption, "caption|id" for a caption drawn in the art. */
  lbl?: string;
  /** Small label at the bottom left. */
  left?: string;
  /** No words drawn inside the art (article cards). */
  plain?: boolean;
}

/** An illustration without the words drawn in it. */
export const stripWords = (art: string) => art.replace(/<text\b[\s\S]*?<\/text>/g, "");

/** The illustration markup of a card. */
export function thumbArt(spec: ThumbSpec): string {
  const art = vxArt(spec.icon, undefined, undefined, spec.lbl);
  return spec.plain ? stripWords(art) : art;
}

export { vxArt };

/** Icon for a use case, product or case study, picked from its id and name. */
export function ucIcon(id: string, name: string, pillar: string): string {
  const t = `${id} ${name}`.toLowerCase();
  const rules: Array<[RegExp, string]> = [
    [/quantum|pqc|crypto-agil/, "shield"], [/pay|card|3ds|token|merchant|transaction|tap/, "card"],
    [/sign|contract|seal|invoice/, "sign"], [/open-bank|api|consent|tpp/, "api"], [/wallet|mdl|licen/, "wallet"],
    [/face|biometric|palm|finger|liveness|deepfake|abis|dedup/, "face"], [/border|travel|egate|airport/, "border"],
    [/public|gov|citizen|service|lgsp|tax/, "gov"], [/passkey|password|sca|otp|login|auth|access/, "key"],
    [/ai|data|analytics|media|content/, "chip"], [/id|identity|onboard|kyc|eid/, "id"],
  ];
  for (const [re, k] of rules) if (re.test(t)) return k;
  return pillar === "cyber" ? "shield" : pillar === "finance" ? "card" : pillar === "gov" ? "gov" : pillar === "ai" ? "chip" : "id";
}

const NW_SC: Record<string, string> = {
  globe: "border", finance: "card", transit: "bus", gov: "gov", sign: "sign", dip: "wallet", abis: "face", kiosk: "id",
  quantum: "shield", identity: "id", eco: "chip", wallet: "wallet", verify: "face", token: "key", audit: "law", kyc: "face",
  omni: "api", pay: "card", bank: "bank",
};
const NW_PR: Record<string, string> = { Award: "mega", Corporate: "border", Event: "gov", Partnership: "api", "Press release": "news", "Case study": "sign" };

export function newsThumb(n: { id: string; type: string; cat: string; scene?: string | null }): ThumbSpec {
  const icon =
    (n.scene && NW_SC[n.scene]) ||
    (n.type === "press" ? NW_PR[n.cat] || "mega"
      : n.cat === "Regulation" ? "law"
      : n.type === "insight" ? (n.cat === "Reference architecture" ? "layers" : n.cat === "Country profile" ? "border" : "bulb")
      : "news");
  const cls = n.type === "press" ? "ai" : n.cat === "Regulation" ? "gov" : n.type === "insight" ? "identity" : "cyber";
  return { cls, icon, lbl: `~${n.id}`, left: n.cat, plain: true };
}

const CS_TH: Record<string, string> = { national: "identity", bankca: "cyber", openbanking: "finance", govdigital: "gov", security: "ai", onboarding: "identity", signing: "finance" };
const CASE_CAT_ICON: Record<string, string> = { national: "root", bankca: "key", signing: "sign", onboarding: "face", openbanking: "api", security: "shield", govdigital: "gov" };

export function caseThumb(c: { id: string; cat: string; client: string; title: string; country?: string }): ThumbSpec {
  const ic = ucIcon(c.id, c.title, "");
  const icon = c.cat === "national" || c.cat === "bankca" ? "root" : ic === "id" && CASE_CAT_ICON[c.cat] ? CASE_CAT_ICON[c.cat] : ic;
  return { cls: CS_TH[c.cat] ?? "identity", icon, lbl: `${c.client}|${c.id}`, left: c.country };
}

export function useCaseThumb(u: { id: string; name: string; pillar: string }, left?: string): ThumbSpec {
  return { cls: u.pillar, icon: ucIcon(u.id, u.name, u.pillar), lbl: u.id, left };
}

export function productThumb(p: { slug: string; name: string; pillar: string }): ThumbSpec {
  return { cls: p.pillar, icon: ucIcon(p.slug, p.name, p.pillar), lbl: p.slug };
}

/** Industry cards: icon, caption and palette by sector name. */
const IM: Array<[RegExp, string, string, string]> = [
  [/government|public sector/i, "gov", "Government", "indigo"], [/banking|financial services|insurance/i, "card", "Banking", "teal"],
  [/payments|fintech/i, "wallet", "Payments", "cyan"], [/trust service|\bcas?\b/i, "root", "Trust services", "blue"],
  [/telecom/i, "iot", "Telecom", "emerald"], [/enterprise/i, "shield", "Enterprise", "violet"],
  [/media|broadcast/i, "news", "Media", "magenta"], [/retail|ecommerce/i, "wallet", "Retail", "coral"],
  [/education/i, "people", "Education", "amber"], [/health/i, "heart", "Healthcare", "coral"],
  [/energy|utilit/i, "bulb", "Energy", "emerald"], [/automotive|mobility/i, "bus", "Mobility", "indigo"],
  [/transport|logistic/i, "bus", "Logistics", "teal"],
];
export function industryThumb(name: string, index: number): { icon: string; tag: string; tone: string; seed: number } {
  const m = IM.find((x) => x[0].test(name)) ?? [/./, "shield", "", "blue"];
  return { icon: m[1], tag: m[2], tone: m[3], seed: index * 7 + 3 };
}

/** Illustration for each solution pillar. */
export const PILLAR_ICON: Record<string, string> = { identity: "face", cyber: "shield", gov: "gov", finance: "root", ai: "chip" };
