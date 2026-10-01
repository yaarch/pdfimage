import React, { useState } from 'react';
import {
  ShieldCheck,
  ChevronDown,
  Sparkles,
  UploadCloud,
  Sliders,
  Zap,
  Download,
  Info,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';
import { ToolDefinition, LanguageCode } from '../../types';
import { getToolRichContent } from '../../data/toolRichContent';
import { useTranslation } from '../../i18n/context';
import { getLocalizedTool } from '../../i18n/toolTranslations';

interface ToolContentSectionProps {
  tool: ToolDefinition;
  language: LanguageCode;
  onNavigate: (route: string) => void;
}

export const ToolContentSection: React.FC<ToolContentSectionProps> = ({
  tool,
  language,
}) => {
  const { t } = useTranslation();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const richContent = getToolRichContent(tool.id, language);
  const localizedTool = getLocalizedTool(tool, language);

  const stepIcons = [UploadCloud, Sliders, Zap, Download];

  return (
    <div className="space-y-12 mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800/80">
      {/* 1. Tool Overview & Client-Side Privacy Card */}
      <div className="bg-gradient-to-br from-indigo-900/5 via-slate-900/5 to-purple-900/5 dark:from-indigo-950/30 dark:via-slate-900/30 dark:to-purple-950/30 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{richContent.overviewTitle}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {localizedTool.name} — {localizedTool.tagline}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {richContent.overviewText || localizedTool.description}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-800/80 rounded-2xl p-4 shrink-0 shadow-xs flex items-start gap-3 max-w-xs">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block">
                {t.clientSidePrivacy}
              </span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-normal">
                {t.zeroServerUploads}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. How to Use & Step-By-Step Instructions */}
      <div className="space-y-6">
        <div className="text-center md:text-left rtl:md:text-right space-y-1">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {richContent.howToUseTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t.selectToolToProcess}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {richContent.steps.map((step, idx) => {
            const IconComponent = stepIcons[idx % stepIcons.length];
            return (
              <div
                key={step.stepNumber}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 relative shadow-2xs hover:border-indigo-400 dark:hover:border-indigo-500 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs flex items-center justify-center">
                      {step.stepNumber}
                    </span>
                    <IconComponent className="w-4 h-4 text-slate-400" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Options & Specifications Grid */}
      {richContent.optionsList && richContent.optionsList.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {richContent.optionsTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {richContent.optionsList.map((opt, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3 text-xs"
              >
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {opt.label}
                </span>
                <span className="font-mono font-medium text-indigo-600 dark:text-indigo-400 text-right rtl:text-left shrink-0">
                  {opt.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Pro Tips & Best Practices */}
      {richContent.tips && richContent.tips.length > 0 && (
        <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {richContent.tipsTitle}
            </h3>
          </div>

          <ul className="space-y-2.5">
            {richContent.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 5. Complete FAQs Section */}
      {localizedTool.faqs && localizedTool.faqs.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">
            {t.faqs}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
            {t.faqSub}
          </p>

          <div className="space-y-3">
            {localizedTool.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left rtl:text-right px-5 py-4 flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
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
    </div>
  );
};
