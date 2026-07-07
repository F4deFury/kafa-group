import Link from "next/link";
import { requirePermission } from "@/lib/admin-guard";
import { upsertProject, deleteProject } from "./actions";
import { Trash2 } from "lucide-react";

export default async function AdminProjects() {
  const supabase = await requirePermission("projects");
  const [{ data: projects }, { data: clients }] = await Promise.all([
    supabase.from("projects").select("*").order("sort_order", { ascending: true }),
    supabase.from("profiles").select("id, full_name, company").eq("role", "client").order("full_name"),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Portfolio Projects</h1>
      <p className="mt-1 text-sm text-cream/60">
        These entries populate the public /projects page.
      </p>

      <div className="mt-8 space-y-4">
        {(projects ?? []).map((p) => (
          <form
            key={p.id}
            action={upsertProject}
            className="grid gap-3 rounded-md border border-black/10 bg-navy-card p-4 sm:grid-cols-2"
          >
            <input type="hidden" name="id" value={p.id} />
            <input
              name="name"
              defaultValue={p.name}
              placeholder="Project name"
              className="rounded-sm border border-black/15 bg-navy-light px-3 py-2 text-sm text-cream focus:border-gold focus:outline-none"
            />
            <input
              name="location"
              defaultValue={p.location ?? ""}
              placeholder="Location"
              className="rounded-sm border border-black/15 bg-navy-light px-3 py-2 text-sm text-cream focus:border-gold focus:outline-none"
            />
            <textarea
              name="description"
              defaultValue={p.description ?? ""}
              placeholder="Description"
              rows={2}
              className="rounded-sm border border-black/15 bg-navy-light px-3 py-2 text-sm text-cream focus:border-gold focus:outline-none sm:col-span-2"
            />
            <label className="flex items-center gap-2 text-sm text-cream/70">
              <input type="checkbox" name="published" defaultChecked={p.published} />
              Published on public site
            </label>
            <label className="flex flex-col gap-1 text-sm text-cream/70 sm:col-span-2">
              Assigned Client
              <select
                name="client_id"
                defaultValue={p.client_id ?? ""}
                className="rounded-sm border border-black/15 bg-navy-light px-3 py-2 text-sm text-cream focus:border-gold focus:outline-none"
              >
                <option value="">— No client assigned —</option>
                {(clients ?? []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name || "Unnamed"} {c.company ? `(${c.company})` : ""}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-sm bg-gold px-4 py-2 text-sm font-medium text-navy hover:bg-gold-light"
              >
                Save
              </button>
              <button
                formAction={deleteProject}
                className="flex items-center gap-1 rounded-sm border border-red-500/40 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
              <Link
                href={`/admin/projects/${p.id}`}
                className="flex items-center rounded-sm border border-black/15 px-3 py-2 text-sm text-cream/80 hover:border-gold hover:text-gold"
              >
                Manage Photos
              </Link>
            </div>
          </form>
        ))}
      </div>

      <div className="section-divider my-8" />

      <h2 className="mb-4 text-lg font-medium">Add New Project</h2>
      <form action={upsertProject} className="grid gap-3 rounded-md border border-black/10 bg-navy-card p-4 sm:grid-cols-2">
        <input name="name" placeholder="Project name" required className="rounded-sm border border-black/15 bg-navy-light px-3 py-2 text-sm text-cream focus:border-gold focus:outline-none" />
        <input name="location" placeholder="Location" className="rounded-sm border border-black/15 bg-navy-light px-3 py-2 text-sm text-cream focus:border-gold focus:outline-none" />
        <textarea name="description" placeholder="Description" rows={2} className="rounded-sm border border-black/15 bg-navy-light px-3 py-2 text-sm text-cream focus:border-gold focus:outline-none sm:col-span-2" />
        <label className="flex items-center gap-2 text-sm text-cream/70">
          <input type="checkbox" name="published" defaultChecked />
          Published on public site
        </label>
        <button type="submit" className="rounded-sm bg-gold px-4 py-2 text-sm font-medium text-navy hover:bg-gold-light">
          Add Project
        </button>
      </form>
    </div>
  );
}
