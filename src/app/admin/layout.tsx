import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/shell";
import { requirePage } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { viewer } = await requirePage("staff", "/admin");
  return (
    <AdminShell
      isAdmin={viewer.isAdmin}
      fullName={viewer.fullName}
      avatarUrl={viewer.avatarUrl}
      role={viewer.role ?? "user"}
    >
      {children}
    </AdminShell>
  );
}
