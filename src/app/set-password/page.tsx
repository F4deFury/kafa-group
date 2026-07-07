"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-20">
      <p className="mb-2 text-sm uppercase tracking-[0.3em] text-gold">Welcome to KAFA Group</p>
      <h1 className="text-3xl font-semibold">Set Your Password</h1>
      <p className="mt-2 text-sm text-cream/60">
        Choose a password for your client portal account. You&rsquo;ll use
        this to sign in going forward.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && (
          <p className="rounded-sm border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}
        <input
          required
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-sm border border-black/15 bg-navy-card px-3 py-2 text-cream focus:border-gold focus:outline-none"
        />
        <input
          required
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full rounded-sm border border-black/15 bg-navy-card px-3 py-2 text-cream focus:border-gold focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-sm bg-gold px-6 py-3 font-medium text-navy hover:bg-gold-light disabled:opacity-60"
        >
          {loading ? "Saving..." : "Set Password & Continue"}
        </button>
      </form>
    </div>
  );
}
