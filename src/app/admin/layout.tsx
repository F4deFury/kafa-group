import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LayoutDashboard, FolderKanban, FileText, Mail, Users, ShieldCheck, Settings, Image as ImageIcon } from "lucide-react";

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
    { href: "/admin", label: "Overview", icon: LayoutDashboard, show: true },
    { href: "/admin/projects", label: "Projects", icon: FolderKanban, show: perms.projects },
    { href: "/admin/content", label: "Site Content", icon: FileText, show: perms.content },
    { href: "/admin/media", label: "Site Media", icon: ImageIcon, show: perms.content },
    { href: "/admin/submissions", label: "Inquiries", icon: Mail, show: perms.inquiries },
    { href: "/admin/clients", label: "Client Accounts", icon: Users, show: perms.clients },
    { href: "/admin/team", label: "Team & Permissions", icon: ShieldCheck, show: isManagement },
    { href: "/settings", label: "Account Settings", icon: Settings, show: true },
  ].filter((i) => i.show);

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-6 py-12">
      <aside className="w-56 shrink-0">
        <p className="mb-1 text-xs uppercase tracking-[0.2em] text-gold">
          {isManagement ? "Management" : "Staff"}
        </p>
        <p className="mb-6 text-sm text-cream/60">{profile.full_name || user.email}</p>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm text-cream/80 transition hover:bg-navy-light hover:text-gold"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
