import { LegalPage, legalMeta } from "@/components/LegalPage";

export const metadata = legalMeta("privacy");

export default function PrivacyPage() {
  return <LegalPage doc="privacy" />;
}
