import React, { useState } from 'react';
import {
  Stamp,
  Download,
  AlertCircle,
  Sparkles,
  RefreshCw,
  UploadCloud,
} from 'lucide-react';
import { addWatermarkToPdf } from '../../lib/pdfUtils';
import { triggerDownload, formatBytes } from '../../lib/zipUtils';

interface PdfWatermarkToolProps {
  initialFiles?: File[];
}

export const PdfWatermarkTool: React.FC<PdfWatermarkToolProps> = ({ initialFiles = [] }) => {
  const [file, setFile] = useState<File | null>(initialFiles[0] || null);
  const [text, setText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.25);
  const [size, setSize] = useState(48);
  const [angle, setAngle] = useState(45);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  React.useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      setFile(initialFiles[0]);
      setResultBlob(null);
      setError(null);
    }
  }, [initialFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResultBlob(null);
      setError(null);
    }
  };

  const handleApply = async () => {
    if (!file || !text.trim()) return;
    setIsProcessing(true);
    setError(null);

    try {
      const blob = await addWatermarkToPdf(file, {
        text,
        opacity,
        size,
        angle,
      });
      setResultBlob(blob);
    } catch (err: any) {
      console.error(err);
      setError('Failed to apply watermark to document.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const base = file.name.replace(/\.pdf$/i, '');
    triggerDownload(resultBlob, `${base}_watermarked.pdf`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
      {!file ? (
        <div className="py-12 text-center max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Choose a PDF to Watermark
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Add custom text stamps, confidentiality marks, or copyright overlays.
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
                Selected Document
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Watermark Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Watermark Text
                </label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="e.g. CONFIDENTIAL, DRAFT, DO NOT COPY"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {['CONFIDENTIAL', 'DRAFT', 'COPYRIGHT', 'SAMPLE'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setText(preset)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Opacity</span>
                  <span>{Math.round(opacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.8"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Font Size</span>
                  <span>{size}pt</span>
                </div>
                <input
                  type="range"
                  min="24"
                  max="72"
                  step="2"
                  value={size}
                  onChange={(e) => setSize(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Visual Simulated Preview */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
              <span className="absolute top-2 left-3 text-[10px] uppercase font-bold text-slate-400">
                Live Layout Simulation
              </span>

              <div className="w-48 h-64 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-4 relative flex items-center justify-center overflow-hidden">
                <div className="w-full space-y-2 opacity-25">
                  <div className="h-1.5 bg-slate-400 rounded w-1/2" />
                  <div className="h-1 bg-slate-300 rounded w-full" />
                  <div className="h-1 bg-slate-300 rounded w-5/6" />
                  <div className="h-1 bg-slate-300 rounded w-4/6" />
                  <div className="h-1 bg-slate-300 rounded w-full" />
                </div>

                <div
                  className="absolute font-extrabold uppercase pointer-events-none select-none text-rose-500 tracking-wider text-center"
                  style={{
                    transform: `rotate(-${angle}deg)`,
                    opacity,
                    fontSize: `${size / 3}px`,
                  }}
                >
                  {text || 'PREVIEW'}
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            {resultBlob ? (
              <button
                onClick={handleDownload}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Watermarked PDF ({formatBytes(resultBlob.size)})</span>
              </button>
            ) : (
              <button
                onClick={handleApply}
                disabled={isProcessing || !text.trim()}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm shadow-indigo-600/20 transition disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Applying Stamp...</span>
                  </>
                ) : (
                  <>
                    <Stamp className="w-4 h-4" />
                    <span>Apply Watermark</span>
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
