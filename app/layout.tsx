import type { Metadata, Viewport } from "next";
import { Fragment_Mono, Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer, PageChrome } from "@/components/Footer";
import { JsonLd } from "@/components/sections";
import { SiteMotion } from "@/components/motion/SiteMotion";
import { company } from "@/lib/site";
import { organizationSchema } from "@/lib/seo";

const serif = Newsreader({ subsets: ["latin"], style: ["normal", "italic"], axes: ["opsz"], variable: "--font-serif", display: "swap" });
const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = Fragment_Mono({ subsets: ["latin"], weight: "400", variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: { default: `${company.name} — ${company.tagline}`, template: `%s | ${company.name}` },
  description: "Elyra helps travel businesses launch, customize and scale their own online booking platforms with white-label solutions, custom development and travel API integrations.",
};

export const viewport: Viewport = { themeColor: "#0f3e39" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // "js" is added before paint so reveal-on-scroll content starts hidden only when scripts run
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.classList.add("js")' }} />
      </head>
      <body>
        <Header />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer />
        <PageChrome />
        <JsonLd data={organizationSchema} />
        <SiteMotion />
      </body>
    </html>
  );
}
