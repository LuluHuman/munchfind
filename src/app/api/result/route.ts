import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, parseFiltersValue } from "@/lib/filters";
import { pickRandomDish } from "@/lib/dishes";

export async function GET(request: NextRequest) {
  const filters = parseFiltersValue(request.cookies.get(COOKIE_NAME)?.value);
  const { dish, poolSize } = pickRandomDish(filters);

  return NextResponse.json({ dish, poolSize });
}
