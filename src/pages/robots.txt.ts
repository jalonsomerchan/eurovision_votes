import { siteConfig } from '../config/site';

export function GET() {
  const basePath = import.meta.env.BASE_URL ?? siteConfig.base;
  const sitemapPath = `${basePath.replace(/\/$/, '')}/sitemap-index.xml`;
  const sitemapUrl = new URL(sitemapPath, siteConfig.url).toString();

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
