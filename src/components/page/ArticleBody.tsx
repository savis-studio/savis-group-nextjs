"use client";

import { useEffect, useRef } from "react";

/**
 * Renders trusted article HTML. Diagrams (`.xd`) start hidden and animate in; this adds `xd-in` when each scrolls
 * into view, or at once under reduced motion. Without JS the noscript rule shows them statically.
 */
export function ArticleBody({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const els = Array.from(ref.current?.querySelectorAll<HTMLElement>(".xd") ?? []);
    const show = (e: Element) => e.classList.add("xd-in");
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach(show);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) if (en.isIntersecting) { show(en.target); io.unobserve(en.target); }
    }, { threshold: 0.15 });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [html]);
  return (
    <>
      <noscript>
        <style>{".xd *{opacity:1!important;transform:none!important;translate:none!important}.xd-tl ol::before{transform:none!important}"}</style>
      </noscript>
      <div ref={ref} className="article" style={{ maxWidth: 820, margin: "0 auto" }} dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
