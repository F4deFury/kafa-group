import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminOverview() {
  const supabase = await createClient();

  const [{ count: projectCount }, { count: submissionCount }, { count: clientCount }] =
    await Promise.all([
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase.from("contact_submissions").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "client"),
    ]);

  const cards = [
    { label: "Portfolio Projects", value: projectCount ?? 0, href: "/admin/projects" },
    { label: "New Inquiries", value: submissionCount ?? 0, href: "/admin/submissions" },
    { label: "Client Accounts", value: clientCount ?? 0, href: "/admin/clients" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Admin Overview</h1>
      <p className="mt-1 text-sm text-cream/60">
        Manage the public website content, incoming leads, and client access.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-md border border-black/10 bg-navy-card p-6 transition hover:border-gold/50"
          >
            <p className="text-3xl font-semibold text-gold">{c.value}</p>
            <p className="mt-2 text-sm text-cream/60">{c.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
