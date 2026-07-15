"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import type { Group } from "three";
import gsap from "gsap";
import Earth from "./Earth";
import Pin from "./Pin";
import { LOCATIONS } from "./coords";

const RADIUS = 2;

function RotatingSystem({ onSelect }: { onSelect: (id: string) => void }) {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.035;
    }
  });

  return (
    <group ref={groupRef}>
      <Earth radius={RADIUS} />
      {LOCATIONS.map((loc) => (
        <Pin
          key={loc.id}
          lat={loc.lat}
          lon={loc.lon}
          radius={RADIUS}
          name={loc.name}
          place={loc.place}
          onSelect={() => onSelect(loc.id)}
        />
      ))}
    </group>
  );
}

// Watches a ref (rather than a re-rendered prop) so the gsap tween starts
// exactly once, on the frame after a pin is clicked, without re-mounting
// the Canvas or fighting React's render cycle.
function ZoomHandler({ zoomingRef }: { zoomingRef: React.MutableRefObject<boolean> }) {
  const { camera } = useThree();
  const started = useRef(false);

  useFrame(() => {
    if (zoomingRef.current && !started.current) {
      started.current = true;
      gsap.to(camera.position, {
        z: 0.9,
        duration: 1.5,
        ease: "power3.in",
      });
    }
  });

  return null;
}

export default function GlobeScene({
  onEnter,
}: {
  onEnter: (locationId: string) => void;
}) {
  const zoomingRef = useRef(false);

  function handleSelect(id: string) {
    if (zoomingRef.current) return;
    zoomingRef.current = true;
    // Let the camera tween play, then hand off to the parent to cross-fade
    // into the rest of the homepage.
    window.setTimeout(() => onEnter(id), 1500);
  }

  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true }} dpr={[1, 1.75]}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} />
      <Stars radius={80} depth={40} count={3000} factor={2.5} saturation={0} fade speed={0.4} />
      <RotatingSystem onSelect={handleSelect} />
      <ZoomHandler zoomingRef={zoomingRef} />
    </Canvas>
  );
}
