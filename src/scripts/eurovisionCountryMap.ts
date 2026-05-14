import 'leaflet/dist/leaflet.css';
// Leaflet is bundled locally by Vite from the npm package; no map tiles or CDN are used.
// @ts-expect-error Leaflet's CommonJS typings are not required for this client-only script.
import L from 'leaflet';

type MapMetric = 'participations' | 'wins' | 'bestPlace' | 'lastParticipation' | 'debut';

type MapCountry = {
  countryCode: string;
  country: string;
  participations: number;
  wins: number;
  bestPlace: number | null;
  lastParticipation: number | null;
  debut: number | null;
  x: number;
  y: number;
  width: number;
  height: number;
  href: string;
  compareHref: string;
  rankingsHref: string;
};

type MapLabels = {
  selectedTitle: string;
  profileLink: string;
  compareLink: string;
  rankingsLink: string;
  participations: string;
  wins: string;
  bestPlace: string;
  lastParticipation: string;
  debut: string;
  unavailable: string;
  pointLabel: string;
  metrics: Record<MapMetric, string>;
};

function readJson<T>(root: Element, selector: string, fallback: T): T {
  try {
    const node = root.querySelector(selector);
    return JSON.parse(node?.textContent || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function escapeHtml(value: unknown) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char] || char);
}

function metricValue(country: MapCountry, metric: MapMetric) {
  if (metric === 'participations') return country.participations;
  if (metric === 'wins') return country.wins;
  if (metric === 'bestPlace') return country.bestPlace ? Math.max(1, 27 - country.bestPlace) : 0;
  if (metric === 'lastParticipation') return country.lastParticipation || 0;
  return country.debut || 0;
}

function displayValue(country: MapCountry, metric: MapMetric, labels: MapLabels) {
  const value = metric === 'participations' ? country.participations : metric === 'wins' ? country.wins : metric === 'bestPlace' ? country.bestPlace : metric === 'lastParticipation' ? country.lastParticipation : country.debut;
  return value ?? labels.unavailable;
}

function pointLabel(country: MapCountry, metric: MapMetric, labels: MapLabels) {
  return labels.pointLabel
    .replaceAll('{country}', country.country)
    .replaceAll('{metric}', labels.metrics[metric])
    .replaceAll('{value}', String(displayValue(country, metric, labels)));
}

function countryFeature(country: MapCountry) {
  const left = country.x - country.width / 2;
  const right = country.x + country.width / 2;
  const top = 100 - (country.y - country.height / 2);
  const bottom = 100 - (country.y + country.height / 2);

  return {
    type: 'Feature' as const,
    properties: { countryCode: country.countryCode },
    geometry: {
      type: 'Polygon' as const,
      coordinates: [[[left, top], [right, top], [right, bottom], [left, bottom], [left, top]]],
    },
  };
}

function renderSummary(node: Element | null, country: MapCountry, labels: MapLabels) {
  if (!node) return;
  node.innerHTML = `
    <p class="eyebrow">${escapeHtml(labels.selectedTitle)}</p>
    <h2>${escapeHtml(country.country)}</h2>
    <dl>
      <div><dt>${escapeHtml(labels.participations)}</dt><dd>${country.participations}</dd></div>
      <div><dt>${escapeHtml(labels.wins)}</dt><dd>${country.wins}</dd></div>
      <div><dt>${escapeHtml(labels.bestPlace)}</dt><dd>${escapeHtml(country.bestPlace ?? labels.unavailable)}</dd></div>
      <div><dt>${escapeHtml(labels.lastParticipation)}</dt><dd>${escapeHtml(country.lastParticipation ?? labels.unavailable)}</dd></div>
      <div><dt>${escapeHtml(labels.debut)}</dt><dd>${escapeHtml(country.debut ?? labels.unavailable)}</dd></div>
    </dl>
    <div class="country-map-summary__actions">
      <a href="${escapeHtml(country.href)}">${escapeHtml(labels.profileLink)}</a>
      <a href="${escapeHtml(country.compareHref)}">${escapeHtml(labels.compareLink)}</a>
      <a href="${escapeHtml(country.rankingsHref)}">${escapeHtml(labels.rankingsLink)}</a>
    </div>
  `;
}

document.querySelectorAll('[data-country-map]').forEach((root) => {
  const countries = readJson<MapCountry[]>(root, '[data-map-countries]', []);
  const labels = readJson<MapLabels>(root, '[data-map-labels]', {} as MapLabels);
  const mapNode = root.querySelector<HTMLElement>('[data-map-leaflet]');
  const metricSelect = root.querySelector<HTMLSelectElement>('[data-map-metric]');
  const summary = root.querySelector('[data-map-summary]');

  if (!mapNode || !metricSelect || !countries.length) return;

  const bounds = L.latLngBounds([[0, 0], [100, 100]]);
  const map = L.map(mapNode, {
    attributionControl: false,
    boxZoom: true,
    crs: L.CRS.Simple,
    doubleClickZoom: true,
    dragging: true,
    keyboard: true,
    maxBounds: [[-20, -20], [120, 120]],
    maxZoom: 5,
    minZoom: -1,
    scrollWheelZoom: true,
    tap: true,
    touchZoom: true,
    zoomControl: false,
  });
  map.fitBounds(bounds, { padding: [18, 18] });

  const primary = getComputedStyle(root).getPropertyValue('--color-primary').trim() || '#7c3aed';
  const features = countries.map(countryFeature);
  const layersByCountry = new Map<string, any>();
  let selectedCode = '';

  const layer = L.geoJSON(features, {
    style: () => ({ color: '#ffffff', fillColor: primary, fillOpacity: 0.42, opacity: 0.95, weight: 1 }),
    onEachFeature: (feature: { properties: { countryCode: string } }, polygon: any) => {
      const country = countries.find((item) => item.countryCode === feature.properties.countryCode);
      if (!country) return;
      layersByCountry.set(country.countryCode, polygon);
      polygon.on('click', () => selectCountry(country.countryCode));
      polygon.bindTooltip(country.country, { direction: 'top', sticky: true });
    },
  }).addTo(map);

  function updateA11y(metric: MapMetric) {
    layersByCountry.forEach((polygon, code) => {
      const country = countries.find((item) => item.countryCode === code);
      const element = polygon.getElement?.();
      if (!country || !element) return;
      element.setAttribute('tabindex', '0');
      element.setAttribute('role', 'button');
      element.setAttribute('aria-label', pointLabel(country, metric, labels));
      element.classList.add('country-map__country');
      element.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        selectCountry(code);
      });
    });
  }

  function updateMetric() {
    const metric = metricSelect.value as MapMetric;
    const max = Math.max(...countries.map((country) => metricValue(country, metric)), 1);
    layersByCountry.forEach((polygon, code) => {
      const country = countries.find((item) => item.countryCode === code);
      if (!country) return;
      const weight = Math.max(0.16, metricValue(country, metric) / max);
      polygon.setStyle({ fillColor: code === selectedCode ? '#f59e0b' : primary, fillOpacity: 0.18 + weight * 0.72, weight: code === selectedCode ? 2.4 : 1 });
      polygon.getElement?.()?.setAttribute('aria-label', pointLabel(country, metric, labels));
    });
  }

  function selectCountry(code: string) {
    selectedCode = code;
    const country = countries.find((item) => item.countryCode === code);
    if (!country) return;
    renderSummary(summary, country, labels);
    updateMetric();
  }

  root.querySelector('[data-map-zoom-in]')?.addEventListener('click', () => map.zoomIn());
  root.querySelector('[data-map-zoom-out]')?.addEventListener('click', () => map.zoomOut());
  root.querySelector('[data-map-reset]')?.addEventListener('click', () => map.fitBounds(bounds, { padding: [18, 18] }));
  metricSelect.addEventListener('change', updateMetric);
  layer.once('add', () => updateA11y(metricSelect.value as MapMetric));
  window.setTimeout(() => updateA11y(metricSelect.value as MapMetric), 0);
  updateMetric();
});
