import fs from 'fs';
import path from 'path';
import { generateLanguageSitemapXml, generateSitemapIndexXml } from '../src/utils/sitemapGenerator';
import { SUPPORTED_LANGUAGES } from '../src/i18n/urlUtils';

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const DIST_DIR = path.resolve(process.cwd(), 'dist');

const today = new Date().toISOString().split('T')[0]; // e.g. "2026-10-01"

function generateAndWriteSitemaps() {
  console.log(`Generating fresh XML sitemaps with date: ${today}...`);

  // 1. Generate Sitemap Index
  const sitemapIndexXml = generateSitemapIndexXml(today);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapIndexXml, 'utf8');
  if (fs.existsSync(DIST_DIR)) {
    fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapIndexXml, 'utf8');
  }
  console.log(' -> Generated public/sitemap.xml');

  // 2. Generate per-language sitemaps
  for (const lang of SUPPORTED_LANGUAGES) {
    const langXml = generateLanguageSitemapXml(lang, today);
    const filename = `sitemap-${lang}.xml`;
    fs.writeFileSync(path.join(PUBLIC_DIR, filename), langXml, 'utf8');
    if (fs.existsSync(DIST_DIR)) {
      fs.writeFileSync(path.join(DIST_DIR, filename), langXml, 'utf8');
    }
    console.log(` -> Generated public/${filename}`);
  }

  console.log('All XML sitemaps generated successfully.');
}

generateAndWriteSitemaps();
