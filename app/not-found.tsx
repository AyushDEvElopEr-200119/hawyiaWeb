import Link from "next/link";
import { Chev } from "@/components/Brand";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="contact-hero container nf">
      <p className="eyebrow">404</p>
      <h1 className="ph-title">This page took<br />a different route</h1>
      <p>The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <div className="cta-row left">
        <Link href="/" className="btn-pill press">Back to home <Chev /></Link>
        <Link href="/solutions/" className="link">Browse solutions <Chev /></Link>
      </div>
    </section>
  );
}
