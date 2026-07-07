"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Menu, X, LayoutDashboard, FolderKanban, FileText, Mail, Users, ShieldCheck, Settings, Image as ImageIcon, BarChart3 } from "lucide-react";

const ICONS = {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Mail,
  Users,
  ShieldCheck,
  Settings,
  ImageIcon,
  BarChart3,
} as const;

export type IconKey = keyof typeof ICONS;

type NavItem = { href: string; label: string; icon: IconKey };

export default function AdminChrome({
  displayName,
  navItems,
  children,
}: {
  displayName: string;
  navItems: NavItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const isRoot = pathname === "/admin";

  return (
    <div>
      <div className="border-b border-forest-light/30 bg-[#0b1520] px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3 font-mono text-xs tracking-widest text-white/70">
            <span className="flex h-2 w-2 rounded-full bg-forest-light shadow-[0_0_6px_2px_rgba(46,107,80,0.6)]" />
            KAFA GROUP &middot; ADMIN CONTROL PANEL
          </div>
          <div className="font-mono text-xs tracking-wide text-gold-light">
            ADMIN ACCESS
          </div>
        </div>
      </div>

      {/* Mobile top bar: back + menu toggle, hidden on md+ where the sidebar is visible */}
      <div className="flex items-center justify-between border-b border-black/10 bg-navy px-4 py-3 md:hidden">
        {isRoot ? (
          <Link href="/" className="flex items-center gap-1.5 text-sm text-cream/70 hover:text-gold">
            <ChevronLeft className="h-4 w-4" /> Site Home
          </Link>
        ) : (
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-cream/70 hover:text-gold">
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
        )}
        <button onClick={() => setMobileNavOpen((v) => !v)} className="flex items-center gap-1.5 text-sm text-cream/70 hover:text-gold" aria-label="Toggle menu">
          {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileNavOpen && (
        <nav className="border-b border-black/10 bg-navy-card px-4 py-3 md:hidden">
          <p className="mb-1 text-xs uppercase tracking-[0.2em] text-gold">Admin</p>
          <p className="mb-3 text-sm text-cream/60">{displayName}</p>
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={`flex items-center gap-2 rounded-sm px-3 py-2 text-sm ${
                  pathname === item.href ? "bg-navy-light text-gold" : "text-cream/80 hover:bg-navy-light hover:text-gold"
                }`}
              >
                {(() => { const Icon = ICONS[item.icon]; return <Icon className="h-4 w-4" />; })()}
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}

      <div className="mx-auto flex max-w-7xl gap-8 px-6 py-12">
        <aside className="hidden w-56 shrink-0 md:block">
          <p className="mb-1 text-xs uppercase tracking-[0.2em] text-gold">Admin</p>
          <p className="mb-6 text-sm text-cream/60">{displayName}</p>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-sm px-3 py-2 text-sm transition ${
                  pathname === item.href ? "bg-navy-light text-gold" : "text-cream/80 hover:bg-navy-light hover:text-gold"
                }`}
              >
                {(() => { const Icon = ICONS[item.icon]; return <Icon className="h-4 w-4" />; })()}
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
