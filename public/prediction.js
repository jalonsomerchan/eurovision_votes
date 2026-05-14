import { predictionStorageKey, readInitialPredictionData } from './prediction/config.js';
import { buildPredictionSummary, decodePrediction, encodePrediction, normalizePrediction, predictionHasContent } from './prediction/data.js';
import { buildPredictionImage, downloadPredictionImage, sharePredictionImage } from './prediction/image.js';
import { renderPrediction, showFeedback } from './prediction/render.js';
import { clearPrediction, loadPrediction, savePrediction } from './prediction/storage.js';

const { candidates, labels } = readInitialPredictionData();
const nodes = {
  name: document.querySelector('[data-prediction-name]'),
  slots: document.querySelectorAll('[data-prediction-slot]'),
  countryGrid: document.querySelector('[data-prediction-country-grid]'),
  countryCards: document.querySelectorAll('[data-prediction-country]'),
  activeSlot: document.querySelector('[data-prediction-active-slot]'),
  status: document.querySelector('[data-prediction-status]'),
  preview: document.querySelector('[data-prediction-preview]'),
  feedback: document.querySelector('[data-prediction-feedback]'),
  copySummary: document.querySelector('[data-prediction-copy-summary]'),
  copyLink: document.querySelector('[data-prediction-copy-link]'),
  previewImage: document.querySelector('[data-prediction-preview-image]'),
  reset: document.querySelector('[data-prediction-reset]'),
  modal: document.querySelector('[data-prediction-modal]'),
  modalImage: document.querySelector('[data-prediction-modal-image]'),
  closeModal: document.querySelector('[data-prediction-close-modal]'),
  shareImage: document.querySelector('[data-prediction-share-image]'),
  downloadImage: document.querySelector('[data-prediction-download-image]'),
};

let activeSlot = 1;
let imagePayload = null;
let prediction = normalizePrediction(loadPrediction(predictionStorageKey));
const sharedPrediction = new URLSearchParams(window.location.search).get('p');
const decodedPrediction = sharedPrediction ? decodePrediction(sharedPrediction) : null;

if (decodedPrediction) {
  prediction = decodedPrediction;
  savePrediction(predictionStorageKey, prediction);
}

function sync() {
  prediction = normalizePrediction(prediction);
  savePrediction(predictionStorageKey, prediction);
  renderPrediction({ activeSlot, candidates, labels, nodes, prediction });
}

function currentShareUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set('p', encodePrediction(prediction));
  return url.toString();
}

async function copyText(text, successMessage) {
  try {
    await navigator.clipboard.writeText(text);
    showFeedback(nodes, successMessage);
  } catch {
    window.prompt(successMessage, text);
  }
}

function ensureShareable() {
  if (predictionHasContent(prediction)) return true;
  showFeedback(nodes, labels.missingPrediction);
  return false;
}

function openModal() {
  if (nodes.modal?.showModal) {
    nodes.modal.showModal();
    return;
  }
  nodes.modal?.setAttribute('open', 'open');
}

function closeModal() {
  if (nodes.modal?.close) {
    nodes.modal.close();
    return;
  }
  nodes.modal?.removeAttribute('open');
}

async function prepareImagePreview() {
  if (!ensureShareable()) return;
  const nextPayload = await buildPredictionImage({ candidates, labels, prediction });
  if (!nextPayload) {
    showFeedback(nodes, labels.imageError);
    return;
  }
  if (imagePayload?.url) URL.revokeObjectURL(imagePayload.url);
  imagePayload = nextPayload;
  if (nodes.modalImage) nodes.modalImage.src = imagePayload.url;
  openModal();
}

nodes.name?.addEventListener('input', () => {
  prediction = { ...prediction, name: nodes.name.value };
  sync();
});

nodes.slots.forEach((slot) => {
  slot.addEventListener('click', () => {
    activeSlot = Number(slot.dataset.predictionSlot) || 1;
    sync();
  });
});

nodes.countryGrid?.addEventListener('click', (event) => {
  const card = event.target.closest('[data-prediction-country]');
  if (!card || card.disabled) return;
  const nextTop = [...prediction.top];
  const flag = card.dataset.predictionCountry;
  nextTop[activeSlot - 1] = nextTop[activeSlot - 1] === flag ? '' : flag;
  prediction = { ...prediction, top: nextTop };
  activeSlot = Math.min(activeSlot + 1, 10);
  sync();
});

nodes.copySummary?.addEventListener('click', () => {
  if (!ensureShareable()) return;
  copyText(buildPredictionSummary({ candidates, labels, prediction }), labels.copied);
});

nodes.copyLink?.addEventListener('click', () => {
  if (!ensureShareable()) return;
  copyText(currentShareUrl(), labels.linkCopied);
});

nodes.previewImage?.addEventListener('click', prepareImagePreview);

nodes.downloadImage?.addEventListener('click', () => {
  if (!imagePayload) return;
  downloadPredictionImage(imagePayload);
  showFeedback(nodes, labels.imageDownloaded);
  closeModal();
});

nodes.shareImage?.addEventListener('click', async () => {
  if (!imagePayload) return;
  try {
    const ok = await sharePredictionImage(imagePayload, labels);
    showFeedback(nodes, ok ? labels.imageShared : labels.shareUnavailable);
    if (ok) closeModal();
  } catch {
    showFeedback(nodes, labels.shareUnavailable);
  }
});

nodes.closeModal?.addEventListener('click', closeModal);
nodes.modal?.addEventListener('click', (event) => {
  if (event.target === nodes.modal) closeModal();
});

nodes.reset?.addEventListener('click', () => {
  if (!window.confirm(labels.resetConfirm)) return;
  clearPrediction(predictionStorageKey);
  prediction = { name: '', top: [] };
  activeSlot = 1;
  if (imagePayload?.url) URL.revokeObjectURL(imagePayload.url);
  imagePayload = null;
  nodes.modalImage?.removeAttribute('src');
  closeModal();
  sync();
  showFeedback(nodes, labels.resetDone);
});

sync();
