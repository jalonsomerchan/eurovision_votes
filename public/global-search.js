function readJson(root, selector, fallback) {
  try {
    const node = root.querySelector(selector);
    return JSON.parse(node?.textContent || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function normalizeSearchText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9ñç\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function itemText(item) {
  return normalizeSearchText([item.title, item.description, ...(item.keywords || [])].join(' '));
}

function filterIndex(index, query) {
  const normalizedQuery = normalizeSearchText(query);
  if (normalizedQuery.length < 2) return [];
  const tokens = normalizedQuery.split(' ').filter(Boolean);

  return index
    .map((item) => {
      const text = itemText(item);
      const title = normalizeSearchText(item.title);
      if (!tokens.every((token) => text.includes(token))) return null;
      const score = tokens.reduce((sum, token) => sum + (title.startsWith(token) ? 4 : title.includes(token) ? 2 : 1), 0);
      return { item, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.item.type.localeCompare(b.item.type) || a.item.title.localeCompare(b.item.title))
    .slice(0, 40)
    .map((entry) => entry.item);
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
}

function groupResults(results) {
  return results.reduce((groups, item) => {
    const current = groups.get(item.type) || [];
    current.push(item);
    groups.set(item.type, current);
    return groups;
  }, new Map());
}

function renderResults(container, results, labels) {
  const groups = groupResults(results);
  const order = ['country', 'edition', 'song', 'artist', 'tool'];
  container.innerHTML = order
    .filter((type) => groups.has(type))
    .map((type) => `
      <section class="search-results__group" aria-labelledby="search-group-${type}">
        <h2 id="search-group-${type}">${escapeHtml(labels.groups[type] || type)}</h2>
        <div class="search-results__grid">
          ${groups.get(type).map((item) => `
            <a class="search-result-card" href="${escapeHtml(item.href)}" aria-label="${escapeHtml(`${labels.openResult}: ${item.title}`)}">
              <span>${escapeHtml(labels.typeLabels[item.type] || item.type)}</span>
              <strong>${escapeHtml(item.title)}</strong>
              <p>${escapeHtml(item.description)}</p>
            </a>
          `).join('')}
        </div>
      </section>
    `)
    .join('');
}

function setVisible(node, visible) {
  if (node) node.hidden = !visible;
}

document.querySelectorAll('[data-global-search]').forEach((root) => {
  const index = readJson(root, '[data-search-index]', []);
  const labels = readJson(root, '[data-search-labels]', {});
  const input = root.querySelector('[data-search-input]');
  const clear = root.querySelector('[data-search-clear]');
  const status = root.querySelector('[data-search-status]');
  const resultsNode = root.querySelector('[data-search-results]');
  const initialNode = root.querySelector('[data-search-initial]');
  const emptyNode = root.querySelector('[data-search-empty]');
  const errorNode = root.querySelector('[data-search-error]');

  if (!Array.isArray(index) || !input || !resultsNode) {
    setVisible(errorNode, true);
    return;
  }

  function update() {
    const query = input.value || '';
    const results = filterIndex(index, query);
    const hasQuery = normalizeSearchText(query).length >= 2;

    setVisible(errorNode, false);
    setVisible(initialNode, !hasQuery);
    setVisible(emptyNode, hasQuery && results.length === 0);
    setVisible(resultsNode, hasQuery && results.length > 0);

    if (status) {
      status.textContent = hasQuery
        ? (labels.status || '{count}').replaceAll('{count}', String(results.length)).replaceAll('{query}', query)
        : '';
    }

    if (hasQuery && results.length > 0) renderResults(resultsNode, results, labels);
    if (!hasQuery) resultsNode.innerHTML = '';
  }

  input.addEventListener('input', update);
  clear?.addEventListener('click', () => {
    input.value = '';
    input.focus();
    update();
  });
  update();
});
