"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { LOCATIONS } from "./coords";

const GlobeScene = dynamic(() => import("./GlobeScene"), { ssr: false });

export default function GlobeHero() {
  const [dismissed, setDismissed] = useState(false);
  const [use3d, setUse3d] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmallScreen = window.innerWidth < 768;
    setUse3d(!reducedMotion && !isSmallScreen);
    setReady(true);
  }, []);

  function handleEnter() {
    setDismissed(true);
  }

  if (!ready) {
    // Avoid a flash of the wrong variant while we detect capabilities.
    return <div className="-mt-20 h-screen w-full bg-navy" />;
  }

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          className="fixed inset-0 z-40 -mt-20 overflow-hidden bg-[#050a12]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {use3d ? (
            <GlobeScene onEnter={handleEnter} />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-[#050a12] via-navy to-navy">
              <div className="px-6 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-gold-light">
                  {LOCATIONS[0].place}
                </p>
                <h1 className="mt-2 font-serif text-3xl italic text-white">
                  KAFA Group
                </h1>
              </div>
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 top-24 flex flex-col items-center text-center">
            <p className="px-6 text-xs uppercase tracking-[0.35em] text-gold-light">
              Together Building Communities
            </p>
          </div>

          <button
            onClick={handleEnter}
            className="absolute inset-x-0 bottom-10 mx-auto flex w-fit flex-col items-center gap-1 text-xs uppercase tracking-[0.25em] text-white/60 transition hover:text-gold-light"
          >
            {use3d ? "Or click a marker above" : "Enter Site"}
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
