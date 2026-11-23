"use client";

import { useFavorites } from "@/components/favorites-provider";
import type { MealSummary } from "@/lib/types";

type FavoriteButtonProps = {
  meal: MealSummary;
  withLabel?: boolean;
  className?: string;
};

export function FavoriteButton({ meal, withLabel = false, className = "" }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(meal.idMeal);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(meal)}
      aria-pressed={active}
      aria-label={
        active
          ? `Quitar ${meal.strMeal} de favoritos`
          : `Guardar ${meal.strMeal} en favoritos`
      }
      className={[
        "inline-flex items-center justify-center gap-2 border",
        withLabel
          ? "rounded-full border border-line bg-panel px-4 py-2.5 text-sm font-semibold"
          : "size-10 rounded-full border border-line/70 bg-panel/95 text-accent shadow-[0_6px_18px_rgba(24,54,45,0.12)]",
        active
          ? "border-accent text-accent"
          : "border-line text-muted hover:text-text",
        className,
      ].join(" ")}
    >
      <HeartIcon filled={active} className={withLabel ? "size-5" : "size-[18px]"} />
      {withLabel ? (
        <span>{active ? "En favoritos" : "Guardar en favoritos"}</span>
      ) : null}
    </button>
  );
}

function HeartIcon({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.8 5.6a5.6 5.6 0 0 0-7.9 0L12 6.5l-.9-.9a5.6 5.6 0 0 0-7.9 7.9l.9.9L12 21l7.9-6.6.9-.9a5.6 5.6 0 0 0 0-7.9Z" />
    </svg>
  );
}
