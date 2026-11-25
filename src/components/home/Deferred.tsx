"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { Office } from "@/lib/content";

const Network = dynamic(() => import("./HeroNetwork").then((m) => m.HeroNetwork), { ssr: false });
const Globe = dynamic(() => import("./Globe").then((m) => m.Globe), { ssr: false });

/** True once the browser is idle (or after a short delay), so decorative canvases never compete with the first paint. */
function useIdle(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const go = () => setReady(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(go, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = globalThis.setTimeout(go, 600);
    return () => globalThis.clearTimeout(t);
  }, []);
  return ready;
}

export function DeferredNetwork() {
  return useIdle() ? <Network /> : null;
}

/** Reserves the globe's square so nothing shifts when it loads. */
export function DeferredGlobe({ offices, label }: { offices: Office[]; label: string }) {
  const ready = useIdle();
  return ready ? (
    <Globe offices={offices} label={label} />
  ) : (
    <div role="img" aria-label={label} style={{ width: "100%", maxWidth: 440, aspectRatio: "1 / 1" }} />
  );
}
