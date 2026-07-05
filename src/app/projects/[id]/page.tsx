import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import Reveal from "@/components/Reveal";
import { createClient } from "@/lib/supabase/server";

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id, name, location, category, category_description")
    .eq("id", id)
    .eq("published", true)
    .single();

  if (!project) notFound();

  const { data: images } = await supabase
    .from("project_images")
    .select("id, url")
    .eq("project_id", id)
    .order("sort_order", { ascending: true });

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <Reveal>
        <Link href="/projects" className="mb-6 inline-flex items-center gap-2 text-sm text-cream/60 hover:text-gold">
          <ArrowLeft className="h-4 w-4" /> Back to Projects
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
    </div>
  );
}
