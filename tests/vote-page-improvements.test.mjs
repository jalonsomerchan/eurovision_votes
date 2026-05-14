import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const root = process.cwd();

function readText(path) {
  return readFileSync(join(root, path), 'utf8');
}

describe('vote page improvements', () => {
  it('keeps voting page sharing below the song list and removes the visible top generator block', () => {
    const app = readText('src/components/EurovisionVoteApp.astro');

    assert.match(app, /vote-share-card/);
    assert.match(app, /data-share-vote-image/);
    assert.match(app, /data-share-votes/);
    assert.match(app, /data-vote-image-modal/);
    assert.match(app, /data-vote-image-share/);
    assert.match(app, /data-vote-image-download/);
    assert.match(app, /getVoteShareLabels/);
    assert.match(app, /<div class="song-list" data-song-list><\/div>\n\n  <section class="vote-share-card"/);
    assert.doesNotMatch(app, /top-card-generator__preview/);
    assert.doesNotMatch(app, /name="top-card-limit"/);
  });

  it('uses translated SEO and share labels for all configured locales', () => {
    const defaultPage = readText('src/pages/vota.astro');
    const localizedPage = readText('src/pages/[locale]/vota.astro');
    const seoLabels = readText('src/i18n/votePageSeoLabels.ts');
    const shareLabels = readText('src/i18n/voteShareLabels.ts');

    assert.match(defaultPage, /getVotePageSeoLabels/);
    assert.match(localizedPage, /getVotePageSeoLabels/);
    assert.match(seoLabels, /Vota Eurovision 2026: semifinales y final/);
    assert.match(seoLabels, /Vote Eurovision 2026: semi-finals and final/);
    assert.match(shareLabels, /Comparte tu resultado/);
    assert.match(shareLabels, /Share your result/);
    assert.match(shareLabels, /shareImage/);
    assert.match(shareLabels, /shareUnavailable/);
    ['es', 'en', 'fr', 'pt', 'ca', 'eu', 'gl'].forEach((locale) => {
      assert.match(seoLabels, new RegExp(`${locale}: \\{`));
      assert.match(shareLabels, new RegExp(`${locale}: \\{`));
    });
  });

  it('counts only votable semi-final songs and busts cached vote modules', () => {
    const contest = readText('public/vote/contest.js');
    const render = readText('public/vote/render.js');
    const script = readText('public/vote.js');

    assert.match(contest, /isVotableSong/);
    assert.match(contest, /!song\.directFinalist/);
    assert.match(render, /votedCountForSongs/);
    assert.match(render, /songKeys\.has\(key\)/);
    assert.match(script, /contest\.js\?v=20260514-6/);
    assert.match(script, /render\.js\?v=20260514-6/);
    assert.match(script, /top-card-canvas\.js\?v=20260514-6/);
  });

  it('generates shareable image payloads instead of direct-only downloads', () => {
    const script = readText('public/vote.js');
    const canvas = readText('public/vote/top-card-canvas.js');

    assert.match(script, /buildTopCardImage/);
    assert.match(script, /shareTopCardImagePayload/);
    assert.match(script, /downloadTopCardImagePayload/);
    assert.match(script, /showModal/);
    assert.match(script, /data-vote-image-preview/);
    assert.match(canvas, /canvas\.toBlob/);
    assert.match(canvas, /URL\.createObjectURL/);
    assert.match(canvas, /new File/);
    assert.match(canvas, /navigator\.share/);
    assert.match(canvas, /navigator\.canShare/);
  });

  it('keeps the corrected direct finalist smoke test available', () => {
    assert.equal(existsSync(join(root, 'tests/eurovision2026.test.mjs')), true);
    const test = readText('tests/eurovision2026.test.mjs');

    assert.match(test, /directFinalists\.length, 3/);
    assert.match(test, /Francia/);
    assert.match(test, /Austria/);
    assert.match(test, /Reino Unido/);
    assert.match(test, /doesNotMatch\(semi2Block, \/country: 'Chequia'/);
    assert.match(test, /doesNotMatch\(semi2Block, \/country: 'Chipre'/);
    assert.match(test, /doesNotMatch\(semi2Block, \/country: 'Ucrania'/);
  });
});
