import { requirePermission } from "@/lib/admin-guard";
import { updateContent } from "./actions";

const labels: Record<string, string> = {
  home_hero_title: "Home — Hero Title",
  home_hero_subtitle: "Home — Hero Subtitle",
  about_story: "About — Our Story",
};

export default async function AdminContent() {
  const supabase = await requirePermission("content");
  const { data: content } = await supabase
    .from("site_content")
    .select("*")
    .order("key");

  return (
    <div>
      <h1 className="text-2xl font-semibold">Site Content</h1>
      <p className="mt-1 text-sm text-cream/60">
        Edit key text blocks shown on the public website. Changes go live
        immediately after saving.
      </p>

      <div className="mt-8 space-y-6">
        {(content ?? []).map((c) => (
          <form key={c.key} action={updateContent} className="rounded-md border border-black/10 bg-navy-card p-4">
            <input type="hidden" name="key" value={c.key} />
            <label className="mb-2 block text-sm font-medium text-gold">
              {labels[c.key] ?? c.key}
            </label>
            <textarea
              name="value"
              defaultValue={c.value}
              rows={3}
              className="w-full rounded-sm border border-black/15 bg-navy-light px-3 py-2 text-sm text-cream focus:border-gold focus:outline-none"
            />
            <button
              type="submit"
              className="mt-3 rounded-sm bg-gold px-4 py-2 text-sm font-medium text-navy hover:bg-gold-light"
            >
              Save
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
