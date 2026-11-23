import { cn } from "./cn";

export interface KeyValueListProps {
  items: Array<[label: string, value: string]>;
  className?: string;
}

/** 4–8 specs of one object. For multi-column comparisons use DataTable. */
export function KeyValueList({ items, className }: KeyValueListProps) {
  return (
    <ul className={cn("sv-kv", className)}>
      {items.map(([k, v]) => (
        <li key={k}><span>{k}</span><b>{v}</b></li>
      ))}
    </ul>
  );
}
