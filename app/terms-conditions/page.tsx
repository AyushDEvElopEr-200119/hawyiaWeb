import { LegalPage, legalMeta } from "@/components/LegalPage";

export const metadata = legalMeta("terms");

export default function TermsPage() {
  return <LegalPage doc="terms" />;
}
