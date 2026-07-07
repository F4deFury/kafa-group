import Reveal from "@/components/Reveal";

export default function PageHero({
  image,
  eyebrow,
  title,
}: {
  image: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: 420, maxHeight: 420 }}
    >
      <img
        src={image}
        alt=""
        className="absolute inset-0"
        style={{ height: "100%", width: "100%", objectFit: "cover" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/35 via-transparent to-transparent" />
      <div className="relative mx-auto flex h-full max-w-6xl items-center px-6">
        <Reveal>
          <div className="max-w-xl rounded-md bg-white/10 px-8 py-10 backdrop-blur-[2px]">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-gold-light [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">
              {eyebrow}
            </p>
            <h1 className="font-serif text-3xl italic text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.55)] sm:text-4xl">
              {title}
            </h1>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
