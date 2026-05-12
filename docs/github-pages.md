# Guía de GitHub Pages para agentes IA

Esta plantilla está preparada para desplegar proyectos Astro en GitHub Pages mediante GitHub Actions.

## Archivos relacionados

```text
astro.config.mjs
.github/workflows/pages.yml
.github/workflows/ci.yml
src/pages/robots.txt.ts
src/pages/manifest.webmanifest.ts
src/layouts/BaseLayout.astro
```

## Configuración de Astro

`astro.config.mjs` calcula automáticamente:

```js
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'astro-template';
const site = process.env.ASTRO_SITE ?? `https://${process.env.GITHUB_REPOSITORY_OWNER ?? 'jalonsomerchan'}.github.io`;
const base = process.env.ASTRO_BASE ?? (process.env.GITHUB_ACTIONS ? `/${repositoryName}` : '/');
```

Esto permite:

- Desarrollo local en `/`.
- GitHub Pages en `/nombre-repo/`.
- Dominio propio con `ASTRO_BASE=/`.

## Regla principal

No uses rutas internas absolutas si deben funcionar bajo una subcarpeta.

Evitar:

```astro
<a href="/contacto/">Contacto</a>
<img src="/logo.svg" alt="Logo" />
```

Preferir:

```astro
<a href={getLocalizedPath('/contacto/', locale)}>Contacto</a>
```

Para assets en layouts o componentes:

```ts
const basePath = import.meta.env.BASE_URL;
const withBase = (path: string) => `${basePath.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
```

## Rutas localizadas

Usa `getLocalizedPath(path, locale)` desde `src/i18n/ui.ts`.

Ejemplo:

```astro
---
import { getLocalizedPath } from '../i18n/ui';
const href = getLocalizedPath('/blog/', locale);
---

<a href={href}>Blog</a>
```

En GitHub Pages, esto genera rutas compatibles con `BASE_URL`.

## Assets públicos

Los archivos de `public/` se sirven desde la raíz del build, pero si hay `base`, Astro los servirá bajo esa base.

Cuando enlaces assets manualmente en HTML, usa `BASE_URL` o un helper equivalente.

Correcto:

```astro
<link rel="icon" href={withBase('favicon.svg')} />
```

Incorrecto:

```astro
<link rel="icon" href="/favicon.svg" />
```

## Workflow de despliegue

`.github/workflows/pages.yml`:

1. Hace checkout.
2. Configura Node 22.
3. Ejecuta `npm ci`.
4. Ejecuta `npm test`.
5. Ejecuta `npm run build`.
6. Sube `dist` como artifact de Pages.
7. Despliega con `actions/deploy-pages@v4`.

No mezcles este workflow con tareas pesadas o no relacionadas.

## Workflow de CI

`.github/workflows/ci.yml` se usa para pull requests.

Debe seguir siendo simple:

```sh
npm ci
npm test
npm run build
```

## Variables de entorno útiles

Para dominio propio:

```env
ASTRO_SITE=https://example.com
ASTRO_BASE=/
```

Para GitHub Pages con subcarpeta personalizada:

```env
ASTRO_SITE=https://usuario.github.io
ASTRO_BASE=/nombre-repo
```

## Robots y sitemap

`src/pages/robots.txt.ts` debe generar la URL del sitemap respetando `BASE_URL`.

No hardcodear:

```txt
https://usuario.github.io/sitemap-index.xml
```

porque en GitHub Pages puede ser:

```txt
https://usuario.github.io/nombre-repo/sitemap-index.xml
```

## Manifest

`src/pages/manifest.webmanifest.ts` es dinámico para respetar `BASE_URL`.

No volver a moverlo a `public/manifest.webmanifest` salvo que se resuelva bien `start_url` e iconos con `base`.

## Checklist antes de tocar Pages

- ¿`npm run build` seguirá generando `dist/`?
- ¿`pages.yml` sigue subiendo `./dist`?
- ¿Las rutas internas respetan `BASE_URL`?
- ¿Los assets públicos enlazados manualmente respetan `BASE_URL`?
- ¿`robots.txt` apunta al sitemap correcto con subcarpeta?
- ¿`manifest.webmanifest` tiene `start_url` compatible con GitHub Pages?
- ¿La configuración permite dominio propio usando `ASTRO_SITE` y `ASTRO_BASE`?

## Qué evitar

- Cambiar `base` a un valor fijo sin motivo.
- Usar `/` para assets o enlaces internos en componentes compartidos.
- Quitar `npm test` del workflow de Pages.
- Quitar `npm run build` del workflow de CI.
- Añadir pasos lentos al despliegue sin necesidad.
