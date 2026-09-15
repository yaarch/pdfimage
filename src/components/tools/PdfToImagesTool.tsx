import React, { useState } from 'react';
import {
  FileImage,
  Download,
  AlertCircle,
  Sparkles,
  RefreshCw,
  UploadCloud,
  FileArchive,
  Eye,
} from 'lucide-react';
import { renderPdfPageToCanvas } from '../../lib/pdfUtils';
import { createZipArchive, triggerDownload, formatBytes } from '../../lib/zipUtils';
import { PDFDocument } from 'pdf-lib';

interface PdfToImagesToolProps {
  initialFiles?: File[];
}

interface RenderedPage {
  pageNumber: number;
  dataUrl: string;
  blob: Blob;
}

export const PdfToImagesTool: React.FC<PdfToImagesToolProps> = ({ initialFiles = [] }) => {
  const [file, setFile] = useState<File | null>(initialFiles[0] || null);
  const [format, setFormat] = useState<'image/jpeg' | 'image/png'>('image/jpeg');
  const [scale, setScale] = useState<number>(2); // 2x for sharp retina rendering
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [renderedPages, setRenderedPages] = useState<RenderedPage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);

  React.useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      setFile(initialFiles[0]);
      setRenderedPages([]);
      setZipBlob(null);
      setError(null);
    }
  }, [initialFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setRenderedPages([]);
      setZipBlob(null);
      setError(null);
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    setRenderedPages([]);
    setZipBlob(null);

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer);
      const total = pdfDoc.getPageCount();
      setProgress({ current: 0, total });

      const results: RenderedPage[] = [];
      const zipFiles: { name: string; blob: Blob }[] = [];
      const base = file.name.replace(/\.pdf$/i, '');
      const ext = format === 'image/jpeg' ? 'jpg' : 'png';

      for (let i = 0; i < total; i++) {
        setProgress({ current: i + 1, total });
        const canvas = await renderPdfPageToCanvas(buffer, i, scale);

        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => {
              if (b) resolve(b);
              else reject(new Error('Canvas to blob failed'));
            },
            format,
            0.92
          );
        });

        const dataUrl = canvas.toDataURL(format, 0.92);
        const fileName = `${base}_page_${i + 1}.${ext}`;

        results.push({
          pageNumber: i + 1,
          dataUrl,
          blob,
        });

        zipFiles.push({
          name: fileName,
          blob,
        });
      }

      setRenderedPages(results);

      // Create ZIP archive
      const zip = await createZipArchive(zipFiles);
      setZipBlob(zip);
    } catch (err: any) {
      console.error(err);
      setError('Failed to extract images from PDF. The document may be password-protected or corrupted.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
      {!file ? (
        <div className="py-12 text-center max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Choose a PDF to Convert to Images
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Render every page into high-resolution JPG or PNG pictures directly in your browser.
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
                Source Document
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Output Image Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              >
                <option value="image/jpeg">JPG (Standard photo format, small size)</option>
                <option value="image/png">PNG (Lossless clarity for text & diagrams)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Render Clarity (DPI Scale)
              </label>
              <select
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              >
                <option value={1.5}>Standard 150 DPI</option>
                <option value={2}>High Resolution 200 DPI (Recommended)</option>
                <option value={3}>Ultra Print 300 DPI</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleConvert}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm shadow-indigo-600/20 transition disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>
                    Rendering Page {progress.current} of {progress.total}...
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Convert All Pages to Images</span>
                </>
              )}
            </button>
          </div>

          {renderedPages.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Converted Pages ({renderedPages.length})
                </h4>
                {zipBlob && (
                  <button
                    onClick={() =>
                      triggerDownload(
                        zipBlob,
                        `${file.name.replace(/\.pdf$/i, '')}_all_pages.zip`
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition self-start sm:self-auto"
                  >
                    <FileArchive className="w-4 h-4" />
                    <span>Download All as ZIP ({formatBytes(zipBlob.size)})</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {renderedPages.map((page) => (
                  <div
                    key={page.pageNumber}
                    className="p-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col justify-between"
                  >
                    <div className="aspect-[3/4] bg-white rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 mb-2 flex items-center justify-center">
                      <img
                        src={page.dataUrl}
                        alt={`Page ${page.pageNumber}`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        P.{page.pageNumber}
                      </span>
                      <button
                        onClick={() =>
                          triggerDownload(
                            page.blob,
                            `${file.name.replace(/\.pdf$/i, '')}_p${page.pageNumber}.${
                              format === 'image/jpeg' ? 'jpg' : 'png'
                            }`
                          )
                        }
                        className="p-1 rounded text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                        title="Download Page Image"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
