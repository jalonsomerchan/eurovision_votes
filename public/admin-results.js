import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { initializeFirestore, doc, getDoc, serverTimestamp, setDoc } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

const contests = JSON.parse(document.getElementById('admin-contests')?.textContent || '[]');
const firebaseConfig = JSON.parse(document.getElementById('admin-firebase-config')?.textContent || '{}');
const $ = (selector) => document.querySelector(selector);
const listNode = $('[data-admin-list]');
const statusNode = $('[data-admin-status]');
const saveButton = $('[data-admin-save]');
const refreshButton = $('[data-admin-refresh]');
const controlCollection = 'eurovision2026Control';
const controlDocument = 'results';
let db = null;
let control = { semifinals: {}, final: { positions: {} } };

const keyFor = (song) => `${song.flag}-${song.country}`.toLowerCase();
const html = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
const setStatus = (text, error = false) => { statusNode.textContent = text; statusNode.classList.toggle('is-error', error); };
const isSemi = (id) => id === 'semi-1' || id === 'semi-2';

try {
  const app = initializeApp(firebaseConfig);
  db = initializeFirestore(app, { experimentalForceLongPolling: true, useFetchStreams: false });
} catch (error) {
  console.error(error);
  setStatus('Firebase no está configurado.', true);
}

function getSemiState(contestId) {
  return control.semifinals?.[contestId] || { qualifiers: [], closed: false };
}

function getFinalSongs() {
  const qualified = [];
  contests.filter((contest) => isSemi(contest.id)).forEach((contest) => {
    const qualifiers = new Set(getSemiState(contest.id).qualifiers || []);
    contest.songs.forEach((song) => {
      if (qualifiers.has(keyFor(song))) qualified.push({ ...song, fromContest: contest.name });
    });
  });
  const baseFinal = contests.find((contest) => contest.id === 'final')?.songs || [];
  return baseFinal.length ? baseFinal : qualified;
}

function render() {
  const semifinals = contests.filter((contest) => isSemi(contest.id));
  const finalSongs = getFinalSongs();
  const finalPositions = control.final?.positions || {};

  listNode.innerHTML = [
    ...semifinals.map((contest) => {
      const state = getSemiState(contest.id);
      const qualifiers = new Set(state.qualifiers || []);
      return `<section class="admin-card" data-admin-semi="${contest.id}"><header><div><p class="eyebrow">Semifinal</p><h3>${html(contest.name)}</h3><small>${state.closed ? 'Votación cerrada' : 'Votación abierta'}</small></div><label><input type="checkbox" data-semi-closed="${contest.id}" ${state.closed ? 'checked' : ''}> Cerrar votación</label></header><div class="admin-grid">${contest.songs.map((song) => `<div class="admin-row"><label><input type="checkbox" data-qualifier-contest="${contest.id}" data-song-key="${keyFor(song)}" ${qualifiers.has(keyFor(song)) ? 'checked' : ''}><span><strong>${html(song.country)}</strong><small>${html(song.artist)} - ${html(song.song)}</small></span></label></div>`).join('')}</div></section>`;
    }),
    `<section class="admin-card"><header><div><p class="eyebrow">Final</p><h3>Posiciones finales</h3><small>${finalSongs.length ? 'Ordena los puestos cuando termine la final' : 'Aparecerán aquí los clasificados'}</small></div></header><div class="admin-grid">${finalSongs.length ? finalSongs.map((song) => `<div class="admin-row"><label><span><strong>${html(song.country)}</strong><small>${html(song.artist)} - ${html(song.song)}</small></span></label><input class="position-input" type="number" min="1" step="1" data-final-position="${keyFor(song)}" value="${finalPositions[keyFor(song)] || ''}" placeholder="Puesto"></div>`).join('') : '<p class="stats-empty">Todavía no hay países clasificados.</p>'}</div></section>`,
  ].join('');
}

function readForm() {
  const semifinals = {};
  contests.filter((contest) => isSemi(contest.id)).forEach((contest) => {
    const qualifiers = [...document.querySelectorAll(`[data-qualifier-contest="${contest.id}"]:checked`)].map((input) => input.dataset.songKey);
    const closedInput = document.querySelector(`[data-semi-closed="${contest.id}"]`);
    semifinals[contest.id] = { qualifiers, closed: Boolean(closedInput?.checked) };
  });
  const positions = {};
  document.querySelectorAll('[data-final-position]').forEach((input) => {
    const value = Number(input.value);
    if (Number.isFinite(value) && value > 0) positions[input.dataset.finalPosition] = value;
  });
  control = { semifinals, final: { positions }, updatedAt: new Date().toISOString() };
}

async function loadControl() {
  if (!db) return;
  try {
    setStatus('Cargando resultados...');
    const snapshot = await getDoc(doc(db, controlCollection, controlDocument));
    if (snapshot.exists()) control = { ...control, ...snapshot.data() };
    render();
    setStatus('Resultados cargados.');
  } catch (error) {
    console.error(error);
    setStatus(`No se pudieron cargar los resultados: ${error?.message || 'error'}.`, true);
  }
}

async function saveControl() {
  if (!db) return;
  try {
    readForm();
    setStatus('Guardando resultados...');
    await setDoc(doc(db, controlCollection, controlDocument), { ...control, updatedAt: serverTimestamp() }, { merge: true });
    render();
    setStatus('Resultados guardados.');
  } catch (error) {
    console.error(error);
    setStatus(`No se pudieron guardar los resultados: ${error?.message || 'error'}.`, true);
  }
}

saveButton?.addEventListener('click', saveControl);
refreshButton?.addEventListener('click', loadControl);
loadControl();
