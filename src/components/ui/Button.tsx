import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";
import { SmartLink } from "./SmartLink";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: "primary" | "ghost";
  /** Set on hero, band, CTA banner: primary turns white, ghost turns white outline. */
  onBand?: boolean;
  /** Renders a link (next/link for internal routes). */
  href?: string;
  children: ReactNode;
}

export function Button({ variant = "primary", onBand, href, className, children, type = "button", ...rest }: ButtonProps) {
  const cls = cn("sv-btn", `sv-btn--${variant}`, onBand && "sv-btn--on-band", className);
  if (href) return <SmartLink href={href} className={cls}>{children}</SmartLink>;
  return <button type={type} className={cls} {...rest}>{children}</button>;
}
