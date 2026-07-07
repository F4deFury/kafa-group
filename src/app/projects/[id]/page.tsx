import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import Reveal from "@/components/Reveal";
import { createClient } from "@/lib/supabase/server";
import ProgressStepper from "@/components/progress/ProgressStepper";
import ActivityFeed from "@/components/progress/ActivityFeed";

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // RLS already restricts this to: published projects (anyone), or the
  // client's own assigned project, or staff/management. No extra filter
  // needed here beyond the id lookup — adding .eq("published", true) would
  // incorrectly 404 a client viewing their own unpublished/in-progress project.
  const { data: project } = await supabase
    .from("projects")
    .select("id, name, location, category, category_description, client_id")
    .eq("id", id)
    .single();

  if (!project) notFound();

  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = !!user && user.id === project.client_id;

  const [{ data: images }, { data: milestones }, { data: updates }] = await Promise.all([
    supabase
      .from("project_images")
      .select("id, url")
      .eq("project_id", id)
      .order("sort_order", { ascending: true }),
    isOwner
      ? supabase
          .from("project_milestones")
          .select("id, name, status")
          .eq("project_id", id)
          .order("sort_order", { ascending: true })
      : Promise.resolve({ data: [] as { id: string; name: string; status: "not_started" | "in_progress" | "completed" }[] }),
    isOwner
      ? supabase
          .from("project_updates")
          .select("id, note, created_at")
          .eq("project_id", id)
          .order("created_at", { ascending: false })
          .limit(10)
      : Promise.resolve({ data: [] as { id: string; note: string; created_at: string }[] }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <Reveal>
        <Link href={isOwner ? "/dashboard" : "/projects"} className="mb-6 inline-flex items-center gap-2 text-sm text-cream/60 hover:text-gold">
          <ArrowLeft className="h-4 w-4" /> {isOwner ? "Back to Dashboard" : "Back to Projects"}
        </Link>
        {project.category && (
          <p className="mb-2 text-sm uppercase tracking-[0.3em] text-gold">{project.category}</p>
        )}
        <h1 className="text-4xl font-semibold sm:text-5xl">{project.name}</h1>
        {project.location && (
          <p className="mt-3 flex items-center gap-1 text-cream/60">
            <MapPin className="h-4 w-4" /> {project.location}
          </p>
        )}
      </Reveal>

      <div className="mt-10">
        {images && images.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {images.map((img, i) => (
              <Reveal key={img.id} delay={i * 0.08}>
                <img src={img.url} alt={project.name} className="aspect-[4/3] w-full rounded-md object-cover" />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="flex aspect-[16/7] w-full items-center justify-center rounded-md bg-gradient-to-br from-gray-100 to-gray-200 text-sm text-cream/40">
            Project photography coming soon
          </div>
        )}
      </div>

      {project.category_description && (
        <Reveal delay={0.15}>
          <div className="mt-10 max-w-3xl">
            <h2 className="mb-3 text-xl font-semibold">About This Project</h2>
            <p className="text-cream/70">{project.category_description}</p>
          </div>
        </Reveal>
      )}

      {isOwner && (
        <Reveal delay={0.2}>
          <div className="mt-10 rounded-md border border-black/10 bg-navy-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Your Project Progress</h2>
            <ProgressStepper milestones={milestones ?? []} />
          </div>
          <div className="mt-6 rounded-md border border-black/10 bg-navy-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
            <ActivityFeed updates={updates ?? []} />
          </div>
        </Reveal>
      )}
    </div>
  );
}
