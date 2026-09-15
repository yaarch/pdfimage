import React, { useState, useEffect } from 'react';
import {
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Download,
  AlertCircle,
  Sparkles,
  RefreshCw,
  UploadCloud,
} from 'lucide-react';
import { rotateFlipImage } from '../../lib/imageUtils';
import { triggerDownload, formatBytes } from '../../lib/zipUtils';

interface ImageRotateFlipToolProps {
  initialFiles?: File[];
}

export const ImageRotateFlipTool: React.FC<ImageRotateFlipToolProps> = ({ initialFiles = [] }) => {
  const [file, setFile] = useState<File | null>(
    initialFiles.find((f) => f.type.startsWith('image/')) || initialFiles[0] || null
  );

  useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      const img = initialFiles.find((f) => f.type.startsWith('image/')) || initialFiles[0];
      if (img) {
        setFile(img);
        setResultBlob(null);
        setError(null);
      }
    }
  }, [initialFiles]);
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setResultBlob(null);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleApply = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const blob = await rotateFlipImage(file, rotation, flipH, flipV);
      setResultBlob(blob);
    } catch (err: any) {
      console.error(err);
      setError('Failed to transform image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const base = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const ext = file.name.split('.').pop() || 'jpg';
    triggerDownload(resultBlob, `${base}_transformed.${ext}`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
      {!file ? (
        <div className="py-12 text-center max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Choose an Image to Rotate or Mirror
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Fix upside-down photos or flip horizontally/vertically without server uploads.
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
              <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Live Interactive Canvas/Image Preview */}
            <div className="h-64 sm:h-80 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-center overflow-hidden relative">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Transform Preview"
                  className="max-h-full max-w-full object-contain rounded transition-transform duration-200"
                  style={{
                    transform: `rotate(${rotation}deg) scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`,
                  }}
                />
              )}
            </div>

            {/* Transform Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Rotate
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>Rotate +90°</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRotation((r) => (r + 270) % 360)}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Rotate -90°</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Flip & Mirror
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFlipH(!flipH)}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                      flipH
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <FlipHorizontal className="w-4 h-4" />
                    <span>Flip Horizontal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlipV(!flipV)}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                      flipV
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <FlipVertical className="w-4 h-4" />
                    <span>Flip Vertical</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                {resultBlob ? (
                  <button
                    onClick={handleDownload}
                    className="w-full px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Transformed Image</span>
                  </button>
                ) : (
                  <button
                    onClick={handleApply}
                    disabled={isProcessing}
                    className="w-full px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/20 transition disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Rendering...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Apply & Render Image</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
