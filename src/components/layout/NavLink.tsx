import { SmartLink, type SmartLinkProps } from "@/components/ui/SmartLink";
import { hashToPath } from "@/lib/routes";

/** Placeholders that deliberately stay as they are (no destination yet). */
const KEEP = new Set(["#"]);

/**
 * Link for the header, menus and footer. Their data still uses the mockup's `#route` keys; this turns each one into the
 * real URL (see lib/routes.ts) so no menu item points at a hash that does not exist on the page.
 */
export function NavLink({ href, ...rest }: SmartLinkProps) {
  return <SmartLink href={href.startsWith("#") && !KEEP.has(href) ? hashToPath(href) : href} {...rest} />;
}
