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
  const value = metric === 'participations'
    ? country.participations
    : metric === 'wins'
      ? country.wins
      : metric === 'bestPlace'
        ? country.bestPlace
        : metric === 'lastParticipation'
          ? country.lastParticipation
          : country.debut;
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

document.querySelectorAll('[data-country-map]').forEach((root) => {
  const countries = readJson(root, '[data-map-countries]', []);
  const labels = readJson(root, '[data-map-labels]', {});
  const metricSelect = root.querySelector('[data-map-metric]');
  const points = [...root.querySelectorAll('[data-map-point]')];
  const summary = root.querySelector('[data-map-summary]');

  if (!Array.isArray(countries) || !metricSelect || !points.length) return;

  function updatePoints() {
    const metric = metricSelect.value;
    const max = Math.max(...countries.map((country) => metricValue(country, metric)), 1);

    points.forEach((point) => {
      const country = countries.find((item) => item.countryCode === point.dataset.countryCode);
      if (!country) return;
      const value = metricValue(country, metric);
      const size = 0.68 + (value / max) * 1.15;
      point.style.setProperty('--size', `${size.toFixed(2)}rem`);
      point.setAttribute('aria-label', pointLabel(country, metric, labels));
      point.title = pointLabel(country, metric, labels);
    });
  }

  points.forEach((point) => {
    point.addEventListener('click', () => {
      const country = countries.find((item) => item.countryCode === point.dataset.countryCode);
      if (!country) return;
      points.forEach((item) => item.classList.toggle('is-selected', item === point));
      renderSummary(summary, country, labels);
    });
  });

  metricSelect.addEventListener('change', updatePoints);
  updatePoints();
});
