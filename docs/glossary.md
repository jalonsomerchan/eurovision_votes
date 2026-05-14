# Glosario eurovisivo

El glosario añade contenido SEO estático e indexable con términos habituales de Eurovision.

## Rutas

- `/glosario/`: índice del glosario en el idioma por defecto.
- `/glosario/{slug}/`: ficha indexable de un término en español.
- `/{locale}/glosario/`: índice localizado para idiomas secundarios.
- `/{locale}/glosario/{slug}/`: ficha localizada con slug propio por idioma.

Todas las rutas deben generarse con helpers que respeten `base`, para no romper despliegues en GitHub Pages bajo subcarpeta.

## Datos y traducciones

- `src/config/eurovisionGlossary.ts` mantiene la lista pequeña de términos, slugs localizados, definiciones, notas y enlaces relacionados.
- `src/i18n/glossaryLabels.ts` mantiene los textos de UI y SEO auxiliares del glosario.
- `src/lib/glossaryRoutes.ts` centraliza la generación de URLs internas del glosario y sus páginas relacionadas.

Los términos deben estar completos para todos los idiomas configurados en `src/config/site.ts`.

## Convenciones editoriales

No afirmes reglas cambiantes como definitivas. Si un concepto depende de la edición, como finalistas directos, jurado, televoto o formato de semifinales, debe describirse como dato configurable de cada edición.

## Componentes

- `src/components/EurovisionGlossaryIndexApp.astro`: índice responsive sin JavaScript de cliente.
- `src/components/EurovisionGlossaryTermApp.astro`: ficha del término, definición, notas, sinónimos y enlaces internos.
- `src/components/GlossaryRelatedLinks.astro`: bloque reutilizable de enlaces relacionados.

La UI usa HTML semántico, enlaces reales, contraste mediante variables globales y funciona en modo claro/oscuro.