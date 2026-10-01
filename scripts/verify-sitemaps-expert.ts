import fs from 'fs';
import path from 'path';
import { SITEMAP_STATIC_ROUTES } from '../src/utils/sitemapGenerator';
import { TOOLS } from '../src/data/tools';
import { SUPPORTED_LANGUAGES } from '../src/i18n/urlUtils';

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const DIST_DIR = path.resolve(process.cwd(), 'dist');

const filesToVerify = [
  'sitemap.xml',
  'sitemap-en.xml',
  'sitemap-ar.xml',
  'sitemap-es.xml',
  'sitemap-fr.xml',
  'sitemap-de.xml',
];

console.log('==================================================');
console.log('WORLD-CLASS SITEMAP AUDIT & VERIFICATION REPORT');
console.log('==================================================\n');

let totalIssuesFound = 0;

for (const file of filesToVerify) {
  const publicPath = path.join(PUBLIC_DIR, file);
  const distPath = path.join(DIST_DIR, file);

  console.log(`[FILE]: ${file}`);

  if (!fs.existsSync(publicPath)) {
    console.error(`  ❌ FAIL: File missing in public/!`);
    totalIssuesFound++;
    continue;
  }
  if (!fs.existsSync(distPath)) {
    console.error(`  ❌ FAIL: File missing in dist/!`);
    totalIssuesFound++;
    continue;
  }

  const content = fs.readFileSync(publicPath, 'utf8');

  // Check 1: XML Declaration
  if (!content.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
    console.error(`  ❌ FAIL: Missing or invalid XML declaration at start.`);
    totalIssuesFound++;
  } else {
    console.log(`  ✓ XML Declaration: Valid UTF-8 header.`);
  }

  // Check 2: Namespace & Root Tag
  if (file === 'sitemap.xml') {
    if (!content.includes('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">') || !content.includes('</sitemapindex>')) {
      console.error(`  ❌ FAIL: Invalid <sitemapindex> root or namespace.`);
      totalIssuesFound++;
    } else {
      console.log(`  ✓ Schema: Valid <sitemapindex> Protocol 0.9.`);
    }

    // Count child sitemaps
    const childSitemaps = (content.match(/<sitemap>/g) || []).length;
    console.log(`  ✓ Child Sitemaps: ${childSitemaps} / 5 indexed.`);
    if (childSitemaps !== 5) {
      console.error(`  ❌ FAIL: Expected 5 child sitemaps, got ${childSitemaps}.`);
      totalIssuesFound++;
    }
  } else {
    if (
      !content.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"') ||
      !content.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"') ||
      !content.includes('</urlset>')
    ) {
      console.error(`  ❌ FAIL: Invalid <urlset> root or missing XHTML namespace.`);
      totalIssuesFound++;
    } else {
      console.log(`  ✓ Schema: Valid <urlset> with xhtml:link namespace.`);
    }

    // Count URLs
    const urlCount = (content.match(/<url>/g) || []).length;
    const expectedCount = SITEMAP_STATIC_ROUTES.length + TOOLS.length; // 9 + 27 = 36
    console.log(`  ✓ Indexed URLs: ${urlCount} / ${expectedCount} expected.`);
    if (urlCount !== expectedCount) {
      console.error(`  ❌ FAIL: Expected ${expectedCount} URLs, got ${urlCount}.`);
      totalIssuesFound++;
    }

    // Check hreflang tags per URL
    const hreflangTags = (content.match(/<xhtml:link rel="alternate"/g) || []).length;
    const expectedHreflangCount = expectedCount * (SUPPORTED_LANGUAGES.length + 1); // 36 * 6 = 216
    console.log(`  ✓ Hreflang Tags: ${hreflangTags} / ${expectedHreflangCount} expected (5 languages + x-default).`);
    if (hreflangTags !== expectedHreflangCount) {
      console.error(`  ❌ FAIL: Expected ${expectedHreflangCount} hreflang tags, got ${hreflangTags}.`);
      totalIssuesFound++;
    }
  }

  console.log('');
}

console.log('==================================================');
console.log(`FINAL AUDIT SUMMARY: ${totalIssuesFound === 0 ? 'PASSED 100% PERFECT' : `FAILED (${totalIssuesFound} issues)`}`);
console.log('==================================================');
