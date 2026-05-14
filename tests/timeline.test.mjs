import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const root = process.cwd();

function readText(path) {
  return readFileSync(join(root, path), 'utf8');
}

describe('Eurovision timeline', () => {
  it('adds localized timeline routes, helpers and configuration', () => {
    [
      'src/pages/linea-tiempo/index.astro',
      'src/pages/[locale]/linea-tiempo/index.astro',
      'src/components/EurovisionTimelineApp.astro',
      'src/components/TimelineEntryCard.astro',
      'src/components/TimelineFilterPanel.astro',
      'src/lib/eurovisionTimeline.ts',
      'src/data/eurovisionTimelineMilestones.ts',
      'src/i18n/timelineLabels.ts',
      'public/timeline-filters.js',
      'docs/eurovision-timeline.md',
    ].forEach((path) => {
      assert.equal(existsSync(join(root, path)), true, `${path} should exist`);
    });
  });

  it('keeps timeline data modular, translated and tied to the senior dataset helpers', () => {
    const helpers = readText('src/lib/eurovisionTimeline.ts');
    const milestones = readText('src/data/eurovisionTimelineMilestones.ts');
    const labels = readText('src/i18n/timelineLabels.ts');

    assert.match(helpers, /getEurovisionEditions/);
    assert.match(helpers, /getLocalizedPath/);
    assert.match(helpers, /getEurovisionTimeline/);
    assert.match(helpers, /filters/);
    assert.match(milestones, /eurovisionTimelineMilestones/);
    assert.match(milestones, /TimelineMilestoneType/);
    ['es', 'en', 'fr', 'pt', 'ca', 'eu', 'gl'].forEach((locale) => {
      assert.match(labels, new RegExp(`${locale}: \\{`));
      assert.match(milestones, new RegExp(`${locale}: \\{`));
    });
    assert.match(labels, /Línea temporal de Eurovision/);
    assert.match(labels, /Eurovision timeline/);
    assert.match(labels, /Liña temporal de Eurovisión/);
  });

  it('renders accessible filters and uses a small client script', () => {
    const component = readText('src/components/EurovisionTimelineApp.astro');
    const filterPanel = readText('src/components/TimelineFilterPanel.astro');
    const entryCard = readText('src/components/TimelineEntryCard.astro');
    const script = readText('public/timeline-filters.js');

    assert.match(component, /data-timeline/);
    assert.match(component, /aria-labelledby="timeline-title"/);
    assert.match(component, /TimelineFilterPanel/);
    assert.match(component, /TimelineEntryCard/);
    assert.match(filterPanel, /data-timeline-filter="decade"/);
    assert.match(filterPanel, /data-timeline-filter="host"/);
    assert.match(filterPanel, /data-timeline-filter="winner"/);
    assert.match(filterPanel, /data-timeline-filter="type"/);
    assert.match(filterPanel, /aria-live="polite"/);
    assert.match(entryCard, /data-timeline-entry/);
    assert.match(entryCard, /timeline-milestones/);
    assert.match(component, /timeline-glossary/);
    assert.match(component, /timeline-filters\.js/);
    assert.match(script, /updateTimeline/);
    assert.match(script, /data-timeline-entry/);
    assert.match(script, /data-timeline-status/);
    assert.doesNotMatch(script, /fetch\(/);
  });

  it('links the timeline from navigation and keeps localized pages static', () => {
    const header = readText('src/components/Header.astro');
    const page = readText('src/pages/linea-tiempo/index.astro');
    const localizedPage = readText('src/pages/[locale]/linea-tiempo/index.astro');

    assert.match(header, /timelineUrl/);
    assert.match(header, /linea-tiempo/);
    assert.match(header, /timelineLabels/);
    assert.match(page, /getEurovisionTimeline/);
    assert.match(localizedPage, /getStaticPaths/);
    assert.match(localizedPage, /locales/);
  });
});
