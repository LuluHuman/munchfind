import { cookies } from "next/headers";
import FiltersForm from "@/app/filters/FiltersForm";
import { COORDS_COOKIE_NAME, parseCoordsValue } from "@/lib/coords";
import { getDistanceRange } from "@/lib/restaurants";

export default async function FiltersPage() {
  const cookieStore = await cookies();
  const coords = parseCoordsValue(cookieStore.get(COORDS_COOKIE_NAME)?.value);
  const distanceRange = getDistanceRange(coords);

  return <FiltersForm distanceRange={distanceRange} />;
}
