import { NextRequest, NextResponse } from "next/server";
import { countWithinDistance, DISTANCE_RANGE } from "@/lib/restaurants";

export async function GET(request: NextRequest) {
  const maxDistanceParam = request.nextUrl.searchParams.get("maxDistance");
  const maxDistance = maxDistanceParam ? Number(maxDistanceParam) : DISTANCE_RANGE.max;

  if (Number.isNaN(maxDistance)) {
    return NextResponse.json({ count: 0 }, { status: 400 });
  }

  return NextResponse.json({ count: countWithinDistance(maxDistance) });
}
