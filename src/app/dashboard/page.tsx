import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "./SignOutButton";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, company")
    .eq("id", user.id)
    .single();

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <div className="flex items-center justify-between">
        <div>
          <p className="mb-2 text-sm uppercase tracking-[0.3em] text-gold">Client Dashboard</p>
          <h1 className="text-3xl font-semibold">
            Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/settings" className="rounded-sm border border-black/15 px-4 py-2 text-sm text-cream/80 hover:border-gold hover:text-gold">
            Account Settings
          </Link>
          <SignOutButton />
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <div className="rounded-md border border-black/10 bg-navy-card p-6">
          <p className="text-sm text-cream/60">Active Projects</p>
          <p className="mt-2 text-3xl font-semibold text-gold">0</p>
        </div>
        <div className="rounded-md border border-black/10 bg-navy-card p-6">
          <p className="text-sm text-cream/60">Documents</p>
          <p className="mt-2 text-3xl font-semibold text-gold">0</p>
        </div>
        <div className="rounded-md border border-black/10 bg-navy-card p-6">
          <p className="text-sm text-cream/60">Messages</p>
          <p className="mt-2 text-3xl font-semibold text-gold">0</p>
        </div>
      </div>

      <div className="mt-10 rounded-md border border-black/10 bg-navy-card p-8 text-center text-cream/60">
        Project tracking, documents, invoices, and messaging will appear here
        once your first project is assigned to your account.
      </div>
    </div>
  );
}
