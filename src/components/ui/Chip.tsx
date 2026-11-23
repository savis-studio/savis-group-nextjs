import type { ReactNode } from "react";
import { cn } from "./cn";

export interface ChipProps {
  onBand?: boolean;
  className?: string;
  children: ReactNode;
}

/** Static tag: role labels (SAVIS, CORE TECHNOLOGY), status (New), topic tags. */
export function Chip({ onBand, className, children }: ChipProps) {
  return <span className={cn("sv-chip", onBand && "sv-chip--on-band", className)}>{children}</span>;
}

export interface FilterChipProps {
  active?: boolean;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}

/** Toggle pill for filtering lists (44px hit area, aria-pressed). Needs a client component parent. */
export function FilterChip({ active, onClick, className, children }: FilterChipProps) {
  return (
    <button type="button" aria-pressed={!!active} onClick={onClick} className={cn("sv-chip", "sv-chip--filter", className)}>
      {children}
    </button>
  );
}
