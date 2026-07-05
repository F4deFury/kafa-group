"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "kafa-cookie-consent";

export default function TawkLoader({ tawkId }: { tawkId: string }) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    function check() {
      setAllowed(window.localStorage.getItem(STORAGE_KEY) === "accepted");
    }
    check();
    window.addEventListener("cookie-consent-changed", check);
    return () => window.removeEventListener("cookie-consent-changed", check);
  }, []);

  useEffect(() => {
    if (!allowed) return;
    if (document.getElementById("tawkto-script")) return;

    (window as unknown as { Tawk_API?: unknown }).Tawk_API =
      (window as unknown as { Tawk_API?: unknown }).Tawk_API || {};
    (window as unknown as { Tawk_LoadStart?: Date }).Tawk_LoadStart = new Date();

    const s1 = document.createElement("script");
    const s0 = document.getElementsByTagName("script")[0];
    s1.id = "tawkto-script";
    s1.async = true;
    s1.src = `https://embed.tawk.to/${tawkId}`;
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");
    s0.parentNode?.insertBefore(s1, s0);
  }, [allowed, tawkId]);

  return null;
}
