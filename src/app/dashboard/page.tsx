import Link from "next/link";
import { redirect } from "next/navigation";
import { FolderKanban, FileText, MessageSquare, MapPin, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "./SignOutButton";
import DocumentList from "./components/DocumentList";
import ProgressStepper from "@/components/progress/ProgressStepper";
import ActivityFeed from "@/components/progress/ActivityFeed";

type Milestone = { id: string; name: string; status: "not_started" | "in_progress" | "completed" };

function projectStatus(milestones: Milestone[]): "not_started" | "in_progress" | "completed" {
  if (milestones.length === 0) return "not_started";
  const completed = milestones.filter((m) => m.status === "completed").length;
  if (completed === milestones.length) return "completed";
  if (completed > 0 || milestones.some((m) => m.status === "in_progress")) return "in_progress";
  return "not_started";
}

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const [{ data: profile }, { data: myProjects }] = await Promise.all([
    supabase.from("profiles").select("full_name, company").eq("id", user.id).single(),
    supabase
      .from("projects")
      .select("id, name, location, category, description")
      .eq("client_id", user.id),
  ]);

  const projects = myProjects ?? [];
  const projectIds = projects.map((p) => p.id);

  const [{ data: documents }, { data: allMilestones }, { data: allUpdates }] = await Promise.all([
    projectIds.length
      ? supabase
          .from("project_documents")
          .select("id, name, created_at")
          .in("project_id", projectIds)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] as { id: string; name: string; created_at: string }[] }),
    projectIds.length
      ? supabase
          .from("project_milestones")
          .select("id, project_id, name, status, sort_order")
          .in("project_id", projectIds)
          .order("sort_order", { ascending: true })
      : Promise.resolve({ data: [] as (Milestone & { project_id: string; sort_order: number })[] }),
    projectIds.length
      ? supabase
          .from("project_updates")
          .select("id, project_id, note, created_at")
          .in("project_id", projectIds)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] as { id: string; project_id: string; note: string; created_at: string }[] }),
  ]);

  const milestonesByProject = new Map<string, Milestone[]>();
  for (const m of allMilestones ?? []) {
    const list = milestonesByProject.get(m.project_id) ?? [];
    list.push(m);
    milestonesByProject.set(m.project_id, list);
  }

  const updatesByProject = new Map<string, { id: string; note: string; created_at: string }[]>();
  for (const u of allUpdates ?? []) {
    const list = updatesByProject.get(u.project_id) ?? [];
    list.push(u);
    updatesByProject.set(u.project_id, list);
  }

  const projectsWithProgress = projects.map((p) => {
    const milestones = milestonesByProject.get(p.id) ?? [];
    return { ...p, milestones, updates: updatesByProject.get(p.id) ?? [], status: projectStatus(milestones) };
  });

  const grouped = {
    in_progress: projectsWithProgress.filter((p) => p.status === "in_progress"),
    not_started: projectsWithProgress.filter((p) => p.status === "not_started"),
    completed: projectsWithProgress.filter((p) => p.status === "completed"),
  };

  const stats = [
    { label: "Active Projects", value: projects.length, icon: FolderKanban },
    { label: "Documents", value: documents?.length ?? 0, icon: FileText },
    { label: "Messages", value: 0, icon: MessageSquare },
  ];

  const sections: { key: keyof typeof grouped; label: string; badgeClass: string }[] = [
    { key: "in_progress", label: "In Progress", badgeClass: "bg-gold/15 text-gold-light" },
    { key: "not_started", label: "Not Yet Started", badgeClass: "bg-navy-light text-cream/50" },
    { key: "completed", label: "Completed", badgeClass: "bg-forest-light/15 text-forest-light" },
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

        {projects.length > 0 ? (
          <div className="mt-10 space-y-10">
            {sections.map(({ key, label, badgeClass }) => {
              const list = grouped[key];
              if (list.length === 0) return null;
              return (
                <div key={key}>
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-medium">
                    {label}
                    <span className={`rounded-full px-2 py-0.5 text-xs font-normal ${badgeClass}`}>
                      {list.length}
                    </span>
                  </h2>
                  <div className="space-y-4">
                    {list.map((p) => (
                      <div
                        key={p.id}
                        className="rounded-md border border-black/10 bg-navy-card p-5"
                      >
                        <Link href={`/projects/${p.id}`} className="group flex items-center justify-between">
                          <div>
                            <p className="font-medium group-hover:text-gold">{p.name}</p>
                            {p.location && (
                              <p className="mt-1 flex items-center gap-1 text-sm text-cream/60">
                                <MapPin className="h-3.5 w-3.5" /> {p.location}
                              </p>
                            )}
                            {p.category && (
                              <p className="mt-1 text-xs uppercase tracking-wide text-gold">{p.category}</p>
                            )}
                          </div>
                          <ArrowRight className="h-5 w-5 text-cream/40 group-hover:text-gold" />
                        </Link>

                        {p.milestones.length > 0 && (
                          <div className="mt-5 border-t border-black/10 pt-5">
                            <ProgressStepper milestones={p.milestones} />
                          </div>
                        )}

                        {p.updates.length > 0 && (
                          <div className="mt-5 border-t border-black/10 pt-5">
                            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-cream/50">
                              Recent Activity
                            </p>
                            <ActivityFeed updates={p.updates.slice(0, 3)} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <div>
              <h2 className="mb-4 text-lg font-medium">Documents</h2>
              <DocumentList documents={documents ?? []} />
            </div>

            <p className="text-sm text-cream/50">
              Project messaging is coming in a future update — for now, reach
              out to your KAFA Group contact directly with questions.
            </p>
          </div>
        ) : (
          <div className="mt-10 rounded-md border border-black/10 bg-navy-card p-8 text-center text-cream/60">
            Project tracking, documents, invoices, and messaging will appear
            here once your first project is assigned to your account.
          </div>
        )}
      </div>
    </div>
  );
}
