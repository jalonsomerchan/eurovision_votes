const dataNode = document.getElementById('history-data');
const historyData = JSON.parse(dataNode?.textContent || '{"contests":[]}');
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
const flag = (src) => src ? `<img class="history-flag" src="${html(src)}" alt="" loading="lazy" decoding="async" width="64" height="64">` : '';
const countryLine = (name, flagSrc) => `<span class="history-country-line">${flag(flagSrc)}<span>${formatValue(name)}</span></span>`;
const textMeta = (value) => ({ html: formatValue(value) });
const htmlMeta = (value) => ({ html: String(value ?? '') });

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
  if (!entries.length) return '<p class="stats-empty">No hay participaciones detalladas para esta edicion.</p>';
  const topEntries = [...entries]
    .sort((a, b) => (a.place ?? 999) - (b.place ?? 999) || (b.points ?? -1) - (a.points ?? -1) || a.country.localeCompare(b.country))
    .slice(0, 12);

  const rows = topEntries.map((entry) => `<tr>
    <td data-label="#">${formatValue(entry.place)}</td>
    <td data-label="Pais"><strong>${countryLine(entry.country, entry.flag)}</strong></td>
    <td data-label="Artista">${formatValue(entry.artist)}</td>
    <td data-label="Cancion">${formatValue(entry.song)}</td>
    <td data-label="Puntos"><strong>${formatValue(entry.points)}</strong></td>
  </tr>`).join('');

  return `<div class="stats-table-wrap history-table-wrap"><table class="stats-table history-entry-table"><thead><tr><th>#</th><th>Pais</th><th>Artista</th><th>Cancion</th><th>Puntos</th></tr></thead><tbody>${rows}</tbody></table></div>${entries.length > topEntries.length ? `<p class="history-more">Mostrando ${topEntries.length} de ${entries.length} participaciones.</p>` : ''}`;
}

function renderContest(contest) {
  const host = [contest.hostCity, contest.hostCountry].filter(Boolean).join(', ');
  const winnerLine = [contest.winnerArtist, contest.winnerSong].filter(Boolean).join(' - ');
  const meta = [
    ['Sede', host ? htmlMeta(countryLine(host, contest.hostFlag)) : textMeta(contest.venue)],
    ['Recinto', textMeta(contest.venue)],
    ['Participantes', textMeta(contest.participants ? formatNumber(contest.participants) : '-')],
    ['Fecha', textMeta(contest.date)],
  ];

  return `<article class="history-contest-card">
    <header>
      <div>
        <p class="eyebrow">Festival ${html(contest.year)}</p>
        <h2>${html(contest.year)}${host ? ` · <span class="history-host-title">${flag(contest.hostFlag)}${html(host)}</span>` : ''}</h2>
      </div>
      <div class="history-winner-pill"><span>Ganador</span><strong>${countryLine(contest.winner, contest.winnerFlag)}</strong></div>
    </header>
    <div class="history-contest-grid">
      <section class="history-contest-main">
        <h3>${countryLine(contest.winner || 'Sin ganador registrado', contest.winnerFlag)}</h3>
        <p>${winnerLine ? html(winnerLine) : 'Datos de la cancion no disponibles.'}</p>
        ${Number.isFinite(contest.winnerPoints) ? `<strong>${formatNumber(contest.winnerPoints)} puntos</strong>` : ''}
      </section>
      <dl class="history-meta-list">${meta.map(([label, value]) => `<div><dt>${html(label)}</dt><dd>${value.html}</dd></div>`).join('')}</dl>
    </div>
    <details class="history-details">
      <summary>Ver participaciones</summary>
      ${renderEntries(contest.entries)}
    </details>
  </article>`;
}

function render() {
  if (!listNode) return;
  const contests = filteredContests();
  if (statusNode) statusNode.textContent = `${contests.length} festivales encontrados.`;

  if (!contests.length) {
    listNode.innerHTML = '<article class="empty-state"><span>🔎</span><h2>No hay resultados</h2><p>Prueba con otro pais, artista, ciudad o rango de años.</p></article>';
    return;
  }

  listNode.innerHTML = contests.map(renderContest).join('');
}

[searchNode, fromNode, toNode, sortNode].forEach((node) => node?.addEventListener('input', render));
render();
