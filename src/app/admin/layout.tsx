import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminChrome from "./AdminChrome";

export const metadata = {
  title: "Admin | KAFA Group",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, permissions")
    .eq("id", user.id)
    .single();

  if (!profile || !["staff", "management"].includes(profile.role)) {
    redirect("/dashboard");
  }

  const isManagement = profile.role === "management";
  const perms = isManagement
    ? { content: true, projects: true, inquiries: true, clients: true }
    : (profile.permissions as { content: boolean; projects: boolean; inquiries: boolean; clients: boolean });

  const navItems = [
    { href: "/admin", label: "Overview", icon: "LayoutDashboard" as const, show: true },
    { href: "/admin/management", label: "Management Overview", icon: "BarChart3" as const, show: isManagement },
    { href: "/admin/projects", label: "Projects", icon: "FolderKanban" as const, show: perms.projects },
    { href: "/admin/content", label: "Site Content", icon: "FileText" as const, show: perms.content },
    { href: "/admin/media", label: "Site Media", icon: "ImageIcon" as const, show: perms.content },
    { href: "/admin/submissions", label: "Inquiries", icon: "Mail" as const, show: perms.inquiries },
    { href: "/admin/clients", label: "Client Accounts", icon: "Users" as const, show: perms.clients },
    { href: "/admin/team", label: "Team & Permissions", icon: "ShieldCheck" as const, show: isManagement },
    { href: "/settings", label: "Account Settings", icon: "Settings" as const, show: true },
  ].filter((i) => i.show);

  return (
    <AdminChrome
      isManagement={isManagement}
      displayName={profile.full_name || user.email || ""}
      navItems={navItems}
    >
      {children}
    </AdminChrome>
  );
}
