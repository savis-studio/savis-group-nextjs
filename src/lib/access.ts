import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from "jose";

/** Settings of the Cloudflare Access application that protects /admin and /api. */
export interface AccessConfig {
  /** For example "savis.cloudflareaccess.com" (no scheme). */
  teamDomain: string;
  /** The application's AUD tag. */
  audience: string;
}

let remote: { domain: string; keys: JWTVerifyGetKey } | undefined;

function remoteKeys(teamDomain: string): JWTVerifyGetKey {
  if (remote?.domain !== teamDomain) {
    remote = { domain: teamDomain, keys: createRemoteJWKSet(new URL(`https://${teamDomain}/cdn-cgi/access/certs`)) };
  }
  return remote.keys;
}

/** Strips a scheme or trailing slash someone may have pasted into the env var. */
export function normalizeTeamDomain(value: string): string {
  return value.trim().replace(/^https?:\/\//i, "").replace(/\/+$/, "");
}

/** True when the token is a valid, unexpired Cloudflare Access JWT for this application. `keys` is for tests. */
export async function verifyAccessJwt(token: string, config: AccessConfig, keys?: JWTVerifyGetKey): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, keys ?? remoteKeys(config.teamDomain), {
      issuer: `https://${config.teamDomain}`,
      audience: config.audience,
      algorithms: ["RS256"],
    });
    return true;
  } catch {
    return false;
  }
}

export type AccessMode =
  | { mode: "off" }
  | { mode: "enforce"; config: AccessConfig }
  /** Production without Access settings: protected paths are refused instead of left open. */
  | { mode: "misconfigured" };

/**
 * Production enforces Access on /admin and /api. Outside production it only runs when the variables are set.
 * CF_ACCESS_ENFORCE=off turns it off on purpose (for example `next start` on a laptop).
 */
export function accessMode(env: NodeJS.ProcessEnv = process.env): AccessMode {
  if (env.CF_ACCESS_ENFORCE === "off") return { mode: "off" };
  const teamDomain = normalizeTeamDomain(env.CF_ACCESS_TEAM_DOMAIN ?? "");
  const audience = (env.CF_ACCESS_AUD ?? "").trim();
  if (teamDomain && audience) return { mode: "enforce", config: { teamDomain, audience } };
  return env.NODE_ENV === "production" ? { mode: "misconfigured" } : { mode: "off" };
}
