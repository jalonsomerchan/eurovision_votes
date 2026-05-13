import { createVoteActions } from './vote/actions.js';
import { createCloudApi, initCloud } from './vote/cloud.js';
import { isSemi, getSemiStatus } from './vote/contest.js';
import { deviceKey, readInitialData, storageKey, voterKey } from './vote/config.js';
import { $, createUi, getVoteNodes } from './vote/dom.js';
import { createRenderer } from './vote/render.js';
import { downloadTopCardImage } from './vote/top-card-canvas.js';
import { formatTopCardText, getRankedTopEntries, getTopCardContest, getTopCardLimit } from './vote/top-card-data.js';
import { renderTopCard, showTopCardFeedback } from './vote/top-card-render.js';
import { getOrCreateDeviceId, loadJson, saveJson } from './vote/storage.js';

const { contests, firebaseConfig, t, topCardLabels } = readInitialData();
const nodes = getVoteNodes();
const ui = createUi(nodes);
const deviceId = getOrCreateDeviceId(deviceKey);

let activeContestId = contests[0]?.id || 'semi-1';
let allVoters = [];
let control = { semifinals: {}, final: { positions: {} } };
let saveTimeoutId;
let voter = loadJson(voterKey, null);
let votes = loadJson(storageKey, {});

function getState() {
  return {
    activeContestId,
    allVoters,
    control,
    isVotingAllowed,
    openNameModal,
    setAllVoters: (nextVoters) => {
      allVoters = nextVoters;
    },
    setControl: (nextControl) => {
      control = nextControl;
    },
    setVotes: (nextVotes) => {
      votes = nextVotes;
    },
    voter,
    votes,
  };
}

function getTopCardState() {
  const contest = getTopCardContest(contests, nodes);
  const limit = getTopCardLimit(nodes);
  const entries = getRankedTopEntries({ contests, contest, control, limit, votes });

  return { contest, entries, labels: topCardLabels, limit };
}

function renderTopCardState() {
  return renderTopCard({ ...getTopCardState(), nodes });
}

function renderVoteUi() {
  renderer.renderSongs();
  renderTopCardState();
}

const renderer = createRenderer({ contests, getState, nodes, t });
const db = initCloud(firebaseConfig, { setCloudStatus: ui.setCloudStatus, t });
const cloud = createCloudApi({
  db,
  deviceId,
  getState,
  renderSongs: renderVoteUi,
  setCloudStatus: ui.setCloudStatus,
  showFeedback: ui.showFeedback,
  t,
});

const actions = createVoteActions({
  closeModal: ui.closeModal,
  deviceId,
  getState,
  importInput: nodes.importInput,
  renderSongs: renderVoteUi,
  saveLocalVotes,
  saveVoter,
  settingsModal: nodes.settingsModal,
  showFeedback: ui.showFeedback,
  t,
});

function saveLocalVotes() {
  saveJson(storageKey, votes);
}

function saveVoter(name) {
  voter = { name: name.trim(), deviceId };
  saveJson(voterKey, voter);
  renderer.renderVoter();
  queueCloudSave();
}

function openNameModal() {
  ui.openModal(nodes.nameModal);
  nodes.nameInput?.focus();
}

function isVotingAllowed() {
  if (!isSemi(activeContestId) || getSemiStatus(control, activeContestId) === 'open') return true;

  const status = getSemiStatus(control, activeContestId);
  ui.setCloudStatus(status === 'closed' ? t('closed', 'Votación cerrada') : t('comingSoon', 'Próximamente'));
  ui.showFeedback(status === 'closed'
    ? t('semiClosed', 'La votación de esta semifinal está cerrada.')
    : t('semiComingSoon', 'La votación de esta semifinal todavía no ha empezado.'));
  return false;
}

function queueCloudSave() {
  window.clearTimeout(saveTimeoutId);
  saveTimeoutId = window.setTimeout(cloud.saveCloudVotes, 500);
}

nodes.tabs?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-contest-id]');
  if (!button) return;
  activeContestId = button.dataset.contestId;
  if (nodes.topCardContest) nodes.topCardContest.value = activeContestId;
  renderVoteUi();
});

nodes.songList?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-score]');
  if (!button || button.disabled || !isVotingAllowed()) return;
  const contestVotes = votes[activeContestId] || {};
  contestVotes[button.dataset.songKey] = Number(button.dataset.score);
  votes = { ...votes, [activeContestId]: contestVotes };
  saveLocalVotes();
  renderVoteUi();
  queueCloudSave();
});

nodes.topCardContest?.addEventListener('change', renderTopCardState);
nodes.topCardLimits?.forEach((input) => input.addEventListener('change', renderTopCardState));
nodes.topCardCopy?.addEventListener('click', async () => {
  const state = getTopCardState();
  const text = formatTopCardText({ contestName: state.contest.name, entries: state.entries, labels: state.labels, limit: state.limit });
  if (!state.entries.length) {
    showTopCardFeedback(nodes, state.labels.emptyCopy);
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    showTopCardFeedback(nodes, state.labels.copied);
  } catch {
    window.prompt(state.labels.copyError, text);
  }
});
nodes.topCardDownload?.addEventListener('click', () => {
  const state = getTopCardState();
  const success = downloadTopCardImage(state);
  showTopCardFeedback(nodes, success ? state.labels.downloaded : state.labels.downloadError);
});

$('[data-open-settings]')?.addEventListener('click', () => ui.openModal(nodes.settingsModal));
$('[data-close-settings]')?.addEventListener('click', () => ui.closeModal(nodes.settingsModal));
$('[data-share-votes]')?.addEventListener('click', () => actions.shareVotes(cloud.saveCloudVotes));
$('[data-open-name]')?.addEventListener('click', () => {
  if (nodes.nameInput && voter?.name) nodes.nameInput.value = voter.name;
  openNameModal();
});

nodes.settingsModal?.addEventListener('click', (event) => {
  if (event.target === nodes.settingsModal) ui.closeModal(nodes.settingsModal);
});

nodes.nameModal?.addEventListener('click', (event) => {
  if (event.target === nodes.nameModal && voter?.name) ui.closeModal(nodes.nameModal);
});

nodes.nameForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = new FormData(nodes.nameForm).get('name')?.toString().trim();
  if (!name) return;
  saveVoter(name);
  ui.closeModal(nodes.nameModal);
  ui.showFeedback(t('nameSaved', 'Nombre guardado.'));
});

$('[data-export]')?.addEventListener('click', actions.exportVotes);
nodes.importInput?.addEventListener('change', (event) => actions.importVotes(event, queueCloudSave));
$('[data-reset]')?.addEventListener('click', () => actions.resetVotes(queueCloudSave));

renderer.renderVoter();
if (nodes.topCardContest) nodes.topCardContest.value = activeContestId;
renderVoteUi();
cloud.startRealtimeListeners();
cloud.loadCloudData();
if (!voter?.name) ui.openModal(nodes.nameModal);
queueCloudSave();
