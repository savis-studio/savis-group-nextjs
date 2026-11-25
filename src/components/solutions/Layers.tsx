import "@/styles/solutions.css";

/** Stacked architecture layers, each a titled row of component chips. Plain HTML, reads in order. */
export function Layers({ layers, label }: { layers: Array<[title: string, items: string[]]>; label: string }) {
  return (
    <div className="sv-layers" role="group" aria-label={label}>
      {layers.map(([title, items]) => (
        <section key={title} className="sv-layers__row">
          <b>{title}</b>
          <ul>{items.map((i) => <li key={i}>{i}</li>)}</ul>
        </section>
      ))}
    </div>
  );
}

/** Numbered user-journey steps. A step's text may arrive as a list (e.g. a confirmation screen's fields). */
export function Steps({ steps }: { steps: Array<[icon: string, title: string, text: string | string[]]> }) {
  return (
    <ol className="sv-steps">
      {steps.map(([, title, text], i) => (
        <li key={i}>
          <span className="sv-steps__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
          <div><b>{title}</b><p>{Array.isArray(text) ? text.join(" · ") : text}</p></div>
        </li>
      ))}
    </ol>
  );
}
