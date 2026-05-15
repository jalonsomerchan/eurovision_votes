import { escapeHtml } from './dom.js';
import { formatAverage, getAverage, getContest, getContestStatus, getFinalPositions, getPreviousSemiVote, getSemiState, getSemiStatus, getSongKey, getSongsForContest, isSemi } from './contest.js';

function countryProfileUrl(flag) {
  return `/paises/${String(flag || '').toLowerCase()}/`;
}

function countryLink(song) {
  return `<a class="country-link" href="${countryProfileUrl(song.flag)}">${escapeHtml(song.country)}</a>`;
}

function votedCountForSongs(contestVotes, songs) {
  const songKeys = new Set(songs.map(getSongKey));
  return Object.entries(contestVotes || {}).filter(([key, value]) => songKeys.has(key) && Number.isFinite(value)).length;
}

export function createRenderer({ contests, getState, nodes, t }) {
  function renderVoter() {
    const { voter } = getState();
    if (nodes.voterNameNode) nodes.voterNameNode.textContent = voter?.name || t('guest', 'Votante invitado');
  }

  function renderTabs() {
    const { activeContestId, control, votes } = getState();
    if (!nodes.tabs) return;
    nodes.tabs.innerHTML = contests.map((contest) => {
      const songs = getSongsForContest(contests, control, contest);
      const selected = contest.id === activeContestId;
      const disabled = songs.length === 0;
      const totalVotes = votedCountForSongs(votes[contest.id], songs);
      const status = getContestStatus(control, contest.id);
      const label = disabled
        ? t('pending', 'Pendiente')
        : status === 'closed'
          ? t('closed', 'Votación cerrada')
          : status === 'pending'
            ? t('comingSoon', 'Próximamente')
            : `${totalVotes}/${songs.length}`;

      return `<button class="tab ${selected ? 'is-active' : ''}" type="button" role="tab" aria-selected="${selected}" data-contest-id="${contest.id}"><span>${escapeHtml(contest.name)}</span><small>${escapeHtml(label)}</small></button>`;
    }).join('');
  }

  function renderSummary(contest) {
    const { control, votes } = getState();
    const songs = getSongsForContest(contests, control, contest);
    const scoresLength = votedCountForSongs(votes[contest.id], songs);
    if (nodes.activeName) nodes.activeName.textContent = contest.name;
    if (nodes.votedCount) nodes.votedCount.textContent = `${scoresLength}/${songs.length}`;
  }

  function renderSongs() {
    const { activeContestId, allVoters, control, votes } = getState();
    const contest = getContest(contests, activeContestId);
    const songs = getSongsForContest(contests, control, contest);
    const contestVotes = votes[contest.id] || {};
    const semiState = getSemiState(control, contest.id);
    const semiStatus = getSemiStatus(control, contest.id);
    const contestStatus = getContestStatus(control, contest.id);
    const qualifiers = new Set(semiState.qualifiers || []);
    const positions = getFinalPositions(control);
    const votingClosed = contestStatus === 'closed';
    const votingPending = contestStatus === 'pending';

    renderTabs();
    renderSummary(contest);

    if (!nodes.songList) return;
    if (!songs.length) {
      nodes.songList.innerHTML = `<article class="empty-state"><span aria-hidden="true">🎤</span><h2>${escapeHtml(contest.name)}</h2><p>${escapeHtml(t('noSongs', 'Las canciones de esta gala se mostrarán cuando estén disponibles.'))}</p></article>`;
      return;
    }

    nodes.songList.innerHTML = songs.map((song) => {
      const songKey = getSongKey(song);
      const currentScore = contestVotes[songKey];
      const previousSemiVote = contest.id === 'final' ? getPreviousSemiVote(contests, votes, song) : null;
      const average = getAverage(allVoters, contest.id, songKey);
      const badges = [`<span class="result-badge result-badge--average">${escapeHtml(t('average', 'Media'))} ${formatAverage(average)}</span>`];

      if (isSemi(contest.id) && semiStatus === 'closed') {
        badges.push(qualifiers.has(songKey)
          ? `<span class="result-badge result-badge--qualified">${escapeHtml(t('qualified', 'Clasificado para la final'))}</span>`
          : `<span class="result-badge">${escapeHtml(t('notQualified', 'No clasificado'))}</span>`);
      }
      if (contest.id === 'final' && positions[songKey]) {
        badges.push(`<span class="result-badge result-badge--qualified">${escapeHtml(t('place', 'Puesto'))} ${positions[songKey]}</span>`);
      }

      const scoreButtons = Array.from({ length: 11 }, (_, score) => `<button class="score-button ${currentScore === score ? 'is-selected' : ''}" type="button" aria-pressed="${currentScore === score}" data-score="${score}" data-song-key="${songKey}" ${votingClosed || votingPending ? 'disabled' : ''}>${score}</button>`).join('');
      const message = votingClosed
        ? t(contest.id === 'final' ? 'finalClosed' : 'semiClosed', contest.id === 'final' ? 'La votación de la final ya está cerrada.' : 'La votación de esta semifinal ya está cerrada.')
        : votingPending
          ? t(contest.id === 'final' ? 'finalComingSoon' : 'semiComingSoon', contest.id === 'final' ? 'La votación de la final se abrirá próximamente.' : 'La votación de esta semifinal se abrirá próximamente.')
          : '';
      const previousVoteNote = previousSemiVote
        ? `<aside class="previous-vote-note" aria-label="${escapeHtml(t('previousSemiVote', 'Voto en semifinal'))}"><span>${escapeHtml(t('previousSemiVote', 'Voto en semifinal'))}</span><strong>${previousSemiVote.score}/10</strong><small>${escapeHtml(previousSemiVote.contestName)}</small></aside>`
        : '';
      const viewCountry = t('viewCountry', 'Ver ficha de {country}', { country: song.country });
      const flagAlt = t('flagAlt', 'Bandera de {country}', { country: song.country });
      const rateCountry = t('rateCountry', 'Puntuar {country} del 0 al 10', { country: song.country });

      return `<article class="song-card ${votingClosed || votingPending ? 'is-closed' : ''}"><div class="song-main"><a href="${countryProfileUrl(song.flag)}" aria-label="${escapeHtml(viewCountry)}"><img class="flag" width="64" height="48" loading="lazy" alt="${escapeHtml(flagAlt)}" src="https://flagsapi.com/${song.flag}/flat/64.png" /></a><div class="song-info"><div class="song-meta"><span class="running-order">${song.runningOrder || 'FD'}</span>${song.directFinalist ? `<span class="direct-badge">${escapeHtml(t('finalist', 'Finalista directo'))}</span>` : ''}${badges.join('')}</div><h2>${countryLink(song)}</h2><p><strong>${escapeHtml(song.artist)}</strong> — «${escapeHtml(song.song)}»</p>${previousVoteNote}</div><div class="selected-score" aria-label="${escapeHtml(t('currentScore', 'Puntuación actual'))}">${currentScore ?? '—'}</div></div>${message ? `<p class="closed-note">${escapeHtml(message)}</p>` : `<div class="score-grid" aria-label="${escapeHtml(rateCountry)}">${scoreButtons}</div>`}</article>`;
    }).join('');
  }

  return { renderSongs, renderTabs, renderVoter };
}
