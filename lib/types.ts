export type MealSummary = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string | null;
  strArea: string | null;
};

export type Meal = MealSummary & {
  strInstructions: string;
  strTags: string | null;
  strYoutube: string | null;
  strSource: string | null;
  strCountry: string | null;
  strMealAlternate: string | null;
  [key: string]: unknown;
};

export type Ingredient = {
  name: string;
  measure: string;
};
