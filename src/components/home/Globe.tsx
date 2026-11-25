"use client";

import { useEffect, useRef } from "react";
import type { Office } from "@/lib/content";

const SIZE = 440;
const RADIUS = 170;
const DOTS = 900;
const TILT = -0.35;

const toVec = (lat: number, lon: number): [number, number, number] => {
  const a = (lat * Math.PI) / 180;
  const b = (lon * Math.PI) / 180;
  return [Math.cos(a) * Math.sin(b), Math.sin(a), Math.cos(a) * Math.cos(b)];
};

/** Rotating dotted globe with arcs from the headquarters (first office) to every other office. */
export function Globe({ offices, label }: { offices: Office[]; label: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || offices.length === 0) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx.scale(dpr, dpr);

    const c = SIZE / 2;
    const dots: Array<[number, number, number]> = [];
    for (let i = 0; i < DOTS; i++) {
      const y = 1 - (i / (DOTS - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = Math.PI * (3 - Math.sqrt(5)) * i;
      dots.push([Math.cos(th) * r, y, Math.sin(th) * r]);
    }
    const places = offices.map((o) => ({ ...o, v: toVec(o.lat, o.lon) }));
    const hq = places[0].v;
    const arcs = places.slice(1).map((o) => {
      const pts: Array<[number, number, number]> = [];
      for (let k = 0; k <= 40; k++) {
        const t = k / 40;
        const x = hq[0] * (1 - t) + o.v[0] * t;
        const y = hq[1] * (1 - t) + o.v[1] * t;
        const z = hq[2] * (1 - t) + o.v[2] * t;
        const len = Math.hypot(x, y, z) || 1;
        const h = 1 + 0.22 * Math.sin(Math.PI * t);
        pts.push([(x / len) * h, (y / len) * h, (z / len) * h]);
      }
      return pts;
    });

    const project = (v: [number, number, number], rot: number): [number, number, number] => {
      const cr = Math.cos(rot), sr = Math.sin(rot);
      const x = v[0] * cr + v[2] * sr;
      const z = -v[0] * sr + v[2] * cr;
      const ct = Math.cos(TILT), st = Math.sin(TILT);
      return [c + x * RADIUS, c - (v[1] * ct - z * st) * RADIUS, v[1] * st + z * ct];
    };

    let raf = 0;
    let visible = true;
    const start = performance.now();

    const draw = (now: number) => {
      const t = (now - start) / 1000;
      const rot = -1.95 + t * 0.12;
      ctx.clearRect(0, 0, SIZE, SIZE);

      const glow = ctx.createRadialGradient(c - 40, c - 50, 20, c, c, RADIUS * 1.25);
      glow.addColorStop(0, "rgba(0,82,255,.35)");
      glow.addColorStop(1, "rgba(0,82,255,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(c, c, RADIUS * 1.25, 0, 7);
      ctx.fill();

      ctx.strokeStyle = "rgba(111,227,255,.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(c, c, RADIUS, 0, 7);
      ctx.stroke();

      for (const p of dots) {
        const q = project(p, rot);
        if (q[2] < 0) {
          ctx.fillStyle = "rgba(111,227,255,.08)";
          ctx.fillRect(q[0], q[1], 1.2, 1.2);
        } else {
          ctx.fillStyle = `rgba(111,227,255,${0.25 + q[2] * 0.6})`;
          ctx.beginPath();
          ctx.arc(q[0], q[1], 1.1 + q[2] * 0.7, 0, 7);
          ctx.fill();
        }
      }

      arcs.forEach((arc, ai) => {
        const phase = (t * 0.35 + ai * 0.13) % 1;
        ctx.lineWidth = 1.4;
        for (let k = 0; k < arc.length - 1; k++) {
          const p1 = project(arc[k], rot);
          const p2 = project(arc[k + 1], rot);
          if (p1[2] < -0.15 && p2[2] < -0.15) continue;
          const d = Math.abs(k / 40 - phase);
          const lit = d < 0.12 ? 1 - d / 0.12 : 0;
          ctx.strokeStyle = `rgba(0,212,255,${0.18 + lit * 0.8})`;
          ctx.beginPath();
          ctx.moveTo(p1[0], p1[1]);
          ctx.lineTo(p2[0], p2[1]);
          ctx.stroke();
        }
      });

      for (const o of places) {
        const q = project(o.v, rot);
        if (q[2] < -0.05) continue;
        const pulse = (t * 1.2 + o.name.length * 0.1) % 1;
        ctx.strokeStyle = `rgba(0,212,255,${1 - pulse})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(q[0], q[1], 4 + pulse * 12, 0, 7);
        ctx.stroke();
        ctx.fillStyle = o.hq ? "#FFFFFF" : "#00D4FF";
        ctx.beginPath();
        ctx.arc(q[0], q[1], o.hq ? 5 : 3.6, 0, 7);
        ctx.fill();
        if (q[2] > 0.25 && !/Ho Chi|Manila|Singapore/.test(o.name)) {
          ctx.font = `${o.hq ? 700 : 600} ${o.hq ? 12 : 11}px Inter, sans-serif`;
          ctx.fillStyle = "rgba(230,240,255,.92)";
          ctx.fillText(o.hq ? "Hanoi HQ" : o.name, q[0] + 8, q[1] - 6);
        }
      }
    };

    const loop = (now: number) => {
      if (visible) draw(now);
      raf = requestAnimationFrame(loop);
    };

    if (reduced) {
      draw(start);
    } else {
      raf = requestAnimationFrame(loop);
    }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [offices]);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label={label}
      width={SIZE}
      height={SIZE}
      style={{ width: "100%", maxWidth: SIZE, height: "auto" }}
    />
  );
}
