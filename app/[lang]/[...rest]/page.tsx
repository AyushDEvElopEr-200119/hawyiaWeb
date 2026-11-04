import { notFound } from "next/navigation";
import { asLocale, setLang, tr } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string }> };

export const generateMetadata = async ({ params }: Props) => ({ title: tr(asLocale((await params).lang), "Page not found") });

// Any unknown address, in either language, shows that language's not-found page.
export default async function CatchAll({ params }: Props) {
  setLang((await params).lang);
  notFound();
}
