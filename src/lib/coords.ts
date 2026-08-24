export type Coords = { lat: number; lng: number };

export const COORDS_COOKIE_NAME = "mf_coords";
const COORDS_COOKIE_MAX_AGE = 60;

export function parseCoordsValue(raw: string | undefined | null): Coords | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed.lat === "number" && typeof parsed.lng === "number") {
      return { lat: parsed.lat, lng: parsed.lng };
    }
    return null;
  } catch {
    return null;
  }
}

export function writeCoords(coords: Coords) {
  if (typeof document === "undefined") return;
  document.cookie = `${COORDS_COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify(coords),
  )}; path=/; max-age=${COORDS_COOKIE_MAX_AGE}; samesite=lax`;
}

export function coordsFromParams(params: URLSearchParams | Record<string, string | null | undefined>): Coords | null {
  const get = (key: string) => (params instanceof URLSearchParams ? params.get(key) : params[key]);
  const latRaw = get("lat");
  const lngRaw = get("lng");
  if (latRaw == null || lngRaw == null) return null;

  const lat = Number(latRaw);
  const lng = Number(lngRaw);
  if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
  return null;
}
