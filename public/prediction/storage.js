export function loadPrediction(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : { name: '', top: [] };
  } catch {
    return { name: '', top: [] };
  }
}

export function savePrediction(key, prediction) {
  localStorage.setItem(key, JSON.stringify({
    name: prediction.name || '',
    top: Array.isArray(prediction.top) ? prediction.top : [],
  }));
}

export function clearPrediction(key) {
  localStorage.removeItem(key);
}
