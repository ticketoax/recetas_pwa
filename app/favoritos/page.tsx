import type { Metadata } from "next";
import { FavoritesGrid } from "@/components/favorites-grid";

export const metadata: Metadata = {
  title: "Favoritos",
  description: "Recetas guardadas.",
};

export default function FavoritesPage() {
  return (
    <>
      <div className="mb-8 border-b-2 border-line pb-5">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-accent">Tu colección</p>
        <h1 className="display-title mt-2 text-6xl font-black uppercase">Favoritos</h1>
      </div>
      <FavoritesGrid />
    </>
  );
}
