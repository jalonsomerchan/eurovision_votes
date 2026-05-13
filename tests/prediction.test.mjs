import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const root = process.cwd();

function readText(path) {
  return readFileSync(join(root, path), 'utf8');
}

describe('Eurovision prediction utility', () => {
  it('adds default and localized prediction routes', () => {
    assert.equal(existsSync(join(root, 'src/pages/quiniela.astro')), true);
    assert.equal(existsSync(join(root, 'src/pages/[locale]/quiniela.astro')), true);

    const page = readText('src/pages/quiniela.astro');
    const localizedPage = readText('src/pages/[locale]/quiniela.astro');

    assert.match(page, /EurovisionPredictionApp/);
    assert.match(page, /getPredictionLabels/);
    assert.match(localizedPage, /getStaticPaths/);
    assert.match(localizedPage, /isLocale/);
  });

  it('keeps prediction UI translated and data-driven', () => {
    const app = readText('src/components/EurovisionPredictionApp.astro');
    const labels = readText('src/i18n/predictionLabels.ts');
    const header = readText('src/components/Header.astro');
    const navigationLabels = readText('src/i18n/navigationLabels.ts');

    assert.match(app, /eurovision2026Contests/);
    assert.match(app, /prediction-candidates/);
    assert.match(app, /prediction-labels/);
    assert.match(app, /data-prediction-name/);
    assert.match(app, /data-prediction-winner/);
    assert.match(app, /data-prediction-slot/);
    assert.match(app, /data-prediction-country/);
    assert.match(labels, /getPredictionLabels/);
    assert.match(labels, /Quiniela Eurovision 2026/);
    assert.match(labels, /Eurovision 2026 prediction/);
    assert.match(labels, /Eurovision 2026 kiniela/);
    assert.match(labels, /eurovision\.alon\.one/);
    assert.match(header, /predictionUrl/);
    assert.match(header, /\/quiniela\//);
    assert.match(navigationLabels, /prediction/);
  });

  it('splits prediction client logic into small modules without Firebase', () => {
    [
      'public/prediction.js',
      'public/prediction/config.js',
      'public/prediction/data.js',
      'public/prediction/image.js',
      'public/prediction/render.js',
      'public/prediction/storage.js',
      'public/prediction.css',
    ].forEach((path) => assert.equal(existsSync(join(root, path)), true, `${path} should exist`));

    const entry = readText('public/prediction.js');
    const data = readText('public/prediction/data.js');
    const image = readText('public/prediction/image.js');
    const storage = readText('public/prediction/storage.js');
    const render = readText('public/prediction/render.js');
    const layout = readText('src/layouts/BaseLayout.astro');
    const docs = readText('docs/prediction.md');

    assert.match(entry, /predictionStorageKey/);
    assert.match(entry, /URLSearchParams/);
    assert.match(entry, /navigator\.clipboard/);
    assert.match(entry, /downloadPredictionImage/);
    assert.doesNotMatch(entry, /firebase|Firestore/i);
    assert.match(data, /encodePrediction/);
    assert.match(data, /decodePrediction/);
    assert.match(data, /predictionHasContent/);
    assert.match(data, /buildPredictionSummary/);
    assert.match(image, /document\.createElement\('canvas'\)/);
    assert.match(image, /toDataURL\('image\/png'\)/);
    assert.match(image, /labels\.credit/);
    assert.match(storage, /localStorage/);
    assert.match(storage, /name: prediction\.name/);
    assert.match(render, /visually-hidden/);
    assert.match(render, /prediction-country-card/);
    assert.match(layout, /prediction\.css/);
    assert.match(docs, /eurovision\.alon\.one/);
  });
});
