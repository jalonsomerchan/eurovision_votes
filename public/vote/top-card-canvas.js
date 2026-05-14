import { flagEmoji } from './top-card-data.js';

function drawRoundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.fill();
}

function fitText(ctx, text, maxWidth) {
  const value = String(text || '');
  if (ctx.measureText(value).width <= maxWidth) return value;

  let next = value;
  while (next.length > 1 && ctx.measureText(`${next}…`).width > maxWidth) {
    next = next.slice(0, -1);
  }
  return `${next}…`;
}

function drawTopCard({ contest, entries, labels, limit }) {
  const canvas = document.createElement('canvas');
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  const width = 1080;
  const rowHeight = 84;
  const height = 270 + entries.length * rowHeight;
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.scale(scale, scale);
  ctx.fillStyle = '#160b2e';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#7c3aed';
  ctx.globalAlpha = 0.26;
  ctx.beginPath();
  ctx.arc(930, 60, 250, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 34px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
  ctx.fillText(labels.eyebrow, 70, 82);
  ctx.font = '900 58px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
  ctx.fillText(fitText(ctx, labels.summaryTitle.replaceAll('{limit}', `Top ${limit}`).replaceAll('{contest}', contest.name), 840), 70, 150);
  ctx.fillStyle = '#d8ccff';
  ctx.font = '700 26px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
  ctx.fillText(labels.generatedWith, 70, 205);

  entries.forEach((entry, index) => {
    const y = 250 + index * rowHeight;
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    drawRoundRect(ctx, 70, y, 940, 62, 24);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 31px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.fillText(`${index + 1}`, 96, y + 41);
    ctx.font = '32px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.fillText(flagEmoji(entry.flag), 148, y + 41);

    ctx.font = '900 27px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.fillText(fitText(ctx, entry.country, 310), 205, y + 31);
    ctx.fillStyle = '#d8ccff';
    ctx.font = '700 21px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.fillText(fitText(ctx, `${entry.artist} — ${entry.song}`, 440), 205, y + 55);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 25px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.fillText(labels.scoreLabel.replaceAll('{score}', entry.score), 805, y + 40);
  });

  return canvas;
}

export async function buildTopCardImage(payload) {
  if (!payload.entries.length) return null;

  const canvas = drawTopCard(payload);
  if (!canvas) return null;

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) return null;

  const fileName = `eurovision-2026-top-${payload.contest.id}-${payload.limit}.png`;
  return { blob, fileName, url: URL.createObjectURL(blob) };
}

export function downloadTopCardImagePayload(payload) {
  const link = document.createElement('a');
  link.download = payload.fileName;
  link.href = payload.url;
  link.click();
}

export async function shareTopCardImagePayload(payload, labels) {
  if (!navigator.share) return false;
  const file = new File([payload.blob], payload.fileName, { type: 'image/png' });
  const shareData = { files: [file], title: labels.previewTitle, text: labels.copy };
  if (navigator.canShare && !navigator.canShare(shareData)) return false;
  await navigator.share(shareData);
  return true;
}

export function downloadTopCardImage(payload) {
  if (!payload.entries.length) return false;

  const canvas = drawTopCard(payload);
  if (!canvas) return false;

  const link = document.createElement('a');
  link.download = `eurovision-2026-top-${payload.contest.id}-${payload.limit}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  return true;
}
