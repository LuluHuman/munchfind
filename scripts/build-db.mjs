#!/usr/bin/env node
import { DatabaseSync } from "node:sqlite";
import { existsSync, readFileSync, unlinkSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "src", "data");
const dbPath = path.join(dataDir, "munchfind.sqlite");

const restaurants = JSON.parse(
  readFileSync(path.join(dataDir, "the_big_big_restaurant_list.json"), "utf8"),
);

const dishRows = readFileSync(path.join(dataDir, "dishes.csv"), "utf8").trim().split("\n");
dishRows.shift(); // header
const dishes = dishRows.map((line) => {
  const [dishName, price, restaurantId] = line.split(",");
  return { dishName, price: Number(price), restaurantId };
});

if (existsSync(dbPath)) unlinkSync(dbPath);

const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE restaurants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    cuisines TEXT NOT NULL,
    distance_in_km REAL NOT NULL,
    rating REAL,
    halal INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE dishes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dish_name TEXT NOT NULL,
    price REAL NOT NULL,
    restaurant_id TEXT NOT NULL REFERENCES restaurants(id)
  );

  CREATE INDEX idx_dishes_restaurant_id ON dishes(restaurant_id);
  CREATE INDEX idx_restaurants_distance ON restaurants(distance_in_km);
`);

const insertRestaurant = db.prepare(
  `INSERT OR IGNORE INTO restaurants (id, name, cuisines, distance_in_km, rating, halal) VALUES (?, ?, ?, ?, ?, ?)`,
);

let restaurantCount = 0;
for (const restaurant of restaurants) {
  const distanceInKm = restaurant.merchantBrief?.distanceInKm;
  if (typeof distanceInKm !== "number") continue;

  const name =
    restaurant.address?.name ??
    [restaurant.chainName, restaurant.branchName].filter(Boolean).join(" - ") ??
    "Unknown restaurant";

  const cuisines = (restaurant.merchantBrief?.cuisine ?? []).join(",");
  const rating = restaurant.merchantBrief?.rating ?? null;
  const halal = restaurant.merchantBrief?.halal ? 1 : 0;

  const result = insertRestaurant.run(restaurant.id, name, cuisines, distanceInKm, rating, halal);
  if (result.changes > 0) restaurantCount++;
}

const insertDish = db.prepare(
  `INSERT INTO dishes (dish_name, price, restaurant_id) SELECT ?, ?, id FROM restaurants WHERE id = ?`,
);

let dishCount = 0;
for (const dish of dishes) {
  if (!dish.dishName || Number.isNaN(dish.price)) continue;
  const result = insertDish.run(dish.dishName, dish.price, dish.restaurantId);
  if (result.changes > 0) dishCount++;
}

db.close();

console.log(`Built ${path.relative(process.cwd(), dbPath)}`);
console.log(`  restaurants: ${restaurantCount}`);
console.log(`  dishes: ${dishCount}`);
