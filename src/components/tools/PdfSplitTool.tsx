import React, { useState } from 'react';
import {
  Scissors,
  Download,
  AlertCircle,
  FileArchive,
  Sparkles,
  RefreshCw,
  UploadCloud,
} from 'lucide-react';
import { splitPdf } from '../../lib/pdfUtils';
import { createZipArchive, triggerDownload, formatBytes } from '../../lib/zipUtils';

interface PdfSplitToolProps {
  initialFiles?: File[];
}

export const PdfSplitTool: React.FC<PdfSplitToolProps> = ({ initialFiles = [] }) => {
  const [file, setFile] = useState<File | null>(initialFiles[0] || null);
  const [mode, setMode] = useState<'all' | 'ranges'>('ranges');
  const [rangeInput, setRangeInput] = useState('1-2, 3');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{ name: string; blob: Blob }[]>([]);

  React.useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      setFile(initialFiles[0]);
      setResults([]);
      setError(null);
    }
  }, [initialFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResults([]);
      setError(null);
    }
  };

  const handleSplit = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const namedResults = await splitPdf(file, mode, rangeInput);
      setResults(namedResults);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to split PDF. Please check your page ranges.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadAllAsZip = async () => {
    if (results.length === 0) return;
    const zipBlob = await createZipArchive(results);
    const base = file ? file.name.replace(/\.pdf$/i, '') : 'document';
    triggerDownload(zipBlob, `${base}_split_pages.zip`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
      {!file ? (
        <div className="py-12 text-center max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Upload PDF to Split
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Extract pages or split your PDF into multiple discrete documents.
          </p>
          <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition">
            <span>Choose PDF File</span>
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
                Target File
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white truncate max-w-md">
                {file.name}
              </h3>
              <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
            </div>
            <label className="cursor-pointer text-xs font-medium text-indigo-600 hover:underline">
              Change File
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

          {/* Split Mode Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setMode('ranges')}
              className={`text-left p-4 rounded-2xl border transition-all ${
                mode === 'ranges'
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <span className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                Custom Page Ranges
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Extract specific segments into individual PDFs (e.g. 1-3, 5, 7-10).
              </p>
            </button>

            <button
              type="button"
              onClick={() => setMode('all')}
              className={`text-left p-4 rounded-2xl border transition-all ${
                mode === 'all'
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <span className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                Extract Every Page Separately
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Splits every page of the document into individual 1-page PDF files.
              </p>
            </button>
          </div>

          {mode === 'ranges' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Specify Page Ranges (Comma-separated)
              </label>
              <input
                type="text"
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                placeholder="e.g. 1-2, 3, 5-8"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400">
                Example: &ldquo;1-3, 4, 6-9&rdquo; will create three documents.
              </p>
            </div>
          )}

          {/* Action Trigger */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={handleSplit}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm shadow-indigo-600/20 transition disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Splitting PDF...</span>
                </>
              ) : (
                <>
                  <Scissors className="w-4 h-4" />
                  <span>Split Document</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Results List */}
          {results.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Generated Files ({results.length})
                </h4>
                {results.length > 1 && (
                  <button
                    onClick={downloadAllAsZip}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition"
                  >
                    <FileArchive className="w-3.5 h-3.5" />
                    <span>Download All as ZIP</span>
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {results.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-slate-500">{formatBytes(item.blob.size)}</p>
                    </div>

                    <button
                      onClick={() => triggerDownload(item.blob, item.name)}
                      className="px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
