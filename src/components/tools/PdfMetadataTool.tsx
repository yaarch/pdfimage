import React, { useState } from 'react';
import {
  Info,
  Download,
  AlertCircle,
  Sparkles,
  RefreshCw,
  UploadCloud,
  FileText,
} from 'lucide-react';
import { getPdfMetadata, updatePdfMetadata } from '../../lib/pdfUtils';
import { triggerDownload, formatBytes } from '../../lib/zipUtils';

interface PdfMetadataToolProps {
  initialFiles?: File[];
}

export const PdfMetadataTool: React.FC<PdfMetadataToolProps> = ({ initialFiles = [] }) => {
  const [file, setFile] = useState<File | null>(initialFiles[0] || null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [subject, setSubject] = useState('');
  const [keywords, setKeywords] = useState('');
  const [pageCount, setPageCount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  React.useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      setFile(initialFiles[0]);
      loadPdf(initialFiles[0]);
    }
  }, [initialFiles]);

  const loadPdf = async (selectedFile: File) => {
    setIsProcessing(true);
    setError(null);
    setResultBlob(null);

    try {
      const meta = await getPdfMetadata(selectedFile);
      setTitle(meta.title || '');
      setAuthor(meta.author || '');
      setSubject(meta.subject || '');
      setKeywords(meta.keywords || '');
      setPageCount(meta.pageCount);
      setFile(selectedFile);
    } catch (err: any) {
      console.error(err);
      setError('Unable to read PDF metadata.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      loadPdf(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const blob = await updatePdfMetadata(file, {
        title,
        author,
        subject,
        keywords,
      });
      setResultBlob(blob);
    } catch (err: any) {
      console.error(err);
      setError('Failed to update PDF metadata.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const base = file.name.replace(/\.pdf$/i, '');
    triggerDownload(resultBlob, `${base}_metadata_updated.pdf`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
      {!file ? (
        <div className="py-12 text-center max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Upload PDF to Inspect & Edit Metadata
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Inspect embedded titles, authors, keywords, and modify or strip them for privacy.
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
                Document Properties
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white truncate max-w-md">
                {file.name}
              </h3>
              <p className="text-xs text-slate-500">
                {formatBytes(file.size)} &bull; {pageCount} {pageCount === 1 ? 'page' : 'pages'}
              </p>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Document Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Annual Financial Report"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Author / Creator
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. John Doe, Acquired Corp"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Subject / Topic
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Fiscal Q4 Review"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Keywords (Comma-separated)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. finance, quarterly, audit"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setTitle('');
                setAuthor('');
                setSubject('');
                setKeywords('');
              }}
              className="text-xs text-rose-600 hover:underline"
            >
              Strip All Metadata (Privacy Sanitization)
            </button>

            {resultBlob ? (
              <button
                onClick={handleDownload}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Updated PDF ({formatBytes(resultBlob.size)})</span>
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm shadow-indigo-600/20 transition disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Writing Metadata...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Save Metadata Changes</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
