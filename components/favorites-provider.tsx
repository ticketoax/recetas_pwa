"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { MealSummary } from "@/lib/types";

const STORAGE_KEY = "recetario:favoritos:v1";

type FavoritesContextValue = {
  favorites: MealSummary[];
  ready: boolean;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (meal: MealSummary) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function pickSummary(meal: MealSummary): MealSummary {
  return {
    idMeal: meal.idMeal,
    strMeal: meal.strMeal,
    strMealThumb: meal.strMealThumb,
    strCategory: meal.strCategory ?? null,
    strArea: meal.strArea ?? null,
  };
}

function parseFavorites(raw: string | null): MealSummary[] {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (item): item is MealSummary =>
          typeof item === "object" &&
          item !== null &&
          typeof (item as MealSummary).idMeal === "string" &&
          typeof (item as MealSummary).strMeal === "string" &&
          typeof (item as MealSummary).strMealThumb === "string",
      )
      .map(pickSummary);
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<MealSummary[]>([]);
  const [ready, setReady] = useState(false);

  // Read once on mount: localStorage is not available during server rendering.
  useEffect(() => {
    setFavorites(parseFavorites(window.localStorage.getItem(STORAGE_KEY)));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Storage full or blocked: favorites just stay in memory.
    }
  }, [favorites, ready]);

  // Keep several open tabs in sync.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      setFavorites(parseFavorites(event.newValue));
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleFavorite = useCallback((meal: MealSummary) => {
    setFavorites((current) => {
      const exists = current.some((item) => item.idMeal === meal.idMeal);
      return exists
        ? current.filter((item) => item.idMeal !== meal.idMeal)
        : [pickSummary(meal), ...current];
    });
  }, []);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites,
      ready,
      isFavorite: (id: string) => favorites.some((item) => item.idMeal === id),
      toggleFavorite,
    }),
    [favorites, ready, toggleFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites debe usarse dentro de <FavoritesProvider>");
  }
  return context;
}
