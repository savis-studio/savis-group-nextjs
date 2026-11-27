import { LegalPage, legalMetadata } from "@/components/page/LegalPage";

export const metadata = legalMetadata("terms");

export default function TermsPage() {
  return <><h1>CI gate test</h1><LegalPage docKey="terms" /></>;
}
