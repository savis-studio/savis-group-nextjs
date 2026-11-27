/**
 * The varied banners of a tab's article cards: an illustration and a palette chosen from the card's category, else
 * from words in its title or text, and changed when two neighbours would look alike. Ported from the design mockup.
 */

export interface ListArt {
  /** Illustration key understood by vxArt. */
  icon: string;
  /** Palette class p-<name> (styles/vx.css). */
  palette: string;
  seed: number;
}

const BY_CATEGORY: Record<string, [icon: string, palette: string]> = {
  "Payments & open finance": ["card", "teal"], "Cybersecurity & quantum-safe": ["shield", "cyan"], "Digital government": ["gov", "indigo"],
  "Digital identity & trust": ["face", "blue"], "Regulation & policy": ["law", "amber"], Award: ["mega", "coral"], Event: ["gov", "violet"],
  Partnership: ["api", "teal"], Corporate: ["border", "indigo"], "Press release": ["news", "coral"], "Case study": ["sign", "blue"],
  "Reference architecture": ["bulb", "violet"], "Country profile": ["border", "cyan"],
  // "Insight" is left to the words below: most of the blog carries it, and one picture for all of them says nothing.
};

/** First match wins, so the narrower subjects come first. */
const BY_WORDS: Array<[RegExp, icon: string, palette: string]> = [
  [/quantum|\bpqc\b|post-quantum|crypto.?agil/i, "chip", "magenta"],
  [/\bai\b|artificial intelligence|machine learning|\bnlp\b|vision|inference|semiconductor|deepfake/i, "ai", "violet"],
  [/\biot\b|edge|sensor|gateway box|receiver/i, "iot", "emerald"],
  [/wallet/i, "wallet", "cyan"],
  [/sign|seal|contract|qtsa|timestamp|paperless/i, "sign", "blue"],
  [/\bpki\b|root ca|certificate authorit|\bca\b|hsm|key manag/i, "root", "indigo"],
  [/regulat|\blaw\b|decree|circular|policy|directive|bill\b|compliance|audit|readiness|certif|\biso\b|webtrust|integrity|ethic|anti-corruption/i, "law", "amber"],
  [/identity|\beid\b|vneid|\bkyc\b|onboard|biometric|face|liveness|passkey|fido|authenticat|login/i, "face", "blue"],
  [/payment|bank|fapi|\bcard\b|open finance|open banking|fintech|3-d secure|transaction|insur/i, "card", "teal"],
  [/government|ministr|commune|province|city|public service|citizen|one-stop|e-gov/i, "gov", "indigo"],
  [/attack|fraud|cyber|\bsoc\b|zero trust|threat|breach|security|protect/i, "shield", "cyan"],
  [/transport|mobility|automotive|vehicle|logistic|transit|car\b/i, "bus", "emerald"],
  [/award|event|press|partnership|anniversar|turns \d|announce|launch/i, "mega", "coral"],
  [/learn|grow|training|career path|mentor|develop/i, "growth", "emerald"],
  [/recognition|honor/i, "award", "amber"],
  [/well-being|wellbeing|health care|care day|benefit/i, "heart", "coral"],
  [/people|team|culture|career|hiring|join|s-ers|family|together/i, "people", "coral"],
  [/health|hospital|patient|education|universit|school|student/i, "gov", "emerald"],
  [/data|archive|document|\bocr\b|analytic|media|broadcast|report/i, "news", "violet"],
  [/europe|\beu\b|global|cross-border|international|country|asia|pacific|africa|americas|middle east/i, "border", "cyan"],
  [/environment|planet|carbon|energy|utilit|sustainab|climate/i, "bulb", "emerald"],
];

const VARIANTS: Record<string, string[]> = { face: ["face", "id"], card: ["card", "api", "bank"], shield: ["shield", "key"] };
const PALETTES = ["blue", "teal", "violet", "coral", "indigo", "amber", "cyan", "emerald", "magenta"];

const hash = (s: string) => {
  let h = 7;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
};

/** One entry per card, in order; undefined for a card that has its own photo. */
export function listArt(cards: Array<{ category: string; title: string; text: string; photo: boolean }>): Array<ListArt | undefined> {
  let previous: ListArt | undefined;
  return cards.map((card, i) => {
    if (card.photo) return undefined;
    const seed = hash(card.title + i);
    const match = BY_CATEGORY[card.category]
      ?? BY_WORDS.find(([words]) => words.test(card.title))?.slice(1) as [string, string] | undefined
      ?? BY_WORDS.find(([words]) => words.test(card.text))?.slice(1) as [string, string] | undefined;
    const base = match?.[0] ?? ["bulb", "news", "border", "mega"][seed % 4];
    const variants = match ? VARIANTS[base] : undefined;
    let icon = variants ? variants[seed % variants.length] : base;
    let palette = match?.[1] ?? PALETTES[seed % PALETTES.length];
    if (previous?.palette === palette) {
      if (previous.icon === icon && variants) icon = variants[(seed + 1) % variants.length];
      palette = PALETTES[(PALETTES.indexOf(palette) + 1 + (seed % 3)) % PALETTES.length];
    }
    previous = { icon, palette, seed };
    return previous;
  });
}
