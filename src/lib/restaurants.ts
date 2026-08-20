import { db } from "@/lib/db";

const range = db
  .prepare(`SELECT MIN(distance_in_km) AS min, MAX(distance_in_km) AS max FROM restaurants`)
  .get() as { min: number; max: number };

export const DISTANCE_RANGE = {
  min: Math.floor(range.min * 10) / 10,
  max: Math.ceil(range.max * 10) / 10,
};

const countStatement = db.prepare(
  `SELECT COUNT(*) AS count FROM restaurants WHERE distance_in_km <= ?`,
);

export function countWithinDistance(maxKm: number): number {
  const result = countStatement.get(maxKm) as { count: number };
  return result.count;
}
