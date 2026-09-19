import React, { useState } from 'react';
import { Globe, FileCode, Download, Copy, Check, ExternalLink, ShieldCheck, Layers, Sparkles } from 'lucide-react';
import { useTranslation } from '../../i18n/context';
import { LanguageCode } from '../../types';
import { TOOLS } from '../../data/tools';
import { getLocalizedTool } from '../../i18n/toolTranslations';
import { formatLocalizedRoute, SUPPORTED_LANGUAGES, BASE_CANONICAL_URL } from '../../i18n/urlUtils';
import { generateLanguageSitemapXml, generateSitemapIndexXml, SITEMAP_STATIC_ROUTES } from '../../utils/sitemapGenerator';

interface SitemapViewProps {
  onNavigate: (route: string) => void;
}

type SitemapTab = 'index' | LanguageCode;

export const SitemapView: React.FC<SitemapViewProps> = ({ onNavigate }) => {
  const { language, t } = useTranslation();
  const [activeTab, setActiveTab] = useState<SitemapTab>(language || 'index');
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'visual' | 'xml'>('visual');

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

  const totalIndexedUrls = (SITEMAP_STATIC_ROUTES.length + TOOLS.length) * SUPPORTED_LANGUAGES.length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
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
            {language === 'ar' ? 'فهرس خرائط الموقع متعدد اللغات (Multilingual Sitemaps)' : 'Multilingual XML Sitemaps Directory'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            {language === 'ar'
              ? 'خرائط XML مخصصة ومستقلة لكل لغة (العربية، الإنجليزية، الإسبانية، الفرنسية، الألمانية) مع وسوم hreflang المتبادلة لفهرسة سريعة في Google Search Console.'
              : 'Dedicated XML sitemaps per language with cross-referencing xhtml:link hreflang annotations for maximum multi-regional search engine indexing.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyXml}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? (language === 'ar' ? 'تم النسخ' : 'Copied') : (language === 'ar' ? 'نسخ XML' : 'Copy XML')}</span>
          </button>
          <button
            onClick={handleDownloadXml}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-4 h-4 text-indigo-500" />
            <span>{language === 'ar' ? 'تحميل .xml' : 'Download .xml'}</span>
          </button>
          <a
            href={rawFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
          >
            <span>{language === 'ar' ? 'فتح الـ XML المباشر' : 'Open Raw XML'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* SEO Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Indexed URLs</div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">{totalIndexedUrls}</div>
          <div className="text-[11px] text-slate-400 mt-1">Across 5 Locales</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tools per Locale</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{TOOLS.length} Tools</div>
          <div className="text-[11px] text-slate-400 mt-1">100% Client-side</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Sitemap Files</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">5 + 1 Index</div>
          <div className="text-[11px] text-slate-400 mt-1">Sitemap Index standard</div>
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
              {language === 'ar' ? 'العرض المرئي' : 'Visual Table'}
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
              {language === 'ar' ? 'ملفات خرائط المواقع الفرعية المفهرسة' : 'Indexed Language Sitemaps in Root Index'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SUPPORTED_LANGUAGES.map((langCode) => {
                const isCurrent = langCode === language;
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
                        {SITEMAP_STATIC_ROUTES.length + TOOLS.length} URLs with 5 hreflang tags each
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                      <button
                        onClick={() => setActiveTab(langCode)}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                      >
                        {language === 'ar' ? 'عرض الروابط' : 'Inspect URLs'}
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
                {language === 'ar' ? `روابط الصفحات الرئيسية للغة (${activeTab.toUpperCase()})` : `Core Platform Pages (${activeTab.toUpperCase()})`}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {SITEMAP_STATIC_ROUTES.map((route) => {
                  const localizedPath = formatLocalizedRoute(route.path, activeTab, activeTab !== 'en');
                  const fullUrl = `${BASE_CANONICAL_URL}${localizedPath}`;
                  return (
                    <div
                      key={route.path}
                      onClick={() => onNavigate(localizedPath)}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 cursor-pointer transition flex items-center justify-between"
                    >
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {route.path === '/' ? 'Home Page' : route.path.replace('/', '')}
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
                {language === 'ar' ? `روابط جميع الأدوات المفهرسة (${TOOLS.length} أداة)` : `All Indexed Interactive Tools (${TOOLS.length} Tools)`}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {TOOLS.map((tool) => {
                  const loc = getLocalizedTool(tool, activeTab);
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
            {language === 'ar' ? 'لماذا يعد فصل خرائط الموقع لكل لغة المعيار الأفضل للـ SEO؟' : 'Why Per-Language Sitemaps with Sitemap Index is the Gold Standard for Multilingual SEO'}
          </h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {language === 'ar'
            ? 'توصي إرشادات Google Search Central الدولية باستخدام ملف فهرس خرائط المواقع (Sitemap Index) يحتوي على خرائط مستقلة لكل لغة. هذا يمنح محركات البحث قدرة أسرع على اكتشاف المحتوى المترجم، وتتبع أداء وفهرسة الصفحات العربية والإنجليزية بشكل مستقل، مع تجنب تضخم حجم ملف الـ XML الواحد وضمان توافق تام مع معايير xhtml:link hreflang و x-default.'
            : 'Google Search Central officially recommends structured Sitemap Indexes pointing to language-specific sitemaps. This architecture speeds up bot crawl discovery, allows per-region error diagnosis in Google Search Console, avoids bloated monolithic XML files, and ensures 100% compliance with xhtml:link hreflang and x-default multi-region specifications.'}
        </p>
      </div>
    </div>
  );
};
