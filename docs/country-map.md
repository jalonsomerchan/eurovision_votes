# Mapa de países de Eurovision

La ruta `/mapa-paises/` y sus variantes localizadas `/{locale}/mapa-paises/` muestran un mapa interactivo de países de Eurovision con Leaflet.

## Arquitectura

- `src/lib/eurovisionMapData.ts` deriva las métricas históricas desde los perfiles de país ya existentes y prepara geometrías ligeras para Leaflet.
- `src/i18n/mapLabels.ts` contiene todos los textos visibles del mapa para los idiomas configurados.
- `src/components/EurovisionCountryMapApp.astro` renderiza el contenedor de Leaflet, el selector de métrica, controles de zoom, el resumen del país y la tabla accesible.
- `src/scripts/eurovisionCountryMap.ts` inicializa Leaflet, carga los países desde el JSON local incrustado en la página, pinta las capas vectoriales, actualiza la métrica visual y muestra el resumen.
- Leaflet se importa desde npm y se empaqueta con Vite/Astro. No se usan teselas, CDN ni servicios externos.

## Interacción

El mapa permite:

- Ampliar y reducir con botones.
- Ampliar y reducir con la rueda del ratón.
- Mover el mapa arrastrando con ratón o dedo.
- Hacer zoom táctil con dos dedos.
- Seleccionar países con clic, toque, Enter o espacio.
- Ver el nombre del país en tooltip.

## Métricas

El mapa permite alternar entre:

- Participaciones.
- Victorias.
- Mejor posición.
- Última participación.
- Debut.

La métrica de mejor posición se invierte internamente para que los mejores puestos tengan más peso visual.

## Reglas de mantenimiento

- No usar servicios externos de mapas, teselas remotas ni CDNs.
- Las coordenadas visuales viven en `countryPositions`; si un país no está definido, se usa una posición circular de fallback.
- Las geometrías se generan con `x`, `y`, `width` y `height` para mantener el índice pequeño y compatible con GitHub Pages.
- Los enlaces internos deben generarse con `getLocalizedPath()` para respetar `base` y GitHub Pages.
- El mapa debe mantener siempre una tabla accesible con los mismos datos básicos.
- Si se añaden nuevas métricas, deben añadirse en `mapMetrics`, en `valueForMapMetric()`, en `mapLabels.ts`, en el componente y en `src/scripts/eurovisionCountryMap.ts`.
