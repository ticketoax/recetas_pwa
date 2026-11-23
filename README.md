# Recetario

App web sencilla de recetas con **Next.js 16 + Tailwind CSS 4** y la API gratuita de [TheMealDB](https://www.themealdb.com/api.php). Diseño oscuro, sin animaciones.

## Funciones

- Home con todas las recetas en tarjetas, buscador y filtros por categoría.
- Detalle de cada receta: imagen, ingredientes con cantidades y pasos de preparación.
- Favoritos guardados en `localStorage`.
- PWA: `manifest.webmanifest`, service worker y botón «Instalar app» en la cabecera.

## Ejecutar

```bash
npm install
npm run dev      # http://localhost:3000
```

Producción:

```bash
npm run build
npm start
```

## PWA

- `app/manifest.ts` genera `/manifest.webmanifest`.
- `public/sw.js` cachea assets estáticos, el manifest y las imágenes de TheMealDB.
- `components/pwa-register.tsx` registra el service worker en producción.
- `components/install-button.tsx` muestra el botón de instalación cuando el navegador dispara `beforeinstallprompt` (por ejemplo, Chrome en HTTPS o localhost).

## Notas

TheMealDB no tiene un endpoint que devuelva todas las recetas, así que `lib/mealdb.ts` consulta `search.php?f=a…z` y elimina duplicados. Las respuestas se cachean 24 horas.

Colores en `app/globals.css`. Tipografía: Open Sans (pesos 300–800 e itálica) mediante `next/font/google`.
