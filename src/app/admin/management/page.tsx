import Link from "next/link";
import { redirect } from "next/navigation";
import { Users, ShieldCheck, Building2, Mail, FolderKanban, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = {
  title: "Management Overview | KAFA Group",
  robots: { index: false, follow: false },
};

export default async function ManagementOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (me?.role !== "management") redirect("/admin");

  const [{ data: allProfiles }, { count: projectCount }, { count: publishedCount }, { count: submissionCount }] =
    await Promise.all([
      supabase.from("profiles").select("id, role"),
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase.from("projects").select("*", { count: "exact", head: true }).eq("published", true),
      supabase.from("contact_submissions").select("*", { count: "exact", head: true }),
    ]);

  const staffCount = (allProfiles ?? []).filter((p) => p.role === "staff").length;
  const managementCount = (allProfiles ?? []).filter((p) => p.role === "management").length;
  const clientProfiles = (allProfiles ?? []).filter((p) => p.role === "client");

  let activeClientCount = 0;
  try {
    const adminClient = createAdminClient();
    const { data } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
    const lastSignInIds = new Set((data?.users ?? []).filter((u) => u.last_sign_in_at).map((u) => u.id));
    activeClientCount = clientProfiles.filter((c) => lastSignInIds.has(c.id)).length;
  } catch {
    // service role not configured — fall back to 0 rather than breaking the page
  }

  const stats = [
    { label: "Staff Accounts", value: staffCount, icon: ShieldCheck },
    { label: "Management Accounts", value: managementCount, icon: Users },
    { label: "Active Clients", value: activeClientCount, icon: Building2 },
    { label: "Pending Client Invites", value: clientProfiles.length - activeClientCount, icon: Mail },
    { label: "Published Projects", value: publishedCount ?? 0, icon: FolderKanban },
    { label: "Total Projects (incl. drafts)", value: projectCount ?? 0, icon: FolderKanban },
  ];

  return (
    <div>
      <div className="-mx-6 -mt-6 mb-8 border-b border-gold/30 bg-gradient-to-r from-navy to-[#1c3a5c] px-6 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          Executive Overview
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-white">
          Company-Wide Standing
        </h1>
        <p className="mt-1 text-sm text-white/60">
          Visible only to Management — staff accounts see the Admin Dashboard
          instead, scoped to their assigned permissions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-md border border-gold/20 bg-navy p-6 text-white">
            <s.icon className="h-6 w-6 text-gold" />
            <p className="mt-3 text-3xl font-semibold text-gold">{s.value}</p>
            <p className="mt-1 text-sm text-white/60">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/team"
          className="flex items-center justify-between rounded-md border border-black/10 bg-navy-card p-5 transition hover:border-gold/50"
        >
          <div>
            <p className="font-medium">Team & Permissions</p>
            <p className="mt-1 text-sm text-cream/60">Invite staff, assign roles, toggle access.</p>
          </div>
          <ArrowRight className="h-5 w-5 text-cream/40" />
        </Link>
        <Link
          href="/admin/clients"
          className="flex items-center justify-between rounded-md border border-black/10 bg-navy-card p-5 transition hover:border-gold/50"
        >
          <div>
            <p className="font-medium">Client Accounts</p>
            <p className="mt-1 text-sm text-cream/60">Review active vs. pending client access.</p>
          </div>
          <ArrowRight className="h-5 w-5 text-cream/40" />
        </Link>
      </div>
    </div>
  );
}
