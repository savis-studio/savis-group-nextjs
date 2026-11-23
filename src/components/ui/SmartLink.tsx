import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

export interface SmartLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children?: ReactNode;
}

/** next/link for internal routes, a plain <a> for external, mailto:, tel: and hash links. */
export function SmartLink({ href, children, ...rest }: SmartLinkProps) {
  const external = /^(https?:)?\/\//.test(href) || /^(mailto|tel):/.test(href) || href.startsWith("#");
  if (external) {
    const ext = /^(https?:)?\/\//.test(href);
    return (
      <a href={href} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
