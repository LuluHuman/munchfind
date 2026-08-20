import FiltersForm from "@/app/filters/FiltersForm";
import { DISTANCE_RANGE } from "@/lib/restaurants";

export default function FiltersPage() {
  return <FiltersForm distanceRange={DISTANCE_RANGE} />;
}
