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

  return { winner: prediction.winner || '', top };
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

export function buildPredictionSummary({ candidates, labels, prediction }) {
  const winner = getCandidate(candidates, prediction.winner);
  const lines = [labels.summaryTitle];
  lines.push(labels.winnerSummary.replaceAll('{country}', winner?.country || '—'));
  lines.push(labels.topSummary);
  prediction.top.forEach((flag, index) => {
    const candidate = getCandidate(candidates, flag);
    if (candidate) lines.push(`${index + 1}. ${candidate.country} — ${candidate.artist} — «${candidate.song}»`);
  });
  return lines.join('\n');
}

export function getPredictionStatus(labels, prediction) {
  if (!prediction.winner) return { complete: false, message: labels.missingWinner };
  if (!prediction.top.some(Boolean)) return { complete: false, message: labels.missingTop };
  return { complete: true, message: labels.readyCopy };
}
