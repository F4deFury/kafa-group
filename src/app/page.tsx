import Link from "next/link";
import {
  ArrowRight,
  Building2,
  HardHat,
  Landmark,
  Wrench,
  ClipboardCheck,
  Hammer,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import HeroRotator from "@/components/HeroRotator";
import { createClient } from "@/lib/supabase/server";

const stats = [
  { value: "2012", label: "Year Established" },
  { value: "200+", label: "Projects Completed" },
  { value: "80+", label: "Contractors Appointed" },
  { value: "30+", label: "Years Combined Experience" },
];

const services = [
  { icon: HardHat, title: "Construction Management", desc: "Collaborative oversight from planning through closeout, with full transparency and accountability." },
  { icon: ClipboardCheck, title: "Construction Management at Risk", desc: "We assume cost and schedule risk while managing the build to protect your budget and timeline." },
  { icon: Building2, title: "General Construction Services", desc: "Full-service general contracting for commercial and residential projects of any scale." },
  { icon: Wrench, title: "Design Build", desc: "A single point of accountability from concept through construction." },
  { icon: Landmark, title: "Construction Management Advisor", desc: "Expert advisory support to optimize planning, scheduling, and cost management." },
  { icon: Hammer, title: "Facility Management", desc: "Ongoing facility operations and maintenance support after project completion." },
];

const fallbackProjects = [
  { id: "1", name: "Fairfield Ave Residences", location: "Bridgeport, CT" },
  { id: "2", name: "365 John St Project", location: "Bridgeport, CT" },
  { id: "3", name: "Artist Loft", location: "Bridgeport, CT" },
  { id: "4", name: "MLS Stadium", location: "Bridgeport, CT" },
];

export default async function Home() {
  const supabase = await createClient();

  const [{ data: content }, { data: projects }, { data: heroSlides }] = await Promise.all([
    supabase.from("site_content").select("key, value"),
    supabase
      .from("projects")
      .select("id, name, location")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .limit(4),
    supabase
      .from("hero_slides")
      .select("id, url, media_type, duration_seconds")
      .order("sort_order", { ascending: true }),
  ]);

  const slides =
    heroSlides && heroSlides.length > 0
      ? heroSlides
      : [{ id: "default", url: "https://assets.mixkit.co/videos/9686/9686-360.mp4", media_type: "video" as const, duration_seconds: 12 }];

  const contentMap = Object.fromEntries((content ?? []).map((c) => [c.key, c.value]));
  const heroTitle = contentMap.home_hero_title || "Together Building Communities.";
  const heroSubtitle =
    contentMap.home_hero_subtitle ||
    "Founded in 2012, KAFA Group is a premier construction management and general contracting firm based in Bridgeport, Connecticut, bringing over 30 years of combined experience in architecture and urban planning to every project.";
  const featuredProjects = projects && projects.length > 0 ? projects : fallbackProjects;

  return (
    <div>
      {/* Hero with background video */}
      <section className="relative -mt-20 flex min-h-[90vh] items-center overflow-hidden">
        <HeroRotator slides={slides} />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/50" />
        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <Reveal>
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gold">
              Construction Management &middot; General Contracting
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-6xl">
              {heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/80">{heroSubtitle}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/projects"
                className="flex items-center gap-2 rounded-sm bg-gold px-6 py-3 font-medium text-navy transition hover:bg-gold-light"
              >
                Explore Our Work <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="rounded-sm border border-white/30 px-6 py-3 font-medium text-white transition hover:border-gold hover:text-gold"
              >
                Request a Consultation
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-black/10 bg-navy-light">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-14 sm:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1}>
              <div className="text-center">
                <p className="text-3xl font-semibold text-gold sm:text-4xl">{s.value}</p>
                <p className="mt-2 text-sm text-cream/60">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <div className="mb-12 max-w-2xl">
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-gold">What We Do</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">Comprehensive Construction Services</h2>
          </div>
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
        <Link
          href="/services"
          className="mt-10 inline-flex items-center gap-2 text-gold hover:text-gold-light"
        >
          View All Services <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Featured Projects */}
      <section className="border-t border-black/10 bg-navy-light">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <Reveal>
            <div className="mb-12 max-w-2xl">
              <p className="mb-2 text-sm uppercase tracking-[0.3em] text-gold">Portfolio</p>
              <h2 className="text-3xl font-semibold sm:text-4xl">Bringing Projects Alive</h2>
            </div>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProjects.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <div className="group relative aspect-[4/5] overflow-hidden rounded-md border border-black/10 bg-gradient-to-br from-gray-100 to-gray-200 p-6 transition hover:border-gold/50">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-lg font-medium">{p.name}</h3>
                    <p className="text-sm text-cream/60">{p.location}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Link
            href="/projects"
            className="mt-10 inline-flex items-center gap-2 text-gold hover:text-gold-light"
          >
            View More Projects <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-24 text-center">
        <Reveal>
          <h2 className="text-3xl font-semibold sm:text-4xl">
            Let&rsquo;s Build a Better Future &mdash; <span className="text-gold">Together.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-cream/60">
            Whether you&rsquo;re planning a new development or need a trusted
            construction management partner, our team is ready to help.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-sm bg-gold px-8 py-3 font-medium text-navy hover:bg-gold-light"
          >
            Get in Touch <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
