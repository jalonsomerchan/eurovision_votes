export function loadJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getOrCreateDeviceId(deviceKey) {
  let deviceId = localStorage.getItem(deviceKey);
  if (!deviceId) {
    deviceId = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    localStorage.setItem(deviceKey, deviceId);
  }
  return deviceId;
}
