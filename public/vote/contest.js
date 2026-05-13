export function getSongKey(song) {
  return `${song.flag}-${song.country}`.toLowerCase();
}

export function getContest(contests, contestId) {
  return contests.find((contest) => contest.id === contestId) || contests[0];
}

export function isSemi(contestId) {
  return contestId === 'semi-1' || contestId === 'semi-2';
}

export function getSemiState(control, contestId) {
  return control?.semifinals?.[contestId] || { qualifiers: [], status: 'pending', closed: false };
}

export function getSemiStatus(control, contestId) {
  const state = getSemiState(control, contestId);
  if (state.status) return state.status;
  return state.closed ? 'closed' : 'open';
}

export function getFinalPositions(control) {
  return control?.final?.positions || {};
}

export function getSongsForContest(contests, control, contest) {
  if (contest.id !== 'final' || contest.songs.length) return contest.songs;

  const qualified = [];
  contests.filter((item) => isSemi(item.id)).forEach((semi) => {
    const qualifiers = new Set(getSemiState(control, semi.id).qualifiers || []);
    semi.songs.forEach((song) => {
      if (qualifiers.has(getSongKey(song))) qualified.push({ ...song, qualifiedFrom: semi.name });
    });
  });
  return qualified;
}

export function getAverage(allVoters, contestId, songKey) {
  const scores = allVoters.map((item) => item.votes?.[contestId]?.[songKey]).filter(Number.isFinite);
  if (!scores.length) return null;
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

export function formatAverage(value) {
  return Number.isFinite(value) ? value.toFixed(2).replace('.', ',') : '—';
}
