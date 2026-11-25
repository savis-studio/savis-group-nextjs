/**
 * Tiny inline markup for text fields inside article blocks, so editors can write links and emphasis without HTML:
 *   **bold**   *italic*   [link text](/path or https://…)   and a backslash escapes the next character.
 * Output is always escaped, so a field can never inject tags.
 */

const ESC: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
export const escapeHtml = (s: string): string => s.replace(/[&<>"]/g, (c) => ESC[c]);

const external = (url: string) => /^https?:\/\//i.test(url) && !url.startsWith("https://savis-group.com");

/** Only http(s), mailto:, tel: and site-relative URLs are allowed in links. */
export const safeUrl = (url: string): string => (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(url.trim()) ? url.trim() : "#");

export function renderInline(src: string | null | undefined): string {
  const s = src ?? "";
  let out = "";
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === "\\" && i + 1 < s.length) {
      out += escapeHtml(s[i + 1]);
      i += 2;
    } else if (s.startsWith("**", i)) {
      const j = s.indexOf("**", i + 2);
      if (j > i + 2) { out += `<b>${renderInline(s.slice(i + 2, j))}</b>`; i = j + 2; } else { out += "**"; i += 2; }
    } else if (c === "*") {
      const j = s.indexOf("*", i + 1);
      if (j > i + 1) { out += `<em>${renderInline(s.slice(i + 1, j))}</em>`; i = j + 1; } else { out += "*"; i += 1; }
    } else if (c === "[") {
      let depth = 0;
      let j = i;
      for (; j < s.length; j++) {
        if (s[j] === "\\") { j++; continue; }
        if (s[j] === "[") depth++;
        else if (s[j] === "]" && --depth === 0) break;
      }
      if (j < s.length && s[j + 1] === "(" && s.indexOf(")", j) > 0) {
        const end = s.indexOf(")", j);
        const url = safeUrl(s.slice(j + 2, end));
        const ext = external(url) ? ' target="_blank" rel="noopener noreferrer"' : "";
        out += `<a href="${escapeHtml(url)}"${ext}>${renderInline(s.slice(i + 1, j))}</a>`;
        i = end + 1;
      } else { out += "["; i += 1; }
    } else {
      out += escapeHtml(c);
      i += 1;
    }
  }
  return out;
}

/** Escapes characters that would otherwise be read as markup. Used when converting plain text into a field. */
export const escapeMarkup = (s: string): string => s.replace(/[\\*[\]]/g, (c) => `\\${c}`);
