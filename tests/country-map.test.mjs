import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const root = process.cwd();

function readText(path) {
  return readFileSync(join(root, path), 'utf8');
}

describe('Eurovision country map', () => {
  it('adds routes, component, helpers, script and documentation', () => {
    [
      'src/pages/mapa-paises/index.astro',
      'src/pages/[locale]/mapa-paises/index.astro',
      'src/components/EurovisionCountryMapApp.astro',
      'src/lib/eurovisionMapData.ts',
      'src/i18n/mapLabels.ts',
      'public/eurovision-map.js',
      'docs/country-map.md',
    ].forEach((path) => {
      assert.equal(existsSync(join(root, path)), true, `${path} should exist`);
    });
  });

  it('derives map data from existing historical country profiles and localized links', () => {
    const helper = readText('src/lib/eurovisionMapData.ts');

    assert.match(helper, /listEurovisionCountryProfiles/);
    assert.match(helper, /getEurovisionCountryProfile/);
    assert.match(helper, /mapMetrics/);
    assert.match(helper, /participations/);
    assert.match(helper, /wins/);
    assert.match(helper, /bestPlace/);
    assert.match(helper, /lastParticipation/);
    assert.match(helper, /debut/);
    assert.match(helper, /getLocalizedPath/);
    assert.match(helper, /countryComparatorHref/);
    assert.match(helper, /\?countries=\$\{countryCode\.toLowerCase\(\)\}/);
    assert.match(helper, /rankings/);
  });

  it('renders an accessible map, metric selector, summary and table fallback', () => {
    const component = readText('src/components/EurovisionCountryMapApp.astro');

    assert.match(component, /data-country-map/);
    assert.match(component, /aria-labelledby="country-map-title"/);
    assert.match(component, /data-map-metric/);
    assert.match(component, /aria-label=\{labels\.mapLabel\}/);
    assert.match(component, /role="list"/);
    assert.match(component, /data-map-point/);
    assert.match(component, /data-map-summary/);
    assert.match(component, /<table>/);
    assert.match(component, /scope="col"/);
    assert.match(component, /scope="row"/);
  });

  it('updates points and country summary without external services or dependencies', () => {
    const script = readText('public/eurovision-map.js');

    assert.match(script, /metricValue/);
    assert.match(script, /renderSummary/);
    assert.match(script, /addEventListener\('change'/);
    assert.match(script, /addEventListener\('click'/);
    assert.doesNotMatch(script, /fetch\(/);
    assert.doesNotMatch(script, /import /);
    assert.doesNotMatch(script, /mapbox|leaflet|openstreetmap/i);
  });

  it('keeps map labels available for all configured locales', () => {
    const labels = readText('src/i18n/mapLabels.ts');

    ['es', 'en', 'fr', 'pt', 'ca', 'eu', 'gl'].forEach((locale) => {
      assert.match(labels, new RegExp(`${locale}: \\{`));
    });
    assert.match(labels, /Mapa de países de Eurovision/);
    assert.match(labels, /Eurovision country map/);
    assert.match(labels, /metrics: \{ participations:/);
  });

  it('links the map from navigation and preserves localized alternate paths', () => {
    const header = readText('src/components/Header.astro');

    assert.match(header, /getMapLabels/);
    assert.match(header, /countryMapUrl/);
    assert.match(header, /\/mapa-paises\//);
    assert.match(header, /currentPath\.includes\('\/mapa-paises'\)/);
    assert.match(header, /mapLabels\.title/);
  });
});
