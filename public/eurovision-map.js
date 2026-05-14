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

function createPanZoom(viewport, layer) {
  const pointers = new Map();
  let state = { scale: 1, x: 0, y: 0 };
  let lastPinchDistance = 0;

  function apply() {
    layer.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale})`;
  }

  function zoom(delta, originX = 0, originY = 0) {
    const nextScale = Math.min(5, Math.max(0.8, state.scale + delta));
    const ratio = nextScale / state.scale;
    state = {
      scale: nextScale,
      x: originX - (originX - state.x) * ratio,
      y: originY - (originY - state.y) * ratio,
    };
    apply();
  }

  function reset() {
    state = { scale: 1, x: 0, y: 0 };
    apply();
  }

  viewport.addEventListener('wheel', (event) => {
    event.preventDefault();
    const rect = viewport.getBoundingClientRect();
    zoom(event.deltaY > 0 ? -0.18 : 0.18, event.clientX - rect.left, event.clientY - rect.top);
  }, { passive: false });

  viewport.addEventListener('pointerdown', (event) => {
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add('is-dragging');
  });

  viewport.addEventListener('pointermove', (event) => {
    const previous = pointers.get(event.pointerId);
    if (!previous) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.size === 1) {
      state.x += event.clientX - previous.x;
      state.y += event.clientY - previous.y;
      apply();
      return;
    }

    const values = [...pointers.values()];
    const distance = Math.hypot(values[0].x - values[1].x, values[0].y - values[1].y);
    if (lastPinchDistance) zoom((distance - lastPinchDistance) / 180, viewport.clientWidth / 2, viewport.clientHeight / 2);
    lastPinchDistance = distance;
  });

  function endPointer(event) {
    pointers.delete(event.pointerId);
    if (!pointers.size) viewport.classList.remove('is-dragging');
    if (pointers.size < 2) lastPinchDistance = 0;
  }

  viewport.addEventListener('pointerup', endPointer);
  viewport.addEventListener('pointercancel', endPointer);

  return { reset, zoomIn: () => zoom(0.35, viewport.clientWidth / 2, viewport.clientHeight / 2), zoomOut: () => zoom(-0.35, viewport.clientWidth / 2, viewport.clientHeight / 2) };
}

document.querySelectorAll('[data-country-map]').forEach((root) => {
  const countries = readJson(root, '[data-map-countries]', []);
  const labels = readJson(root, '[data-map-labels]', {});
  const metricSelect = root.querySelector('[data-map-metric]');
  const countryShapes = [...root.querySelectorAll('[data-map-country]')];
  const summary = root.querySelector('[data-map-summary]');
  const viewport = root.querySelector('[data-map-viewport]');
  const layer = root.querySelector('[data-map-layer]');

  if (!Array.isArray(countries) || !metricSelect || !countryShapes.length || !viewport || !layer) return;
  const panZoom = createPanZoom(viewport, layer);

  function updateShapes() {
    const metric = metricSelect.value;
    const max = Math.max(...countries.map((country) => metricValue(country, metric)), 1);

    countryShapes.forEach((shape) => {
      const country = countries.find((item) => item.countryCode === shape.dataset.countryCode);
      if (!country) return;
      const weight = Math.max(0.12, metricValue(country, metric) / max);
      shape.style.setProperty('--map-weight', weight.toFixed(3));
      shape.setAttribute('aria-label', pointLabel(country, metric, labels));
    });
  }

  function selectCountry(shape) {
    const country = countries.find((item) => item.countryCode === shape.dataset.countryCode);
    if (!country) return;
    countryShapes.forEach((item) => item.classList.toggle('is-selected', item === shape));
    renderSummary(summary, country, labels);
  }

  countryShapes.forEach((shape) => {
    shape.addEventListener('click', () => selectCountry(shape));
    shape.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      selectCountry(shape);
    });
  });

  root.querySelector('[data-map-zoom-in]')?.addEventListener('click', panZoom.zoomIn);
  root.querySelector('[data-map-zoom-out]')?.addEventListener('click', panZoom.zoomOut);
  root.querySelector('[data-map-reset]')?.addEventListener('click', panZoom.reset);
  metricSelect.addEventListener('change', updateShapes);
  updateShapes();
});
