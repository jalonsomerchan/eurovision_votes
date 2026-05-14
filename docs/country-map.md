# Mapa de países de Eurovision

La ruta `/mapa-paises/` y sus variantes localizadas `/{locale}/mapa-paises/` muestran un mapa interactivo mundial de países de Eurovision con Leaflet.

## Arquitectura

- `src/lib/eurovisionMapData.ts` deriva las métricas históricas desde los perfiles de país ya existentes y añade coordenadas centrales por país para colocar marcadores.
- `src/i18n/mapLabels.ts` contiene todos los textos visibles del mapa para los idiomas configurados.
- `src/components/EurovisionCountryMapApp.astro` renderiza el contenedor de Leaflet, el selector de métrica, controles de zoom, el resumen del país y la tabla accesible.
- `public/eurovision-map.js` inicializa Leaflet sobre un mapa mundial completo, añade un marcador interactivo por país de Eurovision y actualiza el resumen.
- Leaflet se carga desde CDN con SRI. Las teselas base usan CARTO desde `basemaps.cartocdn.com`.
- El script elige `light_all` o `dark_all` según el tema activo del sitio, `color-scheme`, `data-theme`, clase del documento o `prefers-color-scheme`, y actualiza la capa si cambia el tema.

## Interacción

El mapa permite:

- Ampliar y reducir con botones.
- Ampliar y reducir con la rueda del ratón después de enfocar/interactuar con el mapa, según Leaflet.
- Mover el mapa arrastrando con ratón o dedo.
- Hacer zoom táctil con dos dedos.
- Seleccionar países con clic, toque, Enter o espacio sobre cada marcador.
- Ver el nombre del país en tooltip.

## Métricas

El mapa permite alternar entre:

- Participaciones.
- Victorias.
- Mejor posición.
- Última participación.
- Debut.

La métrica de mejor posición se invierte internamente para que los mejores puestos tengan más peso visual. En el mapa, el valor de la métrica modifica el tamaño de cada marcador.

## Reglas de mantenimiento

- Leaflet puede cargarse desde CDN cuando sea necesario para mejorar la visualización del mapa.
- Los datos históricos siguen saliendo de los helpers locales del proyecto.
- Las coordenadas de marcador viven en `countryCoordinates` dentro de `src/lib/eurovisionMapData.ts`.
- Los enlaces internos deben generarse con `getLocalizedPath()` para respetar `base` y GitHub Pages.
- El mapa debe mantener siempre una tabla accesible con los mismos datos básicos.
- Si se cambia el sistema de tema del sitio, revisar `getCurrentTheme()` y `watchThemeChanges()` en `public/eurovision-map.js`.
- Si se añaden nuevas métricas, deben añadirse en `mapMetrics`, en `valueForMapMetric()`, en `mapLabels.ts`, en el componente y en `public/eurovision-map.js`.
