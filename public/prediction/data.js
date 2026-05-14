export function getCandidate(candidates, flag) {
  return candidates.find((candidate) => candidate.flag === flag) || null;
}

export function normalizePrediction(prediction) {
  const seen = new Set();
  const top = Array.from({ length: 10 }, (_, index) => {
    const value = prediction.top?.[index] || '';
    if (!value || seen.has(value)) return '';
    seen.add(value);
    return value;
  });

  return { name: String(prediction.name || '').slice(0, 40), winner: prediction.winner || '', top };
}

export function encodePrediction(prediction) {
  return btoa(encodeURIComponent(JSON.stringify(normalizePrediction(prediction))));
}

export function decodePrediction(value) {
  try {
    const parsed = JSON.parse(decodeURIComponent(atob(value)));
    return normalizePrediction(parsed);
  } catch {
    return null;
  }
}

export function predictionHasContent(prediction) {
  return Boolean(prediction.winner || prediction.top.some(Boolean));
}

export function buildPredictionSummary({ candidates, labels, prediction }) {
  const winner = getCandidate(candidates, prediction.winner);
  const title = prediction.name ? labels.byName.replaceAll('{name}', prediction.name) : labels.summaryTitle;
  const lines = [title];
  lines.push(labels.winnerSummary.replaceAll('{country}', winner?.country || '—'));
  lines.push(labels.topSummary);
  prediction.top.forEach((flag, index) => {
    const candidate = getCandidate(candidates, flag);
    if (candidate) lines.push(`${index + 1}. ${candidate.country} — ${candidate.artist} — «${candidate.song}»`);
  });
  lines.push(labels.credit);
  return lines.join('\n');
}

export function getPredictionStatus(labels, prediction) {
  if (!predictionHasContent(prediction)) return { complete: false, message: labels.missingPrediction };
  return { complete: true, message: labels.readyCopy };
}
