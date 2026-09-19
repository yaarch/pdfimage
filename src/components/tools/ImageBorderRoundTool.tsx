import React, { useState, useEffect } from 'react';
import {
  Maximize2,
  Download,
  Image as ImageIcon,
  UploadCloud,
  Sparkles,
  Circle,
  Square,
  Palette,
  AlertCircle,
} from 'lucide-react';
import { applyImageBorderAndCorners, ImageBorderRoundOptions } from '../../lib/imageUtils';
import { triggerDownload, formatBytes } from '../../lib/zipUtils';

interface ImageBorderRoundToolProps {
  initialFiles?: File[];
}

export const ImageBorderRoundTool: React.FC<ImageBorderRoundToolProps> = ({ initialFiles = [] }) => {
  const [file, setFile] = useState<File | null>(initialFiles[0] || null);
  const [borderWidth, setBorderWidth] = useState(6);
  const [borderColor, setBorderColor] = useState('#4f46e5');
  const [cornerRadius, setCornerRadius] = useState(24);
  const [isCircle, setIsCircle] = useState(false);
  const [padding, setPadding] = useState(16);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      setFile(initialFiles[0]);
    }
  }, [initialFiles]);

  useEffect(() => {
    if (file) {
      renderFramePreview();
    }
  }, [file, borderWidth, borderColor, cornerRadius, isCircle, padding, backgroundColor]);

  const renderFramePreview = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const opts: ImageBorderRoundOptions = {
        borderWidth,
        borderColor,
        cornerRadius,
        isCircle,
        padding,
        backgroundColor,
        shadowBlur: 0,
        shadowColor: 'transparent',
      };

      const blob = await applyImageBorderAndCorners(file, opts);
      setResultBlob(blob);
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (err: any) {
      console.error(err);
      setError('Failed to frame image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const base = file.name.replace(/\.[^/.]+$/, '');
    triggerDownload(resultBlob, `${base}_framed.png`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
      {!file ? (
        <div className="py-12 text-center max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Maximize2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Choose an Image to Frame & Round
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Add borders, rounded corners, circular avatar crop, and background padding.
          </p>
          <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition">
            <span>Choose Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="space-y-6">
          {/* File bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                  {file.name}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  {formatBytes(file.size)}
                </p>
              </div>
            </div>

            <label className="cursor-pointer px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition">
              <span>Change Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Controls */}
            <div className="lg:col-span-5 space-y-4">
              {/* Shape Toggle */}
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                <button
                  onClick={() => setIsCircle(false)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    !isCircle
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Rounded Rectangle</span>
                </button>
                <button
                  onClick={() => setIsCircle(true)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    isCircle
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Circle className="w-3.5 h-3.5" />
                  <span>Circle Avatar</span>
                </button>
              </div>

              {!isCircle && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Corner Radius ({cornerRadius}px)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="120"
                    value={cornerRadius}
                    onChange={(e) => setCornerRadius(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              )}

              {/* Border settings */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Border Width ({borderWidth}px)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={borderWidth}
                      onChange={(e) => setBorderWidth(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Border Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={borderColor}
                        onChange={(e) => setBorderColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-xs font-mono">{borderColor}</span>
                    </div>
                  </div>
                </div>

                {/* Padding & Background */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/80 dark:border-slate-700/80">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Padding ({padding}px)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      value={padding}
                      onChange={(e) => setPadding(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Background
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-xs font-mono">{backgroundColor}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDownload}
                disabled={!resultBlob}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Framed PNG</span>
              </button>
            </div>

            {/* Live Preview */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/50 p-4 min-h-[350px]">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Framed preview"
                  className="max-h-[420px] max-w-full rounded-lg shadow-sm object-contain"
                />
              ) : (
                <div className="text-center text-slate-400 text-xs">
                  Generating framed preview...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
