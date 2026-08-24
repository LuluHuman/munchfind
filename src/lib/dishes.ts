import type { Coords } from "@/lib/coords";
import { db } from "@/lib/db";
import { haversineKm } from "@/lib/geo";
import type { FilterState } from "@/lib/filters";

export type Dish = {
  id: number;
  name: string;
  price: number;
  vegetarian: boolean;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string | null;
  cuisines: string[];
  distanceInKm: number | null;
  rating: number | null;
  halal: boolean;
};

type DishRow = {
  id: number;
  dish_name: string;
  price: number;
  vegetarian: number;
  restaurant_id: string;
  restaurant_name: string;
  restaurant_address: string | null;
  cuisines: string;
  lat: number;
  lng: number;
  rating: number | null;
  halal: number;
};

function toDish(row: DishRow, coords: Coords | null): Dish {
  return {
    id: row.id,
    name: row.dish_name,
    price: row.price,
    vegetarian: row.vegetarian === 1,
    restaurantId: row.restaurant_id,
    restaurantName: row.restaurant_name,
    restaurantAddress: row.restaurant_address,
    cuisines: row.cuisines ? row.cuisines.split(",") : [],
    distanceInKm: coords ? haversineKm(coords.lat, coords.lng, row.lat, row.lng) : null,
    rating: row.rating,
    halal: row.halal === 1,
  };
}

function matchesCuisine(dish: Dish, cuisines: string[]): boolean {
  if (cuisines.length === 0) return true;
  return dish.cuisines.some((tag) =>
    cuisines.some(
      (option) =>
        tag.toLowerCase().includes(option.toLowerCase()) ||
        option.toLowerCase().includes(tag.toLowerCase()),
    ),
  );
}

function matchesDietary(dish: Dish, dietary: string): boolean {
  switch (dietary) {
    case "Halal":
      return dish.halal;
    case "Vegetarian":
      return dish.vegetarian;
    default:
      return true;
  }
}

function matchesDistance(dish: Dish, maxKm: number): boolean {
  // No fix on the user yet — don't filter on distance we can't compute.
  if (dish.distanceInKm === null) return true;
  return dish.distanceInKm <= maxKm;
}

function budgetClause(budget: string): { clause: string; params: number[] } {
  switch (budget) {
    case "Under S$8":
      return { clause: "AND d.price < ?", params: [8] };
    case "S$8-15":
      return { clause: "AND d.price >= ? AND d.price <= ?", params: [8, 15] };
    case "S$15-25":
      return { clause: "AND d.price > ? AND d.price <= ?", params: [15, 25] };
    default:
      return { clause: "", params: [] };
  }
}

const BASE_QUERY = `
  SELECT d.id, d.dish_name, d.price, d.vegetarian, d.restaurant_id,
         r.name AS restaurant_name, r.address AS restaurant_address,
         r.cuisines, r.lat, r.lng, r.rating, r.halal
  FROM dishes d
  JOIN restaurants r ON r.id = d.restaurant_id
  WHERE 1=1
`;

export function matchingDishes(filters: FilterState, coords: Coords | null): Dish[] {
  const budget = budgetClause(filters.budget);
  const rows = db.prepare(`${BASE_QUERY} ${budget.clause}`).all(...budget.params) as DishRow[];

  return rows
    .map((row) => toDish(row, coords))
    .filter(
      (dish) =>
        matchesDistance(dish, filters.distance) &&
        matchesCuisine(dish, filters.cuisines) &&
        matchesDietary(dish, filters.dietary),
    );
}

export function pickRandomDish(
  filters: FilterState,
  coords: Coords | null,
): { dish: Dish | null; poolSize: number } {
  const pool = matchingDishes(filters, coords);
  if (pool.length === 0) return { dish: null, poolSize: 0 };
  return { dish: pool[Math.floor(Math.random() * pool.length)], poolSize: pool.length };
}
