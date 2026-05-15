import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const root = process.cwd();

function readText(path) {
  return readFileSync(join(root, path), 'utf8');
}

describe('admin results page', () => {
  it('keeps the hidden admin page and busts its client cache', () => {
    assert.equal(existsSync(join(root, 'src/pages/admin-resultados.astro')), true);
    assert.equal(existsSync(join(root, 'public/admin-results.js')), true);

    const page = readText('src/pages/admin-resultados.astro');
    assert.match(page, /admin-results\.js\?v=20260515-1/);
    assert.match(page, /data-admin-list/);
    assert.match(page, /data-admin-refresh/);
  });

  it('lets admins open, pause and close the final voting', () => {
    const script = readText('public/admin-results.js');

    assert.match(script, /final: \{ positions: \{\}, status: 'open', closed: false \}/);
    assert.match(script, /getFinalState/);
    assert.match(script, /normalizeStatus\(finalState, 'open'\)/);
    assert.match(script, /data-final-set-status/);
    assert.match(script, /setFinalStatus/);
    assert.match(script, /finalButton\.dataset\.finalSetStatus/);
    assert.match(script, /status,\n      closed: status === 'closed'/);
    assert.match(script, /Votación y posiciones finales/);
  });

  it('preserves final status when positions or semifinal qualifiers are saved', () => {
    const script = readText('public/admin-results.js');

    assert.match(script, /const finalStatus = normalizeStatus\(getFinalState\(\), 'open'\)/);
    assert.match(script, /\.\.\.getFinalState\(\),\n      positions: readPositionsFromDom\(\),\n      status: finalStatus/);
    assert.match(script, /final: \{ \.\.\.getFinalState\(\), \.\.\.\(snapshot\.data\(\)\.final \|\| \{\}\) \}/);
  });
});
