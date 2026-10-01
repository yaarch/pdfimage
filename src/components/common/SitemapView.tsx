import React, { useState } from 'react';
import { Globe, FileCode, Download, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../../i18n/context';
import { LanguageCode } from '../../types';
import { TOOLS } from '../../data/tools';
import { getLocalizedTool } from '../../i18n/toolTranslations';
import { formatLocalizedRoute, SUPPORTED_LANGUAGES, BASE_CANONICAL_URL } from '../../i18n/urlUtils';
import { generateLanguageSitemapXml, generateSitemapIndexXml, SITEMAP_STATIC_ROUTES } from '../../utils/sitemapGenerator';

export type SitemapTab = 'index' | LanguageCode;

interface SitemapViewProps {
  onNavigate: (route: string) => void;
  initialTab?: SitemapTab;
}

export const SitemapView: React.FC<SitemapViewProps> = ({ onNavigate, initialTab }) => {
  const { language: currentAppLanguage } = useTranslation();

  const resolveInitialTab = (): SitemapTab => {
    if (initialTab) return initialTab;
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('sitemap-ar')) return 'ar';
      if (path.includes('sitemap-es')) return 'es';
      if (path.includes('sitemap-fr')) return 'fr';
      if (path.includes('sitemap-de')) return 'de';
      if (path.includes('sitemap-en')) return 'en';
      if (path === '/sitemap' || path === '/sitemap.xml') return 'index';
    }
    return 'index';
  };

  const [activeTab, setActiveTab] = useState<SitemapTab>(resolveInitialTab);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'visual' | 'xml'>('visual');

  const displayLang: LanguageCode = activeTab === 'index' ? (currentAppLanguage || 'en') : activeTab;
  const isRtl = displayLang === 'ar';

  const tabs: { id: SitemapTab; label: string; file: string }[] = [
    { id: 'index', label: 'Sitemap Index (All)', file: 'sitemap.xml' },
    { id: 'en', label: 'English (EN)', file: 'sitemap-en.xml' },
    { id: 'ar', label: 'العربية (AR)', file: 'sitemap-ar.xml' },
    { id: 'es', label: 'Español (ES)', file: 'sitemap-es.xml' },
    { id: 'fr', label: 'Français (FR)', file: 'sitemap-fr.xml' },
    { id: 'de', label: 'Deutsch (DE)', file: 'sitemap-de.xml' },
  ];

  const currentXml = activeTab === 'index'
    ? generateSitemapIndexXml()
    : generateLanguageSitemapXml(activeTab);

  const activeFilename = activeTab === 'index' ? 'sitemap.xml' : `sitemap-${activeTab}.xml`;
  const rawFileUrl = `/${activeFilename}`;

  const urlsInSingleFile = SITEMAP_STATIC_ROUTES.length + TOOLS.length; // 36
  const totalUrlsAcrossAllLocales = urlsInSingleFile * SUPPORTED_LANGUAGES.length; // 180
  const displayedUrlCount = activeTab === 'index' ? totalUrlsAcrossAllLocales : urlsInSingleFile;

  const handleCopyXml = () => {
    navigator.clipboard.writeText(currentXml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadXml = () => {
    const blob = new Blob([currentXml], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Localized Labels for UI
  const urlCountCardTitle: Record<LanguageCode, string> = {
    en: activeTab === 'index' ? 'Total Indexed URLs' : 'URLs in this File',
    ar: activeTab === 'index' ? 'إجمالي الروابط المفهرسة' : 'روابط هذا الملف الفردي',
    es: activeTab === 'index' ? 'Total de URLs Indizadas' : 'URLs en este Archivo',
    fr: activeTab === 'index' ? 'Total des URLs Indexées' : 'URLs dans ce Fichier',
    de: activeTab === 'index' ? 'Gesamte Indizierte URLs' : 'URLs in dieser Datei',
  };

  const urlCountCardSubtext: Record<LanguageCode, string> = {
    en: activeTab === 'index' ? 'Across 5 Locales (36 x 5)' : `36 URLs in ${activeFilename}`,
    ar: activeTab === 'index' ? 'عبر 5 لغات (36 × 5)' : `36 رابطاً في ${activeFilename}`,
    es: activeTab === 'index' ? 'En 5 Idiomas (36 x 5)' : `36 URLs en ${activeFilename}`,
    fr: activeTab === 'index' ? 'Dans 5 Langues (36 x 5)' : `36 URLs dans ${activeFilename}`,
    de: activeTab === 'index' ? 'In 5 Sprachen (36 x 5)' : `36 URLs in ${activeFilename}`,
  };

  const corePagesHeading: Record<LanguageCode, string> = {
    en: `Core Platform Pages (${SITEMAP_STATIC_ROUTES.length} Pages - EN)`,
    ar: `صفحات المنصة الرئيسية (${SITEMAP_STATIC_ROUTES.length} صفحات - AR)`,
    es: `Páginas Principales de la Plataforma (${SITEMAP_STATIC_ROUTES.length} Páginas - ES)`,
    fr: `Pages Principales de la Plateforme (${SITEMAP_STATIC_ROUTES.length} Pages - FR)`,
    de: `Kern-Plattform-Seiten (${SITEMAP_STATIC_ROUTES.length} Seiten - DE)`,
  };

  const toolsHeading: Record<LanguageCode, string> = {
    en: `All Indexed Interactive Tools (${TOOLS.length} Tools - EN)`,
    ar: `جميع الأدوات التفاعلية المفهرسة (${TOOLS.length} أداة - AR)`,
    es: `Todas las Herramientas Interactivas Indizadas (${TOOLS.length} Herramientas - ES)`,
    fr: `Toutes les Outils Interactifs Indexés (${TOOLS.length} Outils - FR)`,
    de: `Alle Indizierten Interaktiven Tools (${TOOLS.length} Tools - DE)`,
  };

  const openRawXmlText: Record<LanguageCode, string> = {
    en: `Open Raw ${activeFilename}`,
    ar: `فتح ملف ${activeFilename} المباشر`,
    es: `Abrir ${activeFilename} Directo`,
    fr: `Ouvrir ${activeFilename} Brut`,
    de: `Unbearbeitetes ${activeFilename} Öffnen`,
  };

  const copyXmlText: Record<LanguageCode, string> = {
    en: 'Copy XML',
    ar: 'نسخ XML',
    es: 'Copiar XML',
    fr: 'Copier le XML',
    de: 'XML Kopieren',
  };

  const copiedText: Record<LanguageCode, string> = {
    en: 'Copied!',
    ar: 'تم النسخ!',
    es: '¡Copiado!',
    fr: 'Copié !',
    de: 'Kopiert!',
  };

  const downloadXmlText: Record<LanguageCode, string> = {
    en: 'Download .xml',
    ar: 'تحميل .xml',
    es: 'Descargar .xml',
    fr: 'Télécharger .xml',
    de: '.xml Herunterladen',
  };

  const pageTitleText: Record<LanguageCode, string> = {
    en: activeTab === 'index' ? 'Multilingual XML Sitemaps Directory' : `XML Sitemap — English (${activeFilename})`,
    ar: activeTab === 'index' ? 'فهرس خرائط الموقع متعدد اللغات' : `خريطة الموقع XML — اللغة العربية (${activeFilename})`,
    es: activeTab === 'index' ? 'Directorio de Sitemaps XML Multilingüe' : `Sitemap XML — Español (${activeFilename})`,
    fr: activeTab === 'index' ? 'Répertoire des Sitemaps XML Multilingues' : `Sitemap XML — Français (${activeFilename})`,
    de: activeTab === 'index' ? 'Verzeichnis Multilingualer XML-Sitemaps' : `XML-Sitemap — Deutsch (${activeFilename})`,
  };

  const pageSubtitleText: Record<LanguageCode, string> = {
    en: activeTab === 'index'
      ? 'Dedicated XML sitemaps per language with cross-referencing xhtml:link hreflang annotations.'
      : `Language-specific XML sitemap for English with 36 localized URLs and cross-referencing hreflang tags.`,
    ar: activeTab === 'index'
      ? 'خرائط XML مخصصة ومستقلة لكل لغة (العربية، الإنجليزية، الإسبانية، الفرنسية، الألمانية) مع وسوم hreflang المتبادلة.'
      : `خريطة موقع XML مخصصة للغة العربية تحتوي على 36 رابطاً مفهرساً مع وسوم hreflang المتبادلة.`,
    es: activeTab === 'index'
      ? 'Sitemaps XML dedicados por idioma con anotaciones hreflang cruzadas.'
      : `Sitemap XML específico para Español con 36 URLs localizadas y etiquetas hreflang cruzadas.`,
    fr: activeTab === 'index'
      ? 'Sitemaps XML dédiés par langue avec annotations hreflang croisées.'
      : `Sitemap XML spécifique pour le Français contenant 36 URLs localisées et balises hreflang croisées.`,
    de: activeTab === 'index'
      ? 'Spezifische XML-Sitemaps pro Sprache mit gekreuzten hreflang-Annotationen.'
      : `Sprachenspezifische XML-Sitemap für Deutsch mit 36 lokalisierte URLs und gekreuzten hreflang-Tags.`,
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
              <Globe className="w-5 h-5" />
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
              Google & Bing Sitemaps Protocol 0.9
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {pageTitleText[displayLang]}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            {pageSubtitleText[displayLang]}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyXml}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? copiedText[displayLang] : copyXmlText[displayLang]}</span>
          </button>
          <button
            onClick={handleDownloadXml}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-4 h-4 text-indigo-500" />
            <span>{downloadXmlText[displayLang]}</span>
          </button>
          <a
            href={rawFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
          >
            <span>{openRawXmlText[displayLang]}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Dynamic SEO Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">{urlCountCardTitle[displayLang]}</div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">{displayedUrlCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">{urlCountCardSubtext[displayLang]}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tools per Locale</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{TOOLS.length} Tools</div>
          <div className="text-[11px] text-slate-400 mt-1">100% Client-side</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Current View</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono text-lg">{activeFilename}</div>
          <div className="text-[11px] text-slate-400 mt-1">{activeTab === 'index' ? 'Sitemap Index' : `Language: ${activeTab.toUpperCase()}`}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Hreflang Alternates</div>
          <div className="text-2xl font-black text-violet-600 dark:text-violet-400 mt-0.5">6x Links / URL</div>
          <div className="text-[11px] text-slate-400 mt-1">Includes x-default</div>
        </div>
      </div>

      {/* Language Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap gap-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeTab === tab.id ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                  {tab.file}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('visual')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                viewMode === 'visual'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {displayLang === 'ar' ? 'العرض المرئي' : 'Visual Table'}
            </button>
            <button
              onClick={() => setViewMode('xml')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                viewMode === 'xml'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>XML Code</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {viewMode === 'xml' ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span>File: {activeFilename}</span>
              <span>Encoding: UTF-8</span>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto max-h-[500px] leading-relaxed select-all">
              <code>{currentXml}</code>
            </pre>
          </div>
        ) : activeTab === 'index' ? (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              {displayLang === 'ar' ? 'ملفات خرائط المواقع الفرعية المفهرسة (5 لغات)' : 'Indexed Language Sitemaps in Root Index'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SUPPORTED_LANGUAGES.map((langCode) => {
                const isCurrent = langCode === displayLang;
                const langLabels: Record<LanguageCode, string> = {
                  en: 'English (US/UK/Global)',
                  ar: 'العربية (MENA/Arabic)',
                  es: 'Español (Spain/LATAM)',
                  fr: 'Français (France/Canada)',
                  de: 'Deutsch (Germany/Austria/CH)',
                };
                return (
                  <div
                    key={langCode}
                    className={`p-4 rounded-xl border transition flex flex-col justify-between gap-3 ${
                      isCurrent
                        ? 'border-indigo-300 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase text-indigo-600 dark:text-indigo-400">
                          {langCode}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">sitemap-{langCode}.xml</span>
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                        {langLabels[langCode]}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {SITEMAP_STATIC_ROUTES.length + TOOLS.length} URLs with 6 hreflang tags each
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                      <button
                        onClick={() => setActiveTab(langCode)}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                      >
                        {displayLang === 'ar' ? 'عرض الروابط' : 'Inspect URLs'}
                      </button>
                      <a
                        href={`/sitemap-${langCode}.xml`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 flex items-center gap-1"
                      >
                        <span>XML</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
                {corePagesHeading[displayLang]}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {SITEMAP_STATIC_ROUTES.map((route) => {
                  const localizedPath = formatLocalizedRoute(route.path, activeTab, activeTab !== 'en');
                  return (
                    <div
                      key={route.path}
                      onClick={() => onNavigate(localizedPath)}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 cursor-pointer transition flex items-center justify-between"
                    >
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {route.path === '/' ? (displayLang === 'ar' ? 'الصفحة الرئيسية' : 'Home Page') : route.path.replace('/', '')}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono truncate">{localizedPath}</div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold">
                        P: {route.priority}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
                {toolsHeading[displayLang]}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {TOOLS.map((tool) => {
                  const loc = getLocalizedTool(tool, displayLang);
                  const localizedPath = formatLocalizedRoute(tool.route, activeTab, activeTab !== 'en');
                  return (
                    <div
                      key={tool.id}
                      onClick={() => onNavigate(localizedPath)}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-indigo-300 dark:hover:border-indigo-800 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 cursor-pointer transition group"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                          {loc.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono">
                          {tool.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-1">
                        {loc.tagline}
                      </p>
                      <div className="text-[10px] text-indigo-500 font-mono truncate mt-1.5">
                        {localizedPath}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SEO Explanations & FAQ */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
            {displayLang === 'ar'
              ? 'هيكلية وتفاصيل خرائط الموقع متعددة اللغات (Multilingual XML Sitemaps)'
              : 'Multilingual XML Sitemap Architecture & Specification'}
          </h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {displayLang === 'ar'
            ? 'يعتمد الموقع على ملف فهرس خرائط المواقع (Sitemap Index) يرتبط بخرائط مستقلة لكل لغة (العربية، الإنجليزية، الإسبانية، الفرنسية، الألمانية). ويتضمن كل رابط مفهرس إشارات xhtml:link hreflang متبادلة مع خيار x-default، وذلك بالتوافق الكامل مع معايير بروتوكول خرائط المواقع Sitemap Protocol 0.9 المعتمد لدى Google وBing.'
            : 'This platform uses a sitemap index file pointing to separate language sitemaps (English, Arabic, Spanish, French, German). Each indexed URL includes cross-referencing xhtml:link hreflang annotations and an x-default fallback, fully following the standard Google and Bing compatible Sitemap Protocol 0.9 specification.'}
        </p>
      </div>
    </div>
  );
};
