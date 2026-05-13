# Astro Template

Plantilla base para crear proyectos con Astro sin repetir configuración inicial.

Incluye:

- Astro 6
- Tailwind CSS 4
- MDX
- Sitemap
- i18n nativo de Astro
- Traducciones mediante JSON por idioma
- Layout base
- Componentes mínimos reutilizables
- SEO técnico básico
- Página 404
- `robots.txt` dinámico
- Manifest web dinámico
- Imagen social por defecto
- Tests smoke con `node:test`
- CI en pull requests
- Despliegue automático en GitHub Pages
- Dependabot para npm y GitHub Actions
- Documentación específica para agentes IA

## Requisitos

Usa Node 22. El repositorio incluye `.nvmrc`.

```sh
nvm use
npm ci
```

## Comandos

| Comando | Acción |
| --- | --- |
| `npm run dev` | Arranca el servidor local de Astro |
| `npm run build` | Genera la web estática en `dist/` |
| `npm run preview` | Previsualiza el build localmente |
| `npm test` | Ejecuta tests smoke básicos |
| `npm run format` | Formatea CSS, JS, JSON, Markdown, TS y YAML |
| `npm run format:check` | Comprueba formato |
| `npm run clean` | Borra `dist` y `.astro` |

## Módulos de Eurovision

El proyecto incluye páginas estáticas y compatibles con GitHub Pages para explorar datos de Eurovision Senior, es decir, el festival adulto normal. No se deben mezclar datos de Eurovision Junior en histórico, fichas, estadísticas, rankings ni comparadores.

El dataset histórico se lee desde `public/dataset/data/senior`. Los helpers que recorren el dataset deben mantener ese alcance y no procesar carpetas junior u otros concursos.

- `/vota/`: app de votación de Eurovision 2026. La UI se renderiza desde `src/components/EurovisionVoteApp.astro` y la lógica de cliente entra por `public/vote.js`.
- `/noticias/`: noticias de Eurovision desde el feed RSS público de ESCplus España. La carga se hace durante el build mediante `src/lib/newsFeed.mjs`; si el feed falla, la página muestra un estado de error en vez de romper el build. Solo se muestran título, resumen del feed, fecha, autoría, categorías y enlace externo a ESCplus España.
- `/{locale}/noticias/`: versión localizada de la página de noticias para los idiomas secundarios configurados.
- `/rankings/`: índice de rankings históricos evergreen generados desde el dataset disponible.
- `/rankings/{slug}/`: páginas SEO de rankings históricos, como países con más victorias, más participaciones, ganadores por década, mejores puntuaciones disponibles, más top 10, sedes repetidas y ediciones con más participantes.
- `/{locale}/rankings/` y `/{locale}/rankings/{slug}/`: versiones localizadas de los rankings para los idiomas secundarios configurados.
- `/paises/`: índice de fichas por país.
- `/paises/{codigo}/`: ficha SEO indexable de cada país, generada desde el dataset disponible. Incluye title/meta description únicos, h1, estadísticas, participación actual cuando exista, gráfica, tabla histórica, enlaces internos, FAQ visible y estados claros para datos ausentes.
- `/{locale}/paises/{codigo}/`: versión localizada de cada ficha para los idiomas secundarios configurados.
- `/comparador-paises/`: comparador de países. Permite seleccionar dos o más países y compara participaciones, victorias, mejor posición, puntos medios, resultados por décadas y última participación.
- `/{locale}/comparador-paises/`: versión localizada para los idiomas secundarios configurados.

La app de votación mantiene `public/vote.js` como orquestador pequeño y separa responsabilidades en módulos ES bajo `public/vote/`: `config.js` lee los JSON embebidos y labels, `storage.js` gestiona localStorage/device id, `dom.js` contiene utilidades de DOM/modales/feedback, `contest.js` centraliza reglas de concursos y medias, `render.js` pinta pestañas y canciones, `cloud.js` encapsula Firebase/Firestore y `actions.js` cubre importar, exportar, resetear y compartir votos. Los textos visibles deben seguir viniendo de los labels existentes inyectados por Astro.

Los rankings usan `src/lib/eurovisionRankings.ts` para centralizar cálculos, `src/components/RankingsIndexApp.astro`, `src/components/EurovisionRankingApp.astro` y `src/components/RankingTable.astro` para la interfaz, y `src/i18n/rankingLabels.ts` para textos SEO/UI traducidos. Los rankings explican límites del dataset cuando faltan puntos, sedes u otros datos, y no inventan información. Las noticias usan `src/lib/newsFeed.mjs` para parsear RSS 2.0 de WordPress con namespaces y CDATA, `src/components/EurovisionNewsApp.astro` para la interfaz y `src/i18n/newsLabels.ts` para textos traducidos. Las fichas por país usan `src/lib/eurovisionCountryProfiles.ts` para centralizar datos y cálculos, `src/components/EurovisionCountryProfileApp.astro` como orquestador, componentes pequeños para gráfica, tabla, enlaces y FAQ, y `src/i18n/countryProfileSeoLabels.ts` para textos SEO/FAQ traducidos. El comparador usa `src/lib/countryComparison.ts`, `src/components/EurovisionCountryComparatorApp.astro`, `public/country-comparator.js` y `src/i18n/countryComparisonLabels.ts`.

## Estructura recomendada

```text
/
├── .github/
│   ├── dependabot.yml
│   └── workflows/
│       ├── ci.yml
│       └── pages.yml
├── docs/
│   ├── ai-checklist.md
│   ├── design-system.md
│   ├── github-pages.md
│   ├── i18n-guide.md
│   ├── template-usage.md
│   └── testing-guide.md
├── public/
│   ├── favicon.svg
│   ├── favicon.ico
│   └── og-image.svg
├── scripts/
│   └── clean.mjs
├── src/
│   ├── components/
│   │   ├── Button.astro
│   │   ├── Container.astro
│   │   ├── Footer.astro
│   │   └── Header.astro
│   ├── config/
│   │   └── site.ts
│   ├── i18n/
│   │   ├── translations/
│   │   │   ├── en.json
│   │   │   └── es.json
│   │   └── ui.ts
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── [locale]/
│   │   │   └── index.astro
│   │   ├── 404.astro
│   │   ├── index.astro
│   │   ├── manifest.webmanifest.ts
│   │   └── robots.txt.ts
│   └── styles/
│       └── global.css
└── tests/
    └── smoke.test.mjs
```

## Documentación para agentes IA

Antes de modificar el template, una IA debe leer:

- `agents.md`: reglas principales del repositorio.
- `docs/ai-checklist.md`: checklist rápida antes de cerrar tareas.
- `docs/template-usage.md`: cómo usar y modificar la plantilla.
- `docs/i18n-guide.md`: cómo añadir textos, traducciones e idiomas.
- `docs/github-pages.md`: cómo evitar romper GitHub Pages y `base`.
- `docs/testing-guide.md`: cómo mantener tests smoke.
- `docs/design-system.md`: reglas visuales, SEO, accesibilidad y responsive.

## Crear un proyecto nuevo desde esta plantilla

1. Usa este repositorio como template o clónalo.
2. Cambia `name` en `package.json`.
3. Cambia los datos de `src/config/site.ts`.
4. Cambia los textos en `src/i18n/translations/*.json`.
5. Cambia `public/favicon.svg`, `public/favicon.ico` y `public/og-image.svg`.
6. Revisa `src/pages/manifest.webmanifest.ts` si quieres cambiar color, iconos o modo de visualización.
7. Revisa `.env.example` si necesitas sobrescribir `ASTRO_SITE` o `ASTRO_BASE`.
8. Ejecuta `npm ci`, `npm test` y `npm run build`.
9. Activa GitHub Pages en el repositorio usando GitHub Actions como fuente.

## Traducciones e idiomas

La plantilla usa el i18n nativo de Astro en `astro.config.mjs` y una capa sencilla de traducciones en JSON.

Idioma por defecto:

```txt
/
```

Otros idiomas:

```txt
/en/
/fr/
...
```

### Añadir una nueva traducción

Añade la clave en todos los JSON dentro de:

```txt
src/i18n/translations/
```

Ejemplo:

```json
{
  "home.title": "Título traducido"
}
```

Después úsala en cualquier componente o página:

```astro
---
import { useTranslations } from '../i18n/ui';
const t = useTranslations(locale);
---

<h1>{t('home.title')}</h1>
```

### Añadir un nuevo idioma

Ejemplo para añadir francés:

1. Añade el idioma en `astro.config.mjs`:

```js
i18n: {
  defaultLocale: 'es',
  locales: ['es', 'en', 'fr'],
  routing: {
    prefixDefaultLocale: false,
  },
}
```

2. Añade el idioma en `src/config/site.ts`:

```ts
export const locales = ['es', 'en', 'fr'] as const;

export const localeLabels = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
};
```

3. Crea el fichero:

```txt
src/i18n/translations/fr.json
```

4. Importa y registra el JSON en `src/i18n/ui.ts`:

```ts
import fr from './translations/fr.json';

const translations = {
  es,
  en,
  fr,
};
```

Con eso se generará `/fr/` usando `src/pages/[locale]/index.astro`.

## GitHub Pages

El despliegue está en `.github/workflows/pages.yml`.

Por defecto, cuando corre en GitHub Actions, `astro.config.mjs` calcula automáticamente:

- `site`: `https://OWNER.github.io`
- `base`: `/NOMBRE_DEL_REPO`

Puedes sobrescribirlo con variables de entorno:

```env
ASTRO_SITE=https://example.com
ASTRO_BASE=/
```

Para un dominio propio normalmente usarías:

```env
ASTRO_SITE=https://example.com
ASTRO_BASE=/
```

## CI

`.github/workflows/ci.yml` ejecuta en pull requests:

```sh
npm ci
npm test
npm run build
```

Los tests son intencionadamente suaves: comprueban que la estructura mínima existe, que los scripts básicos están disponibles y que los workflows no desaparecen.

## Configuración principal

La configuración editable del sitio está en:

```ts
src/config/site.ts
```

Ahí puedes cambiar nombre, descripción, idiomas, autor y URL base del proyecto.

## Notas

Esta plantilla intenta ser útil sin ser pesada. Evita añadir dependencias de desarrollo obligatorias para que los proyectos derivados arranquen rápido y no fallen por configuración innecesaria.
