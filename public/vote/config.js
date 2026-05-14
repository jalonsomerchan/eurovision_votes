export const storageKey = 'eurovision-2026-votes-v1';
export const voterKey = 'eurovision-2026-voter-v1';
export const deviceKey = 'eurovision-2026-device-id-v1';
export const votesCollection = 'eurovision2026Votes';
export const controlCollection = 'eurovision2026Control';
export const controlDocument = 'results';

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

export function readInitialData() {
  const contests = readJsonScript('eurovision-contests', []);
  const firebaseConfig = readJsonScript('firebase-config', {});
  const labels = readJsonScript('vote-labels', {});
  const topCardLabels = readJsonScript('top-card-labels', {});
  const shareLabels = readJsonScript('vote-share-labels', {});

  return { contests, firebaseConfig, labels, shareLabels, t: createTranslator(labels), topCardLabels };
}
