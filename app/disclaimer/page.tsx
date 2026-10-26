import { LegalPage, legalMeta } from "@/components/LegalPage";

export const metadata = legalMeta("disclaimer");

export default function Page() {
  return <LegalPage doc="disclaimer" />;
}
