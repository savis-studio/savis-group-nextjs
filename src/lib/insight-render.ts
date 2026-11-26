/**
 * Article blocks → HTML. The markup and class names match the site's article stylesheet (styles/article.css), so a
 * block renders exactly like the original mockup component. The same functions are used by the importer to check that
 * a converted block reproduces its source before it is accepted (see scripts/import-insights.ts).
 */
import { escapeHtml as e, renderInline as i } from "./inline";
import { sanitizeHtml } from "./sanitize";

export type TextItem = { text?: string | null };

export interface BlockFieldsMap {
  /** `image` is the Media document once populated, or only its id (then nothing is shown). */
  gallery: { photos?: Array<{ image?: unknown; caption?: string | null }> | null };
  keyPoint: { text: string };
  note: { text: string };
  cardGrid: {
    layout?: "auto" | "g2" | "g3" | "x2" | "three" | "four" | null;
    soft?: boolean | null;
    cards?: Array<{ title: string; text?: string | null; bullets?: TextItem[] | null; accent?: string | null; tag?: string | null }> | null;
  };
  steps: { items?: Array<{ title: string; text?: string | null; tag?: string | null }> | null };
  chips: { items?: TextItem[] | null };
  stats: { items?: Array<{ value: string; label: string }> | null };
  table: {
    variant?: "x-tbl" | "plain" | null;
    label?: string | null;
    rowHeaders?: boolean | null;
    head?: TextItem[] | null;
    rows?: Array<{ cells?: Array<{ text?: string | null; tone?: string | null }> | null }> | null;
  };
  timeline: {
    items?: Array<{ date: string; title: string; text?: string | null; state?: "done" | "now" | "later" | null }> | null;
    caption?: string | null;
  };
  arch: {
    cols?: Array<{ title: string; items?: TextItem[] | null; core?: boolean | null; tag?: string | null }> | null;
    links?: TextItem[] | null;
    baseTitle?: string | null;
    baseText?: string | null;
    caption?: string | null;
  };
  layers: { items?: Array<{ title: string; text?: string | null; tag?: string | null }> | null };
  landscape: {
    columns?: Array<{
      heading: string;
      items?: Array<{ status: "live" | "pilot" | "plan"; name: string; tag?: string | null; text?: string | null }> | null;
    }> | null;
    legend?: Array<{ status: "live" | "pilot" | "plan"; label: string }> | null;
  };
  diagramHtml: { kind?: string | null; html: string };
  htmlBlock: { html: string };
}

export type BlockType = keyof BlockFieldsMap;

const list = <T>(x: T[] | null | undefined): T[] => x ?? [];
const num = (n: number) => String(Math.round(n * 10) / 10);

const RENDER: { [K in BlockType]: (f: BlockFieldsMap[K]) => string } = {
  gallery: (f) => {
    const figures = list(f.photos).flatMap((p) => {
      const m = p.image as { url?: string | null; alt?: string | null; sizes?: { card?: { url?: string | null } } } | null | undefined;
      if (!m || typeof m !== "object" || !m.url) return [];
      const caption = p.caption || "";
      return [
        `<figure><a href="${e(m.url)}" target="_blank" rel="noopener"><img src="${e(m.sizes?.card?.url || m.url)}" alt="${e(caption || m.alt || "")}" loading="lazy"></a>` +
          (caption ? `<figcaption>${e(caption)}</figcaption>` : "") + `</figure>`,
      ];
    });
    return figures.length ? `<div class="ph-gal">${figures.join("")}</div>` : "";
  },

  keyPoint: (f) => `<div class="af-key">${i(f.text)}</div>`,
  note: (f) => `<p class="af-note">${i(f.text)}</p>`,

  cardGrid: (f) => {
    const cls = ["af-grid", f.layout && f.layout !== "auto" ? f.layout : "", f.soft ? "soft" : ""].filter(Boolean).join(" ");
    const cards = list(f.cards)
      .map((c) => {
        const style = c.accent ? ` style="--c:${e(c.accent)}"` : "";
        const bullets = list(c.bullets);
        return (
          `<div class="af-c"${style}><b>${i(c.title)}</b>` +
          (c.text ? `<p>${i(c.text)}</p>` : "") +
          (bullets.length ? `<ul>${bullets.map((b) => `<li>${i(b.text)}</li>`).join("")}</ul>` : "") +
          (c.tag ? `<em>${i(c.tag)}</em>` : "") +
          `</div>`
        );
      })
      .join("");
    return `<div class="${e(cls)}">${cards}</div>`;
  },

  steps: (f) =>
    `<div class="af-flow">${list(f.items)
      .map((s, n) => `<div class="af-st"><span class="af-n">${n + 1}</span><b>${i(s.title)}</b>${s.text ? `<p>${i(s.text)}</p>` : ""}${s.tag ? `<em>${i(s.tag)}</em>` : ""}</div>`)
      .join("")}</div>`,

  chips: (f) => `<div class="af-chips">${list(f.items).map((c) => `<span>${i(c.text)}</span>`).join("")}</div>`,

  stats: (f) =>
    `<div class="af-stats">${list(f.items).map((s) => `<div><b>${i(s.value)}</b><span>${i(s.label)}</span></div>`).join("")}</div>`,

  table: (f) => {
    const cls = ["dt-tbl", f.variant === "x-tbl" ? "x-tbl" : ""].filter(Boolean).join(" ");
    const head = list(f.head).map((h) => `<th>${i(h.text)}</th>`).join("");
    const rows = list(f.rows)
      .map((r) => {
        const cells = list(r.cells)
          .map((c, n) => {
            const tag = f.rowHeaders && n === 0 ? "th" : "td";
            const tone = tag === "td" && c.tone ? ` class="${e(c.tone)}"` : "";
            return `<${tag}${tone}>${i(c.text)}</${tag}>`;
          })
          .join("");
        return `<tr>${cells}</tr>`;
      })
      .join("");
    return `<div class="${cls}" role="region" tabindex="0" aria-label="${e(f.label ?? "Table")}"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
  },

  timeline: (f) => {
    const items = list(f.items);
    return (
      `<figure class="xd xd-tl"><ol style="--n:${items.length}">` +
      items
        .map((t, n) => {
          const state = t.state === "done" || t.state === "now" ? ` class="${t.state}"` : "";
          return `<li${state} style="--i:${n}"><span class="xt-d">${i(t.date)}</span><b>${i(t.title)}</b>${t.text ? `<p>${i(t.text)}</p>` : ""}</li>`;
        })
        .join("") +
      `</ol>${f.caption ? `<figcaption>${i(f.caption)}</figcaption>` : ""}</figure>`
    );
  },

  arch: (f) => {
    const cols = list(f.cols);
    const links = list(f.links);
    let row = "";
    cols.forEach((c, n) => {
      row += `<div class="xa-col${c.core ? " core" : ""}" style="--i:${n}"><b>${i(c.title)}</b>${c.tag ? `<em>${i(c.tag)}</em>` : ""}<ul>${list(c.items).map((x) => `<li>${i(x.text)}</li>`).join("")}</ul></div>`;
      if (n < cols.length - 1) row += `<div class="xa-link" aria-hidden="true"><span>${i(links[n]?.text)}</span><i></i></div>`;
    });
    const base = f.baseTitle ? `<div class="xa-base"><b>${i(f.baseTitle)}</b><span>${i(f.baseText)}</span></div>` : "";
    return `<figure class="xd xd-arch"><div class="xa-row" style="--n:${cols.length}">${row}</div>${base}${f.caption ? `<figcaption>${i(f.caption)}</figcaption>` : ""}</figure>`;
  },

  layers: (f) => {
    const items = list(f.items);
    return `<div class="af-lay">${items
      .map(
        (l, k) =>
          `<div class="af-l" style="--w:${num(56 + 8.8 * k)}%;--k:${k}"><div class="af-lb"><b>${i(l.title)}</b>${l.text ? `<span>${i(l.text)}</span>` : ""}</div>${l.tag ? `<em>${i(l.tag)}</em>` : ""}</div>`,
      )
      .join("")}</div>`;
  },

  landscape: (f) => {
    const cols = list(f.columns)
      .map(
        (c) =>
          `<div class="al-col"><b class="al-h">${i(c.heading)}</b>${list(c.items)
            .map(
              (x) =>
                `<div class="al-it ${e(String(x.status ?? ""))}"><div><strong>${i(x.name)}</strong>${x.tag ? `<em>${i(x.tag)}</em>` : ""}</div>${x.text ? `<span>${i(x.text)}</span>` : ""}</div>`,
            )
            .join("")}</div>`,
      )
      .join("");
    const legend = list(f.legend);
    const leg = legend.length ? `<div class="al-leg">${legend.map((l) => `<span class="${e(String(l.status ?? ""))}">${i(l.label)}</span>`).join("")}</div>` : "";
    return `<div class="af-land">${cols}${leg}</div>`;
  },

  diagramHtml: (f) => sanitizeHtml(f.html),
  htmlBlock: (f) => sanitizeHtml(f.html),
};

export function renderBlock(type: string, fields: unknown): string {
  const fn = (RENDER as Record<string, (f: never) => string>)[type];
  return fn ? fn(fields as never) : "";
}
