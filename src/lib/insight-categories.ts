/**
 * The sections an article can be filed in (stored in `type`), named like the tabs on /insights, with the categories
 * each one offers. The section decides the tab; the category is the label on the article.
 */
export const INSIGHT_SECTIONS = [
  { value: "insight", label: "Blog", categories: ["Insight", "Reference architecture", "Country profile", "AI Security", "Quantum", "Side-channel attacks", "eIDAS"] },
  { value: "news", label: "News & Regulation", categories: ["Industry news", "Regulation"] },
  { value: "press", label: "Press Releases", categories: ["Press release", "Event", "Award", "Partnership", "Corporate", "Company", "Case study"] },
];

export const categoriesOf = (section: unknown): string[] => INSIGHT_SECTIONS.find((s) => s.value === section)?.categories ?? [];

/** True, or the message shown under the field in the admin and returned by the API. */
export function validateCategory(value: unknown, section: unknown): true | string {
  const found = INSIGHT_SECTIONS.find((s) => s.value === section);
  if (!found) return "Choose a section first.";
  if (typeof value === "string" && found.categories.includes(value)) return true;
  return `Choose a category of the ${found.label} section: ${found.categories.join(", ")}.`;
}
