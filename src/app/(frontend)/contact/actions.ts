"use server";

import config from "@payload-config";
import { cookies, headers } from "next/headers";
import { after } from "next/server";
import { getPayload } from "payload";
import { INQUIRY_SERVICES, INQUIRY_TOPICS } from "@/lib/contact-options";
import { hubspotEnabled, sendToHubSpot, type HubSpotLead } from "@/lib/hubspot";
import { absoluteUrl } from "@/lib/site";

export interface ContactState {
  status: "idle" | "ok" | "error";
  message?: string;
  /** Field-level errors keyed by field name. */
  errors?: Partial<Record<"name" | "email" | "topic" | "message", string>>;
}

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

/** Best-effort per-IP limit. In memory, so it resets on restart and is per instance; Cloudflare is the real guard. */
function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  return recent.length > MAX_PER_WINDOW;
}

const text = (f: FormData, k: string, max: number) => String(f.get(k) ?? "").trim().slice(0, max);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function submitInquiry(_prev: ContactState, form: FormData): Promise<ContactState> {
  // Honeypot: real visitors never fill this hidden field. Pretend success so bots learn nothing.
  if (text(form, "website", 200)) return { status: "ok" };

  const name = text(form, "name", 120);
  const email = text(form, "email", 200).toLowerCase();
  const topic = text(form, "topic", 60);
  const message = text(form, "message", 4000);

  const errors: NonNullable<ContactState["errors"]> = {};
  if (!name) errors.name = "Enter your name.";
  if (!EMAIL.test(email)) errors.email = "Enter a valid work email.";
  if (!(INQUIRY_TOPICS as readonly string[]).includes(topic)) errors.topic = "Choose what you need.";
  if (message.length < 10) errors.message = "Tell us a little more (at least 10 characters).";
  if (Object.keys(errors).length) return { status: "error", errors };

  const h = await headers();
  const ip = h.get("cf-connecting-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) return { status: "error", message: "Too many messages from your network. Please try again in a few minutes." };

  try {
    const payload = await getPayload({ config });
    const lead: HubSpotLead = {
      name,
      email,
      topic,
      message,
      organization: text(form, "organization", 160),
      country: text(form, "country", 80),
      phone: text(form, "phone", 40),
      pillar: text(form, "pillar", 120),
      services: form.getAll("services").map(String).filter((x) => (INQUIRY_SERVICES as readonly string[]).includes(x)).join(", "),
      timeline: text(form, "timeline", 60),
      sourcePath: text(form, "sourcePath", 200),
    };
    const saved = await payload.create({
      collection: "inquiries",
      data: { ...lead, topic: topic as (typeof INQUIRY_TOPICS)[number] },
    });
    // Copy to HubSpot after the visitor already has their answer. The saved inquiry is the record; a failure here is logged and flagged.
    if (hubspotEnabled()) {
      const hutk = (await cookies()).get("hubspotutk")?.value;
      after(async () => {
        let hubspot: "sent" | "failed" = "sent";
        try {
          await sendToHubSpot(lead, { pageUri: absoluteUrl(lead.sourcePath || "/contact"), hutk, ip: ip === "unknown" ? undefined : ip });
        } catch (err) {
          hubspot = "failed";
          console.error("contact form: HubSpot rejected the lead", err instanceof Error ? err.message : err);
        }
        await payload.update({ collection: "inquiries", id: saved.id, data: { hubspot }, overrideAccess: true }).catch(() => undefined);
      });
    }
    return { status: "ok" };
  } catch (err) {
    console.error("contact form: could not save inquiry", err);
    return { status: "error", message: "We could not send your message. Please email sales@savis-group.com instead." };
  }
}
