import { NextRequest, NextResponse } from "next/server";

type LocationResult = {
  town: string | null;
  countryCode: string | null;
};

export async function GET(request: NextRequest) {
  // ts will only be used at my house and ite east realistically 😭✌️
  return NextResponse.json<LocationResult>({ town: "Simei", countryCode: "SG" });

  // const lat = request.nextUrl.searchParams.get("lat");
  // const lon = request.nextUrl.searchParams.get("lon");

  // if (!lat || !lon) {
  //   return NextResponse.json<LocationResult>(
  //     { town: null, countryCode: null },
  //     { status: 400 },
  //   );
  // }

  // try {
  //   const res = await fetch(
  //     `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&zoom=10`,
  //     {
  //       headers: { "User-Agent": "MunchFind/1.0 (school project)" },
  //       cache: "no-store",
  //     },
  //   );

  //   if (!res.ok) return NextResponse.json<LocationResult>({ town: null, countryCode: null });

  //   const data = await res.json();
  //   const address = data.address ?? {};
  //   const town: string | null =
  //     address.city ?? address.town ?? address.village ?? address.suburb ?? null;
  //   const countryCode: string | null = address.country_code
  //     ? String(address.country_code).toUpperCase()
  //     : null;

  //   return NextResponse.json<LocationResult>({ town, countryCode });
  // } catch {
  //   return NextResponse.json<LocationResult>({ town: null, countryCode: null });
  // }
}
