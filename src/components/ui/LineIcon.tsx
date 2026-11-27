import { LINE_ICONS, type LineIconName } from "@/lib/line-icons";

/** A decorative line icon from `LINE_ICONS`; it takes the surrounding text color. */
export function LineIcon({ name, size = 22 }: { name: LineIconName; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: LINE_ICONS[name] }}
    />
  );
}
