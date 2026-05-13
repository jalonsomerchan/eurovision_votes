import { getContest, getSongKey, getSongsForContest } from './contest.js';

export function getTopCardLimit(nodes) {
  const selected = Array.from(nodes.topCardLimits || []).find((item) => item.checked);
  return Number(selected?.value || 5);
}

export function getTopCardContest(contests, nodes) {
  return getContest(contests, nodes.topCardContest?.value || contests[0]?.id || 'semi-1');
}

export function getRankedTopEntries({ contests, contest, control, limit, votes }) {
  const contestVotes = votes[contest.id] || {};
  const songs = getSongsForContest(contests, control, contest);

  return songs
    .map((song) => ({
      artist: song.artist,
      country: song.country,
      flag: song.flag,
      score: contestVotes[getSongKey(song)],
      song: song.song,
    }))
    .filter((entry) => Number.isFinite(entry.score))
    .sort((a, b) => b.score - a.score || a.country.localeCompare(b.country))
    .slice(0, limit);
}

export function formatTopCardText({ contestName, entries, labels, limit }) {
  const title = labels.summaryTitle
    .replaceAll('{limit}', `Top ${limit}`)
    .replaceAll('{contest}', contestName);
  const lines = entries.map((entry, index) => {
    const score = labels.scoreLabel.replaceAll('{score}', entry.score);
    return `${index + 1}. ${entry.country} — ${entry.artist} — ${score}`;
  });

  return [title, ...lines, labels.generatedWith].join('\n');
}

export function flagEmoji(countryCode) {
  const code = String(countryCode || '').toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return '🏳️';
  return Array.from(code).map((letter) => String.fromCodePoint(127397 + letter.charCodeAt(0))).join('');
}
