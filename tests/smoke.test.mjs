import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const root = process.cwd();
const supportedLocales = ['es', 'en', 'fr', 'pt', 'ca', 'eu', 'gl'];

function readJson(path) {
  return JSON.parse(readFileSync(join(root, path), 'utf8'));
}

function readText(path) {
  return readFileSync(join(root, path), 'utf8');
}

describe('project smoke checks', () => {
  it('has the minimum files needed by Astro', () => {
    [
      'package.json',
      'astro.config.mjs',
      'src/pages/index.astro',
      'src/pages/[locale]/index.astro',
      'src/pages/vota.astro',
      'src/pages/[locale]/vota.astro',
      'src/pages/stats.astro',
      'src/pages/[locale]/stats.astro',
      'src/pages/noticias/index.astro',
      'src/pages/[locale]/noticias/index.astro',
      'src/pages/paises/[countryCode].astro',
      'src/pages/[locale]/paises/[countryCode].astro',
      'src/pages/comparador-paises/index.astro',
      'src/pages/[locale]/comparador-paises/index.astro',
      'src/pages/404.astro',
      'src/pages/manifest.webmanifest.ts',
      'src/pages/robots.txt.ts',
      'src/layouts/BaseLayout.astro',
      'src/config/site.ts',
      'src/i18n/ui.ts',
      'src/i18n/featureLabels.ts',
      'src/i18n/statsLabels.ts',
      'src/i18n/newsLabels.ts',
      'src/i18n/countryComparisonLabels.ts',
      'src/i18n/countryProfileSeoLabels.ts',
      'src/i18n/translations/es.json',
      'src/i18n/translations/en.json',
      'src/styles/global.css',
    ].forEach((path) => {
      assert.equal(existsSync(join(root, path)), true, `${path} should exist`);
    });
  });

  it('keeps template metadata files available', () => {
    ['.nvmrc', '.env.example', '.gitignore', '.prettierrc', '.prettierignore', 'README.md'].forEach(
      (path) => {
        assert.equal(existsSync(join(root, path)), true, `${path} should exist`);
      }
    );
  });

  it('keeps the expected npm scripts available', () => {
    const pkg = readJson('package.json');

    assert.equal(pkg.scripts?.dev, 'astro dev');
    assert.equal(pkg.scripts?.build, 'astro build');
    assert.equal(pkg.scripts?.preview, 'astro preview');
    assert.ok(pkg.scripts?.test?.includes('node --test'));
    assert.ok(pkg.scripts?.clean?.includes('scripts/clean.mjs'));
  });

  it('keeps basic template components available', () => {
    ['Button', 'Container', 'Footer', 'Header'].forEach((component) => {
      assert.equal(
        existsSync(join(root, `src/components/${component}.astro`)),
        true,
        `${component}.astro should exist`
      );
    });
  });

  it('keeps Astro i18n enabled', () => {
    const astroConfig = readText('astro.config.mjs');
    const i18nHelper = readText('src/i18n/ui.ts');

    assert.match(astroConfig, /i18n/);
    assert.match(astroConfig, /defaultLocale: 'es'/);
    supportedLocales.forEach((locale) => {
      assert.match(astroConfig, new RegExp(`'${locale}'`));
      assert.match(i18nHelper, new RegExp(`translations/${locale}\\.json|${locale} from`));
    });
    assert.match(i18nHelper, /useTranslations/);
    assert.match(i18nHelper, /getLocalizedPath/);
  });

  it('keeps translation files aligned', () => {
    const es = readJson('src/i18n/translations/es.json');

    supportedLocales.forEach((locale) => {
      const translations = readJson(`src/i18n/translations/${locale}.json`);
      assert.deepEqual(Object.keys(translations).sort(), Object.keys(es).sort(), `${locale} keys should match es`);
      assert.ok(translations['home.title'], `${locale} should include home.title`);
    });
  });

  it('includes the Eurovision homepage, voting app and stats app', () => {
    const home = readText('src/pages/index.astro');
    const votePage = readText('src/pages/vota.astro');
    const localizedStatsPage = readText('src/pages/[locale]/stats.astro');
    const app = readText('src/components/EurovisionVoteApp.astro');
    const statsApp = readText('src/components/EurovisionStatsApp.astro');
    const voteScript = readText('public/vote.js');
    const statsScript = readText('public/stats.js');
    const featureLabels = readText('src/i18n/featureLabels.ts');
    const statsLabels = readText('src/i18n/statsLabels.ts');
    const contestConfig = readText('src/config/eurovision2026.ts');
    const siteConfig = readText('src/config/site.ts');

    assert.match(siteConfig, /name: 'Eurovision 2026'/);
    assert.match(home, /EurovisionHomeApp/);
    assert.match(votePage, /EurovisionVoteApp/);
    assert.match(localizedStatsPage, /EurovisionStatsApp/);
    assert.match(app, /vote-labels/);
    assert.match(statsApp, /stats-labels/);
    assert.match(app, /vote\.js/);
    assert.match(voteScript, /localStorage/);
    assert.match(featureLabels, /Exportar votos/);
    assert.match(featureLabels, /Export votes/);
    assert.match(featureLabels, /Borrar votos/);
    assert.match(statsLabels, /Statistiques de l’Eurovision 2026/);
    assert.match(statsScript, /stats-labels/);
    assert.match(voteScript, /flagsapi\.com/);
    assert.match(contestConfig, /Semifinal 1/);
    assert.match(contestConfig, /Semifinal 2/);
    assert.match(contestConfig, /Final/);
  });

  it('includes the ESCplus news page', () => {
    const newsPage = readText('src/pages/noticias/index.astro');
    const localizedNewsPage = readText('src/pages/[locale]/noticias/index.astro');
    const newsApp = readText('src/components/EurovisionNewsApp.astro');
    const newsLabels = readText('src/i18n/newsLabels.ts');
    const newsFeed = readText('src/lib/newsFeed.mjs');
    const header = readText('src/components/Header.astro');
    const home = readText('src/components/EurovisionHomeApp.astro');

    assert.match(newsPage, /getEscplusNewsFeed/);
    assert.match(localizedNewsPage, /getStaticPaths/);
    assert.match(newsApp, /target="_blank"/);
    assert.match(newsApp, /rel="noopener noreferrer"/);
    assert.match(newsApp, /ESCplus España/);
    assert.match(newsLabels, /Noticias de Eurovision/);
    assert.match(newsLabels, /Eurovision news/);
    assert.match(newsFeed, /dc:creator/);
    assert.match(newsFeed, /parseEscplusRss/);
    assert.match(header, /noticias/);
    assert.match(home, /newsLabels/);
  });

  it('parses a WordPress RSS item from ESCplus', async () => {
    const { parseEscplusRss } = await import('../src/lib/newsFeed.mjs');
    const sample = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:slash="http://purl.org/rss/1.0/modules/slash/"><channel><item><title><![CDATA[Cómo ver y votar en Eurovisión 2026 desde Estados Unidos]]></title><link>https://www.escplus.es/eurovision/2026/como-ver-y-votar-en-eurovision-2026-desde-estados-unidos/</link><dc:creator><![CDATA[Lorena Díaz]]></dc:creator><pubDate>Wed, 13 May 2026 08:00:00 +0000</pubDate><category><![CDATA[Eurovisión]]></category><category><![CDATA[ESC 2026]]></category><guid isPermaLink="false">https://www.escplus.es/?p=348073</guid><description><![CDATA[El Festival de Eurovisión <strong>puede seguirse</strong> actualmente&#160;...<script>alert(1)</script>]]></description><wfw:commentRss>https://www.escplus.es/feed/</wfw:commentRss><slash:comments>0</slash:comments></item></channel></rss>`;
    const items = parseEscplusRss(sample);

    assert.equal(items.length, 1);
    assert.equal(items[0].creator, 'Lorena Díaz');
    assert.deepEqual(items[0].categories, ['Eurovisión', 'ESC 2026']);
    assert.equal(items[0].publishedAt, '2026-05-13T08:00:00.000Z');
    assert.match(items[0].description, /puede seguirse/);
    assert.doesNotMatch(items[0].description, /<strong>|<script>|alert/);
  });

  it('includes SEO country profile pages', () => {
    const countryPage = readText('src/pages/paises/[countryCode].astro');
    const localizedCountryPage = readText('src/pages/[locale]/paises/[countryCode].astro');
    const profileApp = readText('src/components/EurovisionCountryProfileApp.astro');
    const profileChart = readText('src/components/CountryProfileChart.astro');
    const profileTable = readText('src/components/CountryProfileHistoryTable.astro');
    const profileFaq = readText('src/components/CountryProfileFaq.astro');
    const profileRelated = readText('src/components/CountryProfileRelatedLinks.astro');
    const seoLabels = readText('src/i18n/countryProfileSeoLabels.ts');

    assert.match(countryPage, /getStaticPaths/);
    assert.match(countryPage, /formatCountryProfileLabel/);
    assert.match(localizedCountryPage, /locales/);
    assert.match(profileApp, /CountryProfileFaq/);
    assert.match(profileApp, /CountryProfileHistoryTable/);
    assert.match(profileChart, /country-chart/);
    assert.match(profileTable, /data-label/);
    assert.match(profileFaq, /details/);
    assert.match(profileRelated, /comparador-paises/);
    assert.match(seoLabels, /Eurovision: historial/);
    assert.match(seoLabels, /Eurovision: history/);
  });

  it('includes the Eurovision country comparator', () => {
    const comparatorPage = readText('src/pages/comparador-paises/index.astro');
    const localizedComparatorPage = readText('src/pages/[locale]/comparador-paises/index.astro');
    const comparatorApp = readText('src/components/EurovisionCountryComparatorApp.astro');
    const comparatorHelpers = readText('src/lib/countryComparison.ts');
    const comparatorLabels = readText('src/i18n/countryComparisonLabels.ts');
    const comparatorScript = readText('public/country-comparator.js');
    const countryIndex = readText('src/components/EurovisionCountryIndexApp.astro');
    const header = readText('src/components/Header.astro');

    assert.match(comparatorPage, /listCountryComparisons/);
    assert.match(localizedComparatorPage, /getStaticPaths/);
    assert.match(comparatorApp, /data-country-comparator-select/);
    assert.match(comparatorApp, /country-comparator\.js/);
    assert.match(comparatorHelpers, /resultsByDecade/);
    assert.match(comparatorHelpers, /lastParticipation/);
    assert.match(comparatorLabels, /Comparador de países/);
    assert.match(comparatorLabels, /Eurovision country comparator/);
    assert.match(comparatorScript, /selectedOptions/);
    assert.match(countryIndex, /comparador-paises/);
    assert.match(header, /comparatorPathMatch/);
  });

  it('includes GitHub workflows for CI and Pages', () => {
    const pagesWorkflow = readText('.github/workflows/pages.yml');
    const ciWorkflow = readText('.github/workflows/ci.yml');

    assert.match(pagesWorkflow, /actions\/deploy-pages@v4/);
    assert.match(pagesWorkflow, /npm run build/);
    assert.match(pagesWorkflow, /npm test/);
    assert.match(ciWorkflow, /pull_request/);
    assert.match(ciWorkflow, /npm run build/);
    assert.match(ciWorkflow, /npm test/);
  });

  it('keeps useful project documentation available', () => {
    const readme = readText('README.md');

    assert.match(readme, /\S/, 'README.md should not be empty');
    assert.match(readme, /\/noticias\//, 'README.md should document news route');
    assert.match(readme, /\/paises\/\{codigo\}\//, 'README.md should document country profile routes');
    assert.equal(existsSync(join(root, 'agents.md')), true, 'agents.md should exist');
    assert.equal(existsSync(join(root, 'docs/design-system.md')), true, 'docs/design-system.md should exist');
  });
});
