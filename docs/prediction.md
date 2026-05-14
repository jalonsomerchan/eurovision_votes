# Quiniela de Eurovision 2026

La ruta `/quiniela/` permite crear una predicción compartible de Eurovision 2026 sin login ni Firebase.

## Rutas

- `/quiniela/`: idioma por defecto.
- `/{locale}/quiniela/`: idiomas secundarios configurados.

Las páginas usan `BaseLayout`, `Container` y `getLocalizedPath` en la navegación para mantener compatibilidad con GitHub Pages y despliegues bajo `base`.

## Datos

La quiniela usa `eurovision2026Contests` desde `src/config/eurovision2026.ts`. Los países se deduplican por código de bandera para evitar repetir finalistas directos que aparezcan en una semifinal.

## Cliente

La lógica de cliente entra por `public/prediction.js` y se divide en módulos pequeños bajo `public/prediction/`:

- `config.js`: lee candidatos y labels desde JSON embebidos por Astro.
- `storage.js`: carga, guarda y borra la quiniela en `localStorage`, incluyendo el nombre del usuario.
- `data.js`: normaliza predicciones, evita duplicados, permite quinielas parciales, genera resumen y codifica/decodifica la URL compartible.
- `render.js`: actualiza el selector visual, estados y tarjeta accesible.
- `image.js`: genera una imagen PNG mediante Canvas nativo, devuelve un `Blob` previsualizable y permite descarga o Web Share API.

No añade dependencias y funciona sin Firebase.

## Selección visual

El top se construye tocando primero un puesto y después una tarjeta de país. No es obligatorio completar los 10 puestos: con un ganador o un solo país del top ya se puede compartir la quiniela.

El botón de reinicio se muestra junto a la explicación del top para que el usuario pueda empezar de cero justo donde está seleccionando puestos.

## Compartir

La predicción se guarda en localStorage y también puede compartirse con el parámetro `?p=`. Al abrir la URL, la página restaura la quiniela y muestra la tarjeta con el nombre guardado.

También se puede copiar un resumen textual accesible o generar una imagen PNG. La imagen se previsualiza primero en un modal accesible y, desde ahí, se puede descargar o compartir directamente si el navegador soporta Web Share API con archivos.

La imagen generada siempre incluye la referencia `eurovision.alon.one`, usa título multilínea para evitar cortes y añade padding inferior para que el crédito no pise el contenido.

## Accesibilidad e i18n

Todos los textos visibles viven en `src/i18n/predictionLabels.ts`, con entradas para todos los locales configurados. La tarjeta renderizada incluye alternativa textual en `.visually-hidden`, `aria-live` para estados y controles con labels visibles. El modal usa `dialog` nativo con título asociado mediante `aria-labelledby`.
