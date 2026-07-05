import { requirePermission } from "@/lib/admin-guard";
import InviteForm from "./InviteForm";

export default async function AdminClients() {
  const supabase = await requirePermission("clients");
  const { data: clients } = await supabase
    .from("profiles")
    .select("id, full_name, company, role, created_at")
    .order("created_at", { ascending: false });

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

      <div className="space-y-3">
        {(clients ?? []).map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-md border border-black/10 bg-navy-card p-4">
            <div>
              <p className="font-medium">{c.full_name || "(pending invite)"}</p>
              <p className="text-sm text-cream/60">{c.company || "—"}</p>
            </div>
            <span className="rounded-sm bg-navy-light px-2 py-1 text-xs uppercase tracking-wide text-gold">
              {c.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
