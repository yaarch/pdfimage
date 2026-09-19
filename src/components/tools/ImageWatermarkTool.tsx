import React, { useState, useEffect } from 'react';
import {
  Stamp,
  Download,
  Image as ImageIcon,
  UploadCloud,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Type,
  Grid,
} from 'lucide-react';
import { applyImageWatermark, ImageWatermarkOptions } from '../../lib/imageUtils';
import { triggerDownload, formatBytes } from '../../lib/zipUtils';

interface ImageWatermarkToolProps {
  initialFiles?: File[];
}

export const ImageWatermarkTool: React.FC<ImageWatermarkToolProps> = ({ initialFiles = [] }) => {
  const [file, setFile] = useState<File | null>(initialFiles[0] || null);
  const [type, setType] = useState<'text' | 'image'>('text');
  const [text, setText] = useState('© COPYRIGHT');
  const [textColor, setTextColor] = useState('#ffffff');
  const [opacity, setOpacity] = useState(0.4);
  const [fontSize, setFontSize] = useState(36);
  const [rotation, setRotation] = useState(-30);
  const [position, setPosition] = useState<'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'tile'>('center');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoScale, setLogoScale] = useState(25);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      setFile(initialFiles[0]);
    }
  }, [initialFiles]);

  useEffect(() => {
    if (file) {
      updateWatermarkPreview();
    }
  }, [file, type, text, textColor, opacity, fontSize, rotation, position, logoFile, logoScale]);

  const updateWatermarkPreview = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const opts: ImageWatermarkOptions = {
        type,
        text,
        textColor,
        opacity,
        fontSize,
        rotation,
        position,
        logoFile: logoFile || undefined,
        logoScalePercent: logoScale,
      };

      const blob = await applyImageWatermark(file, opts);
      setResultBlob(blob);
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (err: any) {
      console.error(err);
      setError('Failed to watermark image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const base = file.name.replace(/\.[^/.]+$/, '');
    triggerDownload(resultBlob, `${base}_watermarked.jpg`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
      {!file ? (
        <div className="py-12 text-center max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Stamp className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Choose an Image to Watermark
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Add text stamps, copyright marks, or custom company logos securely in your browser.
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
                  {formatBytes(file.size)} • {resultBlob ? `Output: ${formatBytes(resultBlob.size)}` : ''}
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
              {/* Type Switcher */}
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                <button
                  onClick={() => setType('text')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    type === 'text'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Type className="w-3.5 h-3.5" />
                  <span>Text Watermark</span>
                </button>
                <button
                  onClick={() => setType('image')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    type === 'image'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Logo / Image</span>
                </button>
              </div>

              {type === 'text' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Watermark Text
                    </label>
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="e.g. © MY BRAND 2026"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Font Size ({fontSize}px)
                      </label>
                      <input
                        type="range"
                        min="16"
                        max="96"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Text Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                        />
                        <span className="text-xs font-mono">{textColor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="cursor-pointer block border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 block">
                      {logoFile ? logoFile.name : 'Upload Logo Stamp (PNG/SVG)'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && setLogoFile(e.target.files[0])}
                      className="hidden"
                    />
                  </label>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Logo Size ({logoScale}%)
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="60"
                      value={logoScale}
                      onChange={(e) => setLogoScale(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                </div>
              )}

              {/* Opacity & Rotation */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Opacity ({Math.round(opacity * 100)}%)
                  </label>
                  <input
                    type="range"
                    min="0.05"
                    max="1"
                    step="0.05"
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Rotation ({rotation}°)
                  </label>
                  <input
                    type="range"
                    min="-90"
                    max="90"
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>

              {/* Position selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Position & Layout
                </label>
                <div className="grid grid-cols-3 gap-2 text-[11px] font-semibold">
                  {[
                    { id: 'center', label: 'Center' },
                    { id: 'top-left', label: 'Top Left' },
                    { id: 'top-right', label: 'Top Right' },
                    { id: 'bottom-left', label: 'Bottom Left' },
                    { id: 'bottom-right', label: 'Bottom Right' },
                    { id: 'tile', label: 'Tile Repeat' },
                  ].map((pos) => (
                    <button
                      key={pos.id}
                      onClick={() => setPosition(pos.id as any)}
                      className={`p-2 rounded-xl border text-center transition ${
                        position === pos.id
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleDownload}
                disabled={!resultBlob}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Watermarked Image</span>
              </button>
            </div>

            {/* Live Preview Canvas / Image */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/50 p-4 min-h-[350px]">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Watermark preview"
                  className="max-h-[420px] max-w-full rounded-lg shadow-xs object-contain"
                />
              ) : (
                <div className="text-center text-slate-400 text-xs">
                  Generating live preview...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
