import Link from "next/link";
import { Compass } from "lucide-react";

export const metadata = {
  title: "Page Not Found | KAFA Group",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-32 text-center">
      <Compass className="mb-6 h-14 w-14 text-gold" />
      <p className="mb-2 text-sm uppercase tracking-[0.3em] text-gold">404</p>
      <h1 className="text-3xl font-semibold sm:text-4xl">
        We couldn&rsquo;t find that page
      </h1>
      <p className="mt-4 text-navy/60">
        The page you&rsquo;re looking for may have moved or no longer exists.
        Let&rsquo;s get you back on track.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="rounded-sm bg-gold px-6 py-3 font-medium text-navy transition hover:bg-gold-light"
        >
          Back to Home
        </Link>
        <Link
          href="/contact"
          className="rounded-sm border border-navy/20 px-6 py-3 font-medium text-navy transition hover:border-gold hover:text-gold"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
