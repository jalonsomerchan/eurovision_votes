import { getCandidate } from './data.js';

function fitText(ctx, text, maxWidth) {
  const value = String(text || '');
  if (ctx.measureText(value).width <= maxWidth) return value;
  let next = value;
  while (next.length > 1 && ctx.measureText(`${next}…`).width > maxWidth) next = next.slice(0, -1);
  return `${next}…`;
}

function flagEmoji(countryCode) {
  const code = String(countryCode || '').toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return '🏳️';
  return Array.from(code).map((letter) => String.fromCodePoint(127397 + letter.charCodeAt(0))).join('');
}

export function downloadPredictionImage({ candidates, labels, prediction }) {
  const entries = prediction.top.map((flag) => getCandidate(candidates, flag)).filter(Boolean);
  const winner = getCandidate(candidates, prediction.winner);
  if (!entries.length && !winner) return false;

  const canvas = document.createElement('canvas');
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  const width = 1080;
  const rowHeight = 82;
  const height = 360 + Math.max(entries.length, 1) * rowHeight;
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return false;

  ctx.scale(scale, scale);
  ctx.fillStyle = '#150b2e';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#7c3aed';
  ctx.globalAlpha = 0.28;
  ctx.beginPath();
  ctx.arc(930, 80, 260, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 34px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
  ctx.fillText(labels.eyebrow, 70, 80);
  ctx.font = '900 60px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
  const title = prediction.name ? labels.byName.replaceAll('{name}', prediction.name) : labels.summaryTitle;
  ctx.fillText(fitText(ctx, title, 860), 70, 150);

  ctx.fillStyle = '#d8ccff';
  ctx.font = '800 28px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
  ctx.fillText(labels.credit, 70, height - 55);

  if (winner) {
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath();
    ctx.roundRect(70, 195, 940, 82, 26);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 27px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.fillText(`${labels.winnerTitle}: ${flagEmoji(winner.flag)} ${winner.country}`, 105, 245);
  }

  ctx.font = '900 30px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(labels.topSummary, 70, 325);

  entries.forEach((entry, index) => {
    const y = 350 + index * rowHeight;
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.roundRect(70, y, 940, 62, 22);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 28px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.fillText(`${index + 1}. ${flagEmoji(entry.flag)} ${fitText(ctx, entry.country, 330)}`, 105, y + 39);
    ctx.fillStyle = '#d8ccff';
    ctx.font = '700 21px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.fillText(fitText(ctx, `${entry.artist} — ${entry.song}`, 500), 455, y + 39);
  });

  const link = document.createElement('a');
  link.download = 'quiniela-eurovision-2026.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
  return true;
}
