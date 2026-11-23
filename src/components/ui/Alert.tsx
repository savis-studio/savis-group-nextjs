import type { ReactNode } from "react";
import { cn } from "./cn";

export interface AlertProps {
  tone?: "info" | "success" | "warn" | "error";
  /** Always give a short title; color alone never carries the meaning. */
  title: string;
  className?: string;
  children?: ReactNode;
}

const ICON: Record<NonNullable<AlertProps["tone"]>, ReactNode> = {
  info: <><circle cx="12" cy="12" r="10" /><path d="M12 11v6M12 7.5v.5" /></>,
  success: <><circle cx="12" cy="12" r="10" /><path d="m8 12.5 2.5 2.5L16 9.5" /></>,
  warn: <><path d="M12 3 2 20h20L12 3z" /><path d="M12 10v4M12 17v.5" /></>,
  error: <><circle cx="12" cy="12" r="10" /><path d="m9 9 6 6M15 9l-6 6" /></>,
};

export function Alert({ tone = "info", title, className, children }: AlertProps) {
  return (
    <div className={cn("sv-alert", `sv-alert--${tone}`, className)} role={tone === "error" ? "alert" : "status"}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICON[tone]}</svg>
      <b>{title}</b>
      {children && <div>{children}</div>}
    </div>
  );
}
