import { LegalPage, legalMetadata } from "@/components/page/LegalPage";

export const metadata = legalMetadata("terms");

export default function TermsPage() {
  return <LegalPage docKey="terms" />;
}
