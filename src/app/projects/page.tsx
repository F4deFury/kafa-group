import Link from "next/link";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import CategoryGallery from "./CategoryGallery";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Projects | KAFA Group",
  description:
    "Browse KAFA Group's portfolio of completed and ongoing construction projects across commercial, residential, institutional, and infrastructure categories.",
};


type Project = {
  id: string;
  name: string;
  location: string | null;
  category: string | null;
  category_description: string | null;
};

const categoryOrder = ["Education", "Healthcare", "Commercial Residences", "Municipalities"];

const categoryCoverKeys: Record<string, string> = {
  Education: "category_education_cover",
  Healthcare: "category_healthcare_cover",
  "Commercial Residences": "category_commercial_residences_cover",
  Municipalities: "category_municipalities_cover",
};

export default async function Projects() {
  const supabase = await createClient();
  const [{ data }, { data: heroMedia }, { data: media }] = await Promise.all([
    supabase
      .from("projects")
      .select("id, name, location, category, category_description")
      .eq("published", true)
      .order("sort_order", { ascending: true }),
    supabase.from("site_media").select("url").eq("key", "projects_hero").single(),
    supabase.from("site_media").select("key, url"),
  ]);

  const projects = (data ?? []) as Project[];
  const heroImage = heroMedia?.url || "/images/projects-hero.png";
  const mediaMap = Object.fromEntries((media ?? []).map((m) => [m.key, m.url]));

  const projectIds = projects.map((p) => p.id);
  const { data: images } = projectIds.length
    ? await supabase.from("project_images").select("project_id, url").in("project_id", projectIds)
    : { data: [] as { project_id: string; url: string }[] };

  const grouped = categoryOrder
    .map((category) => {
      const items = projects.filter((p) => p.category === category);
      const idsInCategory = new Set(items.map((p) => p.id));
      const photos = (images ?? [])
        .filter((img) => idsInCategory.has(img.project_id))
        .map((img) => img.url);
      return {
        category,
        description: items.find((p) => p.category_description)?.category_description ?? "",
        items,
        photos,
        coverUrl: mediaMap[categoryCoverKeys[category]] ?? null,
      };
    })
    .filter((g) => g.items.length > 0);

  return (
    <div>
      <PageHero image={heroImage} eyebrow="Building Excellence" title="KAFA Group’s Featured Projects" />
      <div className="relative z-10 -mt-24 mx-auto max-w-6xl rounded-t-3xl border border-black/10 bg-white/70 px-6 pb-20 pt-16 backdrop-blur-sm">
      <Reveal>
        <p className="max-w-2xl text-cream/70">
          With a track record of excellence and a commitment to community
          impact, we are your trusted partner for construction projects that
          make a difference. Connect with us to discuss our full portfolio of
          completed projects and renovations within the following industries.
        </p>
      </Reveal>

      <div className="mt-14 space-y-20">
        {grouped.map((group, gi) => (
          <div key={group.category}>
            <Reveal delay={gi * 0.05}>
              <CategoryGallery
                category={group.category}
                description={group.description}
                coverUrl={group.coverUrl}
                photos={group.photos}
                projectCount={group.items.length}
                reverse={gi % 2 === 1}
              />
            </Reveal>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08}>
                  <Link
                    href={`/projects/${p.id}`}
                    className="group relative block aspect-[4/3] overflow-hidden rounded-md border border-black/10 bg-gradient-to-br from-gray-100 to-gray-200 p-5 transition hover:border-gold/50 hover:-translate-y-1"
                  >
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-base font-medium">{p.name}</h3>
                      {p.location && <p className="text-sm text-cream/60">{p.location}</p>}
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Reveal delay={0.2}>
        <p className="mt-14 text-sm text-cream/50">
          Project photography coming soon.
        </p>
      </Reveal>
      </div>
    </div>
  );
}
