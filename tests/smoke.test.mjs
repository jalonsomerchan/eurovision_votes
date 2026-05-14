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

  it('keeps template metadata files available', () => {
    ['README.md', 'tsconfig.json'].forEach((path) => {
      assert.equal(existsSync(join(root, path)), true, `${path} should exist`);
    });
  });

  it('keeps the expected npm scripts available', () => {
    const pkg = JSON.parse(readText('package.json'));
    ['dev', 'build', 'preview', 'test'].forEach((script) => {
      assert.equal(typeof pkg.scripts?.[script], 'string', `missing npm script ${script}`);
    });
  });

  it('keeps basic template components available', () => {
    const layout = readText('src/layouts/BaseLayout.astro');
    const header = readText('src/components/Header.astro');
    const footer = readText('src/components/Footer.astro');
    const container = readText('src/components/Container.astro');

    assert.match(layout, /<Header/);
    assert.match(layout, /<Footer/);
    assert.match(layout, /slot/);
    assert.match(layout, /getCanonicalUrl/);
    assert.match(header, /getNavigationLabels/);
    assert.match(header, /data-theme-toggle/);
    assert.match(footer, /getFooterLabels/);
    assert.match(container, /container/);
  });

  it('keeps Astro i18n enabled', () => {
    const config = readText('astro.config.mjs');
    const site = readText('src/config/site.ts');
    const ui = readText('src/i18n/ui.ts');

    assert.match(config, /i18n/);
    assert.match(config, /locales/);
    assert.match(config, /defaultLocale/);
    assert.match(site, /locales/);
    assert.match(site, /defaultLocale/);
    assert.match(ui, /getLocalizedPath/);
  });

  it('keeps translation files aligned', () => {
    const site = readText('src/config/site.ts');
    const feature = readText('src/i18n/featureLabels.ts');
    const nav = readText('src/i18n/navigationLabels.ts');

    ['es', 'en', 'fr', 'pt', 'ca', 'eu', 'gl'].forEach((locale) => {
      assert.match(site, new RegExp(`'${locale}'`));
      assert.match(feature, new RegExp(`${locale}: \\{`));
      assert.match(nav, new RegExp(`${locale}: \\{`));
    });
  });

  it('includes the Eurovision homepage, voting app and stats app', () => {
    const page = readText('src/pages/index.astro');
    const votePage = readText('src/pages/vota.astro');
    const voteApp = readText('src/components/EurovisionVoteApp.astro');
    const statsPage = readText('src/pages/stats/index.astro');
    const statsApp = readText('src/components/EurovisionStatsApp.astro');

    assert.match(page, /EurovisionHome/);
    assert.match(votePage, /EurovisionVoteApp/);
    assert.match(voteApp, /eurovision2026Contests/);
    assert.match(statsPage, /EurovisionStatsApp/);
    assert.match(statsApp, /data-stats-root/);
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

  it('includes the shareable personal vote image generator', () => {
    const voteApp = readText('src/components/EurovisionVoteApp.astro');
    const voteScript = readText('public/vote.js');
    const topCardLabels = readText('src/i18n/topCardLabels.ts');
    const shareLabels = readText('src/i18n/voteShareLabels.ts');
    const topCardCanvas = readText('public/vote/top-card-canvas.js');
    const variants = readText('public/vote/share-variants.js');
    const layout = readText('src/layouts/BaseLayout.astro');
    const styles = readText('public/top-card.css');

    assert.match(voteApp, /top-card-labels/);
    assert.match(voteApp, /data-top-card-contest/);
    assert.match(voteApp, /data-top-card-copy/);
    assert.match(voteApp, /data-top-card-download/);
    assert.match(voteApp, /data-vote-image-gallery/);
    assert.match(voteScript, /buildVoteShareImage/);
    assert.match(voteScript, /buildVoteShareVariants/);
    assert.match(topCardLabels, /getTopCardLabels/);
    assert.match(topCardLabels, /Generate your personal top/);
    assert.match(topCardLabels, /Xera o teu top persoal/);
    assert.match(shareLabels, /variantTop10/);
    assert.match(shareLabels, /Generado en eurovision\.alon\.one/);
    assert.match(variants, /qualifiedOnly/);
    assert.match(topCardCanvas, /document\.createElement\('canvas'\)/);
    assert.match(topCardCanvas, /canvas\.toBlob/);
    assert.match(topCardCanvas, /URL\.createObjectURL/);
    assert.match(topCardCanvas, /navigator\.share/);
    assert.match(layout, /top-card\.css/);
    assert.match(styles, /top-card-generator/);
  });

  it('restricts historical dataset parsing to senior Eurovision only', () => {
    const history = readText('src/lib/eurovisionHistory.ts');
    const editions = readText('src/lib/eurovisionEditions.ts');

    assert.match(history, /SENIOR_DATASET_DIR/);
    assert.match(history, /path\.join\(DATASET_DIR, 'data', 'senior'\)/);
    assert.match(history, /data\[\/\\\\\]senior/);
    assert.match(history, /walkJsonFiles\(SENIOR_DATASET_DIR\)/);
    assert.match(history, /isSeniorDatasetPath/);
    assert.match(editions, /getEurovisionEditions/);
  });

  it('includes evergreen Eurovision rankings', () => {
    const rankingsPage = readText('src/pages/rankings/index.astro');
    const rankingsLib = readText('src/lib/eurovisionRankings.ts');
    const rankingsLabels = readText('src/i18n/rankingsLabels.ts');

    assert.match(rankingsPage, /RankingsApp/);
    assert.match(rankingsLib, /getEurovisionRankings/);
    assert.match(rankingsLabels, /Eurovision rankings/);
  });

  it('includes the ESCplus news page', () => {
    const newsPage = readText('src/pages/noticias/index.astro');
    const newsLib = readText('src/lib/escplusNews.ts');

    assert.match(newsPage, /EscplusNewsApp/);
    assert.match(newsLib, /ESCPLUS_FEED_URL/);
  });

  it('parses a WordPress RSS item from ESCplus', () => {
    const newsLib = readText('src/lib/escplusNews.ts');

    assert.match(newsLib, /parseEscplusFeed/);
    assert.match(newsLib, /extractFirstImage/);
    assert.match(newsLib, /decodeHtml/);
  });

  it('includes SEO country profile pages', () => {
    const countryPage = readText('src/pages/paises/[countryCode]/index.astro');
    const localizedCountryPage = readText('src/pages/[locale]/paises/[countryCode]/index.astro');
    const countryProfiles = readText('src/lib/eurovisionCountryProfiles.ts');

    assert.match(countryPage, /EurovisionCountryProfile/);
    assert.match(localizedCountryPage, /getStaticPaths/);
    assert.match(countryProfiles, /getEurovisionCountryProfile/);
  });

  it('includes the Eurovision country comparator', () => {
    const page = readText('src/pages/comparador-paises/index.astro');
    const localized = readText('src/pages/[locale]/comparador-paises/index.astro');
    const helper = readText('src/lib/countryComparison.ts');

    assert.match(page, /CountryComparisonApp/);
    assert.match(localized, /CountryComparisonApp/);
    assert.match(helper, /compareCountries/);
  });

  it('includes GitHub workflows for CI and Pages', () => {
    assert.equal(existsSync(join(root, '.github/workflows/ci.yml')), true);
    assert.equal(existsSync(join(root, '.github/workflows/deploy.yml')), true);
  });

  it('keeps useful project documentation available', () => {
    ['docs/country-map.md', 'docs/global-search.md', 'docs/country-comparison.md'].forEach((path) => {
      assert.equal(existsSync(join(root, path)), true, `${path} should exist`);
    });
  });
});
