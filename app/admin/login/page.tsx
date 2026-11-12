import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { LogoMark } from "@/components/Brand";
import { currentAdmin } from "@/lib/server/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sign in" };

type Props = { searchParams: Promise<{ error?: string; next?: string; signedOut?: string }> };

export default async function AdminLogin({ searchParams }: Props) {
  const { error, next, signedOut } = await searchParams;
  if (await currentAdmin()) redirect(next && next.startsWith("/admin") ? next : "/admin/");
  const href = `/api/admin/auth/login/${next ? `?next=${encodeURIComponent(next)}` : ""}`;

  return (
    <main className="adm-login">
      <div className="adm-login-card">
        <div className="adm-brand is-dark">
          <span className="adm-brand-mark"><LogoMark /></span>
          <span className="adm-brand-words"><b>Hawyia</b><em>Premium</em></span>
          <span className="adm-brand-tag">Admin</span>
        </div>
        <h1>Sign in to the admin dashboard</h1>
        <p className="adm-sub">Use your Hawyia Premium Microsoft 365 account. Only approved administrators can sign in.</p>
        {error && <p className="adm-login-msg is-bad" role="alert">{error}</p>}
        {signedOut && !error && <p className="adm-login-msg">You&apos;ve been signed out.</p>}
        <a className="adm-btn is-microsoft is-lg" href={href}>
          <svg width="18" height="18" viewBox="0 0 21 21" aria-hidden="true"><rect x="1" y="1" width="9" height="9" fill="#f25022" /><rect x="11" y="1" width="9" height="9" fill="#7fba00" /><rect x="1" y="11" width="9" height="9" fill="#00a4ef" /><rect x="11" y="11" width="9" height="9" fill="#ffb900" /></svg>
          Sign in with Microsoft
        </a>
        <p className="adm-login-foot"><ShieldCheck size={14} /> Secured with Microsoft Entra ID</p>
      </div>
    </main>
  );
}
