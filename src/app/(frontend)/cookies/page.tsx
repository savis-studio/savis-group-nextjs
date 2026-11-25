import { LegalPage, legalMetadata } from "@/components/page/LegalPage";

export const metadata = legalMetadata("cookies");

export default function CookiesPage() {
  return <LegalPage docKey="cookies" />;
}
