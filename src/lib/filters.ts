export type FilterState = {
  budget: string;
  cuisines: string[];
  dietary: string;
  distance: number;
};

export const DEFAULT_FILTERS: FilterState = {
  budget: "Any",
  cuisines: [],
  dietary: "None",
  distance: 5,
};

export const COOKIE_NAME = "mf_filters";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function parseFiltersValue(raw: string | undefined | null): FilterState {
  if (!raw) return DEFAULT_FILTERS;
  try {
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_FILTERS, ...parsed };
  } catch {
    return DEFAULT_FILTERS;
  }
}

export function readFilters(): FilterState {
  if (typeof document === "undefined") return DEFAULT_FILTERS;

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  if (!match) return DEFAULT_FILTERS;

  return parseFiltersValue(decodeURIComponent(match.slice(COOKIE_NAME.length + 1)));
}

export function writeFilters(filters: FilterState) {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify(filters),
  )}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}

export function cuisineLabel(cuisines: string[]) {
  return cuisines.length === 0 ? "Any" : cuisines.join(", ");
}

export function dietaryLabel(dietary: string) {
  return dietary === "None" ? "No restriction" : dietary;
}
