import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { initializeFirestore, doc, getDoc, serverTimestamp, setDoc } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

const contests = JSON.parse(document.getElementById('admin-contests')?.textContent || '[]');
const firebaseConfig = JSON.parse(document.getElementById('admin-firebase-config')?.textContent || '{}');
const $ = (selector) => document.querySelector(selector);
const listNode = $('[data-admin-list]');
const statusNode = $('[data-admin-status]');
const refreshButton = $('[data-admin-refresh]');
const controlCollection = 'eurovision2026Control';
const controlDocument = 'results';
let db = null;
let saveTimer = null;
let isSaving = false;
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
  return control.semifinals?.[contestId] || { qualifiers: [], status: 'pending' };
}

function getSemiStatus(contestId) {
  const state = getSemiState(contestId);
  if (state.status) return state.status;
  return state.closed ? 'closed' : 'open';
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
      const status = getSemiStatus(contest.id);
      const qualifiers = new Set(state.qualifiers || []);
      return `<section class="admin-card" data-admin-semi="${contest.id}"><header><div><p class="eyebrow">Semifinal</p><h3>${html(contest.name)}</h3><small>${status === 'closed' ? 'Votación cerrada' : status === 'open' ? 'Votación abierta' : 'Votación pendiente'}</small></div><div class="admin-actions"><label><input type="radio" name="status-${contest.id}" data-semi-status="${contest.id}" value="pending" ${status === 'pending' ? 'checked' : ''}> Pendiente</label><label><input type="radio" name="status-${contest.id}" data-semi-status="${contest.id}" value="open" ${status === 'open' ? 'checked' : ''}> Iniciar</label><label><input type="radio" name="status-${contest.id}" data-semi-status="${contest.id}" value="closed" ${status === 'closed' ? 'checked' : ''}> Cerrar</label></div></header><div class="admin-grid">${contest.songs.map((song) => `<div class="admin-row"><label><input type="checkbox" data-qualifier-contest="${contest.id}" data-song-key="${keyFor(song)}" ${qualifiers.has(keyFor(song)) ? 'checked' : ''}><span><strong>${html(song.country)}</strong><small>${html(song.artist)} - ${html(song.song)}</small></span></label></div>`).join('')}</div></section>`;
    }),
    `<section class="admin-card"><header><div><p class="eyebrow">Final</p><h3>Posiciones finales</h3><small>${finalSongs.length ? 'Ordena los puestos cuando termine la final' : 'Aparecerán aquí los clasificados'}</small></div></header><div class="admin-grid">${finalSongs.length ? finalSongs.map((song) => `<div class="admin-row"><label><span><strong>${html(song.country)}</strong><small>${html(song.artist)} - ${html(song.song)}</small></span></label><input class="position-input" type="number" min="1" step="1" data-final-position="${keyFor(song)}" value="${finalPositions[keyFor(song)] || ''}" placeholder="Puesto"></div>`).join('') : '<p class="stats-empty">Todavía no hay países clasificados.</p>'}</div></section>`,
  ].join('');
}

function readForm() {
  const semifinals = {};
  contests.filter((contest) => isSemi(contest.id)).forEach((contest) => {
    const qualifiers = [...document.querySelectorAll(`[data-qualifier-contest="${contest.id}"]:checked`)].map((input) => input.dataset.songKey);
    const statusInput = document.querySelector(`[data-semi-status="${contest.id}"]:checked`);
    const status = statusInput?.value || 'pending';
    semifinals[contest.id] = { qualifiers, status, closed: status === 'closed' };
  });
  const positions = {};
  document.querySelectorAll('[data-final-position]').forEach((input) => {
    const value = Number(input.value);
    if (Number.isFinite(value) && value > 0) positions[input.dataset.finalPosition] = value;
  });
  control = { semifinals, final: { positions }, updatedAt: new Date().toISOString() };
}

function queueSave(renderAfterSave = false) {
  window.clearTimeout(saveTimer);
  setStatus('Cambios pendientes de guardar...');
  saveTimer = window.setTimeout(() => saveControl(renderAfterSave), 650);
}

async function loadControl() {
  if (!db) return;
  try {
    setStatus('Cargando resultados...');
    const snapshot = await getDoc(doc(db, controlCollection, controlDocument));
    if (snapshot.exists()) control = { ...control, ...snapshot.data() };
    render();
    setStatus('Resultados cargados. Los cambios se guardan automáticamente.');
  } catch (error) {
    console.error(error);
    setStatus(`No se pudieron cargar los resultados: ${error?.message || 'error'}.`, true);
  }
}

async function saveControl(renderAfterSave = false) {
  if (!db || isSaving) return;
  try {
    isSaving = true;
    readForm();
    setStatus('Guardando automáticamente...');
    await setDoc(doc(db, controlCollection, controlDocument), { ...control, updatedAt: serverTimestamp() }, { merge: true });
    if (renderAfterSave) render();
    setStatus('Guardado automáticamente.');
  } catch (error) {
    console.error(error);
    setStatus(`No se pudieron guardar los resultados: ${error?.message || 'error'}.`, true);
  } finally {
    isSaving = false;
  }
}

listNode?.addEventListener('change', (event) => {
  if (event.target.matches('[data-semi-status], [data-qualifier-contest], [data-final-position]')) {
    readForm();
    const shouldRender = event.target.matches('[data-semi-status], [data-qualifier-contest]');
    if (shouldRender) render();
    queueSave(shouldRender);
  }
});

listNode?.addEventListener('input', (event) => {
  if (event.target.matches('[data-final-position]')) queueSave(false);
});

refreshButton?.addEventListener('click', loadControl);
loadControl();
