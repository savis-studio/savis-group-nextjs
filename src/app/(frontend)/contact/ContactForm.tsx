"use client";

import { useActionState } from "react";
import { Alert, Button, TextField } from "@/components/ui";
import { submitInquiry, type ContactState } from "./actions";

const TOPICS = ["Request a demo", "Get a quote", "Datasheets & brochure", "Talk to an expert", "Customer support", "Developer / sandbox access", "Partnership"];
const TIMELINES = ["This quarter", "Within 6 months", "6–12 months", "Just exploring"];
const INTERESTS = [
  "Digital Identity & Trust",
  "Cybersecurity & Quantum-Safe Infrastructure",
  "Digital Government & Smart Infrastructure",
  "Open Finance & Secure Digital Transactions",
  "AI, Data & Digital Platforms",
  "Services",
  "Partnership",
  "Careers",
  "Media",
];
const opts = (xs: string[]) => xs.map((x) => ({ value: x, label: x }));

export function ContactForm({ defaultTopic }: { defaultTopic?: string }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitInquiry, { status: "idle" });
  const e = state.errors ?? {};

  if (state.status === "ok") {
    return (
      <Alert tone="success" title="Thank you, your message is on its way">
        A solution expert for your region and topic will reply by email.
      </Alert>
    );
  }

  return (
    <form action={action} noValidate className="sv-form sv-card" style={{ display: "grid", gap: 16 }}>
      {state.status === "error" && state.message && <Alert tone="error" title="Message not sent">{state.message}</Alert>}
      <input type="hidden" name="sourcePath" value="/contact" />
      {/* Honeypot: hidden from people and assistive tech. */}
      <div aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
        <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div className="sv-row2">
        <TextField as="select" name="topic" label="What do you need?" required options={opts(TOPICS)} placeholder="Choose…" defaultValue={defaultTopic} error={e.topic} />
        <TextField as="select" name="pillar" label="Interested in" options={opts(INTERESTS)} placeholder="Choose…" />
      </div>
      <div className="sv-row2">
        <TextField name="name" label="Full name" required autoComplete="name" error={e.name} />
        <TextField name="organization" label="Organization" autoComplete="organization" />
      </div>
      <div className="sv-row2">
        <TextField name="email" type="email" label="Work email" required autoComplete="email" error={e.email} />
        <TextField name="country" label="Country" autoComplete="country-name" />
      </div>
      <div className="sv-row2">
        <TextField name="phone" type="tel" label="Phone" autoComplete="tel" />
        <TextField as="select" name="timeline" label="Timeline" options={opts(TIMELINES)} placeholder="Choose…" />
      </div>
      <TextField as="textarea" name="message" label="How can we help?" rows={5} required error={e.message} />
      <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>
        By sending this form you agree that SAVIS Group processes your details to answer your request, as described in our <a href="/privacy">Privacy Policy</a>.
      </p>
      <div><Button type="submit" disabled={pending}>{pending ? "Sending…" : "Send message"}</Button></div>
    </form>
  );
}
