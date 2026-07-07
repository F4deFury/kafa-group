import Link from "next/link";
import { Building2, HardHat, Landmark, Wrench, ClipboardCheck, Hammer, ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Services | KAFA Group",
  description:
    "KAFA Group offers construction management, general contracting, and pre-construction services across commercial, residential, and infrastructure sectors in Connecticut.",
};


const services = [
  { icon: HardHat, title: "Construction Management", desc: "Collaborative oversight from planning through closeout, with full transparency and accountability at every stage." },
  { icon: ClipboardCheck, title: "Construction Management at Risk", desc: "We assume cost and schedule risk while managing the build, protecting your budget and timeline." },
  { icon: Building2, title: "General Construction Services", desc: "Full-service general contracting for commercial and residential projects of any scale." },
  { icon: Wrench, title: "Design Build", desc: "A single point of accountability from concept through construction, streamlining delivery." },
  { icon: Landmark, title: "Construction Management Advisor", desc: "Expert advisory support utilizing project control systems to optimize planning, scheduling, and cost management." },
  { icon: Hammer, title: "Facility Management", desc: "Ongoing facility operations and maintenance support after project completion." },
];

export default async function Services() {
  const supabase = await createClient();
  const { data: photo } = await supabase.from("site_media").select("url").eq("key", "services_photo").single();
  const heroImage = photo?.url || "/images/services-hero.png";

  return (
    <div>
      <PageHero image={heroImage} eyebrow="What We Do" title="Comprehensive Construction Services" />
      <div className="relative z-10 -mt-24 mx-auto max-w-6xl rounded-t-3xl bg-white/70 px-6 pb-20 pt-16 backdrop-blur-sm">
      <Reveal>
        <p className="max-w-2xl text-cream/70">
          Our comprehensive suite of services ensures your project is managed
          with expertise at every stage, from planning and execution to
          closeout &mdash; so we can build a better future, together.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08}>
            <div className="h-full rounded-md border border-black/10 bg-navy-card p-6 transition hover:border-gold/50 hover:-translate-y-1">
              <s.icon className="h-9 w-9 text-gold" />
              <h3 className="mt-4 text-lg font-medium">{s.title}</h3>
              <p className="mt-2 text-sm text-cream/60">{s.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-14 rounded-md border border-gold/30 bg-navy-card p-8 text-center">
          <h2 className="text-2xl font-semibold">Have a project in mind?</h2>
          <p className="mt-2 text-cream/60">Tell us about it and we&rsquo;ll get back to you within one business day.</p>
          <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-sm bg-gold px-6 py-3 font-medium text-navy hover:bg-gold-light">
            Request a Consultation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
      </div>
    </div>
  );
}
