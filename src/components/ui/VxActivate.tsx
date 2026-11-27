"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Starts a thumbnail's animation when it scrolls into view (and stops it again when it leaves), so off-screen art costs nothing. */
function animateThumbs() {
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
}

/** Draws a journey timeline the first time it is scrolled to. Only timelines still below the screen are hidden first. */
function revealTimelines() {
  if (!("IntersectionObserver" in window)) return;
  const els = Array.from(document.querySelectorAll<HTMLElement>(".sv-journey__steps")).filter((e) => e.getBoundingClientRect().top > window.innerHeight);
  if (els.length === 0) return;
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      en.target.classList.remove("wait");
      io.unobserve(en.target);
    }
  }, { rootMargin: "0px 0px -80px 0px" });
  els.forEach((e) => { e.classList.add("wait"); io.observe(e); });
  return () => { io.disconnect(); els.forEach((e) => e.classList.remove("wait")); };
}

/** Starts the scroll-triggered animations of the current page. */
export function VxActivate() {
  const path = usePathname();
  useEffect(() => {
    const stops = [animateThumbs(), revealTimelines()];
    return () => stops.forEach((stop) => stop?.());
  }, [path]);
  return null;
}
