import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { initializeFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

const contests = JSON.parse(document.getElementById('stats-contests')?.textContent || '[]');
const firebaseConfig = JSON.parse(document.getElementById('stats-firebase-config')?.textContent || '{}');
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const statusNode = $('[data-stats-status]');
const summaryNode = $('[data-stats-summary]');
const rankingNode = $('[data-country-ranking]');
const distributionNode = $('[data-country-distribution]');
const userSummaryNode = $('[data-user-summary]');
const userVotesNode = $('[data-user-votes]');

let db = null;
let voters = [];
let filter = 'all';

const html = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
const average = (values) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
const formatAverage = (value) => Number.isFinite(value) ? value.toFixed(2).replace('.', ',') : '-';
const keyFor = (song) => `${song.flag}-${song.country}`.toLowerCase();
const setStatus = (text, error = false) => {
  if (!statusNode) return;
  statusNode.textContent = text;
  statusNode.classList.toggle('is-error', error);
};

try {
  const app = initializeApp(firebaseConfig);
  db = initializeFirestore(app, { experimentalForceLongPolling: true, useFetchStreams: false });
} catch (error) {
  console.error(error);
  setStatus('Firebase no esta configurado.', true);
}

function getSongs() {
  return contests
    .filter((contest) => filter === 'all' || contest.id === filter)
    .flatMap((contest) => contest.songs.map((song) => ({ ...song, contestId: contest.id, contestName: contest.name, key: keyFor(song) })));
}

function scoreOf(voter, song) {
  const score = voter.votes?.[song.contestId]?.[song.key];
  return Number.isFinite(score) ? score : null;
}

function countryStats() {
  return getSongs().map((song) => {
    const scores = voters.map((voter) => scoreOf(voter, song)).filter(Number.isFinite);
    const distribution = Array.from({ length: 11 }, (_, score) => scores.filter((value) => value === score).length);
    return {
      ...song,
      scores,
      distribution,
      mean: average(scores),
      total: scores.reduce((sum, score) => sum + score, 0),
      count: scores.length,
      min: scores.length ? Math.min(...scores) : null,
      max: scores.length ? Math.max(...scores) : null,
    };
  }).sort((a, b) => (b.mean ?? -1) - (a.mean ?? -1) || b.count - a.count || a.country.localeCompare(b.country));
}

function userStats() {
  const songs = getSongs();
  return voters.map((voter) => {
    const scores = songs.map((song) => ({ song, score: scoreOf(voter, song) })).filter((row) => Number.isFinite(row.score));
    const values = scores.map((row) => row.score);
    const top = [...scores].sort((a, b) => b.score - a.score)[0];
    return {
      ...voter,
      scores,
      top,
      mean: average(values),
      count: scores.length,
      total: values.reduce((sum, score) => sum + score, 0),
    };
  }).sort((a, b) => (b.mean ?? -1) - (a.mean ?? -1) || b.count - a.count || a.name.localeCompare(b.name));
}

function renderSummary() {
  const countries = countryStats();
  const users = userStats();
  const allScores = countries.flatMap((country) => country.scores);
  const leader = countries.find((country) => country.count > 0);
  const mostVoted = [...countries].sort((a, b) => b.count - a.count)[0];
  const completeUsers = users.filter((user) => user.count === getSongs().length && getSongs().length > 0).length;
  const items = [
    ['Votantes', voters.length],
    ['Votos emitidos', allScores.length],
    ['Media global', formatAverage(average(allScores))],
    ['Lider', leader ? `${leader.country} (${formatAverage(leader.mean)})` : '-'],
    ['Mas votado', mostVoted ? `${mostVoted.country} (${mostVoted.count})` : '-'],
    ['Usuarios completos', completeUsers],
  ];
  summaryNode.innerHTML = items.map(([label, value]) => `<div class="stats-kpi"><span>${html(label)}</span><strong>${html(value)}</strong></div>`).join('');
}

function renderRanking() {
  const rows = countryStats();
  if (!rows.length) {
    rankingNode.innerHTML = '<p class="stats-empty">No hay canciones en esta gala.</p>';
    return;
  }
  rankingNode.innerHTML = `<table class="stats-table"><thead><tr><th>#</th><th>Pais</th><th>Gala</th><th>Votos</th><th>Media</th><th>Total</th><th>Min.</th><th>Max.</th></tr></thead><tbody>${rows.map((row, index) => `<tr><td>${index + 1}</td><td><span class="stats-country"><img src="https://flagsapi.com/${row.flag}/flat/64.png" alt="" loading="lazy"><strong>${html(row.country)}</strong><small>${html(row.artist)} - ${html(row.song)}</small></span></td><td>${html(row.contestName)}</td><td>${row.count}</td><td><strong>${formatAverage(row.mean)}</strong></td><td>${row.total}</td><td>${row.min ?? '-'}</td><td>${row.max ?? '-'}</td></tr>`).join('')}</tbody></table>`;
}

function renderDistribution() {
  const rows = countryStats().filter((row) => row.count);
  if (!rows.length) {
    distributionNode.innerHTML = '<p class="stats-empty">Todavia no hay votos para calcular distribucion.</p>';
    return;
  }
  distributionNode.innerHTML = rows.map((row) => {
    const max = Math.max(...row.distribution, 1);
    const bars = row.distribution.map((count, score) => `<div class="score-bar"><span>${score}</span><div style="--bar-size:${(count / max) * 100}%"></div><strong>${count}</strong></div>`).join('');
    return `<section class="distribution-card"><header><strong>${html(row.country)}</strong><span>${row.count} votos - media ${formatAverage(row.mean)}</span></header><div class="score-bars">${bars}</div></section>`;
  }).join('');
}

function renderUsers() {
  const rows = userStats();
  if (!rows.length) {
    userSummaryNode.innerHTML = '<p class="stats-empty">Todavia no hay votantes.</p>';
    return;
  }
  userSummaryNode.innerHTML = `<table class="stats-table"><thead><tr><th>Usuario</th><th>Votos</th><th>Media</th><th>Total</th><th>Mayor puntuacion</th><th>Actualizado</th></tr></thead><tbody>${rows.map((row) => `<tr><td><strong>${html(row.name)}</strong></td><td>${row.count}</td><td><strong>${formatAverage(row.mean)}</strong></td><td>${row.total}</td><td>${row.top ? `${row.top.score} a ${html(row.top.song.country)}` : '-'}</td><td>${html(row.updated)}</td></tr>`).join('')}</tbody></table>`;
}

function renderMatrix() {
  const songs = getSongs();
  const users = userStats();
  if (!songs.length || !users.length) {
    userVotesNode.innerHTML = '<p class="stats-empty">No hay datos suficientes para mostrar el detalle.</p>';
    return;
  }
  userVotesNode.innerHTML = `<table class="stats-table stats-table--matrix"><thead><tr><th>Usuario</th>${songs.map((song) => `<th>${html(song.country)}</th>`).join('')}<th>Media</th></tr></thead><tbody>${users.map((user) => `<tr><td><strong>${html(user.name)}</strong></td>${songs.map((song) => `<td>${scoreOf(user, song) ?? '-'}</td>`).join('')}<td><strong>${formatAverage(user.mean)}</strong></td></tr>`).join('')}</tbody></table>`;
}

function render() {
  renderSummary();
  renderRanking();
  renderDistribution();
  renderUsers();
  renderMatrix();
}

async function loadStats() {
  if (!db) return;
  try {
    setStatus('Cargando estadisticas...');
    const snapshot = await getDocs(collection(db, 'eurovision2026Votes'));
    voters = snapshot.docs.map((item) => {
      const data = item.data();
      return {
        id: item.id,
        name: data.voterName || 'Sin nombre',
        votes: data.votes || {},
        updated: data.updatedAt?.toDate ? data.updatedAt.toDate().toLocaleString('es-ES') : '-',
      };
    });
    render();
    setStatus(`Estadisticas actualizadas: ${voters.length} votantes.`);
  } catch (error) {
    console.error(error);
    setStatus(`No se pudieron cargar las estadisticas: ${error?.message || 'error'}.`, true);
  }
}

$$('[data-stats-filter]').forEach((button) => button.addEventListener('click', () => {
  filter = button.dataset.statsFilter;
  $$('[data-stats-filter]').forEach((item) => item.classList.toggle('is-active', item === button));
  render();
}));

$('[data-refresh-stats]')?.addEventListener('click', loadStats);
loadStats();
