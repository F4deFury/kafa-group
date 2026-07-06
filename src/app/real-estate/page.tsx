import { Landmark, Building2, TramFront, Construction, Home as HomeIcon, Landmark as HistoricIcon } from "lucide-react";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "KG Enterprise | KAFA Group Real Estate",
  description:
    "KG Enterprise, founded in 2005, is the real estate development arm of KAFA Group, investing in and developing properties across Connecticut.",
};


const services = [
  { icon: Landmark, title: "Master Planning & Development", desc: "Crafting strategic frameworks that guide sustainable urban growth and land use." },
  { icon: Building2, title: "Mixed Use Development", desc: "Combining residential, commercial, and recreational facilities within integrated developments." },
  { icon: TramFront, title: "Transit Oriented Development", desc: "Mixed-use communities centered around accessible public transportation hubs." },
  { icon: Construction, title: "Land & Infrastructure Development", desc: "Preparing raw land through utilities, roadways, and public service improvements." },
  { icon: HomeIcon, title: "Residential Development", desc: "Diverse housing solutions across demographics, with high-quality construction standards." },
  { icon: HistoricIcon, title: "Historic Renovations", desc: "Restoring and preserving heritage properties while meeting modern standards." },
];

export default async function RealEstate() {
  const supabase = await createClient();
  const { data: photo } = await supabase.from("site_media").select("url").eq("key", "real_estate_photo").single();
  const heroImage = photo?.url || "/images/real-estate-hero.png";

  return (
    <div>
      <PageHero image={heroImage} eyebrow="KG Enterprise" title="Building Value Through Investment" />
      <div className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <p className="max-w-2xl text-cream/70">
          KG Enterprise specializes in real estate development and investment
          within urban growth markets. Since its founding in 2005, the
          company has focused on central cities and first-ring suburbs,
          transforming urban communities and undertaking large-scale civic
          projects.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {[
          { value: "2005", label: "Founded" },
          { value: "$200M+", label: "Developments Facilitated (2005–2011)" },
          { value: "$1.3B+", label: "Real Estate Investments Placed" },
        ].map((s, i) => (
          <Reveal key={s.label} delay={i * 0.1}>
            <div className="rounded-md border border-black/10 bg-navy-card p-6 text-center">
              <p className="text-2xl font-semibold text-gold">{s.value}</p>
              <p className="mt-2 text-sm text-cream/60">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="section-divider my-16" />

      <Reveal>
        <h2 className="mb-8 text-2xl font-semibold">Real Estate Services</h2>
      </Reveal>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08}>
            <div className="h-full rounded-md border border-black/10 bg-navy-card p-6 transition hover:border-gold/50 hover:-translate-y-1">
              <s.icon className="h-8 w-8 text-gold" />
              <h3 className="mt-4 text-lg font-medium">{s.title}</h3>
              <p className="mt-2 text-sm text-cream/60">{s.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="section-divider my-16" />

      <Reveal>
        <h2 className="mb-4 text-2xl font-semibold">Our Strategy</h2>
        <ul className="grid gap-3 text-sm text-cream/70 sm:grid-cols-2">
          <li>&bull; Targeted focus on high-growth urban markets</li>
          <li>&bull; Value optimization in underserved markets</li>
          <li>&bull; Strategic partnerships with communities and investors</li>
          <li>&bull; Robust risk management and project evaluation</li>
          <li>&bull; Diversified portfolio across market cycles</li>
          <li>&bull; Triple bottom line: returns, community, environment</li>
        </ul>
      </Reveal>
      </div>
    </div>
  );
}
