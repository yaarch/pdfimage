import { LanguageCode } from '../types';

export const SUPPORTED_LANGUAGES: LanguageCode[] = ['en', 'ar', 'es', 'fr', 'de'];
export const DEFAULT_LANGUAGE: LanguageCode = 'en';
export const BASE_CANONICAL_URL = 'https://pdfimage.pages.dev';

export interface ParsedRoute {
  language: LanguageCode;
  purePath: string; // The normalized route without language prefix, e.g. '/merge-pdf', '/', '/privacy'
  isLanguagePrefixed: boolean;
}

/**
 * Extracts language code and normalized pure route from any path or hash.
 * e.g. '/ar/merge-pdf' -> { language: 'ar', purePath: '/merge-pdf', isLanguagePrefixed: true }
 * e.g. '/ar' -> { language: 'ar', purePath: '/', isLanguagePrefixed: true }
 * e.g. '/merge-pdf' -> { language: 'en', purePath: '/merge-pdf', isLanguagePrefixed: false }
 * e.g. '/' -> { language: 'en', purePath: '/', isLanguagePrefixed: false }
 */
export function extractLanguageAndPath(pathname: string): ParsedRoute {
  if (!pathname) {
    return { language: DEFAULT_LANGUAGE, purePath: '/', isLanguagePrefixed: false };
  }

  // Strip leading/trailing hashes, query params, index.html
  const clean = pathname.split('?')[0].split('#')[0].replace(/\/index\.html$/i, '') || '/';
  const normalized = clean.startsWith('/') ? clean : `/${clean}`;
  const segments = normalized.split('/').filter(Boolean);

  if (segments.length > 0) {
    const firstSegment = segments[0].toLowerCase();
    if (SUPPORTED_LANGUAGES.includes(firstSegment as LanguageCode)) {
      const remainingSegments = segments.slice(1);
      const purePath = remainingSegments.length > 0 ? `/${remainingSegments.join('/')}` : '/';
      return {
        language: firstSegment as LanguageCode,
        purePath,
        isLanguagePrefixed: true,
      };
    }
  }

  return {
    language: DEFAULT_LANGUAGE,
    purePath: normalized === '' ? '/' : normalized,
    isLanguagePrefixed: false,
  };
}

/**
 * Formats a localized route with the specified language prefix.
 * e.g. formatLocalizedRoute('/merge-pdf', 'ar') -> '/ar/merge-pdf'
 * e.g. formatLocalizedRoute('/', 'ar') -> '/ar'
 * e.g. formatLocalizedRoute('/merge-pdf', 'en') -> '/merge-pdf'
 * e.g. formatLocalizedRoute('/', 'en') -> '/'
 */
export function formatLocalizedRoute(purePath: string, lang: LanguageCode, forcePrefix = false): string {
  const cleanPath = purePath.startsWith('/') ? purePath : `/${purePath}`;
  
  if (lang === 'en' && !forcePrefix) {
    return cleanPath;
  }
  
  if (cleanPath === '/') {
    return `/${lang}`;
  }
  
  return `/${lang}${cleanPath}`;
}

/**
 * Generates canonical alternate URLs for all supported languages.
 */
export function getAlternateLanguageUrls(purePath: string, baseUrl = BASE_CANONICAL_URL): Record<LanguageCode | 'x-default', string> {
  const cleanPath = purePath.startsWith('/') ? purePath : `/${purePath}`;
  const normalizedPath = cleanPath === '/' ? '' : cleanPath;

  return {
    'x-default': `${baseUrl}${normalizedPath}`,
    en: `${baseUrl}${normalizedPath}`,
    ar: `${baseUrl}/ar${normalizedPath}`,
    es: `${baseUrl}/es${normalizedPath}`,
    fr: `${baseUrl}/fr${normalizedPath}`,
    de: `${baseUrl}/de${normalizedPath}`,
  };
}
