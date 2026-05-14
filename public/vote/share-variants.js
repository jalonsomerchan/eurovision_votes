import { getSemiState, getSongKey, getSongsForContest, isSemi } from './contest.js';

export const voteShareVariantIds = ['top10', 'top3', 'runningOrder', 'scoreOrder', 'qualifiedOnly'];

function voteEntry(song, contestVotes, index) {
  return {
    artist: song.artist,
    country: song.country,
    flag: song.flag,
    order: song.order ?? index + 1,
    score: contestVotes[getSongKey(song)],
    song: song.song,
  };
}

function compareByScore(a, b) {
  return b.score - a.score || a.order - b.order || a.country.localeCompare(b.country);
}

function compareByOrder(a, b) {
  return a.order - b.order || a.country.localeCompare(b.country);
}

function votedEntries({ contests, contest, control, votes }) {
  const contestVotes = votes[contest.id] || {};
  return getSongsForContest(contests, control, contest)
    .map((song, index) => voteEntry(song, contestVotes, index))
    .filter((entry) => Number.isFinite(entry.score));
}

function qualifiedEntries({ contest, control, entries }) {
  if (!isSemi(contest.id)) return [];
  const qualifiers = new Set(getSemiState(control, contest.id).qualifiers || []);
  if (!qualifiers.size) return [];
  return entries.filter((entry) => qualifiers.has(`${entry.flag}-${entry.country}`.toLowerCase()));
}

export function buildVoteShareVariants({ contests, contest, control, labels, votes }) {
  const entries = votedEntries({ contests, contest, control, votes });
  if (!entries.length) return [];

  const base = { contest, labels, generatedWith: labels.generatedWith };
  const variants = [
    { ...base, id: 'top10', title: labels.variantTop10, entries: [...entries].sort(compareByScore).slice(0, 10) },
    { ...base, id: 'top3', title: labels.variantTop3, entries: [...entries].sort(compareByScore).slice(0, 3) },
    { ...base, id: 'runningOrder', title: labels.variantRunningOrder, entries: [...entries].sort(compareByOrder) },
    { ...base, id: 'scoreOrder', title: labels.variantScoreOrder, entries: [...entries].sort(compareByScore) },
  ];

  const qualified = qualifiedEntries({ contest, control, entries }).sort(compareByScore);
  if (qualified.length) variants.push({ ...base, id: 'qualifiedOnly', title: labels.variantQualifiedOnly, entries: qualified });

  return variants.filter((variant) => variant.entries.length);
}
