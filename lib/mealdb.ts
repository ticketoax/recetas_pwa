import type { Ingredient, Meal, MealSummary } from "@/lib/types";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";
const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");
/** The free API is static data, so a day of caching is plenty. */
const REVALIDATE_SECONDS = 60 * 60 * 24;

async function fetchMeals(path: string): Promise<Meal[]> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) return [];

    const data = (await response.json()) as { meals?: Meal[] | null };
    return data.meals ?? [];
  } catch {
    // A single failing request should never break the whole page.
    return [];
  }
}

export function toSummary(meal: Meal | MealSummary): MealSummary {
  return {
    idMeal: meal.idMeal,
    strMeal: meal.strMeal,
    strMealThumb: meal.strMealThumb,
    strCategory: meal.strCategory ?? null,
    strArea: meal.strArea ?? null,
  };
}

/**
 * TheMealDB has no "list every meal" endpoint, so we query by first letter
 * (a-z) and merge the results. This yields the full catalog (~790 recipes).
 */
export async function getAllMeals(): Promise<MealSummary[]> {
  const pages = await Promise.all(
    ALPHABET.map((letter) => fetchMeals(`/search.php?f=${letter}`)),
  );

  const byId = new Map<string, MealSummary>();

  for (const meal of pages.flat()) {
    if (!meal?.idMeal || !meal.strMeal || !meal.strMealThumb) continue;
    byId.set(meal.idMeal, toSummary(meal));
  }

  return [...byId.values()].sort((a, b) =>
    a.strMeal.localeCompare(b.strMeal, "es"),
  );
}

export async function getMealById(id: string): Promise<Meal | null> {
  if (!/^\d+$/.test(id)) return null;
  const meals = await fetchMeals(`/lookup.php?i=${id}`);
  return meals[0] ?? null;
}

export async function getMealsByCategory(
  category: string | null,
  excludeId: string,
  limit = 4,
): Promise<MealSummary[]> {
  if (!category) return [];

  const meals = await fetchMeals(`/filter.php?c=${encodeURIComponent(category)}`);

  return meals
    .filter((meal) => meal.idMeal !== excludeId && meal.strMeal && meal.strMealThumb)
    .slice(0, limit)
    .map((meal) => ({
      idMeal: meal.idMeal,
      strMeal: meal.strMeal,
      strMealThumb: meal.strMealThumb,
      strCategory: category,
      strArea: null,
    }));
}

export function getIngredients(meal: Meal): Ingredient[] {
  const ingredients: Ingredient[] = [];

  for (let index = 1; index <= 20; index += 1) {
    const name = meal[`strIngredient${index}`];
    const measure = meal[`strMeasure${index}`];

    if (typeof name !== "string" || !name.trim()) continue;

    ingredients.push({
      name: name.trim(),
      measure: typeof measure === "string" ? measure.trim() : "",
    });
  }

  return ingredients;
}

/** Splits the instruction blob into readable, numbered steps. */
export function getSteps(instructions: string | null | undefined): string[] {
  const clean = (instructions ?? "").replace(/\r\n/g, "\n").trim();
  if (!clean) return [];

  const byLine = clean
    .split(/\n+/)
    .map((step) => step.replace(/^(step\s*\d+[:.)-]?\s*)/i, "").trim())
    .filter(Boolean);

  if (byLine.length > 1) return byLine;

  const bySentence = clean
    .split(/(?<=[.!?])\s+(?=[¿¡"A-ZÁÉÍÓÚÑ])/)
    .map((step) => step.trim())
    .filter(Boolean);

  return bySentence.length > 1 ? bySentence : [clean];
}

export function getTags(tags: string | null | undefined): string[] {
  return (tags ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}
