export interface StatProps {
  /** Real figure from an approved source; never invented. */
  value: string;
  label: string;
}

/** Big number with a glow rule. Only on band or hero backgrounds. */
export function Stat({ value, label }: StatProps) {
  return (
    <div className="sv-stat">
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );
}
