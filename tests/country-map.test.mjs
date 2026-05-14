import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const root = process.cwd();

function readText(path) {
  return readFileSync(join(root, path), 'utf8');
}

describe('Eurovision country map', () => {
  it('adds routes, component, helper, script and documentation', () => {
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
    assert.equal(existsSync(join(root, 'public/vector-map-engine.js')), false);
  });

  it('derives marker map data from existing historical country profiles and localized links', () => {
    const helper = readText('src/lib/eurovisionMapData.ts');

    assert.match(helper, /listEurovisionCountryProfiles/);
    assert.match(helper, /getEurovisionCountryProfile/);
    assert.match(helper, /countryCoordinates/);
    assert.match(helper, /'GB-WLS'/);
    assert.match(helper, /KZ:/);
    assert.match(helper, /CS:/);
    assert.match(helper, /latitude/);
    assert.match(helper, /longitude/);
    assert.match(helper, /filter\(\(country\) => country\.latitude !== 0 \|\| country\.longitude !== 0\)/);
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
    assert.doesNotMatch(helper, /countryPath/);
    assert.doesNotMatch(helper, /countryPositions/);
  });

  it('renders an accessible Leaflet map, metric selector, controls, summary and table fallback', () => {
    const component = readText('src/components/EurovisionCountryMapApp.astro');

    assert.match(component, /leaflet@1\.9\.4/);
    assert.match(component, /unpkg\.com\/leaflet/);
    assert.match(component, /sha256-p4NxAoJBhIIN\+hmNHrzRCf9tD\/miZyoHS5obTRR9BMY=/);
    assert.match(component, /sha256-20nQCchB9co0qIjJZRGuk2\/Z9VM\+kNiyxNV1lvTlZBo=/);
    assert.match(component, /data-country-map/);
    assert.match(component, /aria-labelledby="country-map-title"/);
    assert.match(component, /data-map-metric/);
    assert.match(component, /data-map-leaflet/);
    assert.match(component, /data-map-status/);
    assert.match(component, /data-map-zoom-in/);
    assert.match(component, /data-map-zoom-out/);
    assert.match(component, /data-map-reset/);
    assert.match(component, /data-map-summary/);
    assert.match(component, /country-map__marker/);
    assert.match(component, /<table>/);
    assert.match(component, /scope="col"/);
    assert.match(component, /scope="row"/);
  });

  it('uses Leaflet with a full world map and stable interactive country markers', () => {
    const script = readText('public/eurovision-map.js');
    const pkg = readText('package.json');

    assert.match(script, /CARTO_TILES/);
    assert.match(script, /light_all/);
    assert.match(script, /dark_all/);
    assert.match(script, /basemaps\.cartocdn\.com/);
    assert.match(script, /INITIAL_VIEW/);
    assert.match(script, /INITIAL_ZOOM/);
    assert.match(script, /getCurrentTheme/);
    assert.match(script, /watchThemeChanges/);
    assert.match(script, /tileLayer\.setUrl/);
    assert.match(script, /waitForLeaflet/);
    assert.match(script, /L\.map/);
    assert.match(script, /L\.tileLayer/);
    assert.match(script, /L\.circleMarker/);
    assert.match(script, /markerRadius/);
    assert.match(script, /5 \+ weight \* 9/);
    assert.match(script, /setMarkerA11y/);
    assert.match(script, /markersByCountry/);
    assert.match(script, /renderSummary/);
    assert.doesNotMatch(script, /GEOJSON_URL/);
    assert.doesNotMatch(script, /L\.geoJSON/);
    assert.doesNotMatch(script, /featureMatchesCountry/);
    assert.doesNotMatch(pkg, /"leaflet"/);
  });

  it('keeps map labels available for all configured locales', () => {
    const labels = readText('src/i18n/mapLabels.ts');

    ['es', 'en', 'fr', 'pt', 'ca', 'eu', 'gl'].forEach((locale) => {
      assert.match(labels, new RegExp(`${locale}: \\{`));
    });
    assert.match(labels, /Mapa de países de Eurovision/);
    assert.match(labels, /Eurovision country map/);
    assert.match(labels, /zoomIn/);
    assert.match(labels, /resetMap/);
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
