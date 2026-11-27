"use client";

import { useActionState } from "react";
import { Alert, TextField } from "@/components/ui";
import { OPT_IN_SENTENCE, REQUEST_COUNTRIES, consentSentence } from "@/lib/request-options";
import { requestDocument, type RequestState } from "./actions";

/** Asks for a report or whitepaper. A SAVIS specialist sends it; nothing is downloaded from the website. */
export function RequestForm({ slug, kind }: { slug: string; kind: string }) {
  const [state, action, pending] = useActionState<RequestState, FormData>(requestDocument, { status: "idle" });
  const e = state.errors ?? {};
  const v = state.values;
  const noun = kind.toLowerCase();

  if (state.status === "ok") {
    return (
      <div className="sv-rpform" role="status">
        <h2>Thank you</h2>
        <p>A SAVIS specialist will contact you and send the {noun}.</p>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="sv-rpform">
      <h2>Request the {noun}</h2>
      {state.status === "error" && state.message && <Alert tone="error" title="Request not sent">{state.message}</Alert>}
      <input type="hidden" name="report" value={slug} />
      {/* Honeypot: hidden from people and assistive tech. */}
      <div aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
        <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div className="sv-rpform__two">
        <TextField name="firstName" label="First name" required autoComplete="given-name" error={e.firstName} defaultValue={v?.firstName} />
        <TextField name="lastName" label="Last name" required autoComplete="family-name" error={e.lastName} defaultValue={v?.lastName} />
      </div>
      <TextField name="email" type="email" label="Business email" required autoComplete="email" error={e.email} defaultValue={v?.email} />
      <TextField name="company" label="Company" required autoComplete="organization" error={e.company} defaultValue={v?.company} />
      <TextField name="jobTitle" label="Job title" autoComplete="organization-title" defaultValue={v?.jobTitle} />
      <TextField name="phone" type="tel" label="Phone" autoComplete="tel" defaultValue={v?.phone} />
      {/* The key makes the list show the visitor's choice again after an error. */}
      <TextField key={v?.country} as="select" name="country" label="Country" required autoComplete="country-name" error={e.country} defaultValue={v?.country} placeholder="Please select" options={REQUEST_COUNTRIES.map((c) => ({ value: c, label: c }))} />
      <label className="sv-rpform__ck">
        <input type="checkbox" name="consent" value="yes" required defaultChecked={v?.consent} aria-invalid={e.consent ? true : undefined} aria-describedby={e.consent ? "consent-err" : undefined} />
        <span>{consentSentence(kind)} <a href="/privacy">Privacy Policy</a>.<b aria-hidden="true">*</b></span>
      </label>
      {e.consent && <p id="consent-err" className="sv-rpform__err" role="alert">{e.consent}</p>}
      <label className="sv-rpform__ck">
        <input type="checkbox" name="marketingOptIn" value="yes" defaultChecked={v?.marketingOptIn} />
        <span>{OPT_IN_SENTENCE}</span>
      </label>
      <button type="submit" disabled={pending}>{pending ? "Sending…" : `Request the ${noun}`}</button>
    </form>
  );
}
