"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "kafa-cookie-consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  function choose(value: "accepted" | "declined") {
    window.localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
    // Let the rest of the app (e.g. Tawk.to loader) know the choice changed.
    window.dispatchEvent(new CustomEvent("cookie-consent-changed", { detail: value }));
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-black/10 bg-navy px-6 py-4 text-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 md:flex-row md:justify-between">
        <p className="text-sm text-white/80">
          We use cookies to support live chat and basic site analytics. See our{" "}
          <Link href="/privacy" className="text-gold underline">
            Privacy Policy
          </Link>{" "}
          to learn more.
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={() => choose("declined")}
            className="rounded-md border border-white/30 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Decline
          </button>
          <button
            onClick={() => choose("accepted")}
            className="rounded-md bg-gold px-4 py-2 text-sm font-medium text-navy transition hover:brightness-95"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
