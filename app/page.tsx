import { InstallButton } from "@/components/install-button";
import Image from "next/image";
import { RecipeExplorer } from "@/components/recipe-explorer";
import { getAllMeals } from "@/lib/mealdb";

export const revalidate = 86400;

export default async function HomePage() {
  const meals = await getAllMeals();
  const featured = meals[0];

  return (
    <>
      <section className="relative mb-12 overflow-hidden rounded-[2rem] bg-forest text-panel">
        <div className="grid min-h-[420px] lg:grid-cols-[1.12fr_0.88fr]">
          <div className="relative z-10 flex flex-col justify-between p-8 sm:p-12 lg:p-14">
            <div>
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-[#d9c4ad]">
                Recetas para todos los días
              </p>
              <h1 className="display-title max-w-xl text-5xl font-bold sm:text-7xl">
                Cocina con
                <span className="block italic text-[#efad82]">buena intención.</span>
              </h1>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <a href="#recetas" className="rounded-full bg-panel px-5 py-3 text-sm font-bold text-forest">
                Explorar recetas
              </a>
              <InstallButton prominent />
            </div>
          </div>
          {featured ? (
            <div className="relative min-h-72 lg:min-h-full">
              <Image
                src={featured.strMealThumb}
                alt={featured.strMeal}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-forest/30 via-transparent to-transparent" />
              <div className="absolute bottom-5 right-5 max-w-56 rounded-2xl bg-panel/95 p-4 text-forest shadow-xl backdrop-blur">
                <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Recomendación</p>
                <p className="mt-1 text-sm font-bold leading-tight">{featured.strMeal}</p>
              </div>
            </div>
          ) : null}
        </div>
      </section>
      <RecipeExplorer meals={meals} />
    </>
  );
}
