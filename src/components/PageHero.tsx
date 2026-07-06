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
    <div className="relative h-[420px] w-full overflow-hidden sm:h-[480px]">
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />
      <div className="relative mx-auto flex h-full max-w-6xl items-center px-6">
        <Reveal>
          <div className="max-w-xl rounded-md bg-white/90 px-8 py-10 shadow-lg backdrop-blur-sm">
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-gold-light">
              {eyebrow}
            </p>
            <h1 className="font-serif text-3xl italic text-navy sm:text-4xl">
              {title}
            </h1>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
