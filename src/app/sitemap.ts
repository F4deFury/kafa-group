import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = "https://www.kafagroup.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/services`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/projects`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/real-estate`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/contact`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${BASE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createClient();
    const { data: projects } = await supabase
      .from("projects")
      .select("id, published")
      .eq("published", true);

    projectRoutes = (projects ?? []).map((p) => ({
      url: `${BASE_URL}/projects/${p.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // If Supabase is unreachable at build time, fall back to static routes only.
  }

  return [...staticRoutes, ...projectRoutes];
}
