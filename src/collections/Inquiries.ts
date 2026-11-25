import type { CollectionConfig } from "payload";
import { isAdmin, isStaff, nobody } from "../access";
import { INQUIRY_SERVICES, INQUIRY_TOPICS } from "../lib/contact-options";

export { INQUIRY_SERVICES, INQUIRY_TOPICS };

/**
 * Messages sent through the public contact form. Created only by the site's server action (which runs with
 * system access); the REST API cannot create them. Staff read them, admins delete them.
 */
export const Inquiries: CollectionConfig = {
  slug: "inquiries",
  admin: { useAsTitle: "email", group: "Leads", defaultColumns: ["createdAt", "name", "organization", "topic", "status"] },
  defaultSort: "-createdAt",
  access: { read: isStaff, create: nobody, update: isStaff, delete: isAdmin },
  fields: [
    { name: "name", type: "text", required: true, maxLength: 120 },
    { name: "email", type: "email", required: true, index: true },
    { name: "organization", type: "text", maxLength: 160 },
    { name: "country", type: "text", maxLength: 80 },
    { name: "phone", type: "text", maxLength: 40 },
    { name: "topic", type: "select", options: [...INQUIRY_TOPICS], required: true },
    { name: "pillar", type: "text", maxLength: 120 },
    { name: "services", type: "text", maxLength: 400, admin: { description: "Services ticked on the form, comma separated." } },
    { name: "timeline", type: "text", maxLength: 60 },
    { name: "message", type: "textarea", required: true, maxLength: 4000 },
    { name: "sourcePath", type: "text", maxLength: 200 },
    {
      name: "hubspot",
      type: "select",
      options: ["sent", "failed"],
      admin: { position: "sidebar", readOnly: true, description: "Whether the message reached HubSpot. Empty when HubSpot is not connected." },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: ["new", "in-progress", "answered", "spam"],
      admin: { position: "sidebar" },
    },
  ],
};
