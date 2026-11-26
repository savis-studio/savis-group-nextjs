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

/**
 * Form field to contact property. Every name here must be a field of the published HubSpot form, and the values of the
 * dropdown and checkbox properties must match the lists in contact-options.ts character for character.
 */
export function buildPayload(l: HubSpotLead, ctx: { pageUri: string; hutk?: string; ip?: string }) {
  const { firstname, lastname } = splitName(l.name);
  const fields = [
    ["email", l.email],
    ["firstname", firstname],
    ["lastname", lastname],
    ["company", l.organization],
    ["phone", l.phone],
    ["country", l.country],
    ["chu_e_quan_tam", l.pillar],
    ["inquiry_topic", l.topic],
    // Multiple-checkbox properties take their values separated by semicolons.
    ["inquiry_services", l.services?.split(", ").join(";")],
    ["inquiry_timeline", l.timeline],
    ["message", l.message],
  ].flatMap(([name, value]) => (value ? [{ name: name as string, value }] : []));
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
