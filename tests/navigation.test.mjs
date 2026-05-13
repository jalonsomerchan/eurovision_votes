import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const root = process.cwd();

function readText(path) {
  return readFileSync(join(root, path), 'utf8');
}

describe('navigation and footer smoke checks', () => {
  it('moves stats out of the header and keeps data links grouped', () => {
    const header = readText('src/components/Header.astro');
    const labels = readText('src/i18n/navigationLabels.ts');

    assert.match(header, /nav-dropdown/);
    assert.match(header, /dataLinks/);
    assert.match(header, /historyUrl/);
    assert.match(header, /countriesUrl/);
    assert.match(header, /countryPointsUrl/);
    assert.doesNotMatch(header, /const statsUrl/);
    assert.doesNotMatch(header, /t\('nav\.stats'\)/);
    assert.match(labels, /voteStatsCta/);
    assert.match(labels, /Ver estadísticas de votaciones/);
    assert.match(labels, /View voting statistics/);
  });

  it('shows the voting statistics CTA inside the vote app', () => {
    const voteApp = readText('src/components/EurovisionVoteApp.astro');

    assert.match(voteApp, /getLocalizedPath\('\/stats\/'/);
    assert.match(voteApp, /vote-stats-link/);
    assert.match(voteApp, /navLabels\.voteStatsCta/);
  });

  it('includes AlonSoftware project links in the footer', () => {
    const footer = readText('src/components/Footer.astro');
    const labels = readText('src/i18n/navigationLabels.ts');
    const styles = readText('public/extra.css');

    assert.match(footer, /site-footer/);
    assert.match(footer, /footerTools/);
    assert.match(footer, /footerGames/);
    assert.match(labels, /facilpdf\.alon\.one/);
    assert.match(labels, /facilimg\.alon\.one/);
    assert.match(labels, /printacalendar\.alon\.one/);
    assert.match(labels, /hityear\.alon\.one/);
    assert.match(labels, /democrazy\.alon\.one/);
    assert.match(labels, /hamsterrun\.alon\.one/);
    assert.match(labels, /mundial2026\.alon\.one/);
    assert.match(styles, /site-footer__projects/);
    assert.match(styles, /nav-dropdown__list/);
    assert.match(styles, /mobile-menu__section/);
  });
});
