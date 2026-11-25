"use client";

import { useEffect, useRef } from "react";

/** Drifting node network behind the hero; nodes link to the pointer. Does nothing when motion is reduced. */
export function HeroNetwork() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    const host = canvas?.closest("section");
    if (!canvas || !ctx || !host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    type Node = { x: number; y: number; vx: number; vy: number };
    let w = 0, h = 0;
    let nodes: Node[] = [];
    let mx = -999, my = -999;
    let raf = 0;
    let visible = true;

    const size = () => {
      const r = canvas.parentElement!.getBoundingClientRect();
      const d = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = w * d;
      canvas.height = h * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      const n = Math.min(70, Math.round((w * h) / 16000));
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      }));
    };

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const onLeave = () => { mx = my = -999; };

    const step = () => {
      if (visible) {
        ctx.clearRect(0, 0, w, h);
        for (const p of nodes) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }
        for (let a = 0; a < nodes.length; a++) {
          const p = nodes[a];
          for (let b = a + 1; b < nodes.length; b++) {
            const q = nodes[b];
            const dx = p.x - q.x, dy = p.y - q.y, d = dx * dx + dy * dy;
            if (d < 15000) {
              ctx.strokeStyle = `rgba(111,227,255,${(1 - d / 15000) * 0.22})`;
              ctx.lineWidth = 1;
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
            }
          }
          const dm = (p.x - mx) ** 2 + (p.y - my) ** 2;
          if (dm < 26000) {
            ctx.strokeStyle = `rgba(0,212,255,${(1 - dm / 26000) * 0.55})`;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mx, my); ctx.stroke();
          }
          ctx.fillStyle = "rgba(140,220,255,.7)";
          ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, 6.3); ctx.fill();
        }
      }
      raf = requestAnimationFrame(step);
    };

    size();
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    const ro = new ResizeObserver(size);
    ro.observe(canvas.parentElement!);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="sv-home__net" aria-hidden="true" />;
}
