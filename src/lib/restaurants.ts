import type { Coords } from "@/lib/coords";
import { db } from "@/lib/db";
import { haversineKm } from "@/lib/geo";

// Used only while the user's coordinates haven't arrived yet (permission not
// yet granted/denied). Once we have a real fix, distances are computed live.
const FALLBACK_DISTANCE_RANGE = { min: 0, max: 20 };

const allCoordsStatement = db.prepare(`SELECT lat, lng FROM restaurants`);

function distancesFrom(coords: Coords): number[] {
  const rows = allCoordsStatement.all() as { lat: number; lng: number }[];
  return rows.map((row) => haversineKm(coords.lat, coords.lng, row.lat, row.lng));
}

export function getDistanceRange(coords: Coords | null): { min: number; max: number } {
  if (!coords) return FALLBACK_DISTANCE_RANGE;

  const distances = distancesFrom(coords);
  if (distances.length === 0) return FALLBACK_DISTANCE_RANGE;

  const min = Math.min(...distances);
  const max = Math.max(...distances);
  return {
    min: Math.floor(min * 10) / 10,
    max: Math.ceil(max * 10) / 10,
  };
}

export function countWithinDistance(maxKm: number, coords: Coords | null): number | null {
  if (!coords) return null;
  return distancesFrom(coords).filter((distance) => distance <= maxKm).length;
}
