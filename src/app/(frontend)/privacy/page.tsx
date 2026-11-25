import { LegalPage, legalMetadata } from "@/components/page/LegalPage";

export const metadata = legalMetadata("privacy");

export default function PrivacyPage() {
  return <LegalPage docKey="privacy" />;
}
