import type { ResourceArt as Art } from "@/lib/resources";

/** The picture of a resource card. Drawings are rendered on the server and passed down as markup. */
export function ResourceArt({ art }: { art: Art }) {
  if (art.kind === "photo") {
    return <span className="sv-ra" aria-hidden="true"><img src={art.src} alt="" loading="lazy" decoding="async" /></span>;
  }
  if (art.kind === "art") {
    return <span className={`sv-ra uc-th-${art.cls}`} aria-hidden="true"><span dangerouslySetInnerHTML={{ __html: art.svg }} /></span>;
  }
  return (
    <span className={`sv-ra sv-ra--cover${art.eyebrow ? "" : " sv-ra--mark"}`} data-pal={art.pal} aria-hidden="true">
      {art.svg && <span className="sv-ra__draw" dangerouslySetInnerHTML={{ __html: art.svg }} />}
      <span className="sv-ra__text">
        {art.eyebrow && <em>{art.eyebrow}</em>}
        <b>{art.title}</b>
        {art.eyebrow && <i>SAVIS Group</i>}
      </span>
    </span>
  );
}
