/** Choices and wording of the form that asks for a report or whitepaper. */
export const REQUEST_COUNTRIES = [
  "Vietnam", "Singapore", "Malaysia", "Indonesia", "Thailand", "Philippines", "Cambodia", "Laos", "Myanmar", "Australia",
  "Japan", "South Korea", "China", "Taiwan", "Hong Kong", "India", "United Arab Emirates", "Saudi Arabia", "Qatar",
  "United Kingdom", "Germany", "France", "Netherlands", "Spain", "Italy", "United States", "Canada", "Brazil", "Chile",
  "Peru", "Mexico", "Nigeria", "Kenya", "South Africa", "Other",
] as const;

/** The sentence next to the required box, up to the link to the privacy policy. It is saved with the request. */
export const consentSentence = (kind: string) =>
  `I agree that SAVIS Group processes my personal data to send me this ${kind.toLowerCase()} and follow up on my request, as described in the`;

export const OPT_IN_SENTENCE = "Send me news, research and event invitations from SAVIS Group. I can unsubscribe at any time.";

export type RequestField = "firstName" | "lastName" | "email" | "company" | "country" | "consent";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export interface RequestValues {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  country: string;
  jobTitle: string;
  phone: string;
  consent: boolean;
  marketingOptIn: boolean;
}

/** Reads the submitted form: trimmed, cut to the stored lengths, with a message for each field that is wrong. */
export function readRequest(form: FormData): { values: RequestValues; errors: Partial<Record<RequestField, string>> } {
  const text = (name: string, max: number) => String(form.get(name) ?? "").trim().slice(0, max);
  const values: RequestValues = {
    firstName: text("firstName", 80),
    lastName: text("lastName", 80),
    email: text("email", 200).toLowerCase(),
    company: text("company", 160),
    country: REQUEST_COUNTRIES.find((c) => c === text("country", 80)) ?? "",
    jobTitle: text("jobTitle", 120),
    phone: text("phone", 40),
    consent: form.get("consent") === "yes",
    marketingOptIn: form.get("marketingOptIn") === "yes",
  };
  const errors: Partial<Record<RequestField, string>> = {};
  if (!values.firstName) errors.firstName = "Enter your first name.";
  if (!values.lastName) errors.lastName = "Enter your last name.";
  if (!EMAIL.test(values.email)) errors.email = "Enter a valid email address.";
  if (!values.company) errors.company = "Enter your company.";
  if (!values.country) errors.country = "Choose your country.";
  if (!values.consent) errors.consent = "We need your agreement to send the document.";
  return { values, errors };
}
