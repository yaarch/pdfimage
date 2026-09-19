import React from 'react';
import { ShieldCheck, Zap, Smartphone, UserX, Heart, FileText, Image } from 'lucide-react';
import { useTranslation } from '../../i18n/context';
import { TOOLS } from '../../data/tools';
import { formatLocalizedRoute } from '../../i18n/urlUtils';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, language } = useTranslation();

  const handleNav = (pureRoute: string) => {
    const targetRoute = formatLocalizedRoute(pureRoute, language, language !== 'en');
    onNavigate(targetRoute);
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 transition-colors">
      {/* Trust Elements Bar */}
      <div className="border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center gap-1.5 p-2">
              <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">100% Client-Side</span>
              <span className="text-xs text-slate-600 dark:text-slate-300">Files never leave your browser</span>
            </div>

            <div className="flex flex-col items-center gap-1.5 p-2">
              <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <UserX className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">No Account Required</span>
              <span className="text-xs text-slate-600 dark:text-slate-300">Free, direct access to all core tools</span>
            </div>

            <div className="flex flex-col items-center gap-1.5 p-2">
              <div className="w-8 h-8 rounded-full bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Instant Hardware Speed</span>
              <span className="text-xs text-slate-600 dark:text-slate-300">Accelerated by modern browser APIs</span>
            </div>

            <div className="flex flex-col items-center gap-1.5 p-2">
              <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Smartphone className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Mobile & Offline Ready</span>
              <span className="text-xs text-slate-600 dark:text-slate-300">Installable PWA for any device</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-slate-800 border border-slate-800 dark:border-slate-700 flex items-center justify-center text-white shadow-md shadow-indigo-600/15 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/30 via-indigo-600/30 to-sky-500/30 opacity-80" />
                <div className="relative flex items-center justify-center gap-0.5">
                  <FileText className="w-4.5 h-4.5 text-rose-500 stroke-[2.5]" />
                  <Image className="w-3.5 h-3.5 text-sky-400 stroke-[2.5] -ml-2 mt-1" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white leading-none">
                  PDF Image Studio
                </span>
                <span className="text-[9px] font-bold tracking-widest text-slate-600 dark:text-slate-400 uppercase mt-0.5">
                  Private Browser Tools
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 max-w-sm leading-relaxed">
              {t.heroSubtitle}
            </p>
            <div className="pt-2 text-[11px] text-slate-600 dark:text-slate-400">
              Compatible with Cloudflare Pages &bull; Open Web Standards
            </div>
          </div>

          {/* Column 1: PDF Tools */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              PDF Toolbox
            </h4>
            <ul className="space-y-1 text-xs font-medium text-slate-700 dark:text-slate-300">
              <li>
                <button onClick={() => handleNav('/pdf-organizer')} className="min-h-[44px] py-1.5 flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  PDF Organizer
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/merge-pdf')} className="min-h-[44px] py-1.5 flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Merge PDF
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/split-pdf')} className="min-h-[44px] py-1.5 flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Split PDF
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/compress-pdf')} className="min-h-[44px] py-1.5 flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Compress PDF
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/images-to-pdf')} className="min-h-[44px] py-1.5 flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Images to PDF
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/pdf-to-images')} className="min-h-[44px] py-1.5 flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  PDF to Images
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Image Tools */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Image Tools
            </h4>
            <ul className="space-y-1 text-xs font-medium text-slate-700 dark:text-slate-300">
              <li>
                <button onClick={() => handleNav('/image-compressor')} className="min-h-[44px] py-1.5 flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Compress Image
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/image-resizer')} className="min-h-[44px] py-1.5 flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Resize Image
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/image-converter')} className="min-h-[44px] py-1.5 flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Convert Format
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/image-crop')} className="min-h-[44px] py-1.5 flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Crop Image
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/image-strip-exif')} className="min-h-[44px] py-1.5 flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Remove Metadata
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/batch-processor')} className="min-h-[44px] py-1.5 flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Batch Processor (ZIP)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Company */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Resources & Privacy
            </h4>
            <ul className="space-y-1 text-xs font-medium text-slate-700 dark:text-slate-300">
              <li>
                <button onClick={() => handleNav('/privacy')} className="min-h-[44px] py-1.5 flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition font-bold text-emerald-700 dark:text-emerald-400">
                  Privacy Architecture
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/blog')} className="min-h-[44px] py-1.5 flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Guides & Tutorials
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/about')} className="min-h-[44px] py-1.5 flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  About PDF Image Studio
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/terms')} className="min-h-[44px] py-1.5 flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/all-tools')} className="min-h-[44px] py-1.5 flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  {t.allToolsCatalog} ({TOOLS.length}+)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/sitemap.xml')} className="min-h-[44px] py-1.5 flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  XML Sitemap (Index & 5 Locales)
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 dark:text-slate-400 gap-3">
          <div>
            &copy; {new Date().getFullYear()} PDF Image Studio. {t.tagline} All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              Engineered with privacy in mind
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
