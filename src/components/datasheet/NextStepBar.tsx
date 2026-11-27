import { Button } from "@/components/ui";

const STAGES = ["Discover", "Explore", "Evaluate", "Trust", "Engage"];

/** Closing bar of a datasheet: where the reader is on the way to buying, and what to do next. */
export function NextStepBar() {
  const current = STAGES.indexOf("Evaluate");
  return (
    <section className="sv-dsnext" aria-label="Your next step">
      <div className="sv-wrap">
        <ol>
          {STAGES.map((s, i) => (
            <li key={s} className={i < current ? "is-done" : undefined} aria-current={i === current ? "step" : undefined}>
              <i aria-hidden="true">{i + 1}</i><span>{s}</span>
            </li>
          ))}
        </ol>
        <div className="sv-dsnext__act">
          <b>Your next step</b>
          <div>
            <Button href="/customers">See it in production</Button>
            <Button href="/trust-center" variant="ghost">Visit the Trust Center</Button>
            <Button href="/contact" variant="ghost">Request a demo</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
