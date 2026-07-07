"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Supabase invite/recovery emails redirect back with the session tokens in
 * the URL hash (e.g. #access_token=...&type=invite), not a query string
 * "code" param. Browsers never send URL hash contents to the server, so a
 * server route can never see or handle this — it has to be picked up here,
 * client-side, on first load.
 */
export default function AuthHashHandler() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || !hash.includes("access_token")) return;

    const params = new URLSearchParams(hash.slice(1));
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
    const type = params.get("type");

    if (!access_token || !refresh_token) return;

    const supabase = createClient();
    supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
      // Clear the token hash from the URL either way, so it's never left
      // sitting visible/reusable in the address bar or browser history.
      window.history.replaceState(null, "", window.location.pathname);
      if (error) return;

      if (type === "invite" || type === "recovery") {
        router.replace("/set-password");
      } else {
        router.replace("/dashboard");
      }
    });
  }, [router]);

  return null;
}
