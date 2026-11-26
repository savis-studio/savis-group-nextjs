/** Choices on the contact form. Kept free of server imports so the client form and the collection can share them. */
export const INQUIRY_TOPICS = [
  "Request a demo",
  "Get a quote",
  "Datasheets & brochure",
  "Talk to an expert",
  "Customer support",
  "Developer / sandbox access",
  "Partnership",
] as const;

/** The "Timeline" choices. Like the topics and services, each one is also an option of a HubSpot property. */
export const INQUIRY_TIMELINES = ["This quarter", "Within 6 months", "6–12 months", "Just exploring"] as const;

/** Services a visitor can tick (the same list as the Services page). */
export const INQUIRY_SERVICES = [
  "Consulting & Advisory",
  "Readiness Programs",
  "System Integration",
  "Software Engineering",
  "Digitization & Data Services",
  "Cloud Transformation & Infrastructure",
  "Managed Services",
  "Trust Services",
] as const;
