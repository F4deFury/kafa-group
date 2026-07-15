"use client";

import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

const EARTH_TEXTURE = "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg";
const EARTH_BUMP = "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png";

// Pure geometry — rotation is owned by the parent group in GlobeScene so that
// pins (siblings, not children, of this component) stay locked to the
// correct lat/lon as the planet turns.
export default function Earth({ radius = 2 }: { radius?: number }) {
  const [colorMap, bumpMap] = useLoader(THREE.TextureLoader, [EARTH_TEXTURE, EARTH_BUMP]);

  return (
    <group>
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.02}
          metalness={0.1}
          roughness={0.85}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[radius * 1.015, 64, 64]} />
        <meshBasicMaterial color="#5b8fd9" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}
