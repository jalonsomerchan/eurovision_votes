import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { initializeFirestore, collection, doc, getDoc, getDocs, onSnapshot, serverTimestamp, setDoc } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

const storageKey = 'eurovision-2026-votes-v1';
const voterKey = 'eurovision-2026-voter-v1';
const deviceKey = 'eurovision-2026-device-id-v1';
const votesCollection = 'eurovision2026Votes';
const controlCollection = 'eurovision2026Control';
const controlDocument = 'results';
const contests = JSON.parse(document.getElementById('eurovision-contests')?.textContent || '[]');
const firebaseConfig = JSON.parse(document.getElementById('firebase-config')?.textContent || '{}');
const $ = (selector) => document.querySelector(selector);

const tabs = $('[data-tabs]');
const songList = $('[data-song-list]');
const activeName = $('[data-active-name]');
const votedCount = $('[data-voted-count]');
const cloudStatus = $('[data-cloud-status]');
const feedback = $('[data-feedback]');
const importInput = $('[data-import]');
const voterNameNode = $('[data-voter-name]');
const nameModal = $('[data-name-modal]');
const settingsModal = $('[data-settings-modal]');
const nameForm = $('[data-name-form]');
const nameInput = $('#voter-name-input');

let db = null;
let feedbackTimeoutId;
let saveTimeoutId;
let activeContestId = contests[0]?.id || 'semi-1';
let votes = loadJson(storageKey, {});
let voter = loadJson(voterKey, null);
let deviceId = localStorage.getItem(deviceKey);
let allVoters = [];
let control = { semifinals: {}, final: { positions: {} } };
let realtimeReady = false;

if (!deviceId) {
  deviceId = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
  localStorage.setItem(deviceKey, deviceId);
}

try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId) {
    const app = initializeApp(firebaseConfig);
    db = initializeFirestore(app, { experimentalForceLongPolling: true, useFetchStreams: false });
    setCloudStatus('Preparado');
  }
} catch (error) {
  console.error('Firebase init error:', error);
  setCloudStatus('Error');
}

function loadJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
}

function setCloudStatus(text) {
  if (cloudStatus) cloudStatus.textContent = text;
}

function showFeedback(message) {
  if (!feedback) return;
  feedback.textContent = message;
  window.clearTimeout(feedbackTimeoutId);
  feedbackTimeoutId = window.setTimeout(() => feedback.textContent = '', 5000);
}

function openModal(modal) {
  if (!modal) return;
  modal.hidden = false;
  document.documentElement.classList.add('has-modal');
}

function closeModal(modal) {
  if (!modal) return;
  modal.hidden = true;
  if (nameModal?.hidden && settingsModal?.hidden) document.documentElement.classList.remove('has-modal');
}

function getSongKey(song) {
  return `${song.flag}-${song.country}`.toLowerCase();
}

function getContest(contestId) {
  return contests.find((contest) => contest.id === contestId) || contests[0];
}

function isSemi(contestId) {
  return contestId === 'semi-1' || contestId === 'semi-2';
}

function getSemiState(contestId) {
  return control?.semifinals?.[contestId] || { qualifiers: [], status: 'pending', closed: false };
}

function getSemiStatus(contestId) {
  const state = getSemiState(contestId);
  if (state.status) return state.status;
  return state.closed ? 'closed' : 'open';
}

function getFinalPositions() {
  return control?.final?.positions || {};
}

function getSongsForContest(contest) {
  if (contest.id !== 'final' || contest.songs.length) return contest.songs;
  const qualified = [];
  contests.filter((item) => isSemi(item.id)).forEach((semi) => {
    const qualifiers = new Set(getSemiState(semi.id).qualifiers || []);
    semi.songs.forEach((song) => {
      if (qualifiers.has(getSongKey(song))) qualified.push({ ...song, qualifiedFrom: semi.name });
    });
  });
  return qualified;
}

function getAverage(contestId, songKey) {
  const scores = allVoters.map((item) => item.votes?.[contestId]?.[songKey]).filter(Number.isFinite);
  if (!scores.length) return null;
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

function formatAverage(value) {
  return Number.isFinite(value) ? value.toFixed(2).replace('.', ',') : '—';
}

function saveLocalVotes() {
  localStorage.setItem(storageKey, JSON.stringify(votes));
}

function saveVoter(name) {
  voter = { name: name.trim(), deviceId };
  localStorage.setItem(voterKey, JSON.stringify(voter));
  renderVoter();
  queueCloudSave();
}

function renderVoter() {
  if (voterNameNode) voterNameNode.textContent = voter?.name || 'Sin nombre';
}

function renderTabs() {
  if (!tabs) return;
  tabs.innerHTML = contests.map((contest) => {
    const songs = getSongsForContest(contest);
    const selected = contest.id === activeContestId;
    const disabled = songs.length === 0;
    const totalVotes = Object.keys(votes[contest.id] || {}).length;
    const status = isSemi(contest.id) ? getSemiStatus(contest.id) : 'open';
    const label = disabled ? 'Pendiente' : status === 'closed' ? 'Cerrada' : status === 'pending' ? 'Pendiente' : `${totalVotes}/${songs.length}`;
    return `<button class="tab ${selected ? 'is-active' : ''}" type="button" role="tab" aria-selected="${selected}" data-contest-id="${contest.id}"><span>${escapeHtml(contest.name)}</span><small>${label}</small></button>`;
  }).join('');
}

function renderSummary(contest) {
  const songs = getSongsForContest(contest);
  const scores = Object.values(votes[contest.id] || {}).filter(Number.isFinite);
  if (activeName) activeName.textContent = contest.name;
  if (votedCount) votedCount.textContent = `${scores.length}/${songs.length}`;
}

function renderSongs() {
  const contest = getContest(activeContestId);
  const songs = getSongsForContest(contest);
  const contestVotes = votes[contest.id] || {};
  const semiState = getSemiState(contest.id);
  const semiStatus = getSemiStatus(contest.id);
  const qualifiers = new Set(semiState.qualifiers || []);
  const positions = getFinalPositions();
  const votingClosed = isSemi(contest.id) && semiStatus === 'closed';
  const votingPending = isSemi(contest.id) && semiStatus === 'pending';

  renderTabs();
  renderSummary(contest);

  if (!songList) return;
  if (!songs.length) {
    songList.innerHTML = `<article class="empty-state"><span aria-hidden="true">🎤</span><h2>${escapeHtml(contest.name)}</h2><p>Pendiente</p></article>`;
    return;
  }

  songList.innerHTML = songs.map((song) => {
    const songKey = getSongKey(song);
    const currentScore = contestVotes[songKey];
    const average = getAverage(contest.id, songKey);
    const badges = [];
    badges.push(`<span class="result-badge result-badge--average">Media ${formatAverage(average)}</span>`);
    if (isSemi(contest.id) && semiStatus === 'closed') badges.push(qualifiers.has(songKey) ? '<span class="result-badge result-badge--qualified">Pasa a la final</span>' : '<span class="result-badge">No clasificado</span>');
    if (contest.id === 'final' && positions[songKey]) badges.push(`<span class="result-badge result-badge--qualified">Puesto ${positions[songKey]}</span>`);
    const scoreButtons = Array.from({ length: 11 }, (_, score) => `<button class="score-button ${currentScore === score ? 'is-selected' : ''}" type="button" aria-pressed="${currentScore === score}" data-score="${score}" data-song-key="${songKey}" ${votingClosed || votingPending ? 'disabled' : ''}>${score}</button>`).join('');
    const message = votingClosed ? 'Votación cerrada para esta semifinal.' : votingPending ? 'Votación pendiente de inicio.' : '';
    return `<article class="song-card ${votingClosed || votingPending ? 'is-closed' : ''}"><div class="song-main"><img class="flag" width="64" height="48" loading="lazy" alt="Bandera de ${escapeHtml(song.country)}" src="https://flagsapi.com/${song.flag}/flat/64.png" /><div class="song-info"><div class="song-meta"><span class="running-order">${song.runningOrder || 'FD'}</span>${song.directFinalist ? '<span class="direct-badge">Finalista directo</span>' : ''}${badges.join('')}</div><h2>${escapeHtml(song.country)}</h2><p><strong>${escapeHtml(song.artist)}</strong> — «${escapeHtml(song.song)}»</p></div><div class="selected-score" aria-label="Puntuación actual">${currentScore ?? '—'}</div></div>${message ? `<p class="closed-note">${message}</p>` : `<div class="score-grid" aria-label="Puntuar ${escapeHtml(song.country)} del 0 al 10">${scoreButtons}</div>`}</article>`;
  }).join('');
}

function queueCloudSave() {
  window.clearTimeout(saveTimeoutId);
  saveTimeoutId = window.setTimeout(saveCloudVotes, 500);
}

async function withTimeout(promise, ms) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error('timeout')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => window.clearTimeout(timeoutId));
}

async function loadCloudData() {
  if (!db) return;
  try {
    const [votesSnapshot, controlSnapshot] = await Promise.all([
      getDocs(collection(db, votesCollection)),
      getDoc(doc(db, controlCollection, controlDocument)),
    ]);
    allVoters = votesSnapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    control = controlSnapshot.exists() ? { ...control, ...controlSnapshot.data() } : control;
    renderSongs();
  } catch (error) {
    console.error('Cloud data load error:', error);
  }
}

function startRealtimeListeners() {
  if (!db || realtimeReady) return;
  realtimeReady = true;

  onSnapshot(doc(db, controlCollection, controlDocument), (snapshot) => {
    control = snapshot.exists() ? { semifinals: {}, final: { positions: {} }, ...snapshot.data() } : { semifinals: {}, final: { positions: {} } };
    renderSongs();
  }, (error) => {
    console.error('Control realtime error:', error);
    loadCloudData();
  });

  onSnapshot(collection(db, votesCollection), (snapshot) => {
    allVoters = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    renderSongs();
  }, (error) => {
    console.error('Votes realtime error:', error);
  });
}

async function saveCloudVotes() {
  if (!db) return;
  if (!voter?.name) {
    setCloudStatus('Falta nombre');
    openModal(nameModal);
    nameInput?.focus();
    return;
  }
  if (isSemi(activeContestId) && getSemiStatus(activeContestId) !== 'open') {
    setCloudStatus(getSemiStatus(activeContestId) === 'closed' ? 'Cerrada' : 'Pendiente');
    showFeedback(getSemiStatus(activeContestId) === 'closed' ? 'La votación de esta semifinal está cerrada.' : 'La votación de esta semifinal todavía no ha empezado.');
    return;
  }

  try {
    setCloudStatus('Guardando...');
    await withTimeout(setDoc(doc(db, votesCollection, deviceId), {
      voterName: voter.name,
      deviceId,
      votes,
      updatedAt: serverTimestamp(),
    }, { merge: true }), 12000);
    setCloudStatus('Guardado');
  } catch (error) {
    console.error('Firestore save error:', error);
    setCloudStatus('Error');
    showFeedback(`No se pudieron guardar los votos en Firebase (${error?.message || 'error'}). Se mantienen en este dispositivo.`);
  }
}

tabs?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-contest-id]');
  if (!button) return;
  activeContestId = button.dataset.contestId;
  renderSongs();
});

songList?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-score]');
  if (!button || button.disabled) return;
  if (isSemi(activeContestId) && getSemiStatus(activeContestId) !== 'open') return;
  const contestVotes = votes[activeContestId] || {};
  contestVotes[button.dataset.songKey] = Number(button.dataset.score);
  votes = { ...votes, [activeContestId]: contestVotes };
  saveLocalVotes();
  renderSongs();
  queueCloudSave();
});

$('[data-open-settings]')?.addEventListener('click', () => openModal(settingsModal));
$('[data-close-settings]')?.addEventListener('click', () => closeModal(settingsModal));
$('[data-open-name]')?.addEventListener('click', () => {
  if (nameInput && voter?.name) nameInput.value = voter.name;
  openModal(nameModal);
  nameInput?.focus();
});
settingsModal?.addEventListener('click', (event) => { if (event.target === settingsModal) closeModal(settingsModal); });
nameModal?.addEventListener('click', (event) => { if (event.target === nameModal && voter?.name) closeModal(nameModal); });
nameForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = new FormData(nameForm).get('name')?.toString().trim();
  if (!name) return;
  saveVoter(name);
  closeModal(nameModal);
  showFeedback('Nombre guardado.');
});
$('[data-export]')?.addEventListener('click', () => {
  const payload = { app: 'eurovision-votes', version: 3, exportedAt: new Date().toISOString(), voter, votes };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'eurovision-2026-votos.json';
  link.click();
  URL.revokeObjectURL(url);
  showFeedback('Votos exportados en JSON.');
});
importInput?.addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const imported = JSON.parse(await file.text());
    const importedVotes = imported.votes || imported;
    if (!importedVotes || typeof importedVotes !== 'object' || Array.isArray(importedVotes)) throw new Error('Formato no válido');
    votes = importedVotes;
    if (imported.voter?.name) saveVoter(imported.voter.name);
    saveLocalVotes();
    renderSongs();
    queueCloudSave();
    closeModal(settingsModal);
    showFeedback('Votos importados correctamente.');
  } catch {
    showFeedback('No se pudo importar el JSON. Revisa el formato del archivo.');
  } finally {
    event.target.value = '';
  }
});
$('[data-reset]')?.addEventListener('click', () => {
  if (!window.confirm('¿Seguro que quieres borrar todos los votos guardados?')) return;
  votes = {};
  localStorage.removeItem(storageKey);
  renderSongs();
  queueCloudSave();
  closeModal(settingsModal);
  showFeedback('Votos reseteados.');
});

renderVoter();
renderSongs();
startRealtimeListeners();
loadCloudData();
if (!voter?.name) openModal(nameModal);
queueCloudSave();
