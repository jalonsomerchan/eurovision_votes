import { getCandidate } from './data.js';

function flagEmoji(countryCode) {
  const code = String(countryCode || '').toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return '🏳️';
  return Array.from(code).map((letter) => String.fromCodePoint(127397 + letter.charCodeAt(0))).join('');
}

function wrapText(ctx, text, maxWidth) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth) {
      current = next;
      return;
    }
    if (current) lines.push(current);
    current = word;
  });

  if (current) lines.push(current);
  return lines;
}

function fitText(ctx, text, maxWidth) {
  const value = String(text || '');
  if (ctx.measureText(value).width <= maxWidth) return value;
  let next = value;
  while (next.length > 1 && ctx.measureText(`${next}…`).width > maxWidth) next = next.slice(0, -1);
  return `${next}…`;
}

function drawRoundedCard(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.fill();
}

export async function buildPredictionImage({ candidates, labels, prediction }) {
  const entries = prediction.top.map((flag) => getCandidate(candidates, flag)).filter(Boolean);
  if (!entries.length) return null;

  const canvas = document.createElement('canvas');
  const measureCtx = canvas.getContext('2d');
  if (!measureCtx) return null;

  const width = 1080;
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  const rowHeight = 86;
  const title = prediction.name ? labels.byName.replaceAll('{name}', prediction.name) : labels.summaryTitle;

  measureCtx.font = '900 58px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
  const titleLines = wrapText(measureCtx, title, 880).slice(0, 3);
  const titleHeight = titleLines.length * 68;
  const entriesHeight = entries.length * rowHeight;
  const bottomPadding = 145;
  const height = 120 + titleHeight + 88 + entriesHeight + bottomPadding;

  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.scale(scale, scale);
  ctx.fillStyle = '#150b2e';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#7c3aed';
  ctx.globalAlpha = 0.22;
  ctx.beginPath();
  ctx.arc(920, 95, 300, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 34px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
  ctx.fillText(labels.eyebrow, 70, 82);

  ctx.font = '900 58px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
  titleLines.forEach((line, index) => {
    ctx.fillText(line, 70, 155 + index * 68);
  });

  let y = 170 + titleHeight;
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 34px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
  ctx.fillText(labels.topSummary, 70, y + 22);
  y += 50;

  entries.forEach((entry, index) => {
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    drawRoundedCard(ctx, 70, y, 940, 64, 22);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 28px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.fillText(`${index + 1}. ${flagEmoji(entry.flag)} ${fitText(ctx, entry.country, 340)}`, 105, y + 41);

    ctx.fillStyle = '#d8ccff';
    ctx.font = '700 21px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.fillText(fitText(ctx, `${entry.artist} — ${entry.song}`, 500), 455, y + 41);
    y += rowHeight;
  });

  ctx.fillStyle = '#bda8ff';
  ctx.font = '800 28px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
  ctx.fillText(labels.credit, 70, height - 62);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) return null;

  return {
    blob,
    fileName: 'quiniela-eurovision-2026.png',
    url: URL.createObjectURL(blob),
  };
}

export function downloadPredictionImage(payload) {
  const link = document.createElement('a');
  link.download = payload.fileName;
  link.href = payload.url;
  link.click();
}

export async function sharePredictionImage(payload, labels) {
  if (!navigator.share) return false;
  const file = new File([payload.blob], payload.fileName, { type: 'image/png' });
  const shareData = { files: [file], title: labels.summaryTitle, text: labels.credit };
  if (navigator.canShare && !navigator.canShare(shareData)) return false;
  await navigator.share(shareData);
  return true;
}
