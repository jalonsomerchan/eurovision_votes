import { buildPredictionSummary, getCandidate, getPredictionStatus } from './data.js';

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
}

function countryProfileUrl(flag) {
  return `../paises/${String(flag || '').toLowerCase()}/`;
}

export function renderPrediction({ activeSlot, candidates, labels, nodes, prediction }) {
  const selected = new Set(prediction.top.filter(Boolean));
  const activePosition = String(activeSlot || 1);

  if (nodes.name) nodes.name.value = prediction.name || '';
  if (nodes.winner) nodes.winner.value = prediction.winner || '';
  if (nodes.status) nodes.status.textContent = labels.saved;
  if (nodes.activeSlot) nodes.activeSlot.textContent = labels.selectedSlot.replaceAll('{position}', activePosition);

  nodes.slots.forEach((slot) => {
    const index = Number(slot.dataset.predictionSlot) - 1;
    const candidate = getCandidate(candidates, prediction.top[index]);
    slot.classList.toggle('is-active', slot.dataset.predictionSlot === activePosition);
    slot.setAttribute('aria-pressed', String(slot.dataset.predictionSlot === activePosition));
    slot.innerHTML = `<span>${index + 1}</span><strong>${escapeHtml(candidate?.country || labels.emptyOption)}</strong>`;
  });

  nodes.countryCards.forEach((card) => {
    const flag = card.dataset.predictionCountry;
    const isSelected = selected.has(flag);
    const isCurrent = prediction.top[activeSlot - 1] === flag;
    card.disabled = isSelected && !isCurrent;
    card.classList.toggle('is-selected', isSelected);
  });

  renderPreview({ candidates, labels, nodes, prediction });
}

export function renderPreview({ candidates, labels, nodes, prediction }) {
  if (!nodes.preview) return;

  const winner = getCandidate(candidates, prediction.winner);
  const topEntries = prediction.top.map((flag) => getCandidate(candidates, flag)).filter(Boolean);
  const status = getPredictionStatus(labels, prediction);
  const summary = buildPredictionSummary({ candidates, labels, prediction });
  const title = prediction.name ? labels.byName.replaceAll('{name}', prediction.name) : labels.summaryTitle;

  nodes.preview.innerHTML = `<article class="prediction-card ${status.complete ? 'is-ready' : ''}">
    <header>
      <span>${escapeHtml(labels.eyebrow)}</span>
      <h2>${escapeHtml(status.complete ? title : labels.shareTitle)}</h2>
      <p>${escapeHtml(status.complete ? labels.readyCopy : status.message)}</p>
    </header>
    <section class="prediction-winner-card" aria-label="${escapeHtml(labels.winnerTitle)}">
      <span>${escapeHtml(labels.winnerTitle)}</span>
      ${winner ? `<a href="${countryProfileUrl(winner.flag)}" aria-label="${escapeHtml(labels.viewCountry.replaceAll('{country}', winner.country))}"><img width="64" height="48" loading="lazy" alt="${escapeHtml(labels.flagAlt.replaceAll('{country}', winner.country))}" src="https://flagsapi.com/${winner.flag}/flat/64.png" /><strong>${escapeHtml(winner.country)}</strong><small>${escapeHtml(winner.artist)} — «${escapeHtml(winner.song)}»</small></a>` : `<strong>—</strong>`}
    </section>
    <ol>
      ${topEntries.map((entry, index) => `<li><img width="48" height="36" loading="lazy" alt="${escapeHtml(labels.flagAlt.replaceAll('{country}', entry.country))}" src="https://flagsapi.com/${entry.flag}/flat/64.png" /><div><strong>${index + 1}. ${escapeHtml(entry.country)}</strong><span>${escapeHtml(entry.artist)} — «${escapeHtml(entry.song)}»</span></div></li>`).join('')}
    </ol>
    <footer>${escapeHtml(labels.credit)}</footer>
    <p class="visually-hidden">${escapeHtml(summary)}</p>
  </article>`;
}

export function showFeedback(nodes, message) {
  if (!nodes.feedback) return;
  nodes.feedback.textContent = message;
  window.clearTimeout(showFeedback.timeoutId);
  showFeedback.timeoutId = window.setTimeout(() => {
    nodes.feedback.textContent = '';
  }, 5000);
}
