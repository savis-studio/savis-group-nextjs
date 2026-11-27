"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Wraps article content. Diagrams (`.xd`) start hidden and animate in; this adds `xd-in` when each scrolls
 * into view, or at once under reduced motion. Without JS the noscript rule shows them statically.
 */
export function ArticleReveal({ children, html }: { children?: ReactNode; html?: string }) {
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
  }, [html, children]);
  return (
    <>
      <noscript>
        <style>{".xd *{opacity:1!important;transform:none!important;translate:none!important}.xd-tl ol::before{transform:none!important}"}</style>
      </noscript>
      {html !== undefined ? (
        <div ref={ref} className="article" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <div ref={ref} className="article">{children}</div>
      )}
    </>
  );
}

/** Article from bundled HTML (used while the CMS is unreachable, e.g. during the Docker build). */
export const ArticleBody = ({ html }: { html: string }) => <ArticleReveal html={html} />;
