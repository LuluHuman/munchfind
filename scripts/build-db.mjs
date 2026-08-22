#!/usr/bin/env node
import { DatabaseSync } from "node:sqlite";
import { existsSync, readdirSync, readFileSync, unlinkSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "src", "data");
const restaurantsDir = path.join(dataDir, "restaurants");
const dbPath = path.join(dataDir, "munchfind.sqlite");

const EARTH_RADIUS_KM = 6371;
const HOME_CLUSTER_RADIUS_KM = 5;

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function haversineKm(lat1, lng1, lat2, lng2) {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

function centroid(points) {
  const lat = points.reduce((sum, p) => sum + p.lat, 0) / points.length;
  const lng = points.reduce((sum, p) => sum + p.lng, 0) / points.length;
  return { lat, lng };
}

// The scrape spans two disjoint clusters (a large Tampines/Bedok cluster and a
// small, distant Downtown Core cluster). A plain centroid falls in the empty
// gap between them, so recenter on the dominant cluster: take an initial
// centroid, then refine using only the points within range of it.
function findHomePoint(points) {
  const initial = centroid(points);
  const nearby = points.filter(
    (p) => haversineKm(initial.lat, initial.lng, p.lat, p.lng) <= HOME_CLUSTER_RADIUS_KM,
  );
  return centroid(nearby.length > 0 ? nearby : points);
}

const files = readdirSync(restaurantsDir).filter((file) => file.endsWith(".json"));

const restaurants = [];
for (const file of files) {
  const raw = JSON.parse(readFileSync(path.join(restaurantsDir, file), "utf8"));
  if (raw.error) continue;

  const lat = raw.address?.lat;
  const lng = raw.address?.lng;
  if (typeof lat !== "number" || typeof lng !== "number") continue;
  if (raw.currency?.code !== "SGD") continue;

  restaurants.push({
    id: raw.ID,
    name: raw.name ?? "Unknown restaurant",
    address: raw.address?.combined_address ?? null,
    cuisines: (raw.cuisine ?? "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    lat,
    lng,
    rating: raw.rating ?? null,
    halal: (raw.translationTags ?? []).includes("halal"),
    menu: raw.menu?.categories ?? [],
  });
}

const homePoint = findHomePoint(restaurants.map((r) => ({ lat: r.lat, lng: r.lng })));

if (existsSync(dbPath)) unlinkSync(dbPath);

const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE restaurants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    cuisines TEXT NOT NULL,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    distance_in_km REAL NOT NULL,
    rating REAL,
    halal INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE dishes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dish_name TEXT NOT NULL,
    price REAL NOT NULL,
    vegetarian INTEGER NOT NULL DEFAULT 0,
    restaurant_id TEXT NOT NULL REFERENCES restaurants(id)
  );

  CREATE INDEX idx_dishes_restaurant_id ON dishes(restaurant_id);
  CREATE INDEX idx_restaurants_distance ON restaurants(distance_in_km);
`);

const insertRestaurant = db.prepare(
  `INSERT INTO restaurants (id, name, address, cuisines, lat, lng, distance_in_km, rating, halal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
);
const insertDish = db.prepare(
  `INSERT INTO dishes (dish_name, price, vegetarian, restaurant_id) VALUES (?, ?, ?, ?)`,
);

let dishCount = 0;
for (const restaurant of restaurants) {
  const distanceInKm = haversineKm(homePoint.lat, homePoint.lng, restaurant.lat, restaurant.lng);

  insertRestaurant.run(
    restaurant.id,
    restaurant.name,
    restaurant.address,
    restaurant.cuisines.join(","),
    restaurant.lat,
    restaurant.lng,
    distanceInKm,
    restaurant.rating,
    restaurant.halal ? 1 : 0,
  );

  const seenItemIds = new Set();
  for (const category of restaurant.menu) {
    for (const item of category.items ?? []) {
      if (seenItemIds.has(item.ID)) continue;
      seenItemIds.add(item.ID);

      const priceInMinorUnit = item.priceInMinorUnit ?? item.priceV2?.amountInMinor;
      if (typeof priceInMinorUnit !== "number") continue;

      const price = priceInMinorUnit / 100;
      // Above this, real menu items are still legitimate (party bundles, whole
      // cakes, wine) — but higher still catches known scrape artifacts, e.g. an
      // operational "Be Back at 1030AM" notice mis-parsed as a $1030 item.
      if (price >= 500) continue;

      const vegetarian = (item.dietary ?? []).includes("dietaryPreferences_vegetarian");

      insertDish.run(item.name, price, vegetarian ? 1 : 0, restaurant.id);
      dishCount++;
    }
  }
}

db.close();

console.log(`Built ${path.relative(process.cwd(), dbPath)}`);
console.log(`  home point: ${homePoint.lat.toFixed(5)}, ${homePoint.lng.toFixed(5)}`);
console.log(`  restaurants: ${restaurants.length}`);
console.log(`  dishes: ${dishCount}`);
