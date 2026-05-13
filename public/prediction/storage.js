export function loadPrediction(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : { winner: '', top: [] };
  } catch {
    return { winner: '', top: [] };
  }
}

export function savePrediction(key, prediction) {
  localStorage.setItem(key, JSON.stringify({
    winner: prediction.winner || '',
    top: Array.isArray(prediction.top) ? prediction.top : [],
  }));
}

export function clearPrediction(key) {
  localStorage.removeItem(key);
}
