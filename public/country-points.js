const dataNode = document.getElementById('country-points-data');
const pointsData = JSON.parse(dataNode?.textContent || '{"sources":[]}');
const sources = Array.isArray(pointsData.sources) ? pointsData.sources : [];
const pageLocale = pointsData.locale || document.documentElement.lang || 'es';

const $ = (selector) => document.querySelector(selector);
const selectNode = $('[data-country-points-select]');
const searchNode = $('[data-country-points-search]');
const resultNode = $('[data-country-points-result]');

const labels = {
  es: { country: 'País', points: 'Puntos', votes: 'Votos', rounds: 'Rondas', years: 'Años', average: 'Media' },
  en: { country: 'Country', points: 'Points', votes: 'Votes', rounds: 'Rounds', years: 'Years', average: 'Average' },
  fr: { country: 'Pays', points: 'Points', votes: 'Votes', rounds: 'Tours', years: 'Années', average: 'Moyenne' },
  pt: { country: 'País', points: 'Pontos', votes: 'Votos', rounds: 'Rondas', years: 'Anos', average: 'Média' },
  ca: { country: 'País', points: 'Punts', votes: 'Vots', rounds: 'Rondes', years: 'Anys', average: 'Mitjana' },
  eu: { country: 'Herrialdea', points: 'Puntuak', votes: 'Botoak', rounds: 'Txandak', years: 'Urteak', average: 'Batez bestekoa' },
  gl: { country: 'País', points: 'Puntos', votes: 'Votos', rounds: 'Roldas', years: 'Anos', average: 'Media' },
};

const text = labels[pageLocale] || labels.es;
const numberFormatter = new Intl.NumberFormat(pageLocale);
const html = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
const normalize = (value) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const formatNumber = (value) => Number.isFinite(value) ? numberFormatter.format(value) : '-';
const flag = (src) => src ? `<img class="history-flag" src="${html(src)}" alt="" loading="lazy" decoding="async" width="64" height="64">` : '';
const countryLine = (country, src) => `<span class="history-country-line">${flag(src)}<span>${html(country)}</span></span>`;

function selectedSource() {
  const selectedCode = selectNode?.value || sources[0]?.countryCode;
  return sources.find((source) => source.countryCode === selectedCode) || sources[0];
}

function filteredTargets(source) {
  const query = normalize(searchNode?.value || '');
  return (source?.targets || []).filter((target) => !query || normalize(`${target.country} ${target.countryCode}`).includes(query));
}

function renderYears(years = []) {
  if (!years.length) return '-';
  const first = years[0];
  const last = years[years.length - 1];
  return first === last ? html(first) : `${html(first)}-${html(last)}`;
}

function render() {
  if (!resultNode) return;
  const source = selectedSource();
  if (!source) {
    resultNode.innerHTML = '<article class="empty-state"><span>📊</span><h2>No hay datos</h2></article>';
    return;
  }

  const targets = filteredTargets(source);
  const rows = targets.map((target, index) => `<tr>
    <td data-label="#">${index + 1}</td>
    <td data-label="${html(text.country)}"><strong>${countryLine(target.country, target.flag)}</strong></td>
    <td data-label="${html(text.points)}"><strong>${formatNumber(target.totalPoints)}</strong></td>
    <td data-label="${html(text.votes)}">${formatNumber(target.voteCount)}</td>
    <td data-label="${html(text.rounds)}">${formatNumber(target.rounds)}</td>
    <td data-label="${html(text.average)}">${formatNumber(target.averagePoints)}</td>
    <td data-label="${html(text.years)}">${renderYears(target.years)}</td>
  </tr>`).join('');

  resultNode.innerHTML = `<article class="stats-card">
    <p class="country-points-source"><span class="eyebrow">${html(text.points)}</span><strong>${countryLine(source.country, source.flag)}</strong><small>${formatNumber(source.totalGiven)} ${html(text.points.toLowerCase())}</small></p>
    <div class="stats-table-wrap country-points-table-wrap">
      <table class="stats-table country-points-table">
        <thead><tr><th>#</th><th>${html(text.country)}</th><th>${html(text.points)}</th><th>${html(text.votes)}</th><th>${html(text.rounds)}</th><th>${html(text.average)}</th><th>${html(text.years)}</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="7">-</td></tr>`}</tbody>
      </table>
    </div>
  </article>`;
}

selectNode?.addEventListener('change', render);
searchNode?.addEventListener('input', render);
render();
