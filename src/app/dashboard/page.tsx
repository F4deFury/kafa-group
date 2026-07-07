import Link from "next/link";
import { redirect } from "next/navigation";
import { FolderKanban, FileText, MessageSquare } from "lucide-react";
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

  const stats = [
    { label: "Active Projects", value: 0, icon: FolderKanban },
    { label: "Documents", value: 0, icon: FileText },
    { label: "Messages", value: 0, icon: MessageSquare },
  ];

  return (
    <div>
      <div
        className="relative -mt-20 w-full overflow-hidden"
        style={{ height: 220 + 80 }}
      >
        <img
          src="/images/real-estate-alt.png"
          alt=""
          className="absolute inset-0"
          style={{ height: "100%", width: "100%", objectFit: "cover" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/50 to-navy/10" />
        <div className="relative mx-auto flex h-full max-w-5xl items-center justify-between px-6">
          <div>
            <p className="mb-1 text-sm uppercase tracking-[0.3em] text-gold-light">
              Client Portal
            </p>
            <h1 className="text-2xl font-semibold text-white sm:text-3xl">
              Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}
            </h1>
            {profile?.company && (
              <p className="mt-1 text-sm text-white/70">{profile.company}</p>
            )}
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <Link
              href="/settings"
              className="rounded-sm border border-white/30 px-4 py-2 text-sm text-white hover:border-gold hover:text-gold"
            >
              Account Settings
            </Link>
            <SignOutButton />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-14">
        <div className="mb-4 flex items-center justify-between sm:hidden">
          <Link href="/settings" className="text-sm text-cream/70 hover:text-gold">
            Account Settings
          </Link>
          <SignOutButton />
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-md border border-black/10 bg-navy-card p-6">
              <s.icon className="h-6 w-6 text-forest-light" />
              <p className="mt-3 text-3xl font-semibold text-gold">{s.value}</p>
              <p className="mt-1 text-sm text-cream/60">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-md border border-black/10 bg-navy-card p-8 text-center text-cream/60">
          Project tracking, documents, invoices, and messaging will appear
          here once your first project is assigned to your account.
        </div>
      </div>
    </div>
  );
}
