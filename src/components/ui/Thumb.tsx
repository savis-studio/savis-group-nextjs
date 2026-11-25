import { vxArt, type ThumbSpec } from "@/lib/thumbs";
import { cn } from "./cn";

/** Card thumbnail: animated scene art on a colour-family background. Server-rendered; `VxActivate` starts the animation. */
export function Thumb({ spec, big, tone, className }: { spec: ThumbSpec; big?: boolean; tone?: string; className?: string }) {
  return (
    <span className={cn("uc-th", `uc-th-${spec.cls}`, big && "uc-th-big", tone && `p-${tone}`, className)} aria-hidden="true">
      <span dangerouslySetInnerHTML={{ __html: vxArt(spec.icon, undefined, undefined, spec.lbl) }} />
      {spec.left && <em className="uc-steps">{spec.left}</em>}
    </span>
  );
}

/** Thumbnail for industry cards: fixed seed and a captioned art. */
export function IndustryThumb({ icon, tag, tone, seed }: { icon: string; tag: string; tone: string; seed: number }) {
  return (
    <span className={cn("vxc-ban", `p-${tone}`)} aria-hidden="true" style={{ margin: 0, borderRadius: 14 }}>
      <span dangerouslySetInnerHTML={{ __html: vxArt(icon, seed) }} />
      {tag && <span className="vxc-tag">{tag}</span>}
    </span>
  );
}
