"use client";

import Link from "next/link";
import { useFavorites } from "@/components/favorites-provider";
import { MealCard } from "@/components/meal-card";

export function FavoritesGrid() {
  const { favorites, ready } = useFavorites();

  if (!ready) return null;

  if (favorites.length === 0) {
    return (
      <div className="border-2 border-line bg-accent-soft p-10 text-center">
        <p className="text-2xl font-black uppercase">La colección está vacía</p>
        <Link href="/" className="mt-5 inline-block border-2 border-line bg-panel px-5 py-3 text-xs font-black uppercase shadow-[4px_4px_0_#171917]">
          Explorar recetas
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="border-b border-line pb-2 text-sm text-muted">
        {favorites.length} {favorites.length === 1 ? "receta guardada" : "recetas guardadas"}
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {favorites.map((meal) => (
          <MealCard key={meal.idMeal} meal={meal} />
        ))}
      </div>
    </>
  );
}
