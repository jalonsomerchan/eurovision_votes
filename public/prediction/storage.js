export function loadPrediction(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : { name: '', winner: '', top: [] };
  } catch {
    return { name: '', winner: '', top: [] };
  }
}

export function savePrediction(key, prediction) {
  localStorage.setItem(key, JSON.stringify({
    name: prediction.name || '',
    winner: prediction.winner || '',
    top: Array.isArray(prediction.top) ? prediction.top : [],
  }));
}

export function clearPrediction(key) {
  localStorage.removeItem(key);
}
