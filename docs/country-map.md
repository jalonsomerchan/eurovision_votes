# Mapa de países de Eurovision

La ruta `/mapa-paises/` y sus variantes localizadas `/{locale}/mapa-paises/` muestran un mapa visual interactivo de países de Eurovision.

## Arquitectura

- `src/lib/eurovisionMapData.ts` deriva las métricas históricas desde los perfiles de país ya existentes.
- `src/i18n/mapLabels.ts` contiene todos los textos visibles del mapa para los idiomas configurados.
- `src/components/EurovisionCountryMapApp.astro` renderiza el mapa, el selector de métrica, el resumen del país y la tabla accesible.
- `public/eurovision-map.js` actualiza tamaños de puntos, etiquetas accesibles y el panel de resumen con APIs nativas.

## Métricas

El mapa permite alternar entre:

- Participaciones.
- Victorias.
- Mejor posición.
- Última participación.
- Debut.

La métrica de mejor posición se invierte internamente para que los mejores puestos tengan más peso visual.

## Reglas de mantenimiento

- No usar mapas externos, CDNs ni librerías pesadas.
- Las coordenadas visuales viven en `countryPositions`; si un país no está definido, se usa una posición circular de fallback.
- Los enlaces internos deben generarse con `getLocalizedPath()` para respetar `base` y GitHub Pages.
- El mapa debe mantener siempre una tabla accesible con los mismos datos básicos.
- Si se añaden nuevas métricas, deben añadirse en `mapMetrics`, en `valueForMapMetric()`, en `mapLabels.ts`, en el componente y en `public/eurovision-map.js`.
