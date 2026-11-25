/** Sends a contact-form submission to HubSpot's Forms API. Off unless HUBSPOT_PORTAL_ID and HUBSPOT_FORM_ID are set. */
export interface HubSpotLead {
  name: string;
  email: string;
  organization?: string;
  phone?: string;
  country?: string;
  topic: string;
  pillar?: string;
  services?: string;
  timeline?: string;
  message: string;
  sourcePath?: string;
}

export const hubspotEnabled = () => !!(process.env.HUBSPOT_PORTAL_ID && process.env.HUBSPOT_FORM_ID);

/** "Nguyen Van A" becomes firstname "Nguyen Van", lastname "A", the way contact records expect it. */
export function splitName(full: string): { firstname: string; lastname: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length < 2) return { firstname: parts[0] ?? "", lastname: "" };
  return { firstname: parts.slice(0, -1).join(" "), lastname: parts[parts.length - 1] };
}

/** The HubSpot default "message" property carries everything that has no property of its own. */
export function composeMessage(l: HubSpotLead): string {
  const meta = [
    ["Topic", l.topic],
    ["Interested in", l.pillar],
    ["Services", l.services],
    ["Timeline", l.timeline],
    ["Page", l.sourcePath],
  ].filter(([, v]) => v);
  return `${meta.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${l.message}`;
}

export function buildPayload(l: HubSpotLead, ctx: { pageUri: string; hutk?: string; ip?: string }) {
  const { firstname, lastname } = splitName(l.name);
  const fields = [
    { name: "email", value: l.email },
    { name: "firstname", value: firstname },
    ...(lastname ? [{ name: "lastname", value: lastname }] : []),
    ...(l.organization ? [{ name: "company", value: l.organization }] : []),
    ...(l.phone ? [{ name: "phone", value: l.phone }] : []),
    ...(l.country ? [{ name: "country", value: l.country }] : []),
    { name: "message", value: composeMessage(l) },
  ];
  return {
    fields,
    context: { pageUri: ctx.pageUri, pageName: "Contact | SAVIS Group", ...(ctx.hutk ? { hutk: ctx.hutk } : {}), ...(ctx.ip ? { ipAddress: ctx.ip } : {}) },
  };
}

/** Resolves on success, throws with the HubSpot response on failure. */
export async function sendToHubSpot(l: HubSpotLead, ctx: { pageUri: string; hutk?: string; ip?: string }): Promise<void> {
  const { HUBSPOT_PORTAL_ID: portal, HUBSPOT_FORM_ID: form } = process.env;
  if (!portal || !form) throw new Error("HubSpot is not configured");
  const res = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${encodeURIComponent(portal)}/${encodeURIComponent(form)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildPayload(l, ctx)),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`HubSpot ${res.status}: ${(await res.text()).slice(0, 300)}`);
}
