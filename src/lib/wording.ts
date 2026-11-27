/**
 * The site's house style, taken from the design mockup: a spaced hyphen where the draft text had an em dash,
 * "Vietnam" as one word, and American spelling. Applied once to the bundled data, the interface text and the CMS
 * content (scripts/apply-wording.ts). Not used while the site renders.
 */

/** Names that keep their official spelling. */
const KEEP = ["National Electronic Authentication Centre", "Department of Cyber Security"];

const PAIRS = `organisations:organizations organisation:organization organised:organized organises:organizes organise:organize
organising:organizing optimisation:optimization optimised:optimized optimises:optimizes optimise:optimize optimising:optimizing
digitisation:digitization digitised:digitized digitise:digitize tokenisation:tokenization tokenised:tokenized tokenise:tokenize
personalisation:personalization personalised:personalized personalise:personalize localisation:localization localised:localized
standardisation:standardization standardised:standardized standardise:standardize authorisation:authorization
authorised:authorized authorise:authorize prioritise:prioritize prioritised:prioritized prioritising:prioritizing
recognised:recognized recognise:recognize recognises:recognizes recognising:recognizing realise:realize realised:realized
minimise:minimize minimised:minimized maximise:maximize utilise:utilize summarise:summarize summarises:summarizes
specialised:specialized specialise:specialize harmonised:harmonized harmonise:harmonize emphasise:emphasize
synchronise:synchronize synchronised:synchronized centralised:centralized centralise:centralize decentralised:decentralized
modernisation:modernization modernise:modernize finalise:finalize finalised:finalized customisable:customizable
customised:customized customise:customize visualisation:visualization visualise:visualize categorised:categorized
categorise:categorize analyse:analyze analysed:analyzed analysing:analyzing catalogue:catalog
catalogues:catalogs programmes:programs programme:program centres:centers centre:center licence:license licences:licenses
colours:colors colour:color behaviours:behaviors behaviour:behavior favour:favor labour:labor honour:honor
neighbouring:neighboring defence:defense enrolment:enrollment enrolments:enrollments modelling:modeling
travelling:traveling labelled:labeled labelling:labeling cancelled:canceled fulfil:fulfill cheque:check grey:gray
mobilise:mobilize criticise:criticize apologise:apologize democratise:democratize utilisation:utilization
monetise:monetize monetisation:monetization energise:energize capitalise:capitalize initialise:initialize
normalise:normalize enrol:enroll enrols:enrolls characterised:characterized memorise:memorize jeopardise:jeopardize revolutionise:revolutionize
incentivise:incentivize industrialised:industrialized`;

const cap = (w: string) => w[0].toUpperCase() + w.slice(1);
const SPELLING = new Map(
  PAIRS.split(/\s+/).flatMap((pair) => {
    const [from, to] = pair.split(":");
    return [[from, to], [cap(from), cap(to)], [from.toUpperCase(), to.toUpperCase()]] as Array<[string, string]>;
  }),
);
const BRITISH = new RegExp(`\\b(${[...SPELLING.keys()].sort((a, b) => b.length - a.length).join("|")})\\b`, "g");

/** Parts that are addresses or code, never prose: markup attributes, link targets, URLs and in-app hashes. */
const PROTECTED = new RegExp(
  [
    ...KEEP,
    String.raw`\b(?:href|src|class|id|data-[a-z-]+)="[^"]*"`,
    String.raw`\]\([^)\s]*\)`,
    String.raw`https?://[^\s"'<>)\]]+`,
    String.raw`[\w.+-]+@[\w-]+(?:\.[\w-]+)+`,
  ].join("|"),
  "g",
);

const prose = (s: string) => s.replace(/VietNam/g, "Vietnam").replace(BRITISH, (w) => SPELLING.get(w) ?? w);

export function fixWording(text: string): string {
  // A dash standing alone (an empty table cell) stays a single hyphen.
  if (text.trim() === "—") return text.replace("—", "-");
  // The spaces stay on both sides: a text run often starts with the dash right after a bold word in the run before.
  const dashed = text.replace(/[ \t]*—[ \t]*/g, " - ");
  let out = "";
  let from = 0;
  for (const m of dashed.matchAll(PROTECTED)) {
    out += prose(dashed.slice(from, m.index)) + m[0];
    from = m.index + m[0].length;
  }
  return out + prose(dashed.slice(from));
}
