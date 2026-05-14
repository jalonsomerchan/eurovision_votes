import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const root = process.cwd();
const supportedLocales = ['es', 'en', 'fr', 'pt', 'ca', 'eu', 'gl'];
const expectedTerms = ['semifinal', 'final', 'big-five', 'jury', 'televote', 'ebu', 'running-order', 'top-10', 'nul-points'];

function readText(path) {
  return readFileSync(join(root, path), 'utf8');
}

describe('Eurovision glossary smoke checks', () => {
  it('keeps glossary structure available', () => {
    [
      'src/config/eurovisionGlossary.ts',
      'src/lib/glossaryRoutes.ts',
      'src/i18n/glossaryLabels.ts',
      'src/components/EurovisionGlossaryIndexApp.astro',
      'src/components/EurovisionGlossaryTermApp.astro',
      'src/components/GlossaryRelatedLinks.astro',
      'src/pages/glosario/index.astro',
      'src/pages/glosario/[slug].astro',
      'src/pages/[locale]/glosario/index.astro',
      'src/pages/[locale]/glosario/[slug].astro',
      'docs/glossary.md',
    ].forEach((path) => {
      assert.equal(existsSync(join(root, path)), true, `${path} should exist`);
    });
  });

  it('keeps all requested glossary terms and locales configured', () => {
    const config = readText('src/config/eurovisionGlossary.ts');

    expectedTerms.forEach((term) => assert.match(config, new RegExp(`'${term}'`), `${term} should be configured`));
    supportedLocales.forEach((locale) => assert.match(config, new RegExp(`${locale}: \\{`), `${locale} should have glossary text`));
    assert.match(config, /No conviene asumir|Direct-final rules|ez dira iraunkortzat/);
    assert.match(config, /getGlossaryTermSlug/);
    assert.match(config, /getGlossaryStaticPaths/);
  });

  it('keeps glossary pages indexable, localized and base-compatible', () => {
    const indexPage = readText('src/pages/glosario/index.astro');
    const localizedTermPage = readText('src/pages/[locale]/glosario/[slug].astro');
    const routes = readText('src/lib/glossaryRoutes.ts');
    const header = readText('src/components/Header.astro');
    const labels = readText('src/i18n/glossaryLabels.ts');
    const readme = readText('README.md');

    assert.match(indexPage, /BaseLayout/);
    assert.match(localizedTermPage, /getStaticPaths/);
    assert.match(localizedTermPage, /findGlossaryTermBySlug/);
    assert.match(routes, /getLocalizedPath/);
    assert.match(routes, /getGlossaryTermPath/);
    assert.match(header, /glossaryUrl/);
    assert.match(header, /getAlternatePath/);
    assert.match(labels, /Glosario de Eurovision/);
    assert.match(labels, /Eurovision glossary/);
    assert.match(readme, /\/glosario\/\{slug\}\//);
    assert.match(readme, /docs\/glossary\.md|glosario usa/);
  });
});
