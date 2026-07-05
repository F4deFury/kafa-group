"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="rounded-sm border border-black/15 px-4 py-2 text-sm text-cream/80 hover:border-gold hover:text-gold"
    >
      Sign Out
    </button>
  );
}
