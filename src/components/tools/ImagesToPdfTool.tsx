import React, { useState } from 'react';
import {
  FileImage,
  UploadCloud,
  ArrowUp,
  ArrowDown,
  Trash2,
  Download,
  Plus,
  Sparkles,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { imagesToPdf } from '../../lib/pdfUtils';
import { triggerDownload, formatBytes } from '../../lib/zipUtils';

interface ImagesToPdfToolProps {
  initialFiles?: File[];
}

export const ImagesToPdfTool: React.FC<ImagesToPdfToolProps> = ({ initialFiles = [] }) => {
  const [files, setFiles] = useState<File[]>(
    initialFiles.filter((f) => f.type.startsWith('image/'))
  );
  const [pageSize, setPageSize] = useState<'fit' | 'a4' | 'letter'>('fit');
  const [margin, setMargin] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  React.useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      const imgs = initialFiles.filter((f) => f.type.startsWith('image/'));
      if (imgs.length > 0) {
        setFiles(imgs);
        setPdfBlob(null);
      }
    }
  }, [initialFiles]);

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = (Array.from(e.target.files) as File[]).filter((f) => f.type.startsWith('image/'));
      setFiles((prev) => [...prev, ...newImages]);
      setPdfBlob(null);
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= files.length) return;
    const updated = [...files];
    const [moved] = updated.splice(index, 1);
    updated.splice(target, 0, moved);
    setFiles(updated);
    setPdfBlob(null);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
    setPdfBlob(null);
  };

  const handleGeneratePdf = async () => {
    if (files.length === 0) {
      setError('Please add at least one image file.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const blob = await imagesToPdf(files, { pageSize, margin });
      setPdfBlob(blob);
    } catch (err: any) {
      console.error(err);
      setError('Failed to convert images to PDF. Please verify image formats.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBlob) return;
    triggerDownload(pdfBlob, 'nuvio_images_album.pdf');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Images to Convert ({files.length})
          </h3>
          <p className="text-xs text-slate-500">
            Combine JPEG, PNG, or WebP images into a single cohesive PDF document.
          </p>
        </div>

        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition">
          <Plus className="w-3.5 h-3.5" />
          <span>Add Images</span>
          <input
            type="file"
            multiple
            accept="image/*"
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
          <FileImage className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            No images selected yet
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Click &ldquo;Add Images&rdquo; above to select photos or scans from your device.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Page Dimensions
              </label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              >
                <option value="fit">Fit to Image Size (No margins)</option>
                <option value="a4">Standard A4 (Portrait / Landscape)</option>
                <option value="letter">Standard US Letter</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Page Margins
              </label>
              <select
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              >
                <option value={0}>No Margins (0px)</option>
                <option value={20}>Small Margins (20px)</option>
                <option value={40}>Generous Margins (40px)</option>
              </select>
            </div>
          </div>

          {/* Image items queue */}
          <div className="space-y-2">
            {files.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
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
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveItem(idx, 'down')}
                    disabled={idx === files.length - 1}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFile(idx)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Total {files.length} images will be compiled into 1 PDF.
            </div>

            {pdfBlob ? (
              <button
                onClick={handleDownload}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF ({formatBytes(pdfBlob.size)})</span>
              </button>
            ) : (
              <button
                onClick={handleGeneratePdf}
                disabled={isProcessing}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/20 transition disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Compiling PDF...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Convert Images to PDF</span>
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
