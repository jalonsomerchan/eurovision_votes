const dataNode = document.getElementById('history-data');
const labelsNode = document.getElementById('history-labels');
const historyData = JSON.parse(dataNode?.textContent || '{"contests":[]}');
const historyLabels = JSON.parse(labelsNode?.textContent || '{}');
const originalContests = Array.isArray(historyData.contests) ? historyData.contests : [];
const pageLocale = historyData.locale || document.documentElement.lang || 'es';

const $ = (selector) => document.querySelector(selector);
const listNode = $('[data-history-list]');
const statusNode = $('[data-history-status]');
const searchNode = $('[data-history-search]');
const fromNode = $('[data-history-from]');
const toNode = $('[data-history-to]');
const sortNode = $('[data-history-sort]');

const html = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
const formatNumber = (value) => Number.isFinite(value) ? new Intl.NumberFormat(pageLocale).format(value) : '-';
const formatValue = (value) => value === undefined || value === null || value === '' ? '-' : html(value);
const normalize = (value) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const localizedPath = (path) => `${pageLocale === 'es' ? '' : `/${pageLocale}`}${path}`;
const countryUrl = (code) => code ? localizedPath(`/paises/${String(code).toLowerCase()}/`) : '';
const editionUrl = (year) => localizedPath(`/ediciones/${year}/`);
const editionLink = (year) => `<a class="country-link edition-link" href="${html(editionUrl(year))}">${html(year)}</a>`;
const flag = (src) => src ? `<img class="history-flag" src="${html(src)}" alt="" loading="lazy" decoding="async" width="64" height="64">` : '';
const countryLine = (name, flagSrc, code) => {
  const content = `${flag(flagSrc)}<span>${formatValue(name)}</span>`;
  const url = countryUrl(code);
  return url ? `<a class="history-country-line country-link" href="${html(url)}">${content}</a>` : `<span class="history-country-line">${content}</span>`;
};
const textMeta = (value) => ({ html: formatValue(value) });
const htmlMeta = (value) => ({ html: String(value ?? '') });

function t(key, fallback, replacements = {}) {
  const template = historyLabels[key] || fallback || key;
  return Object.entries(replacements).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), template);
}

function entryText(entry) {
  return [entry.country, entry.countryCode, entry.artist, entry.song, entry.points, entry.place, entry.runningOrder].join(' ');
}

function contestText(contest) {
  return [
    contest.year,
    contest.hostCity,
    contest.hostCountry,
    contest.hostCountryCode,
    contest.venue,
    contest.slogan,
    contest.winner,
    contest.winnerCode,
    contest.winnerArtist,
    contest.winnerSong,
    ...(contest.entries || []).map(entryText),
  ].join(' ');
}

function filteredContests() {
  const query = normalize(searchNode?.value || '');
  const from = Number(fromNode?.value || 0);
  const to = Number(toNode?.value || 9999);
  const sort = sortNode?.value === 'asc' ? 'asc' : 'desc';

  return originalContests
    .filter((contest) => contest.year >= from && contest.year <= to)
    .filter((contest) => !query || normalize(contestText(contest)).includes(query))
    .sort((a, b) => sort === 'asc' ? a.year - b.year : b.year - a.year);
}

function renderEntries(entries = []) {
  if (!entries.length) return `<p class="stats-empty">${html(t('noDetailedResults', 'No hay resultados detallados para esta edición de Eurovision.'))}</p>`;
  const topEntries = [...entries]
    .sort((a, b) => (a.place ?? 999) - (b.place ?? 999) || (b.points ?? -1) - (a.points ?? -1) || a.country.localeCompare(b.country))
    .slice(0, 12);

  const countryLabel = t('country', 'País');
  const artistLabel = t('artist', 'Artista');
  const songLabel = t('song', 'Canción');
  const pointsLabel = t('points', 'Puntos');
  const rows = topEntries.map((entry) => `<tr>
    <td data-label="#">${formatValue(entry.place)}</td>
    <td data-label="${html(countryLabel)}"><strong>${countryLine(entry.country, entry.flag, entry.countryCode)}</strong></td>
    <td data-label="${html(artistLabel)}">${formatValue(entry.artist)}</td>
    <td data-label="${html(songLabel)}">${formatValue(entry.song)}</td>
    <td data-label="${html(pointsLabel)}"><strong>${formatValue(entry.points)}</strong></td>
  </tr>`).join('');

  return `<div class="stats-table-wrap history-table-wrap"><table class="stats-table history-entry-table"><thead><tr><th>#</th><th>${html(countryLabel)}</th><th>${html(artistLabel)}</th><th>${html(songLabel)}</th><th>${html(pointsLabel)}</th></tr></thead><tbody>${rows}</tbody></table></div>${entries.length > topEntries.length ? `<p class="history-more">${html(t('showingParticipants', 'Mostrando {shown} de {total} países participantes.', { shown: topEntries.length, total: entries.length }))}</p>` : ''}`;
}

function renderContest(contest) {
  const host = [contest.hostCity, contest.hostCountry].filter(Boolean).join(', ');
  const winnerLine = [contest.winnerArtist, contest.winnerSong].filter(Boolean).join(' - ');
  const meta = [
    ['Sede', host ? htmlMeta(countryLine(host, contest.hostFlag, contest.hostCountryCode)) : textMeta(contest.venue)],
    [t('venue', 'Recinto'), textMeta(contest.venue)],
    [t('participants', 'Participantes'), textMeta(contest.participants ? formatNumber(contest.participants) : '-')],
    [t('date', 'Fecha'), textMeta(contest.date)],
  ];

  return `<article class="history-contest-card">
    <header>
      <div>
        <p class="eyebrow">${html(t('edition', 'Edición'))} ${editionLink(contest.year)}</p>
        <h2>Eurovision ${editionLink(contest.year)}${host ? ` · <span class="history-host-title">${flag(contest.hostFlag)}${html(host)}</span>` : ''}</h2>
      </div>
      <div class="history-winner-pill"><span>${html(t('winner', 'Ganador'))}</span><strong>${countryLine(contest.winner, contest.winnerFlag, contest.winnerCode)}</strong></div>
    </header>
    <div class="history-contest-grid">
      <section class="history-contest-main">
        <h3>${countryLine(contest.winner || t('unknownWinner', 'Ganador no disponible'), contest.winnerFlag, contest.winnerCode)}</h3>
        <p>${winnerLine ? html(winnerLine) : html(t('pendingSong', 'Canción y artista pendientes de confirmar.'))}</p>
        ${Number.isFinite(contest.winnerPoints) ? `<strong>${formatNumber(contest.winnerPoints)} ${html(t('points', 'Puntos').toLowerCase())}</strong>` : ''}
      </section>
      <dl class="history-meta-list">${meta.map(([label, value]) => `<div><dt>${html(label)}</dt><dd>${value.html}</dd></div>`).join('')}</dl>
    </div>
    <details class="history-details">
      <summary>${html(t('viewParticipants', 'Ver resultados y participantes'))}</summary>
      ${renderEntries(contest.entries)}
    </details>
  </article>`;
}

function render() {
  if (!listNode) return;
  const contests = filteredContests();
  if (statusNode) statusNode.textContent = `${contests.length} ${t('found', 'ediciones de Eurovision encontradas.')}`;

  if (!contests.length) {
    listNode.innerHTML = `<article class="empty-state"><span>🔎</span><h2>${html(t('noResultsTitle', 'No hay resultados'))}</h2><p>${html(t('noResultsCopy', 'Prueba con otro país, artista, canción, ciudad o rango de años.'))}</p></article>`;
    return;
  }

  listNode.innerHTML = contests.map(renderContest).join('');
}

[searchNode, fromNode, toNode, sortNode].forEach((node) => node?.addEventListener('input', render));
render();
