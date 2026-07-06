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
      <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent" />
      <div className="relative mx-auto flex h-full max-w-6xl items-center px-6">
        <Reveal>
          <div className="max-w-xl rounded-md bg-white/25 px-8 py-10 shadow-lg backdrop-blur-lg">
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-gold-light drop-shadow-sm">
              {eyebrow}
            </p>
            <h1 className="font-serif text-3xl italic text-navy drop-shadow-sm sm:text-4xl">
              {title}
            </h1>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
