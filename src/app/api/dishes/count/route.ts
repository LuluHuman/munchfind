import { NextRequest, NextResponse } from "next/server";
import { coordsFromParams } from "@/lib/coords";
import { matchingDishes } from "@/lib/dishes";
import { DEFAULT_FILTERS, type FilterState } from "@/lib/filters";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const coords = coordsFromParams(params);
  const distance = Number(params.get("distance"));

  if (Number.isNaN(distance)) {
    return NextResponse.json({ count: 0 }, { status: 400 });
  }

  const filters: FilterState = {
    budget: params.get("budget") ?? DEFAULT_FILTERS.budget,
    cuisines: params.getAll("cuisine"),
    dietary: params.get("dietary") ?? DEFAULT_FILTERS.dietary,
    distance,
  };

  return NextResponse.json({ count: matchingDishes(filters, coords).length });
}
