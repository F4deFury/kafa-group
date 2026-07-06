"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export default function CategoryGallery({
  category,
  description,
  coverUrl,
  photos,
  projectCount,
  reverse,
}: {
  category: string;
  description: string;
  coverUrl: string | null;
  photos: string[];
  projectCount: number;
  reverse?: boolean;
}) {
  const images = coverUrl ? [coverUrl, ...photos.filter((p) => p !== coverUrl)] : photos;
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (hovering && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setIndex((i) => (i + 1) % images.length);
      }, 1100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIndex(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hovering, images.length]);

  return (
    <div
      className={`grid gap-8 lg:grid-cols-2 lg:items-center ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}
    >
      <div
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className="group relative aspect-[4/3] w-full overflow-hidden rounded-md border border-black/10"
      >
        {images.length > 0 ? (
          <AnimatePresence mode="sync">
            <motion.img
              key={images[index]}
              src={images[index]}
              alt={category}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 h-full w-full scale-105 object-cover transition-transform duration-700 group-hover:scale-100"
            />
          </AnimatePresence>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-sm text-cream/40">
            Photos coming soon
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        {images.length > 1 && (
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition ${
                  i === index ? "bg-gold" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gold">{category}</h2>
        <p className="mt-3 max-w-xl text-sm text-cream/70">{description}</p>
        <p className="mt-4 text-xs uppercase tracking-wide text-cream/40">
          {projectCount} {projectCount === 1 ? "Project" : "Projects"}
        </p>
      </div>
    </div>
  );
}
