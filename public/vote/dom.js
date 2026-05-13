export const $ = (selector) => document.querySelector(selector);

export function getVoteNodes() {
  return {
    tabs: $('[data-tabs]'),
    songList: $('[data-song-list]'),
    activeName: $('[data-active-name]'),
    votedCount: $('[data-voted-count]'),
    cloudStatus: $('[data-cloud-status]'),
    feedback: $('[data-feedback]'),
    importInput: $('[data-import]'),
    voterNameNode: $('[data-voter-name]'),
    nameModal: $('[data-name-modal]'),
    settingsModal: $('[data-settings-modal]'),
    nameForm: $('[data-name-form]'),
    nameInput: $('#voter-name-input'),
  };
}

export function escapeHtml(value) {
  return String(value ?? '').replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char],
  );
}

export function createUi(nodes) {
  let feedbackTimeoutId;

  function setCloudStatus(text) {
    if (nodes.cloudStatus) nodes.cloudStatus.textContent = text;
  }

  function showFeedback(message) {
    if (!nodes.feedback) return;
    nodes.feedback.textContent = message;
    window.clearTimeout(feedbackTimeoutId);
    feedbackTimeoutId = window.setTimeout(() => {
      nodes.feedback.textContent = '';
    }, 5000);
  }

  function openModal(modal) {
    if (!modal) return;
    modal.hidden = false;
    document.documentElement.classList.add('has-modal');
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.hidden = true;
    if (nodes.nameModal?.hidden && nodes.settingsModal?.hidden) {
      document.documentElement.classList.remove('has-modal');
    }
  }

  return { closeModal, openModal, setCloudStatus, showFeedback };
}
