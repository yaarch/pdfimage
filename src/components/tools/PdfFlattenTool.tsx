import React, { useState } from 'react';
import {
  Lock,
  Download,
  AlertCircle,
  RefreshCw,
  UploadCloud,
  CheckCircle2,
  FileCheck2,
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { triggerDownload, formatBytes } from '../../lib/zipUtils';

interface PdfFlattenToolProps {
  initialFiles?: File[];
}

export const PdfFlattenTool: React.FC<PdfFlattenToolProps> = ({ initialFiles = [] }) => {
  const [file, setFile] = useState<File | null>(initialFiles[0] || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flattenedBlob, setFlattenedBlob] = useState<Blob | null>(null);

  React.useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      setFile(initialFiles[0]);
      setFlattenedBlob(null);
      setError(null);
    }
  }, [initialFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFlattenedBlob(null);
      setError(null);
    }
  };

  const handleFlatten = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

      try {
        const form = pdfDoc.getForm();
        form.flatten();
      } catch (e) {
        // Document might not have interactive form fields, proceed with saving stream optimization
      }

      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setFlattenedBlob(blob);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to flatten PDF document.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
      {!file ? (
        <div className="py-12 text-center max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <FileCheck2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Flatten PDF Form Fields
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Lock interactive forms, checkboxes, and text inputs into read-only permanent vector pages.
          </p>
          <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition">
            <UploadCloud className="w-4 h-4" />
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

          <div className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-600" />
              <span>Permanent Form Locking</span>
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Flattening bakes filled form values, text fields, radio buttons, and annotations into the document pages, preventing subsequent tampering or accidental editing when submitting official applications or contracts.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500">Client-side PDF Flatten Engine</span>
            <button
              onClick={handleFlatten}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Flattening Document...</span>
                </>
              ) : (
                <>
                  <FileCheck2 className="w-4 h-4" />
                  <span>Flatten & Lock PDF</span>
                </>
              )}
            </button>
          </div>

          {flattenedBlob && (
            <div className="mt-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Document Flattened Successfully!
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    File size: {formatBytes(flattenedBlob.size)} &bull; Form fields permanently locked.
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  triggerDownload(flattenedBlob, file.name.replace(/\.pdf$/i, '_flattened.pdf'))
                }
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Flattened PDF</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
