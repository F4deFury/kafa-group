import { requirePermission } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import InviteForm from "./InviteForm";

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AdminClients() {
  const supabase = await requirePermission("clients");
  const { data: clients } = await supabase
    .from("profiles")
    .select("id, full_name, company, role, created_at")
    .order("created_at", { ascending: false });

  // last_sign_in_at only lives on auth.users, not the profiles table, so it
  // needs the service-role admin client rather than the request-scoped one.
  let lastSignInById: Record<string, string | null> = {};
  try {
    const adminClient = createAdminClient();
    const { data } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
    lastSignInById = Object.fromEntries(
      (data?.users ?? []).map((u) => [u.id, u.last_sign_in_at ?? null])
    );
  } catch {
    // If the service role key isn't configured, just skip last-login data
    // rather than breaking the page.
  }

  const clientAccounts = (clients ?? []).filter((c) => c.role === "client");
  const active = clientAccounts.filter((c) => lastSignInById[c.id]);
  const pending = clientAccounts.filter((c) => !lastSignInById[c.id]);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Client Accounts</h1>
      <p className="mt-1 text-sm text-cream/60">
        Invite a new client to create their portal login, or view existing
        accounts. Clients set their own password via the invite email — you
        never handle their credentials.
      </p>

      <div className="mt-8">
        <InviteForm />
      </div>

      <div className="section-divider my-8" />

      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-cream/50">
        Active Accounts
        <span className="rounded-full bg-forest-light/15 px-2 py-0.5 text-xs font-normal normal-case text-forest-light">
          {active.length}
        </span>
      </h2>
      {active.length === 0 ? (
        <p className="mb-8 text-sm text-cream/50">
          No clients have signed in yet.
        </p>
      ) : (
        <div className="mb-8 space-y-3">
          {active.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-md border border-black/10 bg-navy-card p-4"
            >
              <div>
                <p className="font-medium">{c.full_name || "(unnamed)"}</p>
                <p className="text-sm text-cream/60">{c.company || "—"}</p>
              </div>
              <div className="text-right">
                <span className="rounded-sm bg-forest/10 px-2 py-1 text-xs uppercase tracking-wide text-forest-light">
                  Active
                </span>
                <p className="mt-1 text-xs text-cream/40">
                  Last signed in {formatDate(lastSignInById[c.id])}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-cream/50">
        Pending Invites
        <span className="rounded-full bg-gold/15 px-2 py-0.5 text-xs font-normal normal-case text-gold-light">
          {pending.length}
        </span>
      </h2>
      {pending.length === 0 ? (
        <p className="text-sm text-cream/50">No pending invites.</p>
      ) : (
        <div className="space-y-3">
          {pending.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-md border border-black/10 bg-navy-card p-4"
            >
              <div>
                <p className="font-medium">{c.full_name || "(pending invite)"}</p>
                <p className="text-sm text-cream/60">{c.company || "—"}</p>
              </div>
              <span className="rounded-sm bg-navy-light px-2 py-1 text-xs uppercase tracking-wide text-gold">
                Not yet signed in
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
