import { LegalPage, legalMeta } from "@/components/LegalPage";

export const metadata = legalMeta("cookies");

export default function Page() {
  return <LegalPage doc="cookies" />;
}
