/** Rules for the last part of an article URL: lowercase letters and digits, words joined by single hyphens. */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Turns any title (Vietnamese included) into a valid slug. Returns "" when nothing usable is left. */
export const slugify = (text: string): string =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** True, or the message shown under the field in the admin and returned by the API. */
export function validateSlug(value: unknown): true | string {
  if (typeof value !== "string" || value === "") return "A slug is required.";
  if (SLUG_PATTERN.test(value)) return true;
  const suggestion = slugify(value);
  return `Use lowercase letters, digits and single hyphens only.${suggestion ? ` Try: ${suggestion}` : ""}`;
}
