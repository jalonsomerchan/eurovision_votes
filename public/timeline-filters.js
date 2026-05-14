function updateTimeline(root) {
  const filters = {
    decade: root.querySelector('[data-timeline-filter="decade"]')?.value || '',
    host: root.querySelector('[data-timeline-filter="host"]')?.value || '',
    winner: root.querySelector('[data-timeline-filter="winner"]')?.value || '',
    type: root.querySelector('[data-timeline-filter="type"]')?.value || '',
  };
  const entries = [...root.querySelectorAll('[data-timeline-entry]')];
  let visible = 0;

  entries.forEach((entry) => {
    const matches =
      (!filters.decade || entry.dataset.decade === filters.decade) &&
      (!filters.host || entry.dataset.host === filters.host) &&
      (!filters.winner || entry.dataset.winner === filters.winner) &&
      (!filters.type || (entry.dataset.types || '').split(' ').includes(filters.type));

    entry.hidden = !matches;
    if (matches) visible += 1;
  });

  const empty = root.querySelector('[data-timeline-empty]');
  if (empty) empty.hidden = visible > 0;

  const status = root.querySelector('[data-timeline-status]');
  if (status) {
    status.textContent = (status.dataset.template || '{count}').replace('{count}', String(visible));
  }
}

document.querySelectorAll('[data-timeline]').forEach((root) => {
  const form = root.querySelector('[data-timeline-form]');
  const reset = root.querySelector('[data-timeline-reset]');

  form?.addEventListener('change', () => updateTimeline(root));
  reset?.addEventListener('click', () => {
    form?.reset();
    updateTimeline(root);
  });

  updateTimeline(root);
});
