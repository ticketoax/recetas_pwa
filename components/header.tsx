"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFavorites } from "@/components/favorites-provider";
import { InstallButton } from "@/components/install-button";

const links = [
  { href: "/", label: "Recetas" },
  { href: "/favoritos", label: "Favoritos" },
];

export function Header() {
  const pathname = usePathname();
  const { favorites, ready } = useFavorites();

  return (
    <header className="sticky top-0 z-40 border-b border-line/90 bg-night/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link href="/" className="display-title text-2xl font-bold" aria-label="Recetario, inicio">
          Mesa<span className="text-accent">.</span>
        </Link>

        <div className="flex items-stretch">
          <InstallButton />
          <nav aria-label="Navegación principal" className="ml-3 flex items-center gap-1 rounded-full border border-line bg-panel p-1">
            {links.map((link) => {
              const active =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold",
                    active
                      ? "bg-forest text-panel"
                      : "text-muted hover:text-text",
                  ].join(" ")}
                >
                  {link.label}
                  {link.href === "/favoritos" && ready && favorites.length > 0 ? (
                    <span
                      className={[
                        "min-w-5 rounded-full px-1.5 text-center text-[11px] font-bold leading-5",
                        active ? "bg-panel/15 text-panel" : "bg-accent text-panel",
                      ].join(" ")}
                    >
                      {favorites.length}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
