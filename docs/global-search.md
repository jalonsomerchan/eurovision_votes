# Buscador global de Eurovision

La ruta `/buscar/` y sus versiones localizadas `/{locale}/buscar/` ofrecen un buscador global ligero del portal.

## Arquitectura

- `src/lib/searchIndex.ts` genera el índice en build usando datos ya disponibles: países, ediciones, canciones, artistas, rankings y utilidades.
- `src/i18n/searchLabels.ts` contiene todos los textos visibles del buscador para los idiomas configurados.
- `src/components/GlobalSearchApp.astro` renderiza la página, incrusta el índice como JSON local y ofrece fallback con `noscript`.
- `public/global-search.js` filtra en cliente con APIs nativas del navegador, sin dependencias ni llamadas externas.

## Reglas de mantenimiento

- Los enlaces internos deben generarse con `getLocalizedPath()` para respetar `base` y GitHub Pages.
- No añadir dependencias de búsqueda mientras el índice siga siendo pequeño.
- No añadir textos visibles fuera de `searchLabels.ts`.
- La normalización debe ignorar tildes y mayúsculas para que búsquedas como `Suecia`, `suecia` o `suécia` funcionen igual.
- Si se añaden nuevas utilidades importantes, deben incorporarse a `toolItems()` con título traducido y palabras clave útiles.
