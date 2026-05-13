const dataEl = document.getElementById('country-comparator-data');
const labelsEl = document.getElementById('country-comparator-labels');
const form = document.querySelector('[data-country-comparator-form]');
const select = document.querySelector('[data-country-comparator-select]');
const reset = document.querySelector('[data-country-comparator-reset]');
const statusEl = document.querySelector('[data-country-comparator-status]');
const cardsEl = document.querySelector('[data-country-comparator-cards]');
const overviewEl = document.querySelector('[data-country-comparator-overview]');
const decadesEl = document.querySelector('[data-country-comparator-decades]');

const countries = JSON.parse(dataEl?.textContent || '[]');
const labels = JSON.parse(labelsEl?.textContent || '{}');

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
}

function valueOrFallback(value) {
  return value ?? labels.noData;
}

function selectedCountries() {
  if (!select) return countries.slice(0, 2);
  const selectedCodes = [...select.selectedOptions].map((option) => option.value);
  return countries.filter((country) => selectedCodes.includes(country.countryCode));
}

function renderCards(selected) {
  if (!cardsEl) return;
  cardsEl.innerHTML = selected.map((country) => `
    <article class="stats-kpi country-comparator-card">
      <header>
        ${country.flag ? `<img class="history-flag" src="${escapeHtml(country.flag)}" alt="" width="64" height="64" loading="lazy" decoding="async">` : ''}
        <h2>${escapeHtml(country.country)}</h2>
      </header>
      <dl>
        <div><dt>${escapeHtml(labels.participations)}</dt><dd>${country.participations}</dd></div>
        <div><dt>${escapeHtml(labels.wins)}</dt><dd>${country.wins}</dd></div>
        <div><dt>${escapeHtml(labels.bestPlace)}</dt><dd>${escapeHtml(valueOrFallback(country.bestPlace))}</dd></div>
        <div><dt>${escapeHtml(labels.averagePoints)}</dt><dd>${escapeHtml(valueOrFallback(country.averagePoints))}</dd></div>
        <div><dt>${escapeHtml(labels.lastParticipation)}</dt><dd>${escapeHtml(valueOrFallback(country.lastParticipation))}</dd></div>
      </dl>
    </article>`).join('');
}

function renderOverview(selected) {
  if (!overviewEl) return;
  overviewEl.innerHTML = `<table class="stats-table">
    <thead><tr>
      <th>${escapeHtml(labels.country)}</th>
      <th>${escapeHtml(labels.participations)}</th>
      <th>${escapeHtml(labels.wins)}</th>
      <th>${escapeHtml(labels.bestPlace)}</th>
      <th>${escapeHtml(labels.averagePoints)}</th>
      <th>${escapeHtml(labels.lastParticipation)}</th>
    </tr></thead>
    <tbody>${selected.map((country) => `
      <tr>
        <td><span class="stats-country">${country.flag ? `<img src="${escapeHtml(country.flag)}" alt="" width="64" height="64" loading="lazy" decoding="async">` : ''}<strong>${escapeHtml(country.country)}</strong><small>${escapeHtml(country.countryCode)}</small></span></td>
        <td>${country.participations}</td>
        <td>${country.wins}</td>
        <td>${escapeHtml(valueOrFallback(country.bestPlace))}</td>
        <td>${escapeHtml(valueOrFallback(country.averagePoints))}</td>
        <td>${escapeHtml(valueOrFallback(country.lastParticipation))}</td>
      </tr>`).join('')}</tbody>
  </table>`;
}

function renderDecades(selected) {
  if (!decadesEl) return;
  const rows = selected.flatMap((country) => country.resultsByDecade.map((decade) => ({ country, decade })));
  decadesEl.innerHTML = `<table class="stats-table">
    <thead><tr>
      <th>${escapeHtml(labels.country)}</th>
      <th>${escapeHtml(labels.decade)}</th>
      <th>${escapeHtml(labels.participations)}</th>
      <th>${escapeHtml(labels.wins)}</th>
      <th>${escapeHtml(labels.bestPlace)}</th>
      <th>${escapeHtml(labels.averagePoints)}</th>
    </tr></thead>
    <tbody>${rows.map(({ country, decade }) => `
      <tr>
        <td>${escapeHtml(country.country)}</td>
        <td>${escapeHtml(decade.decade)}</td>
        <td>${decade.participations}</td>
        <td>${decade.wins}</td>
        <td>${escapeHtml(valueOrFallback(decade.bestPlace))}</td>
        <td>${escapeHtml(valueOrFallback(decade.averagePoints))}</td>
      </tr>`).join('')}</tbody>
  </table>`;
}

function render() {
  const selected = selectedCountries();
  if (statusEl) statusEl.textContent = selected.length < 2 ? labels.needSelection : `${labels.selected}: ${selected.length}`;
  renderCards(selected);
  renderOverview(selected);
  renderDecades(selected);
}

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  render();
});

select?.addEventListener('change', render);
reset?.addEventListener('click', () => {
  if (!select) return;
  [...select.options].forEach((option, index) => {
    option.selected = index < 2;
  });
  render();
});

render();
