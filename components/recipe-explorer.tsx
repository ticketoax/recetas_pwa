"use client";

import { useMemo, useState } from "react";
import { MealCard } from "@/components/meal-card";
import type { MealSummary } from "@/lib/types";

const PAGE_SIZE = 48;
const ALL_CATEGORIES = "Todas";

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function RecipeExplorer({ meals }: { meals: MealSummary[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const categories = useMemo(() => {
    const unique = new Set(
      meals.map((meal) => meal.strCategory).filter((value): value is string => Boolean(value)),
    );
    return [ALL_CATEGORIES, ...[...unique].sort((a, b) => a.localeCompare(b, "es"))];
  }, [meals]);

  const filtered = useMemo(() => {
    const terms = normalize(query).split(/\s+/).filter(Boolean);

    return meals.filter((meal) => {
      if (category !== ALL_CATEGORIES && meal.strCategory !== category) return false;
      if (terms.length === 0) return true;

      const haystack = normalize(
        `${meal.strMeal} ${meal.strCategory ?? ""} ${meal.strArea ?? ""}`,
      );
      return terms.every((term) => haystack.includes(term));
    });
  }, [meals, query, category]);

  const shown = filtered.slice(0, visible);
  const remaining = filtered.length - shown.length;

  const updateQuery = (value: string) => {
    setQuery(value);
    setVisible(PAGE_SIZE);
  };

  const updateCategory = (value: string) => {
    setCategory(value);
    setVisible(PAGE_SIZE);
  };

  const clearFilters = () => {
    updateQuery("");
    updateCategory(ALL_CATEGORIES);
  };

  return (
    <div id="recetas">
      <div className="relative max-w-xl">
        <label htmlFor="recipe-search" className="sr-only">
          Buscar recetas
        </label>
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.8} className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          id="recipe-search"
          type="text"
          inputMode="search"
          value={query}
          onChange={(event) => updateQuery(event.target.value)}
          placeholder="Buscar receta, categoría o país"
          autoComplete="off"
          className="w-full rounded-full border border-line bg-panel py-4 pl-12 pr-5 text-sm shadow-[0_8px_30px_rgba(24,54,45,0.06)] outline-none placeholder:text-muted focus:border-accent"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => updateCategory(item)}
            aria-pressed={item === category}
            className={[
              "rounded-full border px-4 py-2 text-xs font-semibold transition",
              item === category
                ? "border-forest bg-forest text-panel"
                : "border-line bg-panel text-muted hover:border-accent hover:text-text",
            ].join(" ")}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-8 flex items-baseline justify-between border-b border-line pb-2">
        <p className="text-sm text-muted" aria-live="polite">
          {query || category !== ALL_CATEGORIES ? (
            <>
              <span className="font-semibold text-text">{filtered.length}</span> resultados
              {query ? ` para “${query}”` : ""}
            </>
          ) : (
            <>
              <span className="font-semibold text-text">{meals.length}</span> recetas
            </>
          )}
        </p>
        {query || category !== ALL_CATEGORIES ? (
          <button type="button" onClick={clearFilters} className="text-xs text-accent underline">
            Limpiar filtros
          </button>
        ) : null}
      </div>

      {shown.length > 0 ? (
        <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((meal) => (
            <MealCard key={meal.idMeal} meal={meal} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-md border border-dashed border-line p-10 text-center">
          <p className="font-semibold">No hay resultados</p>
          <button type="button" onClick={clearFilters} className="mt-4 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-night">
            Ver todas las recetas
          </button>
        </div>
      )}

      {remaining > 0 ? (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setVisible((current) => current + PAGE_SIZE)}
            className="rounded-md border border-line px-4 py-2 text-sm"
          >
            Ver más recetas
          </button>
          <p className="mt-2 text-xs text-muted">
            Mostrando {shown.length} de {filtered.length}
          </p>
        </div>
      ) : null}
    </div>
  );
}
