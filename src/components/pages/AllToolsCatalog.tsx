import React, { useState } from 'react';
import { Search, Star, ArrowRight, Sparkles } from 'lucide-react';
import { TOOLS } from '../../data/tools';
import { ToolCategory, ToolDefinition } from '../../types';
import { DynamicIcon } from '../common/DynamicIcon';
import { useFavoritesAndRecents } from '../../hooks/useFavoritesAndRecents';
import { useTranslation } from '../../i18n/context';
import { getLocalizedTool } from '../../i18n/toolTranslations';
import { formatLocalizedRoute } from '../../i18n/urlUtils';

interface AllToolsCatalogProps {
  onNavigate: (route: string) => void;
  initialCategory?: ToolCategory | 'all';
}

export const AllToolsCatalog: React.FC<AllToolsCatalogProps> = ({
  onNavigate,
  initialCategory = 'all',
}) => {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const { isFavorite, toggleFavorite } = useFavoritesAndRecents();
  const { t, language } = useTranslation();

  React.useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  const filteredTools = TOOLS.filter((tool) => {
    const loc = getLocalizedTool(tool, language);
    let matchesCategory = true;
    if (activeCategory === 'pdf') {
      matchesCategory = tool.category === 'pdf' || tool.id.includes('pdf') || tool.acceptedMimeTypes.includes('application/pdf');
    } else if (activeCategory === 'image') {
      matchesCategory = tool.category === 'image' || tool.id.includes('image') || tool.acceptedMimeTypes.some((m) => m.startsWith('image/'));
    } else if (activeCategory === 'compress') {
      matchesCategory = tool.category === 'compress';
    } else if (activeCategory === 'security') {
      matchesCategory = tool.category === 'security' || tool.id.includes('redact') || tool.id.includes('watermark');
    } else if (activeCategory !== 'all') {
      matchesCategory = tool.category === activeCategory;
    }

    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      tool.name.toLowerCase().includes(q) ||
      loc.name.toLowerCase().includes(q) ||
      tool.tagline.toLowerCase().includes(q) ||
      loc.tagline.toLowerCase().includes(q) ||
      tool.keywords.some((kw) => kw.toLowerCase().includes(q));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {t.allPdfImageUtilities}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          {t.selectToolToProcess}
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {[
            { id: 'all', label: t.allTools },
            { id: 'pdf', label: t.pdfTools },
            { id: 'image', label: t.imageTools },
            { id: 'organize', label: t.organize },
            { id: 'compress', label: t.optimize },
            { id: 'convert', label: t.convert },
            { id: 'security', label: t.security },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.findTool}
            className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Tool Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredTools.map((tool) => {
          const localized = getLocalizedTool(tool, language);
          const isFav = isFavorite(tool.id);
          return (
            <div
              key={tool.id}
              onClick={() => onNavigate(formatLocalizedRoute(tool.route, language, language !== 'en'))}
              className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xs hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-200 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      tool.category === 'pdf'
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                        : tool.category === 'image'
                        ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400'
                        : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                    }`}
                  >
                    <DynamicIcon name={tool.iconName} className="w-5 h-5" />
                  </div>

                  <div className="flex items-center gap-1">
                    {tool.isFlagship && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        FLAGSHIP
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(tool.id);
                      }}
                      className={`p-1.5 rounded-lg text-slate-400 hover:text-amber-500 transition ${
                        isFav ? 'text-amber-400' : ''
                      }`}
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {localized.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {localized.tagline}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                <span className="text-[11px] uppercase tracking-wider font-mono">
                  {tool.category}
                </span>
                <span className="flex items-center gap-1">
                  <span>{t.openTool}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
