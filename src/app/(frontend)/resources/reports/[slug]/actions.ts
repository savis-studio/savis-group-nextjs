"use server";

import config from "@payload-config";
import { cookies, headers } from "next/headers";
import { after } from "next/server";
import { getPayload } from "payload";
import { resourceFormEnabled, sendResourceRequest } from "@/lib/hubspot";
import { clientIp, rateLimiter } from "@/lib/rate-limit";
import { reportPath } from "@/lib/reports";
import { consentSentence, readRequest, type RequestField, type RequestValues } from "@/lib/request-options";
import { SALES_EMAIL, absoluteUrl } from "@/lib/site";

export interface RequestState {
  status: "idle" | "ok" | "error";
  message?: string;
  errors?: Partial<Record<RequestField, string>>;
  /** What the visitor typed, so that the form keeps it after an error. */
  values?: RequestValues;
}

const limited = rateLimiter();

export async function requestDocument(_prev: RequestState, form: FormData): Promise<RequestState> {
  // Honeypot: real visitors never fill this hidden field. Pretend success so bots learn nothing.
  if (String(form.get("website") ?? "").trim()) return { status: "ok" };

  const { values, errors } = readRequest(form);
  if (Object.keys(errors).length) return { status: "error", errors, values };

  const h = await headers();
  const ip = clientIp(h);
  if (limited(ip)) return { status: "error", values, message: "Too many requests from your network. Please try again in a few minutes." };

  const failed: RequestState = { status: "error", values, message: `We could not send your request. Please email ${SALES_EMAIL} instead.` };
  try {
    const payload = await getPayload({ config });
    const slug = String(form.get("report") ?? "").slice(0, 200);
    // The title and kind come from the CMS, never from the form.
    const report = (await payload.find({ collection: "reports", where: { and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }] }, limit: 1, depth: 0 })).docs[0];
    if (!report) return failed;
    const { consent: _agreed, ...visitor } = values;
    const saved = await payload.create({
      collection: "document-requests",
      data: {
        ...visitor,
        documentTitle: report.title,
        document: report.id,
        consentText: `${consentSentence(report.kind)} Privacy Policy.`,
        sourcePath: reportPath(report.slug),
      },
    });
    // Copy to HubSpot after the visitor already has their answer. The saved request is the record; a failure here is logged and flagged.
    if (resourceFormEnabled()) {
      const hutk = (await cookies()).get("hubspotutk")?.value;
      after(async () => {
        let hubspot: "sent" | "failed" = "sent";
        try {
          await sendResourceRequest({ ...visitor, document: report.title }, { pageUri: absoluteUrl(reportPath(report.slug)), hutk, ip: ip === "unknown" ? undefined : ip });
        } catch (err) {
          hubspot = "failed";
          console.error("document request: HubSpot rejected the lead", err instanceof Error ? err.message : err);
        }
        await payload.update({ collection: "document-requests", id: saved.id, data: { hubspot }, overrideAccess: true }).catch(() => undefined);
      });
    }
    return { status: "ok" };
  } catch (err) {
    console.error("document request: could not save", err);
    return failed;
  }
}
