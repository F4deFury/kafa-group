import { Trash2 } from "lucide-react";
import { requirePermission } from "@/lib/admin-guard";
import MediaUploadCard from "./MediaUploadCard";
import AddHeroSlideForm from "./AddHeroSlideForm";
import { deleteHeroSlide } from "./hero-actions";

export default async function AdminMedia() {
  const supabase = await requirePermission("content");
  const [{ data: media }, { data: slides }] = await Promise.all([
    supabase.from("site_media").select("key, url, media_type"),
    supabase.from("hero_slides").select("id, url, media_type, duration_seconds").order("sort_order"),
  ]);

  const map = Object.fromEntries((media ?? []).map((m) => [m.key, m]));

  return (
    <div>
      <h1 className="text-2xl font-semibold">Site Media</h1>
      <p className="mt-1 text-sm text-cream/60">
        Upload your own photos and video for key sections of the public
        website. If nothing is uploaded, a placeholder is shown instead.
      </p>

      <h2 className="mb-3 mt-8 text-lg font-medium">Homepage Hero Rotation</h2>
      <p className="mb-4 text-sm text-cream/60">
        Add multiple photos or video clips — the homepage will crossfade
        through them in order. Videos play once through; photos stay for the
        duration you set.
      </p>
      <AddHeroSlideForm />
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {(slides ?? []).map((s) => (
          <div key={s.id} className="relative">
            {s.media_type === "video" ? (
              <video src={s.url} className="aspect-video w-full rounded-md object-cover" muted />
            ) : (
              <img src={s.url} alt="" className="aspect-video w-full rounded-md object-cover" />
            )}
            <p className="mt-1 text-xs text-cream/50">
              {s.media_type} &middot; {s.duration_seconds}s
            </p>
            <form action={deleteHeroSlide} className="absolute right-2 top-2">
              <input type="hidden" name="id" value={s.id} />
              <button type="submit" className="rounded-sm bg-black/60 p-1.5 text-white hover:bg-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </form>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-10 text-lg font-medium">Page Photos</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        <MediaUploadCard
          label="About Page Banner"
          fieldKey="about_photo"
          mediaType="image"
          currentUrl={map.about_photo?.url ?? null}
        />
        <MediaUploadCard
          label="KG Real Estate Banner"
          fieldKey="real_estate_photo"
          mediaType="image"
          currentUrl={map.real_estate_photo?.url ?? null}
        />
        <MediaUploadCard
          label="Services Page Banner"
          fieldKey="services_photo"
          mediaType="image"
          currentUrl={map.services_photo?.url ?? null}
        />
        <MediaUploadCard
          label="Projects Page Banner"
          fieldKey="projects_hero"
          mediaType="image"
          currentUrl={map.projects_hero?.url ?? null}
        />
      </div>

      <h2 className="mb-3 mt-10 text-lg font-medium">Project Category Cover Photos</h2>
      <p className="mb-4 text-sm text-cream/60">
        Shown on the Projects page for each category. If a category has
        uploaded project photos too, hovering will cycle through them
        automatically.
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        <MediaUploadCard
          label="Education Cover"
          fieldKey="category_education_cover"
          mediaType="image"
          currentUrl={map.category_education_cover?.url ?? null}
        />
        <MediaUploadCard
          label="Healthcare Cover"
          fieldKey="category_healthcare_cover"
          mediaType="image"
          currentUrl={map.category_healthcare_cover?.url ?? null}
        />
        <MediaUploadCard
          label="Commercial Residences Cover"
          fieldKey="category_commercial_residences_cover"
          mediaType="image"
          currentUrl={map.category_commercial_residences_cover?.url ?? null}
        />
        <MediaUploadCard
          label="Municipalities Cover"
          fieldKey="category_municipalities_cover"
          mediaType="image"
          currentUrl={map.category_municipalities_cover?.url ?? null}
        />
      </div>

      <p className="mt-8 text-sm text-cream/50">
        To upload photos for a specific project&rsquo;s gallery, go to{" "}
        <a href="/admin/projects" className="text-gold hover:text-gold-light">Projects</a>{" "}
        and open that project.
      </p>
    </div>
  );
}
