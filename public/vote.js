import { createVoteActions } from './vote/actions.js?v=20260514-7';
import { createCloudApi, initCloud } from './vote/cloud.js?v=20260514-7';
import { isSemi, getContest, getSemiStatus } from './vote/contest.js?v=20260514-7';
import { deviceKey, readInitialData, storageKey, voterKey } from './vote/config.js?v=20260514-7';
import { $, createUi, getVoteNodes } from './vote/dom.js?v=20260514-7';
import { createRenderer } from './vote/render.js?v=20260514-7';
import { buildVoteShareImage, downloadTopCardImagePayload, shareTopCardImagePayload } from './vote/top-card-canvas.js?v=20260514-7';
import { buildVoteShareVariants } from './vote/share-variants.js?v=20260514-7';
import { getOrCreateDeviceId, loadJson, saveJson } from './vote/storage.js?v=20260514-7';

const { contests, firebaseConfig, shareLabels, t, topCardLabels } = readInitialData();
const nodes = getVoteNodes();
const ui = createUi(nodes);
const deviceId = getOrCreateDeviceId(deviceKey);
const voteImageNodes = {
  modal: $('[data-vote-image-modal]'),
  gallery: $('[data-vote-image-gallery]'),
  selected: $('[data-vote-image-selected]'),
  preview: $('[data-vote-image-preview]'),
  close: $('[data-vote-image-close]'),
  share: $('[data-vote-image-share]'),
  download: $('[data-vote-image-download]'),
};

let activeContestId = contests[0]?.id || 'semi-1';
let allVoters = [];
let control = { semifinals: {}, final: { positions: {} } };
let imagePayload = null;
let imagePayloads = [];
let saveTimeoutId;
let shareFeedbackTimeoutId;
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

function getVoteShareState() {
  const contest = getContest(contests, activeContestId);
  const labels = { ...topCardLabels, ...shareLabels };
  const variants = buildVoteShareVariants({ contests, contest, control, labels, votes });
  return { contest, variants };
}

function showShareFeedback(message) {
  if (!nodes.shareFeedback) return;
  nodes.shareFeedback.textContent = message;
  window.clearTimeout(shareFeedbackTimeoutId);
  shareFeedbackTimeoutId = window.setTimeout(() => {
    nodes.shareFeedback.textContent = '';
  }, 5000);
}

function openImageModal() {
  if (voteImageNodes.modal?.showModal) {
    voteImageNodes.modal.showModal();
    return;
  }
  voteImageNodes.modal?.setAttribute('open', 'open');
}

function closeImageModal() {
  if (voteImageNodes.modal?.close) {
    voteImageNodes.modal.close();
    return;
  }
  voteImageNodes.modal?.removeAttribute('open');
}

function clearImagePayload() {
  [...imagePayloads, imagePayload].filter(Boolean).forEach((payload) => URL.revokeObjectURL(payload.url));
  imagePayload = null;
  imagePayloads = [];
  voteImageNodes.preview?.removeAttribute('src');
  if (voteImageNodes.gallery) voteImageNodes.gallery.innerHTML = '';
  if (voteImageNodes.selected) voteImageNodes.selected.hidden = true;
}

function renderVoteUi() {
  renderer.renderSongs();
}

function selectImagePayload(index) {
  const payload = imagePayloads[index];
  if (!payload) return;
  imagePayload = payload;
  if (voteImageNodes.preview) voteImageNodes.preview.src = payload.url;
  if (voteImageNodes.selected) voteImageNodes.selected.hidden = false;
}

function renderImageGallery() {
  if (!voteImageNodes.gallery) return;
  voteImageNodes.gallery.innerHTML = imagePayloads.map((payload, index) => `
    <article class="vote-image-option">
      <img src="${payload.url}" alt="${payload.title}" loading="lazy" />
      <h3>${payload.title}</h3>
      <div class="vote-share-card__actions">
        <button class="action-button action-button--primary" type="button" data-vote-image-option-share="${index}">${shareLabels.shareImage}</button>
        <button class="action-button" type="button" data-vote-image-option-download="${index}">${shareLabels.downloadImage}</button>
      </div>
    </article>
  `).join('');
  selectImagePayload(0);
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
  clearImagePayload();
  closeImageModal();
  renderVoteUi();
});

nodes.songList?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-score]');
  if (!button || button.disabled || !isVotingAllowed()) return;
  const contestVotes = votes[activeContestId] || {};
  contestVotes[button.dataset.songKey] = Number(button.dataset.score);
  votes = { ...votes, [activeContestId]: contestVotes };
  clearImagePayload();
  saveLocalVotes();
  renderVoteUi();
  queueCloudSave();
});

nodes.shareImage?.addEventListener('click', async () => {
  const { variants } = getVoteShareState();
  if (!variants.length) {
    showShareFeedback(shareLabels.imageEmpty || topCardLabels.emptyCopy);
    return;
  }

  clearImagePayload();
  imagePayloads = (await Promise.all(variants.map(async (variant) => {
    const payload = await buildVoteShareImage(variant);
    return payload ? { ...payload, title: variant.title } : null;
  }))).filter(Boolean);

  if (!imagePayloads.length) {
    showShareFeedback(shareLabels.imageError || topCardLabels.downloadError);
    return;
  }

  renderImageGallery();
  openImageModal();
  showShareFeedback(shareLabels.imageReady || topCardLabels.downloaded);
});

voteImageNodes.gallery?.addEventListener('click', async (event) => {
  const shareButton = event.target.closest('[data-vote-image-option-share]');
  const downloadButton = event.target.closest('[data-vote-image-option-download]');
  const index = Number(shareButton?.dataset.voteImageOptionShare ?? downloadButton?.dataset.voteImageOptionDownload);
  if (!Number.isInteger(index) || !imagePayloads[index]) return;
  selectImagePayload(index);

  if (downloadButton) {
    downloadTopCardImagePayload(imagePayloads[index]);
    showShareFeedback(shareLabels.imageDownloaded || topCardLabels.downloaded);
    return;
  }

  try {
    const shared = await shareTopCardImagePayload(imagePayloads[index], shareLabels);
    showShareFeedback(shared ? shareLabels.imageShared : shareLabels.shareUnavailable);
    if (shared) closeImageModal();
  } catch {
    showShareFeedback(shareLabels.shareUnavailable);
  }
});

voteImageNodes.close?.addEventListener('click', closeImageModal);
voteImageNodes.modal?.addEventListener('click', (event) => {
  if (event.target === voteImageNodes.modal) closeImageModal();
});
voteImageNodes.download?.addEventListener('click', () => {
  if (!imagePayload) return;
  downloadTopCardImagePayload(imagePayload);
  showShareFeedback(shareLabels.imageDownloaded || topCardLabels.downloaded);
});
voteImageNodes.share?.addEventListener('click', async () => {
  if (!imagePayload) return;
  try {
    const shared = await shareTopCardImagePayload(imagePayload, shareLabels);
    showShareFeedback(shared ? shareLabels.imageShared : shareLabels.shareUnavailable);
    if (shared) closeImageModal();
  } catch {
    showShareFeedback(shareLabels.shareUnavailable);
  }
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
renderVoteUi();
cloud.startRealtimeListeners();
cloud.loadCloudData();
if (!voter?.name) ui.openModal(nodes.nameModal);
queueCloudSave();