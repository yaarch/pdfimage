import React, { useState } from 'react';
import {
  Boxes,
  Download,
  AlertCircle,
  FileArchive,
  Sparkles,
  RefreshCw,
  UploadCloud,
  CheckCircle,
  Trash2,
  FileText,
  FileImage,
  Plus,
} from 'lucide-react';
import { compressImage, convertImage, stripImageMetadata } from '../../lib/imageUtils';
import { compressPdf, rotatePdfPages } from '../../lib/pdfUtils';
import { createZipArchive, triggerDownload, formatBytes } from '../../lib/zipUtils';

interface BatchFileItem {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  resultBlob?: Blob;
  outputName?: string;
  errorMessage?: string;
}

type BatchOperation =
  | 'compress-images'
  | 'convert-webp'
  | 'convert-jpg'
  | 'strip-exif'
  | 'compress-pdfs'
  | 'rotate-pdfs';

export const BatchProcessorTool: React.FC = () => {
  const [items, setItems] = useState<BatchFileItem[]>([]);
  const [operation, setOperation] = useState<BatchOperation>('compress-images');
  const [isProcessing, setIsProcessing] = useState(false);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newItems: BatchFileItem[] = (Array.from(e.target.files) as File[]).map((f) => ({
        id: `${f.name}-${Date.now()}-${Math.random()}`,
        file: f,
        status: 'pending',
      }));
      setItems((prev) => [...prev, ...newItems]);
      setZipBlob(null);
    }
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearAll = () => {
    setItems([]);
    setZipBlob(null);
  };

  const handleRunBatch = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    setZipBlob(null);

    const updatedItems = [...items];
    const completedFiles: { name: string; blob: Blob }[] = [];

    for (let i = 0; i < updatedItems.length; i++) {
      const item = updatedItems[i];
      item.status = 'processing';
      setItems([...updatedItems]);

      try {
        let outputBlob: Blob;
        let outName = item.file.name;
        const nameNoExt = item.file.name.substring(0, item.file.name.lastIndexOf('.')) || item.file.name;

        if (operation === 'compress-images') {
          const res = await compressImage(item.file, { quality: 0.75, maxDimension: 1920 });
          outputBlob = res.blob;
          outName = `${nameNoExt}_compressed.jpg`;
        } else if (operation === 'convert-webp') {
          outputBlob = await convertImage(item.file, 'image/webp', 0.9);
          outName = `${nameNoExt}.webp`;
        } else if (operation === 'convert-jpg') {
          outputBlob = await convertImage(item.file, 'image/jpeg', 0.9);
          outName = `${nameNoExt}.jpg`;
        } else if (operation === 'strip-exif') {
          outputBlob = await stripImageMetadata(item.file);
          outName = `${nameNoExt}_sanitized.jpg`;
        } else if (operation === 'compress-pdfs') {
          const res = await compressPdf(item.file, 'recommended');
          outputBlob = res.blob;
          outName = `${nameNoExt}_compressed.pdf`;
        } else if (operation === 'rotate-pdfs') {
          outputBlob = await rotatePdfPages(item.file, { angle: 90, scope: 'all' });
          outName = `${nameNoExt}_rotated.pdf`;
        } else {
          throw new Error('Unsupported batch operation');
        }

        item.status = 'completed';
        item.resultBlob = outputBlob;
        item.outputName = outName;
        completedFiles.push({ name: outName, blob: outputBlob });
      } catch (err: any) {
        item.status = 'error';
        item.errorMessage = err.message || 'Processing failed';
      }

      setItems([...updatedItems]);
    }

    if (completedFiles.length > 0) {
      const zip = await createZipArchive(completedFiles);
      setZipBlob(zip);
    }

    setIsProcessing(false);
  };

  const completedCount = items.filter((i) => i.status === 'completed').length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Batch Processing Queue ({items.length} files)
          </h3>
          <p className="text-xs text-slate-500">
            Apply automated transforms in bulk and export everything in a single ZIP file.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <button
              onClick={clearAll}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 text-xs font-semibold"
            >
              Clear Queue
            </button>
          )}

          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Files</span>
            <input
              type="file"
              multiple
              onChange={handleAddFiles}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="py-14 text-center max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Boxes className="w-7 h-7" />
          </div>
          <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            No files in queue
          </p>
          <p className="text-xs text-slate-400 mb-6">
            Drag and drop multiple images or PDFs, or click &ldquo;Add Files&rdquo; to begin bulk processing.
          </p>
          <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition">
            <span>Select Files for Batch</span>
            <input
              type="file"
              multiple
              onChange={handleAddFiles}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {/* Operation Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Select Batch Operation
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {[
                { id: 'compress-images', label: 'Compress Images' },
                { id: 'convert-webp', label: 'Convert to WebP' },
                { id: 'convert-jpg', label: 'Convert to JPG' },
                { id: 'strip-exif', label: 'Strip EXIF Data' },
                { id: 'compress-pdfs', label: 'Compress PDFs' },
                { id: 'rotate-pdfs', label: 'Rotate PDFs 90°' },
              ].map((op) => (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => setOperation(op.id as any)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-center transition ${
                    operation === op.id
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {op.label}
                </button>
              ))}
            </div>
          </div>

          {/* Progress Bar (if processing or completed) */}
          {(isProcessing || completedCount > 0) && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Progress: {completedCount} / {items.length} Files</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {item.file.name}
                    </p>
                    <p className="text-[11px] text-slate-500">{formatBytes(item.file.size)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {item.status === 'pending' && (
                    <span className="text-[11px] font-semibold text-slate-400">Ready</span>
                  )}
                  {item.status === 'processing' && (
                    <span className="text-[11px] font-semibold text-indigo-600 flex items-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processing
                    </span>
                  )}
                  {item.status === 'completed' && item.resultBlob && (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Done ({formatBytes(item.resultBlob.size)})
                      </span>
                      <button
                        onClick={() => triggerDownload(item.resultBlob!, item.outputName || 'file')}
                        className="p-1 text-slate-600 hover:text-indigo-600 dark:text-slate-300"
                        title="Download Individual File"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {item.status === 'error' && (
                    <span className="text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Error
                    </span>
                  )}

                  {!isProcessing && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Total Queue: {items.length} files ({formatBytes(items.reduce((a, b) => a + b.file.size, 0))})
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {zipBlob && (
                <button
                  onClick={() => triggerDownload(zipBlob, `nuvio_batch_${Date.now()}.zip`)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <FileArchive className="w-4 h-4" />
                  <span>Download All as ZIP ({formatBytes(zipBlob.size)})</span>
                </button>
              )}

              <button
                onClick={handleRunBatch}
                disabled={isProcessing || items.length === 0}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/20 transition disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Batch...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Batch Operation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
