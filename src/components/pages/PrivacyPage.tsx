import React from 'react';
import { ShieldCheck, Lock, EyeOff, ServerOff, Cpu, HardDrive } from 'lucide-react';
import { useTranslation } from '../../i18n/context';

interface PrivacyPageProps {
  onNavigate: (route: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-4">
          <ShieldCheck className="w-4 h-4" />
          <span>Privacy Architecture Whitepaper</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Your Files Never Touch a Server. Period.
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          PDF Image Studio was engineered around a radical principle: you shouldn&apos;t have to sacrifice confidentiality or upload private documents to the cloud just to merge two PDFs or resize an image.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mb-4">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            100% In-Memory Execution
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            All document compilation, parsing, rasterization, and compression routines execute directly inside your browser&apos;s sandboxed JavaScript runtime. When you close the tab, the memory is instantly freed by the browser garbage collector.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-4">
            <ServerOff className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            Zero File Uploads
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Unlike legacy online conversion websites that upload your files to remote Amazon S3 buckets or temporary server disks, PDF Image Studio does not even have an upload endpoint. Open Network DevTools: no payload bytes are sent over the wire.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mb-4">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            No Account & No Tracking
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            We do not collect names, email addresses, credit cards, or passwords. There are no tracking pixels or invasive telemetry trackers monitoring what files you manipulate or what documents you open.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mb-4">
            <HardDrive className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            Offline Capable PWA
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Once loaded, NUVIO can function completely disconnected from the Internet. You can turn off your Wi-Fi or airplane mode and continue organizing PDFs and converting photos uninterrupted.
          </p>
        </div>
      </div>

      {/* Compliance / Enterprise statement */}
      <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Ideal for Legal, Healthcare, Financial & Confidential Documents
        </h3>
        <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Under regulations like GDPR, HIPAA, FERPA, and CCPA, uploading proprietary or patient data to third-party file conversion servers can constitute a serious data breach or compliance violation. Because NUVIO never transmits data outside your client workstation, it satisfies the strictest corporate data residency policies without requiring specialized enterprise agreements.
        </p>
        <div className="pt-2">
          <button
            onClick={() => onNavigate('/')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition"
          >
            Start Using NUVIO Now
          </button>
        </div>
      </div>
    </div>
  );
};
