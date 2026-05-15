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
let control = { semifinals: {}, final: { positions: {}, status: 'open', closed: false } };

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
  return control.semifinals?.[contestId] || { qualifiers: [], status: 'pending', closed: false };
}

function getFinalState() {
  return control.final || { positions: {}, status: 'open', closed: false };
}

function normalizeStatus(state, fallback = 'pending') {
  if (state?.status) return state.status;
  if (state?.closed) return 'closed';
  return fallback;
}

function statusLabel(status) {
  if (status === 'open') return 'Votación abierta';
  if (status === 'closed') return 'Votación cerrada';
  return 'Votación pendiente';
}

function statusButtons(status, target) {
  const attribute = target === 'final' ? 'data-final-set-status' : 'data-semi-set-status';
  const contestAttribute = target === 'final' ? '' : ' data-contest-id="${target}"';
  return `<div class="admin-actions"><button class="action-button ${status === 'pending' ? 'action-button--primary' : ''}" type="button" ${attribute}="pending"${contestAttribute}>Pendiente</button><button class="action-button ${status === 'open' ? 'action-button--primary' : ''}" type="button" ${attribute}="open"${contestAttribute}>Iniciar votación</button><button class="action-button ${status === 'closed' ? 'action-button--primary' : ''}" type="button" ${attribute}="closed"${contestAttribute}>Cerrar votación</button></div>`;
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
  const finalState = getFinalState();
  const finalStatus = normalizeStatus(finalState, 'open');
  const finalPositions = finalState.positions || {};

  listNode.innerHTML = [
    ...semifinals.map((contest) => {
      const state = getSemiState(contest.id);
      const status = normalizeStatus(state);
      const qualifiers = new Set(state.qualifiers || []);
      return `<section class="admin-card" data-admin-semi="${contest.id}"><header><div><p class="eyebrow">Semifinal</p><h3>${html(contest.name)}</h3><small>${statusLabel(status)}</small></div>${statusButtons(status, contest.id)}</header><div class="admin-grid">${contest.songs.map((song) => `<div class="admin-row"><label><input type="checkbox" data-qualifier-contest="${contest.id}" data-song-key="${keyFor(song)}" ${qualifiers.has(keyFor(song)) ? 'checked' : ''}><span><strong>${html(song.country)}</strong><small>${html(song.artist)} - ${html(song.song)}</small></span></label></div>`).join('')}</div></section>`;
    }),
    `<section class="admin-card" data-admin-final><header><div><p class="eyebrow">Final</p><h3>Votación y posiciones finales</h3><small>${statusLabel(finalStatus)} · ${finalSongs.length ? 'Ordena los puestos cuando termine la final' : 'Aparecerán aquí los clasificados'}</small></div>${statusButtons(finalStatus, 'final')}</header><div class="admin-grid">${finalSongs.length ? finalSongs.map((song) => `<div class="admin-row"><label><span><strong>${html(song.country)}</strong><small>${html(song.artist)} - ${html(song.song)}</small></span></label><input class="position-input" type="number" min="1" step="1" data-final-position="${keyFor(song)}" value="${finalPositions[keyFor(song)] || ''}" placeholder="Puesto"></div>`).join('') : '<p class="stats-empty">Todavía no hay países clasificados.</p>'}</div></section>`,
  ].join('');
}

function readQualifiersFromDom(contestId) {
  return [...document.querySelectorAll(`[data-qualifier-contest="${contestId}"]:checked`)].map((input) => input.dataset.songKey);
}

function readPositionsFromDom() {
  const positions = {};
  document.querySelectorAll('[data-final-position]').forEach((input) => {
    const value = Number(input.value);
    if (Number.isFinite(value) && value > 0) positions[input.dataset.finalPosition] = value;
  });
  return positions;
}

function syncFormToControl() {
  const semifinals = { ...(control.semifinals || {}) };
  contests.filter((contest) => isSemi(contest.id)).forEach((contest) => {
    const previous = getSemiState(contest.id);
    const status = normalizeStatus(previous);
    semifinals[contest.id] = {
      qualifiers: readQualifiersFromDom(contest.id),
      status,
      closed: status === 'closed',
    };
  });
  const finalStatus = normalizeStatus(getFinalState(), 'open');
  control = {
    semifinals,
    final: {
      ...getFinalState(),
      positions: readPositionsFromDom(),
      status: finalStatus,
      closed: finalStatus === 'closed',
    },
    updatedAt: new Date().toISOString(),
  };
}

function setSemiStatus(contestId, status) {
  syncFormToControl();
  const previous = control.semifinals?.[contestId] || { qualifiers: [] };
  control = {
    ...control,
    semifinals: {
      ...(control.semifinals || {}),
      [contestId]: {
        ...previous,
        status,
        closed: status === 'closed',
      },
    },
  };
  render();
  queueSave(false);
}

function setFinalStatus(status) {
  syncFormToControl();
  control = {
    ...control,
    final: {
      ...getFinalState(),
      status,
      closed: status === 'closed',
    },
  };
  render();
  queueSave(false);
}

function queueSave(renderAfterSave = false) {
  window.clearTimeout(saveTimer);
  setStatus('Cambios pendientes de guardar...');
  saveTimer = window.setTimeout(() => saveControl(renderAfterSave), 450);
}

async function loadControl() {
  if (!db) return;
  try {
    setStatus('Cargando resultados...');
    const snapshot = await getDoc(doc(db, controlCollection, controlDocument));
    if (snapshot.exists()) control = { ...control, ...snapshot.data(), final: { ...getFinalState(), ...(snapshot.data().final || {}) } };
    render();
    setStatus('Resultados cargados. Los cambios se guardan automáticamente.');
  } catch (error) {
    console.error(error);
    setStatus(`No se pudieron cargar los resultados: ${error?.message || 'error'}.`, true);
  }
}

async function saveControl(renderAfterSave = false) {
  if (!db) return;
  try {
    syncFormToControl();
    setStatus('Guardando automáticamente...');
    await setDoc(doc(db, controlCollection, controlDocument), { ...control, updatedAt: serverTimestamp() }, { merge: true });
    if (renderAfterSave) render();
    setStatus('Guardado automáticamente.');
  } catch (error) {
    console.error(error);
    setStatus(`No se pudieron guardar los resultados: ${error?.message || 'error'}.`, true);
  }
}

listNode?.addEventListener('click', (event) => {
  const finalButton = event.target.closest('[data-final-set-status]');
  if (finalButton) {
    setFinalStatus(finalButton.dataset.finalSetStatus);
    return;
  }

  const button = event.target.closest('[data-semi-set-status]');
  if (!button) return;
  setSemiStatus(button.dataset.contestId, button.dataset.semiSetStatus);
});

listNode?.addEventListener('change', (event) => {
  if (event.target.matches('[data-qualifier-contest]')) {
    syncFormToControl();
    render();
    queueSave(false);
  }
});

listNode?.addEventListener('input', (event) => {
  if (event.target.matches('[data-final-position]')) queueSave(false);
});

refreshButton?.addEventListener('click', loadControl);
loadControl();
