import { predictionStorageKey, readInitialPredictionData } from './prediction/config.js';
import { buildPredictionSummary, decodePrediction, encodePrediction, normalizePrediction, predictionHasContent } from './prediction/data.js';
import { downloadPredictionImage } from './prediction/image.js';
import { renderPrediction, showFeedback } from './prediction/render.js';
import { clearPrediction, loadPrediction, savePrediction } from './prediction/storage.js';

const { candidates, labels } = readInitialPredictionData();
const nodes = {
  name: document.querySelector('[data-prediction-name]'),
  winner: document.querySelector('[data-prediction-winner]'),
  slots: document.querySelectorAll('[data-prediction-slot]'),
  countryCards: document.querySelectorAll('[data-prediction-country]'),
  activeSlot: document.querySelector('[data-prediction-active-slot]'),
  status: document.querySelector('[data-prediction-status]'),
  preview: document.querySelector('[data-prediction-preview]'),
  feedback: document.querySelector('[data-prediction-feedback]'),
  copySummary: document.querySelector('[data-prediction-copy-summary]'),
  copyLink: document.querySelector('[data-prediction-copy-link]'),
  image: document.querySelector('[data-prediction-image]'),
  reset: document.querySelector('[data-prediction-reset]'),
};

let activeSlot = 1;
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

nodes.name?.addEventListener('input', () => {
  prediction = { ...prediction, name: nodes.name.value };
  sync();
});

nodes.winner?.addEventListener('change', () => {
  prediction = { ...prediction, winner: nodes.winner.value };
  sync();
});

nodes.slots.forEach((slot) => {
  slot.addEventListener('click', () => {
    activeSlot = Number(slot.dataset.predictionSlot) || 1;
    sync();
  });
});

nodes.countryCards.forEach((card) => {
  card.addEventListener('click', () => {
    if (card.disabled) return;
    const nextTop = [...prediction.top];
    const flag = card.dataset.predictionCountry;
    nextTop[activeSlot - 1] = nextTop[activeSlot - 1] === flag ? '' : flag;
    prediction = { ...prediction, top: nextTop };
    activeSlot = Math.min(activeSlot + 1, 10);
    sync();
  });
});

nodes.copySummary?.addEventListener('click', () => {
  if (!ensureShareable()) return;
  copyText(buildPredictionSummary({ candidates, labels, prediction }), labels.copied);
});

nodes.copyLink?.addEventListener('click', () => {
  if (!ensureShareable()) return;
  copyText(currentShareUrl(), labels.linkCopied);
});

nodes.image?.addEventListener('click', () => {
  if (!ensureShareable()) return;
  const success = downloadPredictionImage({ candidates, labels, prediction });
  showFeedback(nodes, success ? labels.imageDownloaded : labels.imageError);
});

nodes.reset?.addEventListener('click', () => {
  if (!window.confirm(labels.resetConfirm)) return;
  clearPrediction(predictionStorageKey);
  prediction = { name: '', winner: '', top: [] };
  activeSlot = 1;
  sync();
  showFeedback(nodes, labels.resetDone);
});

sync();
