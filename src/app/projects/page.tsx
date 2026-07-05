import Link from "next/link";
import Reveal from "@/components/Reveal";
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

export default async function Projects() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("id, name, location, category, category_description")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  const projects = (data ?? []) as Project[];

  const grouped = categoryOrder
    .map((category) => ({
      category,
      description: projects.find((p) => p.category === category)?.category_description ?? "",
      items: projects.filter((p) => p.category === category),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <p className="mb-2 text-sm uppercase tracking-[0.3em] text-gold">Building Excellence</p>
        <h1 className="text-4xl font-semibold sm:text-5xl">KAFA Group&rsquo;s Featured Projects</h1>
        <p className="mt-6 max-w-2xl text-cream/70">
          With a track record of excellence and a commitment to community
          impact, we are your trusted partner for construction projects that
          make a difference. Connect with us to discuss our full portfolio of
          completed projects and renovations within the following industries.
        </p>
      </Reveal>

      <div className="mt-14 space-y-16">
        {grouped.map((group, gi) => (
          <div key={group.category}>
            <Reveal delay={gi * 0.05}>
              <h2 className="text-2xl font-semibold text-gold">{group.category}</h2>
              <p className="mt-3 max-w-3xl text-sm text-cream/70">{group.description}</p>
            </Reveal>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
  );
}
