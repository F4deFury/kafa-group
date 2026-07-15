// Converts lat/lon (degrees) to a 3D position on a sphere of the given radius,
// using the standard equirectangular-texture convention (texture's seam runs
// along the antimeridian, +Z is toward 0,0).
export function latLonToVector3(lat: number, lon: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return [x, y, z];
}

export const LOCATIONS = [
  {
    id: "bridgeport",
    name: "KAFA Group HQ",
    place: "Bridgeport, Connecticut",
    lat: 41.1865,
    lon: -73.1952,
  },
  // A second pin (KG Enterprise) will be added here once its address is confirmed.
] as const;
