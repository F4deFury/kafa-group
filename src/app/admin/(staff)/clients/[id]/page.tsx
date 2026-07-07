import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Building2, Calendar, MapPin } from "lucide-react";
import { requirePermission } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import ProgressStepper from "@/components/progress/ProgressStepper";
import ActivityFeed from "@/components/progress/ActivityFeed";
import AssignProjectForm from "./AssignProjectForm";
import RemoveClientButton from "../RemoveClientButton";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function ClientDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await requirePermission("clients");

  const { data: client } = await supabase
    .from("profiles")
    .select("id, full_name, company, role, created_at")
    .eq("id", id)
    .single();

  if (!client || client.role !== "client") notFound();

  let email = "—";
  let lastSignIn: string | null = null;
  try {
    const adminClient = createAdminClient();
    const { data } = await adminClient.auth.admin.getUserById(id);
    email = data.user?.email ?? "—";
    lastSignIn = data.user?.last_sign_in_at ?? null;
  } catch {
    // service role not configured — degrade gracefully
  }

  const { data: allProjects } = await supabase
    .from("projects")
    .select("id, name, location, category, client_id")
    .order("name", { ascending: true });

  const myProjects = (allProjects ?? []).filter((p) => p.client_id === id);
  const myProjectIds = myProjects.map((p) => p.id);

  const [{ data: milestones }, { data: updates }, { data: documents }] = await Promise.all([
    myProjectIds.length
      ? supabase
          .from("project_milestones")
          .select("id, project_id, name, status, sort_order")
          .in("project_id", myProjectIds)
          .order("sort_order", { ascending: true })
      : Promise.resolve({ data: [] as { id: string; project_id: string; name: string; status: "not_started" | "in_progress" | "completed"; sort_order: number }[] }),
    myProjectIds.length
      ? supabase
          .from("project_updates")
          .select("id, project_id, note, created_at")
          .in("project_id", myProjectIds)
          .order("created_at", { ascending: false })
          .limit(10)
      : Promise.resolve({ data: [] as { id: string; project_id: string; note: string; created_at: string }[] }),
    myProjectIds.length
      ? supabase
          .from("project_documents")
          .select("id, name")
          .in("project_id", myProjectIds)
      : Promise.resolve({ data: [] as { id: string; name: string }[] }),
  ]);

  const projectOptions = (allProjects ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    assignedToThisClient: p.client_id === id,
    assignedElsewhere: !!p.client_id && p.client_id !== id,
  }));

  return (
    <div>
      <Link href="/admin/clients" className="mb-4 inline-flex items-center gap-2 text-sm text-cream/60 hover:text-gold">
        <ArrowLeft className="h-4 w-4" /> Back to Client Accounts
      </Link>

      <div className="mb-8 flex items-start justify-between rounded-md border border-black/10 bg-navy-card p-6">
        <div>
          <h1 className="text-2xl font-semibold">{client.full_name || "(unnamed client)"}</h1>
          <div className="mt-3 space-y-1.5 text-sm text-cream/60">
            <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {email}</p>
            {client.company && <p className="flex items-center gap-2"><Building2 className="h-4 w-4" /> {client.company}</p>}
            <p className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Invited {formatDate(client.created_at)} &middot; Last signed in {formatDate(lastSignIn)}</p>
          </div>
        </div>
        <div className="text-right">
          <span className={`rounded-sm px-2 py-1 text-xs uppercase tracking-wide ${lastSignIn ? "bg-forest/10 text-forest-light" : "bg-navy-light text-gold"}`}>
            {lastSignIn ? "Active" : "Not Yet Signed In"}
          </span>
          <div className="mt-2">
            <RemoveClientButton clientId={client.id} name={client.full_name || "this client"} />
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-md border border-black/10 bg-navy-card p-6">
        <h2 className="mb-1 text-lg font-medium">Assigned Projects</h2>
        <p className="mb-4 text-sm text-cream/60">
          Assign, reassign, or unassign this client&rsquo;s projects. Changes take effect immediately on their dashboard.
        </p>
        <AssignProjectForm clientId={client.id} projects={projectOptions} />
      </div>

      {myProjects.length === 0 ? (
        <div className="rounded-md border border-black/10 bg-navy-card p-8 text-center text-cream/60">
          No project assigned yet — use the form above to give this client visibility into a project.
        </div>
      ) : (
        <div className="space-y-6">
          {myProjects.map((p) => {
            const ms = (milestones ?? []).filter((m) => m.project_id === p.id);
            const up = (updates ?? []).filter((u) => u.project_id === p.id);
            return (
              <div key={p.id} className="rounded-md border border-black/10 bg-navy-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{p.name}</p>
                    {p.location && (
                      <p className="mt-1 flex items-center gap-1 text-sm text-cream/60">
                        <MapPin className="h-3.5 w-3.5" /> {p.location}
                      </p>
                    )}
                  </div>
                  <Link href={`/admin/projects/${p.id}`} className="text-sm text-gold hover:underline">
                    Manage Project &rarr;
                  </Link>
                </div>
                <ProgressStepper milestones={ms} />
                {up.length > 0 && (
                  <div className="mt-5 border-t border-black/10 pt-5">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-cream/50">Recent Activity</p>
                    <ActivityFeed updates={up.slice(0, 3)} />
                  </div>
                )}
              </div>
            );
          })}

          <div className="rounded-md border border-black/10 bg-navy-card p-6">
            <h2 className="mb-3 text-lg font-medium">Documents</h2>
            {(documents ?? []).length === 0 ? (
              <p className="text-sm text-cream/50">No documents shared yet.</p>
            ) : (
              <ul className="space-y-1.5 text-sm text-cream/70">
                {(documents ?? []).map((d) => (
                  <li key={d.id}>{d.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
