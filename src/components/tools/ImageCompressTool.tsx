import React, { useState } from 'react';
import {
  Minimize2,
  Download,
  AlertCircle,
  Sparkles,
  RefreshCw,
  UploadCloud,
  CheckCircle,
} from 'lucide-react';
import { compressImage } from '../../lib/imageUtils';
import { triggerDownload, formatBytes } from '../../lib/zipUtils';

interface ImageCompressToolProps {
  initialFiles?: File[];
}

export const ImageCompressTool: React.FC<ImageCompressToolProps> = ({ initialFiles = [] }) => {
  const [file, setFile] = useState<File | null>(
    initialFiles.find((f) => f.type.startsWith('image/')) || initialFiles[0] || null
  );
  const [quality, setQuality] = useState<number>(0.75);
  const [maxDimension, setMaxDimension] = useState<number>(1920);
  const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    blob: Blob;
    originalSize: number;
    newSize: number;
    savings: number;
    width: number;
    height: number;
    previewUrl: string;
  } | null>(null);

  React.useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      const img = initialFiles.find((f) => f.type.startsWith('image/')) || initialFiles[0];
      if (img) {
        setFile(img);
        setResult(null);
        setError(null);
      }
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
      const res = await compressImage(file, {
        quality,
        maxDimension: maxDimension === 0 ? undefined : maxDimension,
        targetFormat,
      });

      const previewUrl = URL.createObjectURL(res.blob);
      setResult({
        ...res,
        previewUrl,
      });
    } catch (err: any) {
      console.error(err);
      setError('Failed to compress image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const ext = targetFormat === 'image/png' ? 'png' : targetFormat === 'image/webp' ? 'webp' : 'jpg';
    const base = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    triggerDownload(result.blob, `${base}_compressed.${ext}`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
      {!file ? (
        <div className="py-12 text-center max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Choose an Image to Compress
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Optimize JPEG, PNG, or WebP file sizes while keeping crisp visual clarity.
          </p>
          <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition">
            <span>Choose Image</span>
            <input
              type="file"
              accept="image/*"
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
                Selected Image
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white truncate max-w-md">
                {file.name}
              </h3>
              <p className="text-xs text-slate-500">Original Size: {formatBytes(file.size)}</p>
            </div>
            <label className="cursor-pointer text-xs font-medium text-indigo-600 hover:underline">
              Change Image
              <input
                type="file"
                accept="image/*"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Compression Settings */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span>Compression Quality</span>
                  <span className="text-indigo-600 font-mono">{Math.round(quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Smallest Size (10%)</span>
                  <span>Recommended (75%)</span>
                  <span>Near Lossless (100%)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Max Resolution Constraint
                  </label>
                  <select
                    value={maxDimension}
                    onChange={(e) => setMaxDimension(parseInt(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  >
                    <option value={1920}>Full HD (1920px max)</option>
                    <option value={1280}>HD Ready (1280px max)</option>
                    <option value={2560}>2K QHD (2560px max)</option>
                    <option value={0}>Original Resolution (No resize)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Output Format
                  </label>
                  <select
                    value={targetFormat}
                    onChange={(e) => setTargetFormat(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="image/jpeg">JPEG (Universal / Smallest)</option>
                    <option value="image/webp">WebP (Modern High-Efficiency)</option>
                    <option value="image/png">PNG (Lossless / Transparency)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Live action trigger */}
            <div className="flex flex-col justify-end">
              <button
                onClick={handleCompress}
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/20 transition disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Compressing Image...</span>
                  </>
                ) : (
                  <>
                    <Minimize2 className="w-4 h-4" />
                    <span>Compress Image Now</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Result Card */}
          {result && (
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 rounded-3xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <img
                    src={result.previewUrl}
                    alt="Optimized Preview"
                    className="w-20 h-20 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Compression Success!
                      </h4>
                      {result.savings > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs">
                          -{result.savings}% smaller
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span>{formatBytes(result.originalSize)}</span>
                      <span>&rarr;</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {formatBytes(result.newSize)}
                      </span>
                      <span>&bull;</span>
                      <span>{result.width} &times; {result.height} px</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Optimized Image</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
