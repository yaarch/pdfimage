import React, { useState } from 'react';
import {
  Download,
  AlertCircle,
  Sparkles,
  RefreshCw,
  UploadCloud,
  FileArchive,
} from 'lucide-react';
import { loadPdfJsDocument, renderPdfJsPageToCanvas } from '../../lib/pdfUtils';
import { createZipArchive, triggerDownload, formatBytes } from '../../lib/zipUtils';
import { useTranslation } from '../../i18n/context';

interface PdfToImagesToolProps {
  initialFiles?: File[];
}

interface RenderedPage {
  pageNumber: number;
  dataUrl: string;
  blob: Blob;
}

export const PdfToImagesTool: React.FC<PdfToImagesToolProps> = ({ initialFiles = [] }) => {
  const { t } = useTranslation();
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
      // Load PDF document directly once via Mozilla PDF.js
      const pdfDoc = await loadPdfJsDocument(buffer);
      const total = pdfDoc.numPages;

      if (!total || total === 0) {
        throw new Error('PDF document has no pages to convert.');
      }

      setProgress({ current: 0, total });

      const results: RenderedPage[] = [];
      const zipFiles: { name: string; blob: Blob }[] = [];
      const base = file.name.replace(/\.pdf$/i, '') || 'document';
      const ext = format === 'image/jpeg' ? 'jpg' : 'png';
      const mimeType = format === 'image/jpeg' ? 'image/jpeg' : 'image/png';
      const quality = format === 'image/jpeg' ? 0.92 : undefined;

      for (let i = 1; i <= total; i++) {
        setProgress({ current: i, total });
        const page = await pdfDoc.getPage(i);
        const canvas = await renderPdfJsPageToCanvas(page, scale);

        // Verify valid canvas dimensions
        if (!canvas.width || !canvas.height) {
          throw new Error(`Failed to calculate valid dimensions for page ${i}`);
        }

        // Verify that the generated image contains actual rendered pixels
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Failed to acquire 2D canvas context');
        }

        // Convert canvas to image Blob with strict non-null & non-zero size checks
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => {
              if (b && b.size > 0) {
                resolve(b);
              } else {
                reject(new Error(`Failed to generate ${ext.toUpperCase()} blob for page ${i}`));
              }
            },
            mimeType,
            quality
          );
        });

        const dataUrl = canvas.toDataURL(mimeType, quality);
        const fileName = `${base}_page_${i}.${ext}`;

        results.push({
          pageNumber: i,
          dataUrl,
          blob,
        });

        zipFiles.push({
          name: fileName,
          blob,
        });

        // Release page resources
        if (typeof (page as any).cleanup === 'function') {
          (page as any).cleanup();
        }
      }

      setRenderedPages(results);

      // Create ZIP archive for multi-page downloads
      if (zipFiles.length > 0) {
        const zip = await createZipArchive(zipFiles);
        if (zip && zip.size > 0) {
          setZipBlob(zip);
        }
      }

      // Cleanup document resources
      if (typeof pdfDoc.destroy === 'function') {
        pdfDoc.destroy();
      }
    } catch (err: any) {
      console.error('PDF to Images error:', err);
      const msg = (err?.message || '').toLowerCase();
      if (msg.includes('password') || err?.name === 'PasswordException') {
        setError('The PDF document is password-protected and cannot be converted without a password.');
      } else if (msg.includes('corrupted') || msg.includes('invalid pdf') || msg.includes('formaterror')) {
        setError('The selected PDF file is corrupted or formatted incorrectly.');
      } else if (msg.includes('memory') || msg.includes('out of memory')) {
        setError('Device memory limit reached. Try converting with standard DPI resolution.');
      } else {
        setError(t.pdfToImagesExtractError);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Interactive Tool Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        {!file ? (
          <div className="py-12 text-center max-w-sm mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <UploadCloud className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              {t.pdfToImagesChooseFile}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              {t.pdfToImagesChooseDesc}
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
                  {t.pdfToImagesSourceDocument}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white truncate max-w-md">
                  {file.name}
                </h3>
                <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.pdfToImagesOutputFormat}
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                >
                  <option value="image/jpeg">{t.pdfToImagesJpgOption}</option>
                  <option value="image/png">{t.pdfToImagesPngOption}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.pdfToImagesClarityDpi}
                </label>
                <select
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                >
                  <option value={1.5}>{t.pdfToImagesDpiStandard}</option>
                  <option value={2}>{t.pdfToImagesDpiHigh}</option>
                  <option value={3}>{t.pdfToImagesDpiUltra}</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleConvert}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm shadow-indigo-600/20 transition disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>
                      {t.pdfToImagesRenderingProgress} {progress.current} {t.pdfToImagesOf} {progress.total}...
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{t.pdfToImagesConvertBtn}</span>
                  </>
                )}
              </button>
            </div>

            {renderedPages.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {t.pdfToImagesConvertedPages} ({renderedPages.length})
                  </h4>
                  {zipBlob && (
                    <button
                      onClick={() =>
                        triggerDownload(
                          zipBlob,
                          `${file.name.replace(/\.pdf$/i, '')}_all_pages.zip`
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition self-start sm:self-auto cursor-pointer"
                    >
                      <FileArchive className="w-4 h-4" />
                      <span>{t.pdfToImagesDownloadZip} ({formatBytes(zipBlob.size)})</span>
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
                          className="p-1 rounded text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 cursor-pointer"
                          title={t.pdfToImagesDownloadSingle}
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

      {/* 1. How to Convert PDF to Images Section */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-1.5">
            {t.pdfToImagesHowToTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t.pdfToImagesHowToSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-bold text-xs flex items-center justify-center mb-3">
                1
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                {t.pdfToImagesStep1Title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {t.pdfToImagesStep1Desc}
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-bold text-xs flex items-center justify-center mb-3">
                2
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                {t.pdfToImagesStep2Title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {t.pdfToImagesStep2Desc}
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-bold text-xs flex items-center justify-center mb-3">
                3
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                {t.pdfToImagesStep3Title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {t.pdfToImagesStep3Desc}
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-bold text-xs flex items-center justify-center mb-3">
                4
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                {t.pdfToImagesStep4Title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {t.pdfToImagesStep4Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. JPG vs PNG Comparison Section */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-1.5">
            {t.pdfToImagesCompareTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t.pdfToImagesCompareSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* JPG Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {t.pdfToImagesJpgTitle}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                  {t.pdfToImagesJpgBadge}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.pdfToImagesJpgDesc}
              </p>
            </div>
          </div>

          {/* PNG Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {t.pdfToImagesPngTitle}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300">
                  {t.pdfToImagesPngBadge}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.pdfToImagesPngDesc}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
