"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Mesh } from "three";
import { latLonToVector3 } from "./coords";

export default function Pin({
  lat,
  lon,
  radius,
  name,
  place,
  onSelect,
}: {
  lat: number;
  lon: number;
  radius: number;
  name: string;
  place: string;
  onSelect: () => void;
}) {
  const position = latLonToVector3(lat, lon, radius);
  const ringRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      const t = clock.getElapsedTime();
      const scale = 1 + Math.sin(t * 2.2) * 0.15;
      ringRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={position}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color="#D4AF37" />
      </mesh>
      <mesh ref={ringRef}>
        <ringGeometry args={[0.045, 0.06, 32]} />
        <meshBasicMaterial color="#D4AF37" transparent opacity={0.6} />
      </mesh>
      {hovered && (
        <Html distanceFactor={6} style={{ pointerEvents: "none" }}>
          <div
            style={{
              transform: "translate(-50%, -140%)",
              background: "rgba(11,21,32,0.92)",
              border: "1px solid rgba(212,175,55,0.5)",
              borderRadius: 6,
              padding: "8px 12px",
              whiteSpace: "nowrap",
              fontFamily: "sans-serif",
            }}
          >
            <p style={{ margin: 0, color: "#D4AF37", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em" }}>
              {name}
            </p>
            <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.7)", fontSize: 11 }}>{place}</p>
            <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.5)", fontSize: 10 }}>Click to enter &rarr;</p>
          </div>
        </Html>
      )}
    </group>
  );
}
