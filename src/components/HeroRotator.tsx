"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Slide = {
  id: string;
  url: string;
  media_type: "image" | "video";
  duration_seconds: number;
};

export default function HeroRotator({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = slides[index];

  function advance() {
    setIndex((prev) => (prev + 1) % slides.length);
  }

  useEffect(() => {
    if (!current) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    if (current.media_type === "image") {
      timerRef.current = setTimeout(advance, current.duration_seconds * 1000);
    }
    // videos advance via onEnded, with duration_seconds as a safety-net max
    else {
      timerRef.current = setTimeout(advance, current.duration_seconds * 1000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, slides.length]);

  if (!current) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {current.media_type === "video" ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              onEnded={advance}
              className="h-full w-full scale-105 object-cover"
            >
              <source src={current.url} type="video/mp4" />
            </video>
          ) : (
            <motion.img
              src={current.url}
              alt=""
              initial={{ scale: 1 }}
              animate={{ scale: 1.08 }}
              transition={{ duration: current.duration_seconds, ease: "linear" }}
              className="h-full w-full object-cover"
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
