"use client";

import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "@/components/favorite-button";
import type { MealSummary } from "@/lib/types";

type MealCardProps = {
  meal: MealSummary;
  priority?: boolean;
};

export function MealCard({ meal, priority = false }: MealCardProps) {
  const meta = [meal.strCategory, meal.strArea].filter(Boolean).join(" · ");

  return (
    <article className="group relative">
      <Link href={`/receta/${meal.idMeal}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.35rem] bg-accent-soft shadow-[0_10px_28px_rgba(24,54,45,0.07)]">
          <Image
            src={meal.strMealThumb}
            alt={meal.strMeal}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
            priority={priority}
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        </div>
        <div className="px-1 pb-2 pt-3">
          <p className="truncate text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
            {meta || "Receta"}
          </p>
          <h3 className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug group-hover:text-accent">
            {meal.strMeal}
          </h3>
        </div>
      </Link>

      <FavoriteButton meal={meal} className="absolute right-2 top-2" />
    </article>
  );
}
