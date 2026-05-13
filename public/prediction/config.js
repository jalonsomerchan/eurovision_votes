export const predictionStorageKey = 'eurovision-2026-prediction-v1';

export function readJsonScript(id, fallback) {
  try {
    return JSON.parse(document.getElementById(id)?.textContent || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

export function createTranslator(labels) {
  return (key, fallback, replacements = {}) => {
    const template = labels[key] || fallback || key;
    return Object.entries(replacements).reduce(
      (text, [name, value]) => text.replaceAll(`{${name}}`, value),
      template,
    );
  };
}

export function readInitialPredictionData() {
  const candidates = readJsonScript('prediction-candidates', []);
  const labels = readJsonScript('prediction-labels', {});
  return { candidates, labels, t: createTranslator(labels) };
}
