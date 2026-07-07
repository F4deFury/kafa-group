import { requirePermission } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import InviteForm from "./InviteForm";
import ClientsFilter, { ClientRow } from "./ClientsFilter";

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

  const clientAccounts = (clients ?? []).filter((c) => c.role === "client");
  const clientIds = clientAccounts.map((c) => c.id);

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

  const { data: assignedProjects } = clientIds.length
    ? await supabase
        .from("projects")
        .select("id, name, client_id")
        .in("client_id", clientIds)
    : { data: [] as { id: string; name: string; client_id: string }[] };

  const projectIds = (assignedProjects ?? []).map((p) => p.id);
  const { data: milestones } = projectIds.length
    ? await supabase
        .from("project_milestones")
        .select("project_id, status")
        .in("project_id", projectIds)
    : { data: [] as { project_id: string; status: string }[] };

  const pctByProject = new Map<string, number>();
  for (const projectId of projectIds) {
    const ms = (milestones ?? []).filter((m) => m.project_id === projectId);
    const pct = ms.length ? Math.round((ms.filter((m) => m.status === "completed").length / ms.length) * 100) : 0;
    pctByProject.set(projectId, pct);
  }

  const projectByClient = new Map<string, { id: string; name: string; pct: number }>();
  for (const p of assignedProjects ?? []) {
    projectByClient.set(p.client_id, { id: p.id, name: p.name, pct: pctByProject.get(p.id) ?? 0 });
  }

  const rows: ClientRow[] = clientAccounts.map((c) => ({
    id: c.id,
    name: c.full_name || "(unnamed)",
    company: c.company,
    status: lastSignInById[c.id] ? "active" : "pending",
    lastSignIn: formatDate(lastSignInById[c.id]),
    project: projectByClient.get(c.id) ?? null,
  }));

  const activeCount = rows.filter((r) => r.status === "active").length;
  const pendingCount = rows.length - activeCount;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Client Accounts</h1>
      <p className="mt-1 text-sm text-cream/60">
        Invite a new client to create their portal login, search or filter
        existing accounts, and see each client&rsquo;s project progress at a
        glance.
      </p>

      <div className="mt-8">
        <InviteForm />
      </div>

      <div className="section-divider my-8" />

      <div className="mb-4 flex items-center gap-3 text-sm text-cream/60">
        <span>{rows.length} total</span>
        <span>&middot;</span>
        <span className="text-forest-light">{activeCount} active</span>
        <span>&middot;</span>
        <span className="text-gold">{pendingCount} pending</span>
      </div>

      <ClientsFilter clients={rows} />
    </div>
  );
}
