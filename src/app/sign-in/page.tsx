"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-20">
      <p className="mb-2 text-sm uppercase tracking-[0.3em] text-gold">Client Portal</p>
      <h1 className="text-3xl font-semibold">Sign In</h1>
      <p className="mt-2 text-sm text-cream/60">
        Access your project dashboard, documents, and updates.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && <p className="rounded-sm border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-sm border border-black/15 bg-navy-card px-3 py-2 text-cream focus:border-gold focus:outline-none"
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-sm border border-black/15 bg-navy-card px-3 py-2 text-cream focus:border-gold focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-sm bg-gold px-6 py-3 font-medium text-navy hover:bg-gold-light disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-cream/60">
        Client portal access is set up by our team once you&rsquo;re an
        active client.{" "}
        <Link href="/contact" className="text-gold hover:text-gold-light">
          Contact us
        </Link>{" "}
        to get started.
      </p>
    </div>
  );
}
