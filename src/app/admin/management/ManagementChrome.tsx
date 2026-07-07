"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Menu, X, BarChart3, ShieldCheck, FolderKanban, FileText, Mail, Users, Image as ImageIcon, Settings } from "lucide-react";

const ICONS = {
  BarChart3,
  ShieldCheck,
  FolderKanban,
  FileText,
  Mail,
  Users,
  ImageIcon,
  Settings,
} as const;

export type IconKey = keyof typeof ICONS;

type NavItem = { href: string; label: string; icon: IconKey; group: "executive" | "operational" | "account" };

export default function ManagementChrome({
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

  const isRoot = pathname === "/admin/management";
  const executive = navItems.filter((i) => i.group === "executive");
  const operational = navItems.filter((i) => i.group === "operational");
  const account = navItems.filter((i) => i.group === "account");

  function renderLink(item: NavItem, onClick?: () => void) {
    const Icon = ICONS[item.icon];
    const active = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onClick}
        className={`flex items-center gap-2 rounded-sm px-3 py-2 text-sm transition ${
          active ? "bg-gold/10 text-gold" : "text-white/70 hover:bg-white/5 hover:text-gold"
        }`}
      >
        <Icon className="h-4 w-4" />
        {item.label}
      </Link>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e14]">
      <div className="border-b-2 border-gold bg-black px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3 font-mono text-xs tracking-widest text-gold-light/80">
            <span className="flex h-2 w-2 rounded-full bg-gold shadow-[0_0_6px_2px_rgba(212,175,55,0.5)]" />
            KAFA GROUP &middot; EXECUTIVE SUITE
          </div>
          <div className="font-mono text-xs font-semibold tracking-wide text-gold">
            MANAGEMENT ACCESS
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-gold/20 bg-black px-4 py-3 md:hidden">
        {isRoot ? (
          <Link href="/" className="flex items-center gap-1.5 text-sm text-white/70 hover:text-gold">
            <ChevronLeft className="h-4 w-4" /> Site Home
          </Link>
        ) : (
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-white/70 hover:text-gold">
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
        )}
        <button onClick={() => setMobileNavOpen((v) => !v)} className="flex items-center gap-1.5 text-sm text-white/70 hover:text-gold" aria-label="Toggle menu">
          {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileNavOpen && (
        <nav className="border-b border-gold/20 bg-black px-4 py-3 md:hidden">
          <p className="mb-1 font-serif text-xs uppercase tracking-[0.25em] text-gold">Executive</p>
          <p className="mb-3 text-sm text-white/50">{displayName}</p>
          <div className="flex flex-col gap-1">
            {executive.map((item) => renderLink(item, () => setMobileNavOpen(false)))}
          </div>
          <p className="mb-1 mt-4 text-xs uppercase tracking-[0.2em] text-white/40">Operational Tools</p>
          <div className="flex flex-col gap-1">
            {operational.map((item) => renderLink(item, () => setMobileNavOpen(false)))}
          </div>
          <div className="my-3 border-t border-gold/10" />
          <div className="flex flex-col gap-1">
            {account.map((item) => renderLink(item, () => setMobileNavOpen(false)))}
          </div>
        </nav>
      )}

      <div className="mx-auto flex max-w-7xl gap-8 px-6 py-12">
        <aside className="hidden w-60 shrink-0 md:block">
          <div className="rounded-md border border-gold/20 bg-black/40 p-4">
            <p className="mb-1 font-serif text-xs uppercase tracking-[0.25em] text-gold">Executive</p>
            <p className="mb-5 text-sm text-white/50">{displayName}</p>
            <nav className="flex flex-col gap-1">
              {executive.map((item) => renderLink(item))}
            </nav>

            <p className="mb-1 mt-6 text-xs uppercase tracking-[0.2em] text-white/40">Operational Tools</p>
            <nav className="flex flex-col gap-1">
              {operational.map((item) => renderLink(item))}
            </nav>

            <div className="my-4 border-t border-gold/10" />
            <nav className="flex flex-col gap-1">
              {account.map((item) => renderLink(item))}
            </nav>
          </div>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
