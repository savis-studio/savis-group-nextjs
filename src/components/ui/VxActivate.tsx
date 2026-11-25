"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Starts a thumbnail's animation when it scrolls into view (and stops it again when it leaves), so off-screen art costs nothing. */
export function VxActivate() {
  const path = usePathname();
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".vx"));
    if (els.length === 0) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("on"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) en.target.classList.toggle("on", en.isIntersecting);
    }, { rootMargin: "80px" });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [path]);
  return null;
}
