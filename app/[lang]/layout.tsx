import type { Metadata, Viewport } from "next";
import { Fragment_Mono, IBM_Plex_Sans_Arabic, Newsreader, Noto_Naskh_Arabic, Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/Header";
import { Footer, PageChrome } from "@/components/Footer";
import { JsonLd } from "@/components/sections";
import { SiteMotion } from "@/components/motion/SiteMotion";
import { Preloader, preloaderScript } from "@/components/Preloader";
import { asLocale, isRtl, locales, setLang, tr, type LangParams } from "@/lib/i18n";
import { company, indexable } from "@/lib/site";
import { organizationSchema, siteDescription, websiteSchema } from "@/lib/seo";

const serif = Newsreader({ subsets: ["latin"], style: ["normal", "italic"], axes: ["opsz"], variable: "--font-serif", display: "swap" });
const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = Fragment_Mono({ subsets: ["latin"], weight: "400", variable: "--font-mono", display: "swap" });
// Arabic faces hold only Arabic letters; Latin words fall through to the fonts above. Not preloaded, so English pages never fetch them.
const arSerif = Noto_Naskh_Arabic({ subsets: ["arabic"], display: "swap", preload: false, adjustFontFallback: false, variable: "--font-ar-serif" });
const arSans = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["300", "400", "500", "600", "700"], display: "swap", preload: false, adjustFontFallback: false, variable: "--font-ar-sans" });

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const lang = asLocale((await params).lang);
  const brand = tr(lang, company.name);
  return {
    metadataBase: new URL(company.url),
    title: { default: `${brand} — ${tr(lang, company.tagline)}`, template: `%s | ${brand}` },
    description: tr(lang, siteDescription),
    applicationName: brand,
    category: "technology",
    formatDetection: { telephone: false, email: false, address: false },
    openGraph: { type: "website", siteName: brand, locale: lang === "ar" ? "ar_AR" : "en_US" },
    twitter: { card: "summary_large_image" },
    robots: indexable
      ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } }
      : { index: false, follow: false },
  };
}

export const viewport: Viewport = { themeColor: "#0a2463" };

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export default async function RootLayout({ children, params }: LangParams & { children: React.ReactNode }) {
  const lang = asLocale((await params).lang);
  setLang(lang);
  return (
    // before paint: "js" makes reveal-on-scroll content start hidden only when scripts run,
    // and "pl-on" shows the page-load preloader (see components/Preloader.tsx)
    <html lang={lang} dir={isRtl(lang) ? "rtl" : "ltr"} className={`${serif.variable} ${sans.variable} ${mono.variable} ${arSerif.variable} ${arSans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preloaderScript }} />
      </head>
      <body>
        <Preloader />
        <Header />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer />
        <PageChrome />
        <JsonLd data={[organizationSchema, websiteSchema]} />
        <SiteMotion />
      </body>
    </html>
  );
}
