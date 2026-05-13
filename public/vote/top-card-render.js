import { escapeHtml } from './dom.js';
import { flagEmoji, formatTopCardText } from './top-card-data.js';

export function renderTopCard({ contest, entries, labels, limit, nodes }) {
  if (!nodes.topCardPreview) return '';

  if (!entries.length) {
    nodes.topCardPreview.innerHTML = `<article class="top-card-empty"><span aria-hidden="true">🏆</span><h3>${escapeHtml(labels.emptyTitle)}</h3><p>${escapeHtml(labels.emptyCopy)}</p></article>`;
    return '';
  }

  const summary = formatTopCardText({ contestName: contest.name, entries, labels, limit });
  const notice = entries.length < limit
    ? `<p class="top-card-notice"><strong>${escapeHtml(labels.incompleteTitle)}.</strong> ${escapeHtml(labels.incompleteCopy)}</p>`
    : '';

  nodes.topCardPreview.innerHTML = `<article class="top-card" aria-label="${escapeHtml(labels.previewLabel)}">
    <header>
      <span>${escapeHtml(labels.eyebrow)}</span>
      <h3>${escapeHtml(labels.summaryTitle.replaceAll('{limit}', `Top ${limit}`).replaceAll('{contest}', contest.name))}</h3>
    </header>
    ${notice}
    <ol>
      ${entries.map((entry, index) => `<li>
        <img width="48" height="36" loading="lazy" alt="${escapeHtml(labels.flagAlt.replaceAll('{country}', entry.country))}" src="https://flagsapi.com/${entry.flag}/flat/64.png" />
        <div>
          <strong><span aria-hidden="true">${flagEmoji(entry.flag)}</span> ${index + 1}. ${escapeHtml(entry.country)}</strong>
          <span>${escapeHtml(entry.artist)} — «${escapeHtml(entry.song)}»</span>
        </div>
        <mark>${escapeHtml(labels.scoreLabel.replaceAll('{score}', entry.score))}</mark>
      </li>`).join('')}
    </ol>
    <p class="visually-hidden">${escapeHtml(summary)}</p>
  </article>`;

  return summary;
}

export function showTopCardFeedback(nodes, message) {
  if (!nodes.topCardFeedback) return;
  nodes.topCardFeedback.textContent = message;
  window.clearTimeout(showTopCardFeedback.timeoutId);
  showTopCardFeedback.timeoutId = window.setTimeout(() => {
    nodes.topCardFeedback.textContent = '';
  }, 5000);
}
