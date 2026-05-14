const CARTO_TILES = {
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
};
const TILE_ATTRIBUTION = '&copy; OpenStreetMap contributors &copy; CARTO';

function readJson(root, selector, fallback) {
  try {
    const node = root.querySelector(selector);
    return JSON.parse(node?.textContent || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
}

function metricValue(country, metric) {
  if (metric === 'participations') return country.participations;
  if (metric === 'wins') return country.wins;
  if (metric === 'bestPlace') return country.bestPlace ? Math.max(1, 27 - country.bestPlace) : 0;
  if (metric === 'lastParticipation') return country.lastParticipation || 0;
  return country.debut || 0;
}

function displayValue(country, metric, labels) {
  const value = metric === 'participations' ? country.participations : metric === 'wins' ? country.wins : metric === 'bestPlace' ? country.bestPlace : metric === 'lastParticipation' ? country.lastParticipation : country.debut;
  return value ?? labels.unavailable;
}

function markerLabel(country, metric, labels) {
  return (labels.pointLabel || '{country}: {metric} {value}')
    .replaceAll('{country}', country.country)
    .replaceAll('{metric}', labels.metrics?.[metric] || metric)
    .replaceAll('{value}', String(displayValue(country, metric, labels)));
}

function renderSummary(node, country, labels) {
  if (!node || !country) return;
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

function getPrimaryColor(root) {
  return getComputedStyle(root).getPropertyValue('--color-primary').trim() || '#7c3aed';
}

function getCurrentTheme() {
  const htmlTheme = document.documentElement.dataset.theme || document.documentElement.className;
  if (/dark/i.test(htmlTheme)) return 'dark';
  if (/light/i.test(htmlTheme)) return 'light';

  const colorScheme = getComputedStyle(document.documentElement).colorScheme;
  if (colorScheme.includes('dark')) return 'dark';
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getTileUrl() {
  return CARTO_TILES[getCurrentTheme()] || CARTO_TILES.light;
}

function watchThemeChanges(onChange) {
  let currentTheme = getCurrentTheme();
  const update = () => {
    const nextTheme = getCurrentTheme();
    if (nextTheme === currentTheme) return;
    currentTheme = nextTheme;
    onChange(nextTheme);
  };

  window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', update);
  new MutationObserver(update).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'data-theme', 'style'],
  });
}

function waitForLeaflet() {
  return new Promise((resolve) => {
    if (window.L) {
      resolve(window.L);
      return;
    }
    window.addEventListener('leaflet:ready', () => resolve(window.L), { once: true });
  });
}

function markerRadius(country, metric, max) {
  const weight = Math.max(0.12, metricValue(country, metric) / Math.max(max, 1));
  return 6 + weight * 16;
}

async function initCountryMap(root) {
  const countries = readJson(root, '[data-map-countries]', []);
  const labels = readJson(root, '[data-map-labels]', {});
  const metricSelect = root.querySelector('[data-map-metric]');
  const mapNode = root.querySelector('[data-map-leaflet]');
  const summary = root.querySelector('[data-map-summary]');
  const status = root.querySelector('[data-map-status]');

  if (!Array.isArray(countries) || !countries.length || !metricSelect || !mapNode) return;

  const L = await waitForLeaflet();
  const map = L.map(mapNode, {
    attributionControl: true,
    boxZoom: true,
    doubleClickZoom: true,
    dragging: true,
    keyboard: true,
    maxBounds: [[-85, -180], [85, 180]],
    maxBoundsViscosity: 0.7,
    maxZoom: 8,
    minZoom: 2,
    scrollWheelZoom: false,
    tap: true,
    touchZoom: true,
    worldCopyJump: true,
    zoomControl: false,
  }).setView([32, 18], 2);

  const tileLayer = L.tileLayer(getTileUrl(), {
    attribution: TILE_ATTRIBUTION,
    maxZoom: 19,
    subdomains: 'abcd',
  }).addTo(map);
  watchThemeChanges(() => tileLayer.setUrl(getTileUrl()));

  const primary = getPrimaryColor(root);
  const markersByCountry = new Map();
  let selectedCode = '';

  function updateMetric() {
    const metric = metricSelect.value;
    const max = Math.max(...countries.map((country) => metricValue(country, metric)), 1);
    markersByCountry.forEach((marker, code) => {
      const country = countries.find((item) => item.countryCode === code);
      if (!country) return;
      marker.setRadius(markerRadius(country, metric, max));
      marker.setStyle({
        color: code === selectedCode ? '#111827' : '#ffffff',
        fillColor: code === selectedCode ? '#f59e0b' : primary,
        fillOpacity: code === selectedCode ? 0.92 : 0.68,
        opacity: 0.98,
        weight: code === selectedCode ? 3 : 1.5,
      });
      marker.getElement?.()?.setAttribute('aria-label', markerLabel(country, metric, labels));
    });
  }

  function selectCountry(code) {
    selectedCode = code;
    const country = countries.find((item) => item.countryCode === code);
    if (!country) return;
    renderSummary(summary, country, labels);
    map.panTo([country.latitude, country.longitude], { animate: true });
    updateMetric();
  }

  countries.forEach((country) => {
    if (typeof country.latitude !== 'number' || typeof country.longitude !== 'number') return;

    const marker = L.circleMarker([country.latitude, country.longitude], {
      className: 'country-map__marker',
      color: '#ffffff',
      fillColor: primary,
      fillOpacity: 0.68,
      opacity: 0.98,
      radius: 10,
      weight: 1.5,
    }).addTo(map);

    markersByCountry.set(country.countryCode, marker);
    marker.bindTooltip(country.country, { direction: 'top', sticky: true });
    marker.on('click', () => selectCountry(country.countryCode));

    setTimeout(() => {
      const element = marker.getElement?.();
      if (!element) return;
      element.setAttribute('tabindex', '0');
      element.setAttribute('role', 'button');
      element.setAttribute('aria-label', markerLabel(country, metricSelect.value, labels));
      element.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        selectCountry(country.countryCode);
      });
    }, 0);
  });

  updateMetric();
  if (status) status.textContent = '';

  root.querySelector('[data-map-zoom-in]')?.addEventListener('click', () => map.zoomIn());
  root.querySelector('[data-map-zoom-out]')?.addEventListener('click', () => map.zoomOut());
  root.querySelector('[data-map-reset]')?.addEventListener('click', () => map.setView([32, 18], 2));
  metricSelect.addEventListener('change', updateMetric);
}

document.querySelectorAll('[data-country-map]').forEach((root) => {
  initCountryMap(root);
});
