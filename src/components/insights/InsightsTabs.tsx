import { SmartLink } from "@/components/ui/SmartLink";
import type { InsightGroup } from "@/lib/insight-groups";

/**
 * The tab bar shared by the Insights tabs and the case study library. `base` is empty on /insights itself, where a
 * tab is a hash link, and "/insights" elsewhere.
 */
export function InsightsTabs({ groups, current, base = "" }: { groups: InsightGroup[]; current: string; base?: string }) {
  const tabs = groups.map((g) => ({ id: g.id as string, label: g.label, href: `${base}#${g.id}` }));
  // Case studies have their own page; the design lists them just before Blog.
  const blog = tabs.findIndex((t) => t.id === "insights");
  tabs.splice(blog < 0 ? tabs.length : blog, 0, { id: "cases", label: "Case Study", href: "/customers" });
  return (
    <nav className="sv-tabs" aria-label="Insights sections">
      <div className="sv-wrap">
        {tabs.map((t) => (
          <SmartLink key={t.id} href={t.href} aria-current={t.id === current ? "page" : undefined}>{t.label}</SmartLink>
        ))}
      </div>
    </nav>
  );
}
