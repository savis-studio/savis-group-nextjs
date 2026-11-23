import type { ReactNode } from "react";
import { cn } from "./cn";

export interface CtaBannerProps {
  title: ReactNode;
  /** A Button with onBand. */
  action?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function CtaBanner({ title, action, className, children }: CtaBannerProps) {
  return (
    <div className={cn("sv-cta", className)}>
      <div>
        <b>{title}</b>
        {children && <span>{children}</span>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
