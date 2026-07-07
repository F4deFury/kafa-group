import { ShieldCheck, Award, Users, Building } from "lucide-react";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "About Us | KAFA Group",
  description:
    "Founded in 2012 by Steve McKenzie, KAFA Group is a Bridgeport, Connecticut construction management and general contracting firm delivering commercial, residential, and infrastructure projects.",
};


const stats = [
  { value: "2012", label: "Year Established" },
  { value: "200+", label: "Projects Completed" },
  { value: "80+", label: "Contractors Appointed" },
];

const values = [
  { icon: ShieldCheck, label: "Transparency" },
  { icon: Award, label: "Accountability" },
  { icon: Users, label: "Collaboration" },
  { icon: Building, label: "Craftsmanship" },
];

export default async function About() {
  const supabase = await createClient();
  const [{ data }, { data: photo }] = await Promise.all([
    supabase.from("site_content").select("value").eq("key", "about_story").single(),
    supabase.from("site_media").select("url").eq("key", "about_photo").single(),
  ]);
  const heroImage = photo?.url || "/images/about-hero.png";

  const story =
    data?.value ||
    "Founded in 2012 by Steve McKenzie, KAFA Group was created from a profound passion for revitalizing the communities we call home. As a premier construction management and general contracting firm based in Bridgeport, Connecticut, we bring over 30 years of combined experience in architecture and urban planning to every project. Our diverse team, rich in local expertise, is dedicated to transforming visions into reality.";

  return (
    <div>
      <PageHero image={heroImage} eyebrow="Our Story" title="Who We Are" />
      <div className="relative z-10 -mt-24 mx-auto max-w-5xl rounded-t-3xl border border-black/10 bg-white/70 px-6 pb-20 pt-16 backdrop-blur-sm">
      <Reveal>
        <p className="max-w-2xl text-cream/70">{story}</p>
      </Reveal>

      <div className="section-divider my-14" />

      <div className="grid gap-6 sm:grid-cols-3">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.1}>
            <div className="rounded-md border border-black/10 bg-navy-card p-6 text-center">
              <p className="text-3xl font-semibold text-gold">{s.value}</p>
              <p className="mt-2 text-sm text-cream/60">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="section-divider my-14" />

      <Reveal>
        <h2 className="mb-8 text-2xl font-semibold">Our Approach</h2>
        <p className="max-w-2xl text-cream/70">
          Our comprehensive suite of services ensures your project is managed
          with expertise at every stage &mdash; from planning and execution to
          closeout. Whether you require a construction management advisor,
          general construction services, or something in between, KAFA Group
          provides a collaborative approach that fosters transparency and
          accountability, utilizing project control systems to optimize
          planning, scheduling, and cost management.
        </p>
      </Reveal>

      <div className="section-divider my-14" />

      <Reveal>
        <h2 className="mb-8 text-2xl font-semibold">Our Values</h2>
      </Reveal>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {values.map((v, i) => (
          <Reveal key={v.label} delay={i * 0.08}>
            <div className="flex flex-col items-center gap-2 text-center">
              <v.icon className="h-8 w-8 text-forest-light" />
              <p className="text-sm text-cream/70">{v.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
      </div>
    </div>
  );
}
