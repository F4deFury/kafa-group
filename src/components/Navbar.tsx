"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/real-estate", label: "KG Real Estate" },
  { href: "/contact", label: "Contact" },
];

type AuthInfo = {
  signedIn: boolean;
  destination: string;
  destinationLabel: string;
};

export default function Navbar({ auth }: { auth: AuthInfo }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-black/10 bg-navy/95 text-white backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-gold" />
          <span className="text-lg font-semibold tracking-wide text-white">
            KAFA <span className="text-gold">GROUP</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-white/80 transition hover:text-gold"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {auth.signedIn ? (
            <>
              <Link href={auth.destination} className="text-sm text-white/80 hover:text-gold">
                {auth.destinationLabel}
              </Link>
              <button onClick={handleSignOut} className="text-sm text-white/60 hover:text-gold">
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/sign-in" className="text-sm text-white/80 hover:text-gold">
              Client Sign In
            </Link>
          )}
          <Link
            href="/contact"
            className="rounded-sm border border-gold px-4 py-2 text-sm text-gold transition hover:bg-gold hover:text-navy"
          >
            Get in Touch
          </Link>
        </div>

        <button
          className="text-white md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-black/10 bg-navy px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-white/80 hover:text-gold"
              >
                {l.label}
              </Link>
            ))}
            <div className="section-divider" />
            {auth.signedIn ? (
              <>
                <Link href={auth.destination} onClick={() => setOpen(false)} className="text-white/80 hover:text-gold">
                  {auth.destinationLabel}
                </Link>
                <button onClick={handleSignOut} className="text-left text-white/60 hover:text-gold">
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/sign-in" onClick={() => setOpen(false)} className="text-white/80 hover:text-gold">
                Client Sign In
              </Link>
            )}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="rounded-sm border border-gold px-4 py-2 text-center text-gold"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
