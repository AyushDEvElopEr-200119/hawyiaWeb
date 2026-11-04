import { setLang, type LangParams } from "@/lib/i18n";
import { LegalPage, legalMetaFor } from "@/components/LegalPage";

export const generateMetadata = legalMetaFor("privacy");

export default async function Page({ params }: LangParams) {
  setLang((await params).lang);
  return <LegalPage doc="privacy" />;
}
