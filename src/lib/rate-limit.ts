/** Best-effort limit per IP address for the public forms. In memory, so it resets on restart and is per instance; Cloudflare is the real guard. */
export function rateLimiter(max = 5, windowMs = 10 * 60 * 1000) {
  const hits = new Map<string, number[]>();
  return (ip: string): boolean => {
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(ip, recent);
    if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
    return recent.length > max;
  };
}

/** The visitor's address as Cloudflare reports it. */
export const clientIp = (h: { get(name: string): string | null }) =>
  h.get("cf-connecting-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
