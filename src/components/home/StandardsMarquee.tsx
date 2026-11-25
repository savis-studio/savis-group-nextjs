/** Scrolling strip of the standards SAVIS builds on. The list is repeated once for a seamless loop; the copy is hidden from assistive tech. */
export function StandardsMarquee({ items }: { items: string[] }) {
  return (
    <section className="sv-home__mq" aria-label="Standards we build on">
      <div className="sv-wrap"><span>Standards we build on</span></div>
      <div className="sv-home__track">
        <ul className="sv-home__row">
          {items.map((s) => <li key={s}>{s}</li>)}
          {items.map((s) => <li key={`${s}-copy`} aria-hidden="true">{s}</li>)}
        </ul>
      </div>
    </section>
  );
}
