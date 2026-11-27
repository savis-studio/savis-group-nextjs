import type { CollectionConfig } from "payload";
import { isAdmin, isStaff, nobody } from "../access";

/**
 * Visitors asking for a report or whitepaper. Created only by the site's server action (which runs with system access);
 * the REST API cannot create them. A SAVIS specialist sends the document and marks the request as sent. Staff read
 * them, admins delete them.
 */
export const DocumentRequests: CollectionConfig = {
  slug: "document-requests",
  labels: { singular: "Document request", plural: "Document requests" },
  admin: { useAsTitle: "email", group: "Leads", defaultColumns: ["createdAt", "email", "company", "documentTitle", "status"] },
  defaultSort: "-createdAt",
  access: { read: isStaff, create: nobody, update: isStaff, delete: isAdmin },
  fields: [
    // The title is kept as well, so a request still says what was asked for after a report is renamed or deleted.
    { name: "documentTitle", label: "Requested document", type: "text", required: true, maxLength: 300 },
    { name: "document", label: "Report page", type: "relationship", relationTo: "reports" },
    {
      type: "row",
      fields: [
        { name: "firstName", type: "text", required: true, maxLength: 80 },
        { name: "lastName", type: "text", required: true, maxLength: 80 },
      ],
    },
    { name: "email", type: "email", required: true, index: true },
    { name: "company", type: "text", required: true, maxLength: 160 },
    { name: "country", type: "text", required: true, maxLength: 80 },
    { name: "jobTitle", type: "text", maxLength: 120 },
    { name: "phone", type: "text", maxLength: 40 },
    { name: "consentText", type: "textarea", required: true, maxLength: 600, admin: { readOnly: true, description: "The sentence the visitor agreed to. The date of the request is the date of consent." } },
    { name: "marketingOptIn", label: "Agreed to receive news and invitations", type: "checkbox", defaultValue: false },
    { name: "sourcePath", type: "text", maxLength: 200 },
    {
      name: "hubspot",
      type: "select",
      options: ["sent", "failed"],
      admin: { position: "sidebar", readOnly: true, description: "Whether the request reached HubSpot. Empty when HubSpot is not connected." },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: ["new", "sent", "spam"],
      admin: { position: "sidebar", description: "“sent” once the document has gone to the visitor." },
    },
  ],
};
