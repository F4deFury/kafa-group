import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ManagementChrome from "./ManagementChrome";

export const metadata = {
  title: "Management | KAFA Group",
  robots: { index: false, follow: false },
};

export default async function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/admin/management");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  // The Executive Suite is management-only. Staff (even with every
  // permission toggled on) belong in the Admin Dashboard instead.
  if (!profile || profile.role !== "management") {
    redirect("/admin");
  }

  const navItems = [
    { href: "/admin/management", label: "Executive Overview", icon: "BarChart3" as const, group: "executive" as const },
    { href: "/admin/management/team", label: "Team & Permissions", icon: "ShieldCheck" as const, group: "executive" as const },
    { href: "/admin/projects", label: "Projects", icon: "FolderKanban" as const, group: "operational" as const },
    { href: "/admin/content", label: "Site Content", icon: "FileText" as const, group: "operational" as const },
    { href: "/admin/media", label: "Site Media", icon: "ImageIcon" as const, group: "operational" as const },
    { href: "/admin/submissions", label: "Inquiries", icon: "Mail" as const, group: "operational" as const },
    { href: "/admin/clients", label: "Client Accounts", icon: "Users" as const, group: "operational" as const },
    { href: "/settings", label: "Account Settings", icon: "Settings" as const, group: "account" as const },
  ];

  return (
    <ManagementChrome displayName={profile.full_name || user.email || ""} navItems={navItems}>
      {children}
    </ManagementChrome>
  );
}
