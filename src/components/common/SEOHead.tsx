import React, { useEffect } from 'react';
import { ToolDefinition, LanguageCode } from '../../types';
import { getLocalizedTool } from '../../i18n/toolTranslations';
import { getStaticSeo } from '../../data/seoMetadata';
import { getAlternateLanguageUrls, BASE_CANONICAL_URL, formatLocalizedRoute } from '../../i18n/urlUtils';

interface SEOHeadProps {
  purePath: string;
  currentLanguage: LanguageCode;
  tool?: ToolDefinition | null;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ purePath, currentLanguage, tool }) => {
  useEffect(() => {
    try {
      const cleanPath = purePath.startsWith('/') ? purePath : `/${purePath}`;
      const canonicalRoute = formatLocalizedRoute(cleanPath, currentLanguage, currentLanguage !== 'en');
      const canonicalUrl = `${BASE_CANONICAL_URL}${canonicalRoute === '/' ? '' : canonicalRoute}`;
      const alternateUrls = getAlternateLanguageUrls(cleanPath, BASE_CANONICAL_URL);

      let title = '';
      let description = '';
      let keywords: string[] = [];
      let faqs: { question: string; answer: string }[] = [];
      let isToolPage = false;
      let toolName = '';
      let toolCategory = '';

      if (tool) {
        isToolPage = true;
        const loc = getLocalizedTool(tool, currentLanguage);
        title = loc.seoTitle;
        description = loc.seoDescription;
        keywords = loc.keywords;
        faqs = loc.faqs;
        toolName = loc.name;
        toolCategory = tool.category === 'pdf' ? 'PDF Toolbox' : 'Image Toolbox';
      } else {
        const staticSeo = getStaticSeo(cleanPath, currentLanguage);
        title = staticSeo.title;
        description = staticSeo.description;
        keywords = staticSeo.keywords || [];
      }

      // 1. Update document title
      document.title = title;

      // Helper function to safely set or update a meta tag
      const setMeta = (attrName: string, attrVal: string, content: string) => {
        let meta = document.querySelector(`meta[${attrName}="${attrVal}"]`) as HTMLMetaElement | null;
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute(attrName, attrVal);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      // 2. Standard Meta Tags
      setMeta('name', 'description', description);
      if (keywords.length > 0) {
        setMeta('name', 'keywords', keywords.join(', '));
      }

      // 3. OpenGraph Social Cards
      setMeta('property', 'og:title', title);
      setMeta('property', 'og:description', description);
      setMeta('property', 'og:url', canonicalUrl);
      setMeta('property', 'og:type', isToolPage ? 'application' : 'website');
      setMeta('property', 'og:site_name', 'PDF Image Studio');
      setMeta('property', 'og:locale', currentLanguage === 'ar' ? 'ar_AR' : currentLanguage === 'es' ? 'es_ES' : currentLanguage === 'fr' ? 'fr_FR' : currentLanguage === 'de' ? 'de_DE' : 'en_US');

      // 4. Twitter Cards
      setMeta('name', 'twitter:card', 'summary_large_image');
      setMeta('name', 'twitter:title', title);
      setMeta('name', 'twitter:description', description);

      // 5. Canonical Link
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonicalUrl);

      // 6. Multilingual Hreflang Alternate Links
      const hreflangMap: Record<string, string> = {
        'x-default': alternateUrls['x-default'],
        en: alternateUrls.en,
        ar: alternateUrls.ar,
        es: alternateUrls.es,
        fr: alternateUrls.fr,
        de: alternateUrls.de,
      };

      // Remove previous hreflangs
      document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());

      // Append updated hreflang links
      Object.entries(hreflangMap).forEach(([langCode, url]) => {
        const link = document.createElement('link');
        link.setAttribute('rel', 'alternate');
        link.setAttribute('hreflang', langCode);
        link.setAttribute('href', url);
        document.head.appendChild(link);
      });

      // 7. Schema.org Structured Data (JSON-LD)
      const schemaDataList: any[] = [];

      // Base WebSite / Organization Schema
      schemaDataList.push({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: isToolPage ? `${toolName} — PDF Image Studio` : 'PDF Image Studio',
        url: canonicalUrl,
        applicationCategory: isToolPage ? 'UtilitiesApplication' : 'MultimediaApplication',
        operatingSystem: 'All (Windows, macOS, Linux, iOS, Android)',
        browserRequirements: 'Requires JavaScript. Requires HTML5 Canvas & WebAssembly.',
        description: description,
        inLanguage: currentLanguage,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '1280',
          bestRating: '5',
          worstRating: '1',
        },
      });

      // BreadcrumbList Schema
      if (isToolPage) {
        schemaDataList.push({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: currentLanguage === 'ar' ? 'الرئيسية' : currentLanguage === 'es' ? 'Inicio' : currentLanguage === 'fr' ? 'Accueil' : 'Home',
              item: alternateUrls[currentLanguage],
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: toolCategory,
              item: `${BASE_CANONICAL_URL}/${currentLanguage === 'en' ? '' : `${currentLanguage}/`}${tool?.category === 'pdf' ? 'pdf-tools' : 'image-tools'}`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: toolName,
              item: canonicalUrl,
            },
          ],
        });
      }

      // FAQPage Schema
      if (faqs.length > 0) {
        schemaDataList.push({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer,
            },
          })),
        });
      }

      // Inject JSON-LD
      let scriptTag = document.getElementById('app-structured-data') as HTMLScriptElement | null;
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'app-structured-data';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schemaDataList.length === 1 ? schemaDataList[0] : schemaDataList);
    } catch (err) {
      console.error('Failed to update SEO head tags:', err);
    }
  }, [purePath, currentLanguage, tool]);

  return null;
};
