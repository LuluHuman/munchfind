import { NextRequest, NextResponse } from "next/server";
import { coordsFromParams } from "@/lib/coords";
import { countWithinDistance, getDistanceRange } from "@/lib/restaurants";

export async function GET(request: NextRequest) {
  const coords = coordsFromParams(request.nextUrl.searchParams);
  const maxDistanceParam = request.nextUrl.searchParams.get("maxDistance");
  const maxDistance = maxDistanceParam
    ? Number(maxDistanceParam)
    : getDistanceRange(coords).max;

  if (Number.isNaN(maxDistance)) {
    return NextResponse.json({ count: 0 }, { status: 400 });
  }

  return NextResponse.json({ count: countWithinDistance(maxDistance, coords) });
}
