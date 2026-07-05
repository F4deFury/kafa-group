import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { requirePermission } from "@/lib/admin-guard";
import UploadPhotoForm from "./UploadPhotoForm";
import { deleteProjectImage } from "./actions";

export default async function AdminProjectPhotos({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await requirePermission("projects");

  const { data: project } = await supabase
    .from("projects")
    .select("id, name")
    .eq("id", id)
    .single();

  const { data: images } = await supabase
    .from("project_images")
    .select("id, url")
    .eq("project_id", id)
    .order("sort_order", { ascending: true });

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
    </div>
  );
}
