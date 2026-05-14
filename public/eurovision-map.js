const GEOJSON_URL = 'https://cdn.jsdelivr.net/gh/johan/world.geo.json@master/countries.geo.json';
const CARTO_TILES = {
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
};
const TILE_ATTRIBUTION = '&copy; OpenStreetMap contributors &copy; CARTO';

const ISO2_TO_ISO3 = {
  AL: 'ALB', AD: 'AND', AM: 'ARM', AU: 'AUS', AT: 'AUT', AZ: 'AZE', BA: 'BIH', BE: 'BEL', BG: 'BGR', BY: 'BLR', CH: 'CHE', CY: 'CYP', CZ: 'CZE', DE: 'DEU', DK: 'DNK', EE: 'EST', ES: 'ESP', FI: 'FIN', FR: 'FRA', GB: 'GBR', GE: 'GEO', GR: 'GRC', HR: 'HRV', HU: 'HUN', IE: 'IRL', IL: 'ISR', IS: 'ISL', IT: 'ITA', LT: 'LTU', LU: 'LUX', LV: 'LVA', MA: 'MAR', MC: 'MCO', MD: 'MDA', ME: 'MNE', MK: 'MKD', MT: 'MLT', NL: 'NLD', NO: 'NOR', PL: 'POL', PT: 'PRT', RO: 'ROU', RS: 'SRB', RU: 'RUS', SM: 'SMR', SE: 'SWE', SI: 'SVN', SK: 'SVK', TR: 'TUR', UA: 'UKR', XK: 'XKX', YU: 'SRB',
};

const COUNTRY_NAME_ALIASES = {
  BA: ['Bosnia and Herzegovina'],
  CZ: ['Czech Republic', 'Czechia'],
  GB: ['United Kingdom'],
  MD: ['Moldova', 'Republic of Moldova'],
  MK: ['Macedonia', 'North Macedonia'],
  RU: ['Russia', 'Russian Federation'],
  TR: ['Turkey', 'Türkiye'],
  XK: ['Kosovo'],
  YU: ['Serbia', 'Yugoslavia'],
};

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

function pointLabel(country, metric, labels) {
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

function featureMatchesCountry(feature, country) {
  const props = feature.properties || {};
  const iso3 = ISO2_TO_ISO3[country.countryCode];
  const featureIds = [feature.id, props.iso_a3, props.ISO_A3, props.adm0_a3].filter(Boolean).map(String);
  if (iso3 && featureIds.includes(iso3)) return true;

  const names = [country.country, ...(COUNTRY_NAME_ALIASES[country.countryCode] || [])].map((name) => String(name).toLowerCase());
  const featureNames = [props.name, props.NAME, props.admin, props.ADMIN].filter(Boolean).map((name) => String(name).toLowerCase());
  return featureNames.some((name) => names.includes(name));
}

function findCountryFeature(features, country) {
  return features.find((feature) => featureMatchesCountry(feature, country));
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

function buildFeatureCollection(features) {
  return { type: 'FeatureCollection', features };
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

async function loadWorldFeatures() {
  const response = await fetch(GEOJSON_URL, { mode: 'cors' });
  if (!response.ok) throw new Error(`Unable to load world GeoJSON: ${response.status}`);
  const data = await response.json();
  return Array.isArray(data.features) ? data.features : [];
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
    maxBounds: [[24, -32], [73, 50]],
    maxBoundsViscosity: 0.8,
    maxZoom: 7,
    minZoom: 3,
    scrollWheelZoom: false,
    tap: true,
    touchZoom: true,
    zoomControl: false,
  }).setView([54, 14], 4);

  const tileLayer = L.tileLayer(getTileUrl(), {
    attribution: TILE_ATTRIBUTION,
    maxZoom: 19,
    subdomains: 'abcd',
  }).addTo(map);
  watchThemeChanges(() => tileLayer.setUrl(getTileUrl()));

  const primary = getPrimaryColor(root);
  const layersByCountry = new Map();
  let selectedCode = '';

  function updateMetric() {
    const metric = metricSelect.value;
    const max = Math.max(...countries.map((country) => metricValue(country, metric)), 1);
    layersByCountry.forEach((layer, code) => {
      const country = countries.find((item) => item.countryCode === code);
      if (!country) return;
      const weight = Math.max(0.12, metricValue(country, metric) / max);
      layer.setStyle({
        color: code === selectedCode ? '#111827' : '#ffffff',
        fillColor: code === selectedCode ? '#f59e0b' : primary,
        fillOpacity: 0.2 + weight * 0.68,
        opacity: 0.98,
        weight: code === selectedCode ? 2.4 : 1,
      });
      layer.getElement?.()?.setAttribute('aria-label', pointLabel(country, metric, labels));
    });
  }

  function selectCountry(code) {
    selectedCode = code;
    const country = countries.find((item) => item.countryCode === code);
    if (!country) return;
    renderSummary(summary, country, labels);
    updateMetric();
  }

  try {
    const worldFeatures = await loadWorldFeatures();
    const mapFeatures = countries
      .map((country) => {
        const feature = findCountryFeature(worldFeatures, country);
        return feature ? { ...feature, properties: { ...(feature.properties || {}), countryCode: country.countryCode } } : null;
      })
      .filter(Boolean);

    const geoJsonLayer = L.geoJSON(buildFeatureCollection(mapFeatures), {
      style: () => ({ color: '#ffffff', fillColor: primary, fillOpacity: 0.35, opacity: 0.98, weight: 1 }),
      onEachFeature(feature, layer) {
        const code = feature.properties?.countryCode;
        const country = countries.find((item) => item.countryCode === code);
        if (!country) return;
        layersByCountry.set(code, layer);
        layer.bindTooltip(country.country, { direction: 'top', sticky: true });
        layer.on('click', () => selectCountry(code));
        layer.on('keypress', (event) => {
          if (event.originalEvent?.key !== 'Enter' && event.originalEvent?.key !== ' ') return;
          event.originalEvent.preventDefault();
          selectCountry(code);
        });
      },
    }).addTo(map);

    map.fitBounds(geoJsonLayer.getBounds(), { padding: [22, 22] });
    updateMetric();

    setTimeout(() => {
      layersByCountry.forEach((layer, code) => {
        const country = countries.find((item) => item.countryCode === code);
        const element = layer.getElement?.();
        if (!country || !element) return;
        element.classList.add('country-map__country');
        element.setAttribute('tabindex', '0');
        element.setAttribute('role', 'button');
        element.setAttribute('aria-label', pointLabel(country, metricSelect.value, labels));
      });
    }, 0);

    if (status) status.textContent = '';
  } catch (error) {
    console.error(error);
    if (status) status.textContent = labels.mapLoadError || '';
  }

  root.querySelector('[data-map-zoom-in]')?.addEventListener('click', () => map.zoomIn());
  root.querySelector('[data-map-zoom-out]')?.addEventListener('click', () => map.zoomOut());
  root.querySelector('[data-map-reset]')?.addEventListener('click', () => map.setView([54, 14], 4));
  metricSelect.addEventListener('change', updateMetric);
}

document.querySelectorAll('[data-country-map]').forEach((root) => {
  initCountryMap(root);
});
