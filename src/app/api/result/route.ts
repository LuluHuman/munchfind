import { NextRequest, NextResponse } from "next/server";
import { COORDS_COOKIE_NAME, parseCoordsValue } from "@/lib/coords";
import { COOKIE_NAME, parseFiltersValue } from "@/lib/filters";
import { pickRandomDish } from "@/lib/dishes";

export async function GET(request: NextRequest) {
  const filters = parseFiltersValue(request.cookies.get(COOKIE_NAME)?.value);
  const coords = parseCoordsValue(request.cookies.get(COORDS_COOKIE_NAME)?.value);
  const { dish, poolSize } = pickRandomDish(filters, coords);

  return NextResponse.json({ dish, poolSize });
}
