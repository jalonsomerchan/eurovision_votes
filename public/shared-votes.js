import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { initializeFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

const contests = JSON.parse(document.getElementById('shared-contests')?.textContent || '[]');
const firebaseConfig = JSON.parse(document.getElementById('shared-firebase-config')?.textContent || '{}');
const $ = (selector) => document.querySelector(selector);
const subtitleNode = $('[data-shared-subtitle]');
const statusNode = $('[data-shared-status]');
const summaryNode = $('[data-shared-summary]');
const listNode = $('[data-shared-list]');
const params = new URLSearchParams(window.location.search);
const userId = params.get('u');
let db = null;

const html = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
const keyFor = (song) => `${song.flag}-${song.country}`.toLowerCase();
const setStatus = (text, error = false) => { statusNode.textContent = text; statusNode.classList.toggle('is-error', error); };
const average = (values) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
const fmt = (value) => Number.isFinite(value) ? value.toFixed(2).replace('.', ',') : '—';

try {
  const app = initializeApp(firebaseConfig);
  db = initializeFirestore(app, { experimentalForceLongPolling: true, useFetchStreams: false });
} catch (error) {
  console.error(error);
  setStatus('Firebase no está configurado.', true);
}

function render(voter) {
  const voteData = voter.votes || {};
  const rows = contests.map((contest) => {
    const contestVotes = voteData[contest.id] || {};
    const songs = contest.songs.map((song) => ({ ...song, key: keyFor(song), score: contestVotes[keyFor(song)] })).filter((song) => Number.isFinite(song.score));
    return { ...contest, songs, average: average(songs.map((song) => song.score)), total: songs.reduce((sum, song) => sum + song.score, 0) };
  });
  const allScores = rows.flatMap((contest) => contest.songs.map((song) => song.score));

  subtitleNode.textContent = `Votaciones de ${voter.voterName || 'usuario'} en Eurovision Votes 2026.`;
  summaryNode.innerHTML = [
    ['Usuario', voter.voterName || 'Sin nombre'],
    ['Votos', allScores.length],
    ['Media', fmt(average(allScores))],
    ['Total puntos', allScores.reduce((sum, score) => sum + score, 0)],
  ].map(([label, value]) => `<div class="stats-kpi"><span>${html(label)}</span><strong>${html(value)}</strong></div>`).join('');

  listNode.innerHTML = rows.map((contest) => `<section class="admin-card"><header><div><p class="eyebrow">${html(contest.name)}</p><h3>${contest.songs.length ? `${contest.songs.length} votos` : 'Sin votos'}</h3><small>Media ${fmt(contest.average)} · Total ${contest.total}</small></div></header><div class="admin-grid">${contest.songs.length ? contest.songs.sort((a, b) => b.score - a.score || a.country.localeCompare(b.country)).map((song) => `<div class="admin-row"><label><span><strong>${html(song.country)}</strong><small>${html(song.artist)} - ${html(song.song)}</small></span></label><strong class="selected-score">${song.score}</strong></div>`).join('') : '<p class="stats-empty">No hay votos en esta gala.</p>'}</div></section>`).join('');
}

async function loadSharedVotes() {
  if (!db) return;
  if (!userId) {
    setStatus('Falta el identificador del usuario en el enlace.', true);
    return;
  }
  try {
    setStatus('Cargando votaciones...');
    const snapshot = await getDoc(doc(db, 'eurovision2026Votes', userId));
    if (!snapshot.exists()) {
      setStatus('No se encontraron votaciones para este enlace.', true);
      return;
    }
    render({ id: snapshot.id, ...snapshot.data() });
    setStatus('Votaciones cargadas.');
  } catch (error) {
    console.error(error);
    setStatus(`No se pudieron cargar las votaciones: ${error?.message || 'error'}.`, true);
  }
}

loadSharedVotes();
