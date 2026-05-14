# Línea temporal de Eurovision

La ruta `/linea-tiempo/` y sus versiones localizadas `/{locale}/linea-tiempo/` muestran una línea temporal estática e interactiva del histórico de Eurovision.

## Arquitectura

- `src/lib/eurovisionTimeline.ts` construye las entradas desde `getEurovisionEditions()` y genera filtros por década, país anfitrión, ganador y tipo de hito.
- `src/data/eurovisionTimelineMilestones.ts` mantiene los hitos editoriales configurables y traducidos. No deben añadirse hitos que no estén documentados o que no se quieran mantener como dato editorial.
- `src/i18n/timelineLabels.ts` contiene todos los textos visibles de la UI para los idiomas configurados.
- `src/components/EurovisionTimelineApp.astro` renderiza la experiencia accesible y semántica.
- `public/timeline-filters.js` aplica filtros en cliente sin dependencias, sin llamadas externas y sin romper GitHub Pages.

## Reglas de mantenimiento

- No mezclar datos de Eurovision Junior ni otros concursos.
- No inventar sedes, ganadores, participantes ni hitos si el dataset o la configuración no los incluyen.
- Mantener cualquier texto visible en todos los idiomas configurados.
- Generar enlaces internos con `getLocalizedPath()` para respetar `base` e i18n.
- Mantener los filtros como mejora progresiva: la lista completa debe renderizarse aunque JavaScript no esté disponible.
