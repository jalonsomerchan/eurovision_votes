# Mapa de países de Eurovision

La ruta `/mapa-paises/` y sus variantes localizadas `/{locale}/mapa-paises/` muestran un mapa vectorial interactivo de países de Eurovision.

## Arquitectura

- `src/lib/eurovisionMapData.ts` deriva las métricas históricas desde los perfiles de país ya existentes y genera formas SVG locales por país.
- `src/i18n/mapLabels.ts` contiene todos los textos visibles del mapa para los idiomas configurados.
- `src/components/EurovisionCountryMapApp.astro` renderiza el mapa SVG, el selector de métrica, controles de zoom, el resumen del país y la tabla accesible.
- `public/vector-map-engine.js` es una librería local ligera para ampliar, reducir, arrastrar y hacer pinch zoom con puntero/táctil.
- `public/eurovision-map.js` carga los países incrustados en la página, actualiza color/tamaño visual por métrica, etiquetas accesibles y el panel de resumen.

## Interacción

El mapa permite:

- Ampliar y reducir con botones.
- Ampliar y reducir con la rueda del ratón.
- Mover el mapa arrastrando con ratón o dedo.
- Hacer zoom táctil con dos dedos.
- Seleccionar países con clic, toque, Enter o espacio.

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
- Las formas SVG se generan en `countryPath()` para mantener el bundle simple y sin datasets grandes.
- Los enlaces internos deben generarse con `getLocalizedPath()` para respetar `base` y GitHub Pages.
- El mapa debe mantener siempre una tabla accesible con los mismos datos básicos.
- Si se añaden nuevas métricas, deben añadirse en `mapMetrics`, en `valueForMapMetric()`, en `mapLabels.ts`, en el componente y en `public/eurovision-map.js`.
