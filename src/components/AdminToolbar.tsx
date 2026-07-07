"use client";

import Link from "next/link";
import { useState } from "react";
import { LayoutDashboard, FileText, FolderKanban, Mail, Users, ShieldCheck, BarChart3, ChevronDown, ChevronUp } from "lucide-react";

type Perms = { content: boolean; projects: boolean; inquiries: boolean; clients: boolean };

export default function AdminToolbar({
  label,
  isManagement,
  permissions,
}: {
  label: string;
  isManagement: boolean;
  permissions: Perms;
}) {
  const [open, setOpen] = useState(true);

  const links = [
    { href: "/admin", label: "Admin Dashboard", icon: LayoutDashboard, show: true },
    { href: "/admin/management", label: "Executive Overview", icon: BarChart3, show: isManagement },
    { href: "/admin/content", label: "Edit Content", icon: FileText, show: isManagement || permissions.content },
    { href: "/admin/projects", label: "Edit Projects", icon: FolderKanban, show: isManagement || permissions.projects },
    { href: "/admin/submissions", label: "Inquiries", icon: Mail, show: isManagement || permissions.inquiries },
    { href: "/admin/clients", label: "Clients", icon: Users, show: isManagement || permissions.clients },
    { href: "/admin/management/team", label: "Team", icon: ShieldCheck, show: isManagement },
  ].filter((l) => l.show);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] font-mono text-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 bg-black px-4 py-2 text-white shadow-[0_-2px_10px_rgba(0,0,0,0.3)]">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 text-gold hover:text-gold-light"
        >
          {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
          {label} MODE
        </button>
        {open && (
          <div className="flex flex-wrap items-center gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-1 text-white/80 transition hover:text-gold"
              >
                <l.icon className="h-3.5 w-3.5" />
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
