import React, { useState, useEffect } from 'react';
import {
  Scaling,
  Download,
  AlertCircle,
  Sparkles,
  RefreshCw,
  UploadCloud,
  Lock,
  Unlock,
} from 'lucide-react';
import { resizeImage, getImageDimensions, ImageDimensions } from '../../lib/imageUtils';
import { triggerDownload, formatBytes } from '../../lib/zipUtils';

interface ImageResizeToolProps {
  initialFiles?: File[];
}

export const ImageResizeTool: React.FC<ImageResizeToolProps> = ({ initialFiles = [] }) => {
  const [file, setFile] = useState<File | null>(
    initialFiles.find((f) => f.type.startsWith('image/')) || initialFiles[0] || null
  );

  useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      const img = initialFiles.find((f) => f.type.startsWith('image/')) || initialFiles[0];
      if (img) {
        setFile(img);
        setResult(null);
        setError(null);
      }
    }
  }, [initialFiles]);
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [mode, setMode] = useState<'exact' | 'percentage'>('exact');
  const [percentage, setPercentage] = useState(50);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    blob: Blob;
    width: number;
    height: number;
    newSize: number;
    previewUrl: string;
  } | null>(null);

  useEffect(() => {
    if (file) {
      getImageDimensions(file)
        .then((dim) => {
          setDimensions(dim);
          setWidth(dim.width);
          setHeight(dim.height);
        })
        .catch(() => setError('Unable to detect image dimensions'));
    }
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockAspectRatio && dimensions && dimensions.width > 0) {
      setHeight(Math.round((val * dimensions.height) / dimensions.width));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockAspectRatio && dimensions && dimensions.height > 0) {
      setWidth(Math.round((val * dimensions.width) / dimensions.height));
    }
  };

  const handleResize = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const res = await resizeImage(file, {
        mode,
        width,
        height,
        percentage,
        maintainAspectRatio: lockAspectRatio,
      });

      const previewUrl = URL.createObjectURL(res.blob);
      setResult({
        ...res,
        previewUrl,
      });
    } catch (err: any) {
      console.error(err);
      setError('Failed to resize image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const base = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const ext = file.name.split('.').pop() || 'jpg';
    triggerDownload(result.blob, `${base}_${result.width}x${result.height}.${ext}`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
      {!file ? (
        <div className="py-12 text-center max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Choose an Image to Resize
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Change pixel dimensions or scale your image by percentage.
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
                Target Image
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white truncate max-w-md">
                {file.name}
              </h3>
              <p className="text-xs text-slate-500">
                {dimensions ? `${dimensions.width} × ${dimensions.height} px` : 'Loading...'} &bull;{' '}
                {formatBytes(file.size)}
              </p>
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

          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setMode('exact')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                mode === 'exact'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Exact Pixel Dimensions
            </button>
            <button
              type="button"
              onClick={() => setMode('percentage')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                mode === 'percentage'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Percentage Scale
            </button>
          </div>

          {mode === 'exact' ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Width (px)
                </label>
                <input
                  type="number"
                  min={1}
                  value={width || ''}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-sm font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-center pb-2">
                <button
                  type="button"
                  onClick={() => setLockAspectRatio(!lockAspectRatio)}
                  className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                    lockAspectRatio
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-300 text-indigo-600'
                      : 'border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}
                  title={lockAspectRatio ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
                >
                  {lockAspectRatio ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  <span className="text-[11px] hidden sm:inline">Ratio Locked</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Height (px)
                </label>
                <input
                  type="number"
                  min={1}
                  value={height || ''}
                  onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-sm font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Scale Factor</span>
                <span className="font-mono text-indigo-600">{percentage}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                step="5"
                value={percentage}
                onChange={(e) => setPercentage(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex gap-2">
                {[25, 50, 75, 100, 150, 200].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setPercentage(pct)}
                    className={`px-3 py-1 text-xs rounded-lg border ${
                      percentage === pct
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleResize}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm shadow-indigo-600/20 transition disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Resizing...</span>
                </>
              ) : (
                <>
                  <Scaling className="w-4 h-4" />
                  <span>Resize Image</span>
                </>
              )}
            </button>
          </div>

          {result && (
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Image Resized Successfully!
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  New size: <span className="font-bold text-slate-700 dark:text-slate-300">{result.width} &times; {result.height} px</span> &bull; {formatBytes(result.newSize)}
                </p>
              </div>

              <button
                onClick={handleDownload}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Resized Image</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
