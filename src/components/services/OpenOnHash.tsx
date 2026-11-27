"use client";

import { useEffect } from "react";

/**
 * When the address ends in one of these item ids, opens that `<details>`, closes the others in the list and scrolls to it.
 * Covers a fresh load, a hash change, and a menu link followed while already on the page.
 */
export function OpenOnHash({ ids }: { ids: string[] }) {
  const key = ids.join(" ");
  useEffect(() => {
    const list = key.split(" ");
    const show = (hash: string) => {
      const id = hash.slice(1);
      if (!list.includes(id)) return;
      for (const other of list) {
        const el = document.getElementById(other);
        if (el instanceof HTMLDetailsElement) el.open = other === id;
      }
      // After the other items have closed, so the target is measured in its final place.
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" }));
    };
    const onHash = () => show(window.location.hash);
    // next/link changes the address with pushState, which fires no hashchange.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href*='#']");
      if (!(a instanceof HTMLAnchorElement) || a.pathname !== window.location.pathname) return;
      requestAnimationFrame(() => show(a.hash));
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", onHash);
      document.removeEventListener("click", onClick);
    };
  }, [key]);
  return null;
}
