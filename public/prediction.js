import { predictionStorageKey, readInitialPredictionData } from './prediction/config.js';
import { buildPredictionSummary, decodePrediction, encodePrediction, normalizePrediction } from './prediction/data.js';
import { renderPrediction, showFeedback } from './prediction/render.js';
import { clearPrediction, loadPrediction, savePrediction } from './prediction/storage.js';

const { candidates, labels } = readInitialPredictionData();
const nodes = {
  winner: document.querySelector('[data-prediction-winner]'),
  positionSelects: document.querySelectorAll('[data-prediction-position]'),
  status: document.querySelector('[data-prediction-status]'),
  preview: document.querySelector('[data-prediction-preview]'),
  feedback: document.querySelector('[data-prediction-feedback]'),
  copySummary: document.querySelector('[data-prediction-copy-summary]'),
  copyLink: document.querySelector('[data-prediction-copy-link]'),
  reset: document.querySelector('[data-prediction-reset]'),
};

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
  renderPrediction({ candidates, labels, nodes, prediction });
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

nodes.winner?.addEventListener('change', () => {
  prediction = { ...prediction, winner: nodes.winner.value };
  sync();
});

nodes.positionSelects.forEach((select) => {
  select.addEventListener('change', () => {
    const nextTop = [...prediction.top];
    nextTop[Number(select.dataset.predictionPosition) - 1] = select.value;
    prediction = { ...prediction, top: nextTop };
    sync();
  });
});

nodes.copySummary?.addEventListener('click', () => {
  copyText(buildPredictionSummary({ candidates, labels, prediction }), labels.copied);
});

nodes.copyLink?.addEventListener('click', () => {
  copyText(currentShareUrl(), labels.linkCopied);
});

nodes.reset?.addEventListener('click', () => {
  if (!window.confirm(labels.resetConfirm)) return;
  clearPrediction(predictionStorageKey);
  prediction = { winner: '', top: [] };
  sync();
  showFeedback(nodes, labels.resetDone);
});

sync();
