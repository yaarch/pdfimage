import React, { useState } from 'react';
import {
  FileArchive,
  Download,
  CheckCircle,
  AlertCircle,
  Sparkles,
  RefreshCw,
  UploadCloud,
  ShieldCheck,
} from 'lucide-react';
import { compressPdf } from '../../lib/pdfUtils';
import { triggerDownload, formatBytes } from '../../lib/zipUtils';
import { useTranslation } from '../../i18n/context';

interface PdfCompressToolProps {
  initialFiles?: File[];
}

export const PdfCompressTool: React.FC<PdfCompressToolProps> = ({ initialFiles = [] }) => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(initialFiles[0] || null);
  const [level, setLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; originalSize: number; newSize: number; savings: number } | null>(null);

  React.useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      setFile(initialFiles[0]);
      setResult(null);
      setError(null);
    }
  }, [initialFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const res = await compressPdf(file, level);
      setResult(res);
    } catch (err: any) {
      console.error(err);
      setError('Unable to compress this PDF. The document structure may already be optimized.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const base = file.name.replace(/\.pdf$/i, '');
    triggerDownload(result.blob, `${base}_compressed.pdf`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
      {!file ? (
        <div className="py-12 text-center max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            {t.choosePdfToCompress}
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            {t.reducePdfDesc}
          </p>
          <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition">
            <span>{t.choosePdfFile}</span>
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">
                {t.selectedPdf}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white truncate max-w-md">
                {file.name}
              </h3>
              <p className="text-xs text-slate-500">{t.originalSize}: {formatBytes(file.size)}</p>
            </div>
            <label className="cursor-pointer text-xs font-medium text-indigo-600 hover:underline">
              {t.changeFile}
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Compression Level Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
              {t.selectCompressionProfile}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'high',
                  name: 'Extreme Compression',
                  desc: 'Maximum file size reduction for fast sharing and email attachments.',
                },
                {
                  id: 'medium',
                  name: 'Recommended',
                  desc: 'Optimal balance of high visual clarity and reduced file size.',
                },
                {
                  id: 'low',
                  name: 'Light Optimization',
                  desc: 'Cleans stream metadata and internal tables with maximum crispness.',
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setLevel(opt.id as any)}
                  className={`text-left p-4 rounded-2xl border transition-all ${
                    level === opt.id
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                    {opt.name}
                  </span>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleCompress}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm shadow-indigo-600/20 transition disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Compressing Document...</span>
                </>
              ) : (
                <>
                  <FileArchive className="w-4 h-4" />
                  <span>Compress PDF</span>
                </>
              )}
            </button>
          </div>

          {/* Result Presentation */}
          {result && (
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-2xl p-5 border border-emerald-200/50 dark:border-emerald-800/50 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Compression Complete!
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      <span>{formatBytes(result.originalSize)}</span>
                      <span>&rarr;</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {formatBytes(result.newSize)}
                      </span>
                      {result.savings > 0 && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                          -{result.savings}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Optimized PDF</span>
                </button>
              </div>

              {/* Progress visual representation */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(10, 100 - result.savings))}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
