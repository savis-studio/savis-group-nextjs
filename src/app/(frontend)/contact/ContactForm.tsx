"use client";

import { useActionState } from "react";
import { Alert, Button, TextField } from "@/components/ui";
import { INQUIRY_SERVICES, INQUIRY_TIMELINES, INQUIRY_TOPICS } from "@/lib/contact-options";
import { submitInquiry, type ContactState } from "./actions";

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
const opts = (xs: readonly string[]) => xs.map((x) => ({ value: x, label: x }));

/** A group of pill buttons backed by real radio buttons or checkboxes, so it works with the keyboard and without JavaScript. */
function Chips({ legend, name, items, type, defaultValue, error }: {
  legend: string;
  name: string;
  items: readonly string[];
  type: "radio" | "checkbox";
  defaultValue?: string;
  error?: string;
}) {
  return (
    <fieldset className="sv-chips" aria-describedby={error ? `${name}-err` : undefined}>
      <legend>{legend}{type === "radio" && <span className="sv-chips__req" aria-hidden="true"> *</span>}</legend>
      <div className="sv-chips__row">
        {items.map((it) => (
          <label key={it} className="sv-pick">
            <input type={type} name={name} value={it} defaultChecked={it === defaultValue} required={type === "radio" ? true : undefined} />
            <span>{it}</span>
          </label>
        ))}
      </div>
      {error && <p id={`${name}-err`} className="sv-chips__err" role="alert">{error}</p>}
    </fieldset>
  );
}

export function ContactForm({ defaultTopic }: { defaultTopic?: string }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitInquiry, { status: "idle" });
  const e = state.errors ?? {};
  const topic = (INQUIRY_TOPICS as readonly string[]).includes(defaultTopic ?? "") ? defaultTopic : INQUIRY_TOPICS[0];

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
      <Chips legend="What do you need?" name="topic" items={INQUIRY_TOPICS} type="radio" defaultValue={topic} error={e.topic} />
      <Chips legend="Services you may need" name="services" items={INQUIRY_SERVICES} type="checkbox" />
      <div style={{ maxWidth: 240 }}>
        <TextField as="select" name="timeline" label="Timeline" options={opts(INQUIRY_TIMELINES)} placeholder="Choose…" />
      </div>
      <div className="sv-row2">
        <TextField name="name" label="Full name" required autoComplete="name" error={e.name} />
        <TextField name="organization" label="Organization" autoComplete="organization" />
      </div>
      <div className="sv-row2">
        <TextField name="email" type="email" label="Work email" required autoComplete="email" error={e.email} />
        <TextField name="country" label="Country" autoComplete="country-name" />
      </div>
      <TextField name="phone" type="tel" label="Phone" autoComplete="tel" />
      <TextField as="select" name="pillar" label="Interested in" options={opts(INTERESTS)} defaultValue={INTERESTS[0]} />
      <TextField as="textarea" name="message" label="How can we help?" rows={5} required error={e.message} />
      <div><Button type="submit" disabled={pending}>{pending ? "Sending…" : "Send message"}</Button></div>
      <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>
        By sending this form you agree that SAVIS Group processes your details to answer your request, as described in our <a href="/privacy">Privacy Policy</a>.
      </p>
    </form>
  );
}
