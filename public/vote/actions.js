import { storageKey } from './config.js';

export function createVoteActions({ closeModal, deviceId, getState, importInput, renderSongs, saveLocalVotes, saveVoter, settingsModal, showFeedback, t }) {
  function getShareUrl() {
    const { voter } = getState();
    const url = new URL('/votos/', window.location.origin);
    url.searchParams.set('u', deviceId);
    if (voter?.name) url.searchParams.set('nombre', voter.name);
    return url.toString();
  }

  async function shareVotes(saveCloudVotes) {
    const { openNameModal, voter } = getState();
    if (!voter?.name) {
      openNameModal();
      showFeedback(t('saveNameFirst', 'Guarda tu nombre antes de compartir tus votaciones.'));
      return;
    }

    await saveCloudVotes();
    const shareUrl = getShareUrl();
    const title = t('shareTitle', 'Votaciones de {name} en Eurovision 2026', { name: voter.name });
    const text = t('shareText', 'Consulta mis votaciones de Eurovision 2026.');

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: shareUrl });
        showFeedback(t('shareReady', 'Enlace preparado para compartir.'));
        return;
      }
    } catch (error) {
      if (error?.name === 'AbortError') return;
      console.error('Share error:', error);
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      showFeedback(t('linkCopied', 'Enlace copiado al portapapeles.'));
    } catch {
      window.prompt(t('promptCopy', 'Copia este enlace para compartir tus votaciones:'), shareUrl);
    }
  }

  function exportVotes() {
    const { voter, votes } = getState();
    const payload = { app: 'eurovision-2026', version: 3, exportedAt: new Date().toISOString(), voter, votes };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'eurovision-2026-votos.json';
    link.click();
    URL.revokeObjectURL(url);
    showFeedback(t('exported', 'Archivo de votos exportado correctamente.'));
  }

  async function importVotes(event, queueCloudSave) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const imported = JSON.parse(await file.text());
      const importedVotes = imported.votes || imported;
      if (!importedVotes || typeof importedVotes !== 'object' || Array.isArray(importedVotes)) throw new Error('Formato no válido');
      getState().setVotes(importedVotes);
      if (imported.voter?.name) saveVoter(imported.voter.name);
      saveLocalVotes();
      renderSongs();
      queueCloudSave();
      closeModal(settingsModal);
      showFeedback(t('imported', 'Votos importados correctamente.'));
    } catch {
      showFeedback(t('importError', 'No se pudo importar el archivo de votos. Revisa el formato e inténtalo de nuevo.'));
    } finally {
      event.target.value = '';
    }
  }

  function resetVotes(queueCloudSave) {
    if (!window.confirm(t('resetConfirm', '¿Seguro que quieres borrar todos los votos guardados?'))) return;
    getState().setVotes({});
    localStorage.removeItem(storageKey);
    renderSongs();
    queueCloudSave();
    closeModal(settingsModal);
    showFeedback(t('resetDone', 'Votos borrados correctamente.'));
  }

  return { exportVotes, getShareUrl, importVotes, resetVotes, shareVotes };
}
