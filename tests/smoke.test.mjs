import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const root = process.cwd();

function readText(path) {
  return readFileSync(join(root, path), 'utf8');
}

describe('project smoke checks', () => {
  it('has the minimum files needed by Astro', () => {
    [
      'astro.config.mjs',
      'package.json',
      'src/pages/index.astro',
      'src/layouts/BaseLayout.astro',
      'src/components/Container.astro',
      'src/components/Header.astro',
      'src/components/Footer.astro',
      'src/styles/global.css',
    ].forEach((path) => {
      assert.equal(existsSync(join(root, path)), true, `${path} should exist`);
    });
  });

  it('keeps template metadata and npm scripts available', () => {
    ['README.md', 'tsconfig.json'].forEach((path) => {
      assert.equal(existsSync(join(root, path)), true, `${path} should exist`);
    });

    const pkg = JSON.parse(readText('package.json'));
    ['dev', 'build', 'preview', 'test'].forEach((script) => {
      assert.equal(typeof pkg.scripts?.[script], 'string', `missing npm script ${script}`);
    });
  });

  it('keeps basic layout and navigation components available', () => {
    const layout = readText('src/layouts/BaseLayout.astro');
    const header = readText('src/components/Header.astro');
    const footer = readText('src/components/Footer.astro');
    const container = readText('src/components/Container.astro');

    assert.match(layout, /<Header/);
    assert.match(layout, /<Footer/);
    assert.match(layout, /canonicalUrl/);
    assert.match(header, /getNavigationLabels/);
    assert.match(header, /data-theme-toggle/);
    assert.match(footer, /getFooterLabels/);
    assert.match(container, /container/);
  });

  it('keeps Astro i18n enabled and translations aligned', () => {
    const config = readText('astro.config.mjs');
    const site = readText('src/config/site.ts');
    const feature = readText('src/i18n/featureLabels.ts');
    const nav = readText('src/i18n/navigationLabels.ts');
    const ui = readText('src/i18n/ui.ts');

    assert.match(config, /i18n/);
    assert.match(config, /locales/);
    assert.match(config, /defaultLocale/);
    assert.match(ui, /getLocalizedPath/);

    ['es', 'en', 'fr', 'pt', 'ca', 'eu', 'gl'].forEach((locale) => {
      assert.match(site, new RegExp(`'${locale}'`));
      assert.match(feature, new RegExp(`${locale}: \\{`));
      assert.match(nav, new RegExp(`${locale}: \\{`));
    });
  });

  it('includes the Eurovision homepage and voting app', () => {
    const page = readText('src/pages/index.astro');
    const votePage = readText('src/pages/vota.astro');
    const voteApp = readText('src/components/EurovisionVoteApp.astro');

    assert.match(page, /EurovisionHome/);
    assert.match(votePage, /EurovisionVoteApp/);
    assert.match(voteApp, /eurovision2026Contests/);
  });

  it('keeps the vote client split into focused modules', () => {
    [
      'public/vote/actions.js',
      'public/vote/cloud.js',
      'public/vote/config.js',
      'public/vote/contest.js',
      'public/vote/dom.js',
      'public/vote/render.js',
      'public/vote/storage.js',
      'public/vote/top-card-canvas.js',
      'public/vote/top-card-data.js',
      'public/vote/share-variants.js',
    ].forEach((path) => {
      assert.equal(existsSync(join(root, path)), true, `${path} should exist`);
    });

    assert.match(readText('public/vote/cloud.js'), /initializeFirestore/);
    assert.match(readText('public/vote/actions.js'), /shareVotes/);
    assert.match(readText('public/vote/actions.js'), /exportVotes/);
    assert.match(readText('public/vote/actions.js'), /importVotes/);
    assert.match(readText('public/vote/render.js'), /createRenderer/);
    assert.match(readText('public/vote/storage.js'), /localStorage/);
  });

  it('includes the shareable vote image variant generator', () => {
    const voteApp = readText('src/components/EurovisionVoteApp.astro');
    const voteScript = readText('public/vote.js');
    const shareLabels = readText('src/i18n/voteShareLabels.ts');
    const topCardCanvas = readText('public/vote/top-card-canvas.js');
    const variants = readText('public/vote/share-variants.js');
    const layout = readText('src/layouts/BaseLayout.astro');
    const styles = readText('public/top-card.css');

    assert.match(voteApp, /top-card-labels/);
    assert.match(voteApp, /vote-share-labels/);
    assert.match(voteApp, /data-vote-image-gallery/);
    assert.match(voteApp, /data-vote-image-preview/);
    assert.match(voteScript, /buildVoteShareImage/);
    assert.match(voteScript, /buildVoteShareVariants/);
    assert.match(voteScript, /renderImageGallery/);
    assert.match(shareLabels, /variantTop10/);
    assert.match(shareLabels, /variantTop3/);
    assert.match(shareLabels, /variantRunningOrder/);
    assert.match(shareLabels, /variantScoreOrder/);
    assert.match(shareLabels, /variantQualifiedOnly/);
    assert.match(shareLabels, /Generado en eurovision\.alon\.one/);
    assert.match(variants, /qualifiedOnly/);
    assert.match(topCardCanvas, /document\.createElement\('canvas'\)/);
    assert.match(topCardCanvas, /canvas\.toBlob/);
    assert.match(topCardCanvas, /URL\.createObjectURL/);
    assert.match(topCardCanvas, /navigator\.share/);
    assert.match(layout, /top-card\.css/);
    assert.match(styles, /top-card-generator/);
  });

  it('keeps senior Eurovision history parsing constrained when present', () => {
    const history = readText('src/lib/eurovisionHistory.ts');
    const editions = readText('src/lib/eurovisionEditions.ts');

    assert.match(history, /SENIOR_DATASET_DIR/);
    assert.match(history, /senior/);
    assert.match(editions, /getEurovisionEditions/);
  });

  it('keeps GitHub Pages workflow available', () => {
    assert.equal(existsSync(join(root, '.github/workflows/deploy.yml')), true);
  });
});
