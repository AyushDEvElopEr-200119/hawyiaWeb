import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { currentAdmin } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

/** Everything inside needs a signed-in administrator (proxy.ts checks too). */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login/");
  return <AdminShell user={{ email: admin.email, name: admin.name }}>{children}</AdminShell>;
}
