export const ESCPLUS_FEED_URL = 'https://www.escplus.es/feed/';

const ENTITY_MAP = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  nbsp: ' ',
  quot: '"',
};

function decodeEntity(entity) {
  if (entity.startsWith('#x')) {
    const codePoint = Number.parseInt(entity.slice(2), 16);
    return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : `&${entity};`;
  }
  if (entity.startsWith('#')) {
    const codePoint = Number.parseInt(entity.slice(1), 10);
    return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : `&${entity};`;
  }
  return ENTITY_MAP[entity] ?? `&${entity};`;
}

function decodeXml(value = '') {
  return value
    .replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/u, '$1')
    .replace(/&([a-zA-Z]+|#[0-9]+|#x[0-9a-fA-F]+);/gu, (_match, entity) => decodeEntity(entity))
    .trim();
}

function stripHtml(value = '') {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/giu, ' ')
    .replace(/<[^>]+>/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim();
}

function sanitizeText(value = '') {
  return stripHtml(decodeXml(value));
}

function summarize(value = '', maxLength = 360) {
  const clean = sanitizeText(value);
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength).replace(/\s+\S*$/u, '').trim()}…`;
}

function tagValue(xml, tagName) {
  const match = xml.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'iu'));
  return match ? decodeXml(match[1]) : '';
}

function allTagValues(xml, tagName) {
  return [...xml.matchAll(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'giu'))]
    .map((match) => sanitizeText(match[1]))
    .filter(Boolean);
}

function safeUrl(value = '') {
  try {
    const url = new URL(decodeXml(value));
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : '';
  } catch {
    return '';
  }
}

function parseDate(value = '') {
  const timestamp = Date.parse(decodeXml(value));
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null;
}

export function parseEscplusRss(xml) {
  if (typeof xml !== 'string' || !xml.trim()) return [];

  return [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/giu)]
    .map((match) => {
      const item = match[1];
      const link = safeUrl(tagValue(item, 'link'));
      const title = sanitizeText(tagValue(item, 'title'));

      if (!title || !link) return null;

      return {
        title,
        link,
        description: summarize(tagValue(item, 'description')),
        pubDate: sanitizeText(tagValue(item, 'pubDate')),
        publishedAt: parseDate(tagValue(item, 'pubDate')),
        creator: sanitizeText(tagValue(item, 'dc:creator')),
        categories: allTagValues(item, 'category'),
        guid: sanitizeText(tagValue(item, 'guid')),
      };
    })
    .filter(Boolean);
}

export async function getEscplusNewsFeed({ feedUrl = ESCPLUS_FEED_URL, limit = 12, timeoutMs = 6000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(feedUrl, {
      headers: { accept: 'application/rss+xml, application/xml, text/xml' },
      signal: controller.signal,
    });

    if (!response.ok) throw new Error(`RSS request failed with ${response.status}`);

    const xml = await response.text();
    return {
      error: null,
      items: parseEscplusRss(xml).slice(0, limit),
      sourceUrl: feedUrl,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown RSS error',
      items: [],
      sourceUrl: feedUrl,
    };
  } finally {
    clearTimeout(timer);
  }
}
