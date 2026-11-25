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
