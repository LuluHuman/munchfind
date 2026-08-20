import { db } from "@/lib/db";
import type { FilterState } from "@/lib/filters";

export type Dish = {
  id: number;
  name: string;
  price: number;
  restaurantId: string;
  restaurantName: string;
  cuisines: string[];
  distanceInKm: number;
  rating: number | null;
  halal: boolean;
};

type DishRow = {
  id: number;
  dish_name: string;
  price: number;
  restaurant_id: string;
  restaurant_name: string;
  cuisines: string;
  distance_in_km: number;
  rating: number | null;
  halal: number;
};

function toDish(row: DishRow): Dish {
  return {
    id: row.id,
    name: row.dish_name,
    price: row.price,
    restaurantId: row.restaurant_id,
    restaurantName: row.restaurant_name,
    cuisines: row.cuisines ? row.cuisines.split(",") : [],
    distanceInKm: row.distance_in_km,
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
      return dish.cuisines.some((tag) => /veg/i.test(tag));
    case "Gluten-free":
      return dish.cuisines.some((tag) => /gluten/i.test(tag));
    default:
      return true;
  }
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
  SELECT d.id, d.dish_name, d.price, d.restaurant_id,
         r.name AS restaurant_name, r.cuisines, r.distance_in_km, r.rating, r.halal
  FROM dishes d
  JOIN restaurants r ON r.id = d.restaurant_id
  WHERE r.distance_in_km <= ?
`;

export function matchingDishes(filters: FilterState): Dish[] {
  const budget = budgetClause(filters.budget);
  const rows = db
    .prepare(`${BASE_QUERY} ${budget.clause}`)
    .all(filters.distance, ...budget.params) as DishRow[];

  return rows
    .map(toDish)
    .filter(
      (dish) => matchesCuisine(dish, filters.cuisines) && matchesDietary(dish, filters.dietary),
    );
}

export function pickRandomDish(filters: FilterState): { dish: Dish | null; poolSize: number } {
  const pool = matchingDishes(filters);
  if (pool.length === 0) return { dish: null, poolSize: 0 };
  return { dish: pool[Math.floor(Math.random() * pool.length)], poolSize: pool.length };
}
