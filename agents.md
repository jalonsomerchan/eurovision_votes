# AGENTS.md

## Regla principal

Este repositorio es una plantilla base para crear proyectos con Astro. Cualquier agente IA que trabaje aquí debe conservar la plantilla reutilizable, ligera, traducible y preparada para GitHub Pages.

Antes de modificar páginas, layouts, componentes, estilos, SEO, rutas, i18n o despliegue, el agente debe consultar estas guías:

- `docs/design-system.md`
- `docs/template-usage.md`
- `docs/i18n-guide.md`
- `docs/github-pages.md`
- `docs/testing-guide.md`

## Prioridad

Estas instrucciones tienen prioridad sobre estilos antiguos del proyecto, salvo que el usuario indique lo contrario en la tarea concreta.

## Principios obligatorios

- Mobile first.
- Diseño profesional, limpio, moderno y vistoso.
- Light mode y dark mode en todos los componentes nuevos.
- No usar fuentes externas de Google Fonts, Adobe Fonts ni CDNs similares.
- Usar system fonts.
- Evitar dependencias innecesarias.
- Cuidar Core Web Vitals.
- HTML semántico.
- Buen SEO técnico.
- Accesibilidad mínima WCAG AA.
- Componentes reutilizables.
- Variables CSS globales para colores, radios, sombras, espaciados y transiciones.
- Mantener el soporte i18n de Astro.
- Mantener compatibilidad con GitHub Pages en subcarpeta.
- Mantener tests smoke simples y útiles.

## Arquitectura actual

La plantilla usa:

- Astro 6.
- Tailwind CSS 4 mediante `@tailwindcss/vite`.
- MDX.
- `@astrojs/sitemap`.
- i18n nativo de Astro.
- Traducciones en JSON por idioma.
- GitHub Actions para CI y GitHub Pages.
- Tests básicos con `node:test`.

## Estructura importante

- `astro.config.mjs`: configuración de Astro, `site`, `base`, i18n e integraciones.
- `src/config/site.ts`: configuración central del sitio e idiomas.
- `src/i18n/ui.ts`: helpers de traducción y rutas localizadas.
- `src/i18n/translations/*.json`: textos traducibles.
- `src/layouts/BaseLayout.astro`: HTML base, SEO, Open Graph, header y footer.
- `src/components/`: componentes reutilizables.
- `src/pages/index.astro`: home del idioma por defecto.
- `src/pages/[locale]/index.astro`: home de idiomas no predeterminados.
- `src/pages/robots.txt.ts`: robots dinámico.
- `src/pages/manifest.webmanifest.ts`: manifest dinámico.
- `.github/workflows/ci.yml`: checks en pull requests.
- `.github/workflows/pages.yml`: despliegue en GitHub Pages.
- `tests/smoke.test.mjs`: comprobaciones básicas.

## Reglas para modificar el template

### No romper GitHub Pages

La web puede desplegarse en una subcarpeta como `/astro-template/`. No crear enlaces internos o assets con rutas absolutas duras tipo `/archivo.svg` si deben respetar `base`.

Usar helpers existentes cuando aplique:

- `getLocalizedPath('/', locale)` para URLs internas localizadas.
- `import.meta.env.BASE_URL` para assets y rutas que dependan del `base`.

### No romper i18n

No meter textos visibles directamente en componentes o páginas si son parte de la UI reutilizable. Añadir claves a los JSON de traducciones.

Cuando se añada una clave nueva:

1. Añadirla en `src/i18n/translations/es.json`.
2. Añadirla en `src/i18n/translations/en.json`.
3. Usarla con `useTranslations(locale)`.
4. Mantener las claves alineadas entre idiomas.

### No añadir dependencias sin necesidad

Esta es una plantilla. Evitar librerías nuevas salvo que la tarea lo requiera claramente. Preferir Astro, TypeScript, CSS, Tailwind y APIs del navegador.

### Mantener tests suaves

Los tests no deben validar detalles frágiles de diseño. Deben comprobar que la plantilla no explota y que los elementos base existen.

Cuando se añada infraestructura nueva, actualizar `tests/smoke.test.mjs` con comprobaciones mínimas.

### Mantener documentación actualizada

Si se cambia una convención importante, actualizar el documento correspondiente en `docs/` y, si afecta a agentes IA, también este archivo.

## Checklist antes de terminar una tarea

- ¿Sigue funcionando el idioma por defecto en `/`?
- ¿Siguen funcionando los idiomas secundarios como `/en/`?
- ¿Las rutas internas respetan GitHub Pages con subcarpeta?
- ¿Los textos nuevos están en los JSON de traducción?
- ¿El cambio respeta `docs/design-system.md`?
- ¿Se mantiene `npm test` como comprobación básica?
- ¿Se actualizó la documentación si cambió una convención?

## Comandos útiles

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
npm run clean
```

## Qué evitar

- Convertir la plantilla en un proyecto demasiado específico.
- Añadir frameworks de UI pesados sin necesidad.
- Duplicar layouts por idioma si se puede resolver con traducciones.
- Usar rutas absolutas que fallen en GitHub Pages.
- Saltarse los JSON de traducción.
- Borrar tests smoke porque parezcan simples.
- Usar fuentes externas.
- Añadir JavaScript de cliente si no aporta valor real.
