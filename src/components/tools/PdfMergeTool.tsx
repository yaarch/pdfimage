import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  ArrowUp,
  ArrowDown,
  Trash2,
  Download,
  Plus,
  Sparkles,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { mergePdfs } from '../../lib/pdfUtils';
import { triggerDownload, formatBytes } from '../../lib/zipUtils';

interface PdfMergeToolProps {
  initialFiles?: File[];
}

export const PdfMergeTool: React.FC<PdfMergeToolProps> = ({ initialFiles = [] }) => {
  const [files, setFiles] = useState<File[]>(initialFiles);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = (Array.from(e.target.files) as File[]).filter(
        (f) => f.type === 'application/pdf' || f.name.endsWith('.pdf')
      );
      setFiles((prev) => [...prev, ...newFiles]);
      setMergedBlob(null);
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= files.length) return;
    const updated = [...files];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setFiles(updated);
    setMergedBlob(null);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
    setMergedBlob(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please add at least 2 PDF files to merge.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const blob = await mergePdfs(files);
      setMergedBlob(blob);
    } catch (err: any) {
      console.error(err);
      setError('Failed to merge files. Please verify that the PDF files are not password protected.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!mergedBlob) return;
    triggerDownload(mergedBlob, 'nuvio_merged_document.pdf');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Files to Merge ({files.length})
          </h3>
          <p className="text-xs text-slate-500">
            Arrange files in the exact order you want them combined.
          </p>
        </div>

        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition">
          <Plus className="w-3.5 h-3.5" />
          <span>Add PDF Files</span>
          <input
            type="file"
            multiple
            accept="application/pdf,.pdf"
            onChange={handleAddFiles}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {files.length === 0 ? (
        <div className="py-14 text-center">
          <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            No PDF files added yet
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Click &ldquo;Add PDF Files&rdquo; above to select multiple documents.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-2.5">
          {files.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3 transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <FileText className="w-5 h-5 text-rose-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-[11px] text-slate-500">{formatBytes(file.size)}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => moveItem(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveItem(idx, 'down')}
                  disabled={idx === files.length - 1}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeFile(idx)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition ml-1"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            Total files:{' '}
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {files.length}
            </span>{' '}
            &bull; Total size:{' '}
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {formatBytes(files.reduce((a, b) => a + b.size, 0))}
            </span>
          </div>

          {mergedBlob ? (
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
            >
              <Download className="w-4 h-4" />
              <span>Download Merged PDF ({formatBytes(mergedBlob.size)})</span>
            </button>
          ) : (
            <button
              onClick={handleMerge}
              disabled={isProcessing || files.length < 2}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/20 transition disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Merging Documents...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Merge {files.length} Files</span>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
