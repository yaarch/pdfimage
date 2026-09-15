import React from 'react';
import { Sparkles, ShieldCheck, Zap, Globe2 } from 'lucide-react';
import { useTranslation } from '../../i18n/context';

interface AboutPageProps {
  onNavigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          About PDF Image Studio
        </h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-400 font-medium">
          Your files. Your way.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 space-y-6 text-slate-700 dark:text-slate-300 shadow-xs leading-relaxed text-sm sm:text-base">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          The Problem with Legacy File Converters
        </h2>
        <p>
          For over a decade, simple document tasks—like merging two PDFs, rotating an image, or compressing a presentation—have forced users into a hostile web of bloated, ad-saturated converter sites that upload private contracts and personal photos onto unidentified servers.
        </p>
        <p>
          These legacy websites charge recurring subscription fees, impose artificial hourly limits, force users to create accounts, and store uploaded files in cloud queues where they are vulnerable to data scraping or leakage.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-4">
          The Modern Browser Revolution
        </h2>
        <p>
          Modern web browsers are capable operating environments equipped with high-performance WebAssembly engines, Typed Arrays, Canvas 2D renderers, and native hardware acceleration.
        </p>
        <p>
          PDF Image Studio was engineered to leverage 100% of this client-side compute power. Instead of sending files across the globe to be manipulated by an expensive server farm, PDF Image Studio processes files right inside your browser window. The result is instant speed, zero server costs, unlimited file processing, and guaranteed privacy.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
            <span className="block text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">0s</span>
            <span className="text-xs text-slate-500 font-medium">Upload Wait Time</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
            <span className="block text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">100%</span>
            <span className="text-xs text-slate-500 font-medium">Local Privacy</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
            <span className="block text-2xl font-extrabold text-sky-600 dark:text-sky-400">18+</span>
            <span className="text-xs text-slate-500 font-medium">In-Browser Tools</span>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-center">
          <button
            onClick={() => onNavigate('/all-tools')}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition"
          >
            Explore All NUVIO Utilities
          </button>
        </div>
      </div>
    </div>
  );
};
