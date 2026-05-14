import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const root = process.cwd();

function readText(path) {
  return readFileSync(join(root, path), 'utf8');
}

describe('global Eurovision search', () => {
  it('adds routes, component, helpers, script and documentation', () => {
    [
      'src/pages/buscar/index.astro',
      'src/pages/[locale]/buscar/index.astro',
      'src/components/GlobalSearchApp.astro',
      'src/lib/searchIndex.ts',
      'src/lib/searchTools.ts',
      'src/i18n/searchLabels.ts',
      'public/global-search.js',
      'docs/global-search.md',
    ].forEach((path) => {
      assert.equal(existsSync(join(root, path)), true, `${path} should exist`);
    });
  });

  it('builds a local, accent-insensitive index without dependencies', () => {
    const helper = readText('src/lib/searchIndex.ts');
    const tools = readText('src/lib/searchTools.ts');
    const client = readText('public/global-search.js');

    assert.match(helper, /normalizeSearchText/);
    assert.match(helper, /\.normalize\('NFD'\)/);
    assert.match(helper, /buildSearchIndex/);
    assert.match(helper, /listEurovisionCountryProfiles/);
    assert.match(helper, /getEurovisionEditions/);
    assert.match(helper, /eurovision2026Contests/);
    assert.match(helper, /getLocalizedPath/);
    assert.match(helper, /filterSearchIndex/);
    assert.match(helper, /getSearchToolItems/);
    assert.match(tools, /toolTitles/);
    assert.match(tools, /rankingTitles/);
    assert.match(tools, /getLocalizedPath/);
    assert.doesNotMatch(helper, /from ['"]fuse\.js/);
    assert.doesNotMatch(client, /fetch\(/);
    assert.doesNotMatch(client, /import /);
  });

  it('renders accessible grouped results and states', () => {
    const component = readText('src/components/GlobalSearchApp.astro');
    const client = readText('public/global-search.js');

    assert.match(component, /role="search"/);
    assert.match(component, /data-search-input/);
    assert.match(component, /aria-describedby="global-search-help global-search-status"/);
    assert.match(component, /role="status"/);
    assert.match(component, /aria-live="polite"/);
    assert.match(component, /data-search-empty/);
    assert.match(component, /data-search-error/);
    assert.match(component, /<noscript>/);
    assert.match(client, /groupResults/);
    assert.match(client, /search-results__group/);
    assert.match(client, /search-result-card/);
  });

  it('keeps search labels available for all configured locales', () => {
    const labels = readText('src/i18n/searchLabels.ts');

    ['es', 'en', 'fr', 'pt', 'ca', 'eu', 'gl'].forEach((locale) => {
      assert.match(labels, new RegExp(`${locale}: \\{`));
    });
    assert.match(labels, /Buscador de Eurovision/);
    assert.match(labels, /Eurovision search/);
    assert.match(labels, /Buscador de Eurovisión/);
    assert.match(labels, /groups: \{ country:/);
    assert.match(labels, /typeLabels: \{ country:/);
  });

  it('links the search page from navigation and preserves localized alternate paths', () => {
    const header = readText('src/components/Header.astro');

    assert.match(header, /getSearchLabels/);
    assert.match(header, /searchUrl/);
    assert.match(header, /\/buscar\//);
    assert.match(header, /currentPath\.includes\('\/buscar'\)/);
    assert.match(header, /searchLabels\.title/);
  });
});
