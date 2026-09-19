import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Star,
  Clock,
  Boxes,
  FileText,
  FileImage,
  ChevronRight,
  UploadCloud,
  CheckCircle2,
  Lock,
  Search,
  Layers,
  Scissors,
  Minimize2,
  Stamp,
  Hash,
  RotateCw,
  FileCheck2,
  ShieldAlert,
  Image,
  Palette,
  Crop,
  Scaling,
} from 'lucide-react';
import { DropZone } from '../common/DropZone';
import { TOOLS, getToolById } from '../../data/tools';
import { ToolCategory, ToolDefinition } from '../../types';
import { DynamicIcon } from '../common/DynamicIcon';
import { useFavoritesAndRecents } from '../../hooks/useFavoritesAndRecents';
import { useTranslation } from '../../i18n/context';
import { getLocalizedTool } from '../../i18n/toolTranslations';

interface HomePageProps {
  onNavigate: (route: string) => void;
  onFilePreload: (files: File[], targetTool?: ToolDefinition) => void;
  initialCategory?: ToolCategory | 'popular';
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onFilePreload,
  initialCategory = 'popular',
}) => {
  const { t, language } = useTranslation();
  const { favorites, isFavorite, toggleFavorite } = useFavoritesAndRecents();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleDropzoneSelect = (files: File[], tool?: ToolDefinition) => {
    onFilePreload(files, tool);
  };

  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const loc = getLocalizedTool(tool, language);
      // Category filter match
      const matchesCategory =
        activeTab === 'all'
          ? true
          : activeTab === 'pdf'
          ? tool.category === 'pdf' || tool.id.includes('pdf')
          : activeTab === 'organize'
          ? ['pdf-organizer', 'merge-pdf', 'split-pdf'].includes(tool.id)
          : activeTab === 'compress'
          ? tool.category === 'compress' || tool.id.includes('compress')
          : activeTab === 'convert'
          ? tool.id.includes('to-') || tool.id.includes('converter')
          : activeTab === 'security'
          ? ['pdf-watermark', 'pdf-page-numbers', 'pdf-flatten', 'pdf-redact-sanitize', 'pdf-metadata'].includes(tool.id)
          : activeTab === 'image'
          ? tool.category === 'image'
          : true;

      // Search query match
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        tool.name.toLowerCase().includes(query) ||
        loc.name.toLowerCase().includes(query) ||
        tool.tagline.toLowerCase().includes(query) ||
        loc.tagline.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.keywords?.some((k) => k.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });
  }, [activeTab, searchQuery, language]);

  return (
    <div className="space-y-12 md:space-y-20 pb-16">
      {/* 1. Hero Section - Iconic iLovePDF Style */}
      <section className="relative pt-6 sm:pt-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        {/* Security badge pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-6 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{t.secureNotice}</span>
        </div>

        {/* Hero Headline - Signature Professional Styling */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
          {t.heroTitle}
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-800 dark:text-slate-200 max-w-2xl mx-auto leading-relaxed font-medium">
          {t.heroSubtitle}
        </p>

        {/* Central Drag & Drop Zone */}
        <div className="mt-8 max-w-3xl mx-auto">
          <DropZone onFilesSelected={handleDropzoneSelect} />
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-700 dark:text-slate-200">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-red-500" />
            {t.freeUnlimited}
          </span>
          <span className="hidden sm:inline">&bull;</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            {t.zeroServerUploads}
          </span>
          <span className="hidden sm:inline">&bull;</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
            {t.noRegistrationNeeded}
          </span>
        </div>
      </section>

      {/* 2. Flagship Spotlights: Visual PDF & Image Suites */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PDF Suite Spotlight (iLovePDF Red) */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-red-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 shadow-xl border border-red-900/40 flex flex-col justify-between">
            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-extrabold uppercase tracking-wider border border-red-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.featuredPdfSuite}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-snug">
                {t.pdfOrganizerTitle}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
                {t.pdfOrganizerDesc}
              </p>

              {/* Visual preview pills */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                {[1, 2, 3].map((p) => (
                  <div
                    key={p}
                    className={`aspect-[3/4] rounded-xl border p-2 flex flex-col justify-between ${
                      p === 2 ? 'border-red-500 bg-red-950/70 ring-2 ring-red-500/40' : 'border-slate-800 bg-slate-950/60'
                    }`}
                  >
                    <span className="text-[9px] text-slate-400 font-bold">P.{p}</span>
                    <div className="space-y-1 opacity-30">
                      <div className="h-1 bg-slate-400 rounded w-2/3" />
                      <div className="h-1 bg-slate-500 rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <button
                onClick={() => onNavigate('/pdf-organizer')}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>{t.launchPdfOrganizer}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>

          {/* Image Suite Spotlight (iLoveIMG Sky Blue) */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-sky-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 shadow-xl border border-sky-900/40 flex flex-col justify-between">
            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-extrabold uppercase tracking-wider border border-sky-400/30">
                <Palette className="w-3.5 h-3.5 text-sky-400" />
                <span>{t.featuredImageSuite}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-snug">
                {t.imageSuiteTitle}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
                {t.imageSuiteDesc}
              </p>

              {/* Quick Image Tools Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <button
                  onClick={() => onNavigate('/image-compressor')}
                  className="px-2.5 py-2 rounded-xl bg-slate-900/90 border border-sky-500/40 hover:border-sky-400 text-left rtl:text-right transition"
                >
                  <div className="text-[10px] font-bold text-sky-400">{t.optimize}</div>
                  <div className="text-[9px] text-slate-300 font-medium">JPG/PNG/WebP</div>
                </button>
                <button
                  onClick={() => onNavigate('/image-resizer')}
                  className="px-2.5 py-2 rounded-xl bg-slate-900/90 border border-sky-500/40 hover:border-sky-400 text-left rtl:text-right transition"
                >
                  <div className="text-[10px] font-bold text-emerald-400">Resize</div>
                  <div className="text-[9px] text-slate-300 font-medium">Pixels & %</div>
                </button>
                <button
                  onClick={() => onNavigate('/image-crop')}
                  className="px-2.5 py-2 rounded-xl bg-slate-900/90 border border-sky-500/40 hover:border-sky-400 text-left rtl:text-right transition"
                >
                  <div className="text-[10px] font-bold text-amber-400">Crop</div>
                  <div className="text-[9px] text-slate-300 font-medium">Square, 16:9</div>
                </button>
                <button
                  onClick={() => onNavigate('/image-converter')}
                  className="px-2.5 py-2 rounded-xl bg-slate-900/90 border border-sky-500/40 hover:border-sky-400 text-left rtl:text-right transition"
                >
                  <div className="text-[10px] font-bold text-purple-400">{t.convert}</div>
                  <div className="text-[9px] text-slate-300 font-medium">To WebP/JPG</div>
                </button>
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <button
                onClick={() => onNavigate('/image-compressor')}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-sky-700 hover:bg-sky-800 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-sky-700/30 transition-all flex items-center justify-center gap-2"
              >
                <span>{t.launchImageSuite}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Tools Grid Section (The Signature iLovePDF & iLoveIMG Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {t.allPdfImageUtilities}
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 mt-1 font-medium">
              {t.selectToolToProcess}
            </p>
          </div>

          {/* Filter Tabs & Search Filter Input */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search filter input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.findTool}
                className="pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-48 shadow-2xs"
              />
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-x-auto">
              {[
                { id: 'all', label: t.allTools },
                { id: 'pdf', label: t.pdfTools },
                { id: 'image', label: t.imageTools },
                { id: 'organize', label: t.organize },
                { id: 'compress', label: t.optimize },
                { id: 'convert', label: t.convert },
                { id: 'security', label: t.security },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                    activeTab === tab.id
                      ? tab.id === 'image'
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tools Grid - iLovePDF & iLoveIMG Visual Cards */}
        {filteredTools.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
              No tools matched your search "{searchQuery}"
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveTab('all');
              }}
              className="mt-3 text-xs font-extrabold text-red-600 hover:underline"
            >
              Clear filters and view all tools
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredTools.map((tool) => {
              const localized = getLocalizedTool(tool, language);
              const isFav = isFavorite(tool.id);
              const isImageTool = tool.category === 'image' || tool.id.includes('image') || tool.id.startsWith('image-');
              return (
                <div
                  key={tool.id}
                  onClick={() => onNavigate(tool.route)}
                  className={`group relative bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                    isImageTool
                      ? 'hover:border-sky-400 dark:hover:border-sky-500'
                      : 'hover:border-red-400 dark:hover:border-red-500'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      {/* Icon container with signature category colors */}
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                          isImageTool
                            ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400'
                            : tool.category === 'pdf' || tool.id.includes('pdf') || tool.id === 'merge-pdf' || tool.id === 'split-pdf'
                            ? 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400'
                            : tool.category === 'compress'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                            : 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400'
                        }`}
                      >
                        <DynamicIcon name={tool.iconName} className="w-6 h-6" />
                      </div>

                      <div className="flex items-center gap-1">
                        {tool.isFlagship && (
                          <span
                            className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                              isImageTool
                                ? 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                                : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                            }`}
                          >
                            POPULAR
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(tool.id);
                          }}
                          className={`p-1.5 rounded-lg text-slate-300 hover:text-amber-500 transition ${
                            isFav ? 'text-amber-400' : ''
                          }`}
                          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <h3
                      className={`text-base font-extrabold text-slate-900 dark:text-white transition-colors ${
                        isImageTool
                          ? 'group-hover:text-sky-600 dark:group-hover:text-sky-400'
                          : 'group-hover:text-red-600 dark:group-hover:text-red-400'
                      }`}
                    >
                      {localized.name}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-2 font-medium">
                      {localized.tagline}
                    </p>
                  </div>

                  <div
                    className={`mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors ${
                      isImageTool
                        ? 'group-hover:text-sky-600 dark:group-hover:text-sky-400'
                        : 'group-hover:text-red-600 dark:group-hover:text-red-400'
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-slate-700 dark:text-slate-300">
                      {tool.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-extrabold">
                      <span>{t.openTool}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Batch Processing Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/25">
              <Boxes className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Batch Processing Hub
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  ZIP ARCHIVE
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                Convert, compress, or sanitize dozens of files concurrently in your browser, then export everything cleanly as a unified ZIP archive.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/batch-processor')}
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition shrink-0 flex items-center justify-center gap-2"
          >
            <span>Open Batch Hub</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 5. Privacy Whitepaper Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 rounded-3xl p-8 sm:p-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-4">
              <Lock className="w-3.5 h-3.5" />
              <span>{t.confidentialityGuarantee}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3">
              {t.confidentialityTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              {t.confidentialityDesc}
            </p>
            <button
              onClick={() => onNavigate('/privacy')}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1.5"
            >
              <span>{t.readPrivacyWhitepaper}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
