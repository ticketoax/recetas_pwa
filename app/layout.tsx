import type { Metadata, Viewport } from "next";
import { Open_Sans } from "next/font/google";
import { FavoritesProvider } from "@/components/favorites-provider";
import { Header } from "@/components/header";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Recetario",
    template: "%s · Recetario",
  },
  description: "Recetas de TheMealDB con buscador y favoritos.",
  applicationName: "Recetario",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#f5f1e8",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={openSans.variable}>
      <body>
        <FavoritesProvider>
          <Header />
          <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-10">
            {children}
          </main>
          <PwaRegister />
        </FavoritesProvider>
      </body>
    </html>
  );
}
