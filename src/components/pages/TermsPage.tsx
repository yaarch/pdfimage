import React from 'react';

interface TermsPageProps {
  onNavigate: (route: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Terms of Service
        </h1>
        <p className="mt-2 text-xs text-slate-500">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 space-y-6 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            1. Client-Side Service Architecture
          </h2>
          <p>
            PDF Image Studio provides client-side file manipulation software that runs locally on your device. By accessing or using PDF Image Studio, you acknowledge that all file reading, processing, and rendering occur entirely within your browser environment.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            2. Intellectual Property & File Ownership
          </h2>
          <p>
            You retain 100% full, exclusive ownership of any documents, graphics, and images processed through PDF Image Studio. We do not claim any rights, title, or interest in your files, nor do our systems possess the technical ability to store or copy them.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            3. Disclaimer of Warranties
          </h2>
          <p>
            PDF Image Studio is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis without warranties of any kind, whether express or implied. While our routines are thoroughly tested against standard PDF specifications and image encodings, we recommend maintaining original backups of critical files.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => onNavigate('/')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
