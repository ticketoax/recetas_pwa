"use client";

import { useState } from "react";
import type { Ingredient } from "@/lib/types";

export function IngredientsList({ ingredients }: { ingredients: Ingredient[] }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (index: number) => {
    setChecked((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <ul className="divide-y divide-line">
      {ingredients.map((ingredient, index) => {
        const isChecked = checked.has(index);

        return (
          <li key={`${ingredient.name}-${index}`}>
            <label className="flex cursor-pointer items-start gap-3 py-3">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggle(index)}
                className="mt-0.5 size-4 shrink-0 accent-accent"
              />
              <span className="text-sm leading-relaxed">
                <span className={isChecked ? "text-muted line-through" : ""}>
                  {ingredient.name}
                </span>
                {ingredient.measure ? (
                  <span className="ml-2 text-muted">{ingredient.measure}</span>
                ) : null}
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
