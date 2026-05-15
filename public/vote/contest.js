export function getSongKey(song) {
  return `${song.flag}-${song.country}`.toLowerCase();
}

export function getContest(contests, contestId) {
  return contests.find((contest) => contest.id === contestId) || contests[0];
}

export function isSemi(contestId) {
  return contestId === 'semi-1' || contestId === 'semi-2';
}

export function isVotableSong(contestId, song) {
  return !isSemi(contestId) || !song.directFinalist;
}

export function getSemiState(control, contestId) {
  return control?.semifinals?.[contestId] || { qualifiers: [], status: 'pending', closed: false };
}

export function getSemiStatus(control, contestId) {
  const state = getSemiState(control, contestId);
  if (state.status) return state.status;
  return state.closed ? 'closed' : 'open';
}

export function getFinalState(control) {
  return control?.final || { positions: {}, status: 'open', closed: false };
}

export function getFinalStatus(control) {
  const state = getFinalState(control);
  if (state.status) return state.status;
  return state.closed ? 'closed' : 'open';
}

export function getContestStatus(control, contestId) {
  return isSemi(contestId) ? getSemiStatus(control, contestId) : getFinalStatus(control);
}

export function getFinalPositions(control) {
  return getFinalState(control).positions || {};
}

export function getSongsForContest(contests, control, contest) {
  if (contest.id !== 'final' || contest.songs.length) {
    return contest.songs.filter((song) => isVotableSong(contest.id, song));
  }

  const qualified = [];
  contests.filter((item) => isSemi(item.id)).forEach((semi) => {
    const qualifiers = new Set(getSemiState(control, semi.id).qualifiers || []);
    semi.songs.forEach((song) => {
      if (qualifiers.has(getSongKey(song))) qualified.push({ ...song, qualifiedFrom: semi.name });
    });
  });
  return qualified;
}

export function getLatestOpenContestId(contests, control) {
  const withSongs = contests.filter((contest) => getSongsForContest(contests, control, contest).length > 0);
  const openContest = withSongs.findLast((contest) => getContestStatus(control, contest.id) === 'open');
  const availableContest = withSongs.findLast((contest) => getContestStatus(control, contest.id) !== 'closed');
  return openContest?.id || availableContest?.id || withSongs.at(-1)?.id || contests[0]?.id || 'semi-1';
}

export function getPreviousSemiVote(contests, votes, song) {
  const songKey = getSongKey(song);
  for (const contest of contests.filter((item) => isSemi(item.id))) {
    const score = votes?.[contest.id]?.[songKey];
    if (Number.isFinite(score)) return { contestName: contest.name, score };
  }
  return null;
}

export function getAverage(allVoters, contestId, songKey) {
  const scores = allVoters.map((item) => item.votes?.[contestId]?.[songKey]).filter(Number.isFinite);
  if (!scores.length) return null;
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

export function formatAverage(value) {
  return Number.isFinite(value) ? value.toFixed(2).replace('.', ',') : '—';
}
