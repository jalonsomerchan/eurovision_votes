import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const root = process.cwd();

function readText(path) {
  return readFileSync(join(root, path), 'utf8');
}

describe('vote share image variants', () => {
  it('adds a dedicated helper for the supported variants', () => {
    const helperPath = 'public/vote/share-variants.js';
    assert.equal(existsSync(join(root, helperPath)), true, `${helperPath} should exist`);
    const helper = readText(helperPath);

    ['top10', 'top3', 'runningOrder', 'scoreOrder', 'qualifiedOnly'].forEach((variant) => {
      assert.match(helper, new RegExp(variant));
    });
    assert.match(helper, /isSemi/);
    assert.match(helper, /getSemiState/);
    assert.match(helper, /qualifiers/);
    assert.match(helper, /slice\(0, 10\)/);
    assert.match(helper, /slice\(0, 3\)/);
    assert.match(helper, /compareByOrder/);
    assert.match(helper, /compareByScore/);
  });

  it('renders all vote share images with the required generated footer', () => {
    const canvas = readText('public/vote/top-card-canvas.js');

    assert.match(canvas, /drawVoteShareCard/);
    assert.match(canvas, /buildVoteShareImage/);
    assert.match(canvas, /labels\.generatedWith/);
    assert.match(canvas, /eurovision-2026-\$\{variant\.contest\.id\}-\$\{safeId\}\.png/);
    assert.match(canvas, /canvasPayload/);
  });

  it('shows a gallery of generated image options before sharing or downloading', () => {
    const component = readText('src/components/EurovisionVoteApp.astro');
    const script = readText('public/vote.js');

    assert.match(component, /data-vote-image-gallery/);
    assert.match(component, /data-vote-image-selected/);
    assert.match(component, /vote-image-option/);
    assert.match(script, /buildVoteShareVariants/);
    assert.match(script, /buildVoteShareImage/);
    assert.match(script, /imagePayloads/);
    assert.match(script, /renderImageGallery/);
    assert.match(script, /data-vote-image-option-share/);
    assert.match(script, /data-vote-image-option-download/);
  });

  it('adds translated labels for all variants and the fixed footer text', () => {
    const labels = readText('src/i18n/voteShareLabels.ts');

    ['es', 'en', 'fr', 'pt', 'ca', 'eu', 'gl'].forEach((locale) => {
      assert.match(labels, new RegExp(`${locale}: \\{`));
    });
    ['variantTop10', 'variantTop3', 'variantRunningOrder', 'variantScoreOrder', 'variantQualifiedOnly', 'generatedWith'].forEach((key) => {
      assert.match(labels, new RegExp(key));
    });
    assert.match(labels, /Generado en eurovision\.alon\.one/);
  });
});
