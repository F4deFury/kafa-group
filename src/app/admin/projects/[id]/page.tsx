import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { requirePermission } from "@/lib/admin-guard";
import UploadPhotoForm from "./UploadPhotoForm";
import UploadDocumentForm from "./UploadDocumentForm";
import MilestoneManager from "./MilestoneManager";
import PostUpdateForm from "./PostUpdateForm";
import { deleteProjectImage, deleteProjectDocument } from "./actions";

export default async function AdminProjectPhotos({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await requirePermission("projects");

  const { data: project } = await supabase
    .from("projects")
    .select("id, name, client_id")
    .eq("id", id)
    .single();

  const [{ data: images }, { data: documents }, { data: milestones }, { data: updates }] = await Promise.all([
    supabase
      .from("project_images")
      .select("id, url")
      .eq("project_id", id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("project_documents")
      .select("id, name, storage_path, created_at")
      .eq("project_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("project_milestones")
      .select("id, name, status, sort_order")
      .eq("project_id", id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("project_updates")
      .select("id, note, notify_client, created_at")
      .eq("project_id", id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return (
    <div>
      <Link href="/admin/projects" className="mb-4 inline-flex items-center gap-2 text-sm text-cream/60 hover:text-gold">
        <ArrowLeft className="h-4 w-4" /> Back to Projects
      </Link>
      <h1 className="text-2xl font-semibold">{project?.name} — Photos</h1>
      <p className="mt-1 text-sm text-cream/60">
        These photos appear in this project&rsquo;s public gallery.
      </p>

      <div className="mt-6">
        <UploadPhotoForm projectId={id} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {(images ?? []).map((img) => (
          <div key={img.id} className="relative">
            <img src={img.url} alt="" className="aspect-[4/3] w-full rounded-md object-cover" />
            <form action={deleteProjectImage} className="absolute right-2 top-2">
              <input type="hidden" name="image_id" value={img.id} />
              <input type="hidden" name="project_id" value={id} />
              <button type="submit" className="rounded-sm bg-black/60 p-1.5 text-white hover:bg-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </form>
          </div>
        ))}
      </div>

      <div className="section-divider my-8" />

      <h2 className="mb-1 text-lg font-medium">Progress &amp; Milestones</h2>
      <p className="mb-4 text-sm text-cream/60">
        {project?.client_id
          ? "The client sees these milestones as a progress stepper on their dashboard."
          : "Assign a client to this project (on the Portfolio Projects page) for these to appear on a dashboard."}
      </p>
      <MilestoneManager
        projectId={id}
        milestones={(milestones ?? []) as { id: string; name: string; status: "not_started" | "in_progress" | "completed"; sort_order: number }[]}
      />

      <div className="section-divider my-8" />

      <h2 className="mb-1 text-lg font-medium">Post an Update</h2>
      <p className="mb-4 text-sm text-cream/60">
        Shows up in the client&rsquo;s recent activity feed, and optionally sends them a notification.
      </p>
      <PostUpdateForm projectId={id} />
      <div className="mt-4 space-y-2">
        {(updates ?? []).map((u) => (
          <div key={u.id} className="rounded-md border border-black/10 bg-navy-card p-3">
            <p className="text-sm">{u.note}</p>
            <p className="mt-1 text-xs text-cream/40">
              {new Date(u.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
              {u.notify_client && <span className="ml-2 text-gold-light">· client notified</span>}
            </p>
          </div>
        ))}
      </div>

      <div className="section-divider my-8" />

      <h2 className="mb-1 text-lg font-medium">Documents</h2>
      <p className="mb-4 text-sm text-cream/60">
        Visible only to staff/management and this project&rsquo;s assigned
        client, from their dashboard.
      </p>
      <UploadDocumentForm projectId={id} />
      <div className="mt-4 space-y-2">
        {(documents ?? []).map((doc) => (
          <div key={doc.id} className="flex items-center justify-between rounded-md border border-black/10 bg-navy-card p-3">
            <p className="text-sm">{doc.name}</p>
            <form action={deleteProjectDocument}>
              <input type="hidden" name="document_id" value={doc.id} />
              <input type="hidden" name="project_id" value={id} />
              <input type="hidden" name="storage_path" value={doc.storage_path} />
              <button type="submit" className="rounded-sm border border-red-500/40 px-2 py-1 text-xs text-red-600 hover:bg-red-50">
                Remove
              </button>
            </form>
          </div>
        ))}
        {(documents ?? []).length === 0 && (
          <p className="text-sm text-cream/50">No documents uploaded yet.</p>
        )}
      </div>
    </div>
  );
}
