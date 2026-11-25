import type { Arch } from "@/lib/content";

/**
 * Reference architecture as layered tiers: users → channels → the product → trust core and connected systems.
 * Plain HTML so it reads on mobile and to screen readers; the numbered steps spell out the flow.
 */
export function Architecture({ arch, name, caption }: { arch: Arch; name: string; caption?: string }) {
  const chips = (items: Array<[string, string]>) => items.map(([label]) => <li key={label}>{label}</li>);
  return (
    <figure className="sv-arch">
      <div className="sv-arch__tiers">
        <section className="sv-arch__tier" aria-label="Users">
          <b>Users</b>
          <ul>{chips(arch.users)}</ul>
        </section>
        <span className="sv-arch__flow" aria-hidden="true" />
        <section className="sv-arch__tier" aria-label="Channels">
          <b>Channels</b>
          <ul>{chips(arch.ch)}</ul>
        </section>
        <span className="sv-arch__flow" aria-hidden="true" />
        <section className="sv-arch__tier sv-arch__tier--main" aria-label={name}>
          <b>{name}{arch.tag ? ` · ${arch.tag}` : ""}</b>
          <ul>{arch.mods.map((m) => <li key={m}>{m}</li>)}</ul>
        </section>
        <span className="sv-arch__flow" aria-hidden="true" />
        <div className="sv-arch__row">
          <section className="sv-arch__tier" aria-label="Trust and crypto core">
            <b>Trust &amp; crypto core</b>
            <ul>{chips(arch.core)}</ul>
          </section>
          <section className="sv-arch__tier" aria-label="Enterprise and national systems">
            <b>Enterprise &amp; national systems</b>
            <ul>{chips(arch.ent)}</ul>
          </section>
        </div>
      </div>
      {arch.steps && arch.steps.length > 0 && (
        <ol className="sv-arch__steps">
          {arch.steps.map((s, i) => <li key={i}><b>{i + 1}</b><span>{s}</span></li>)}
        </ol>
      )}
      <figcaption>
        {caption ?? `Reference architecture of ${name}. Components and integrations are confirmed during solution design.`}
      </figcaption>
    </figure>
  );
}
