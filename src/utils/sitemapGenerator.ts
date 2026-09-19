import { TOOLS } from '../data/tools';
import { LanguageCode } from '../types';
import { BASE_CANONICAL_URL, formatLocalizedRoute, SUPPORTED_LANGUAGES } from '../i18n/urlUtils';

export interface SitemapUrlEntry {
  path: string;
  changefreq: 'daily' | 'weekly' | 'monthly';
  priority: number;
}

export const SITEMAP_STATIC_ROUTES: SitemapUrlEntry[] = [
  { path: '/', changefreq: 'daily', priority: 1.0 },
  { path: '/all-tools', changefreq: 'weekly', priority: 0.9 },
  { path: '/pdf-tools', changefreq: 'weekly', priority: 0.9 },
  { path: '/image-tools', changefreq: 'weekly', priority: 0.9 },
  { path: '/batch-processor', changefreq: 'weekly', priority: 0.8 },
  { path: '/privacy', changefreq: 'monthly', priority: 0.7 },
  { path: '/terms', changefreq: 'monthly', priority: 0.6 },
  { path: '/about', changefreq: 'monthly', priority: 0.6 },
  { path: '/blog', changefreq: 'weekly', priority: 0.7 },
];

export function getAllSitemapEntries(): SitemapUrlEntry[] {
  const toolEntries: SitemapUrlEntry[] = TOOLS.map((t) => ({
    path: t.route,
    changefreq: 'weekly',
    priority: t.isFlagship ? 0.95 : t.popular ? 0.9 : 0.8,
  }));
  return [...SITEMAP_STATIC_ROUTES, ...toolEntries];
}

export function generateLanguageSitemapXml(targetLang: LanguageCode, dateStr: string = '2026-09-19'): string {
  const entries = getAllSitemapEntries();
  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ];

  for (const entry of entries) {
    const loc = `${BASE_CANONICAL_URL}${formatLocalizedRoute(entry.path, targetLang, targetLang !== 'en')}`;

    lines.push('  <url>');
    lines.push(`    <loc>${loc}</loc>`);
    lines.push(`    <lastmod>${dateStr}</lastmod>`);
    lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    lines.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);

    // Hreflang alternates for all supported languages
    for (const lang of SUPPORTED_LANGUAGES) {
      const altUrl = `${BASE_CANONICAL_URL}${formatLocalizedRoute(entry.path, lang, lang !== 'en')}`;
      lines.push(`    <xhtml:link rel="alternate" hreflang="${lang}" href="${altUrl}" />`);
    }

    // x-default hreflang pointing to English
    const defaultUrl = `${BASE_CANONICAL_URL}${formatLocalizedRoute(entry.path, 'en', false)}`;
    lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultUrl}" />`);

    lines.push('  </url>');
  }

  lines.push('</urlset>');
  return lines.join('\n');
}

export function generateSitemapIndexXml(dateStr: string = '2026-09-19'): string {
  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  for (const lang of SUPPORTED_LANGUAGES) {
    lines.push('  <sitemap>');
    lines.push(`    <loc>${BASE_CANONICAL_URL}/sitemap-${lang}.xml</loc>`);
    lines.push(`    <lastmod>${dateStr}</lastmod>`);
    lines.push('  </sitemap>');
  }

  lines.push('</sitemapindex>');
  return lines.join('\n');
}
