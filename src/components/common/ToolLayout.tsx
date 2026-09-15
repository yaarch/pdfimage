import React, { useState } from 'react';
import {
  ShieldCheck,
  Star,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Share2,
  Check,
} from 'lucide-react';
import { ToolDefinition } from '../../types';
import { TOOLS, getToolById } from '../../data/tools';
import { DynamicIcon } from './DynamicIcon';
import { useFavoritesAndRecents } from '../../hooks/useFavoritesAndRecents';
import { useTranslation } from '../../i18n/context';
import { getLocalizedTool } from '../../i18n/toolTranslations';

interface ToolLayoutProps {
  tool: ToolDefinition;
  onNavigate: (route: string) => void;
  children: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({
  tool,
  onNavigate,
  children,
}) => {
  const { isFavorite, toggleFavorite } = useFavoritesAndRecents();
  const { t, language } = useTranslation();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const isFav = isFavorite(tool.id);
  const currentToolLoc = getLocalizedTool(tool, language);

  const relatedTools = tool.relatedToolIds
    .map((id) => getToolById(id))
    .filter((t): t is ToolDefinition => !!t);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Breadcrumb & Quick Nav */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
          <span>{t.backToHome}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Favorite Toggle */}
          <button
            onClick={() => toggleFavorite(tool.id)}
            className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition ${
              isFav
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-600 dark:text-amber-400'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span className="hidden sm:inline">{isFav ? t.saved : t.favorite}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5 transition"
            title="Copy shareable link"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="hidden sm:inline text-emerald-600">{t.copied}</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">{t.share}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tool Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                tool.category === 'pdf'
                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                  : tool.category === 'image'
                  ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400'
                  : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
              }`}
            >
              <DynamicIcon name={tool.iconName} className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {currentToolLoc.name}
                </h1>
                {tool.isFlagship && (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                    {t.flagshipUtility}
                  </span>
                )}
                <span className="text-xs uppercase font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                  {tool.category}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
                {currentToolLoc.tagline}
              </p>
            </div>
          </div>

          {/* Privacy Seal */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 shrink-0 self-start md:self-auto">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div className="text-xs">
              <span className="font-bold block">{t.clientSideEngine}</span>
              <span className="text-emerald-700/80 dark:text-emerald-400/80">
                {t.zeroUploadsNoServer}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Tool Workspace */}
      <div className="mb-14">{children}</div>

      {/* FAQ Section */}
      {tool.faqs.length > 0 && (
        <div className="mb-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
            {t.faqs}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
            {t.faqSub}
          </p>

          <div className="space-y-3">
            {tool.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left rtl:text-right px-5 py-4 flex items-center justify-between gap-4 font-semibold text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-indigo-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Related Tools Recommendation */}
      {relatedTools.length > 0 && (
        <div className="bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.relatedTools}
              </h3>
              <p className="text-xs text-slate-500">
                {t.relatedSub}
              </p>
            </div>
            <button
              onClick={() => onNavigate('/all-tools')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>{t.viewAll}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedTools.map((rel) => {
              const relLoc = getLocalizedTool(rel, language);
              return (
                <button
                  key={rel.id}
                  onClick={() => onNavigate(rel.route)}
                  className="group text-left rtl:text-right p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${
                        rel.category === 'pdf'
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600'
                          : rel.category === 'image'
                          ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600'
                          : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600'
                      }`}
                    >
                      <DynamicIcon name={rel.iconName} className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                      {relLoc.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                      {relLoc.tagline}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-medium text-slate-400 group-hover:text-indigo-600">
                    <span>{t.openTool}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
