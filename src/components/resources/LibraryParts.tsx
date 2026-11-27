import { resourcesMenu, type ResourceKind } from "@/components/layout/nav-data";
import { Button, Section } from "@/components/ui";
import { SmartLink } from "@/components/ui/SmartLink";
import { hashToPath } from "@/lib/routes";

/** Switches between the library and its categories. Reports are left out until they have pages. */
export function LibraryTabs({ current }: { current?: ResourceKind }) {
  const tabs = resourcesMenu.categories.filter((c) => c.id !== "reports");
  return (
    <nav className="sv-libtabs" aria-label="Resource types">
      <div className="sv-wrap">
        <SmartLink href="/resources" aria-current={current ? undefined : "page"}>All</SmartLink>
        {tabs.map((c) => (
          <SmartLink key={c.id} href={hashToPath(c.href)} aria-current={current === c.id ? "page" : undefined}>{c.label}</SmartLink>
        ))}
      </div>
    </nav>
  );
}

export function FollowLinks() {
  return (
    <div className="sv-libfollow">
      <span>Follow us</span>
      <SmartLink href="https://www.linkedin.com/company/savis-technology-group/">LinkedIn</SmartLink>
      <SmartLink href="https://www.facebook.com/savisgroup1">Facebook</SmartLink>
    </div>
  );
}

export interface LibraryCtaProps { title: string; text: string; action: string }

/** The closing box of a category page. */
export function LibraryCta({ title, text, action }: LibraryCtaProps) {
  return (
    <Section className="sv-libclose">
      <div className="sv-libcta">
        <div><h2>{title}</h2><p>{text}</p></div>
        <div className="sv-libcta__acts">
          <Button href="/contact">{action}</Button>
          <Button href="/resources" variant="ghost">All resources</Button>
        </div>
      </div>
    </Section>
  );
}
