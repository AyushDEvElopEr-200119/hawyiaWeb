import type { Metadata, Viewport } from "next";
import { Fragment_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import "./admin.css";

// The admin area has its own root layout: no public header, preloader, cursor or translations.
const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = Fragment_Mono({ subsets: ["latin"], weight: "400", variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Admin | Hawyia Premium", template: "%s | Hawyia Admin" },
  robots: { index: false, follow: false, nocache: true },
};
export const viewport: Viewport = { themeColor: "#0a2463" };

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${sans.variable} ${mono.variable}`}>
      <body className="adm-body">{children}</body>
    </html>
  );
}
