import React, { useState } from 'react';
import { Download, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useTranslation } from '../../i18n/context';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const { t } = useTranslation();

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        id="btn-install-pwa"
        onClick={install}
        className="flex items-center gap-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        title={t.installApp}
      >
        <Download className="w-3.5 h-3.5" />
        <span>{t.installApp}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          id="btn-install-ios"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 text-xs font-semibold shadow-sm transition-all"
          title={t.installIos}
        >
          <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
          <span>{t.installIos}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-slate-900 dark:text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Install NUVIO on iOS</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Add to your iPhone / iPad Home Screen</p>
                </div>
              </div>
              <ol className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300 list-decimal list-inside bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <li className="leading-relaxed">Tap the <span className="font-semibold text-indigo-600 dark:text-indigo-400">Share</span> icon in Safari toolbar.</li>
                <li className="leading-relaxed">Scroll down and tap <span className="font-semibold text-indigo-600 dark:text-indigo-400">Add to Home Screen</span>.</li>
                <li className="leading-relaxed">Launch NUVIO from your home screen for fast, offline-ready utility access!</li>
              </ol>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-sm"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
