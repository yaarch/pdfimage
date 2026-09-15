import React, { useState, useEffect, useRef } from 'react';
import {
  Sliders,
  Download,
  RotateCcw,
  Sparkles,
  UploadCloud,
  CheckCircle2,
} from 'lucide-react';
import { triggerDownload, formatBytes } from '../../lib/zipUtils';

interface ImageFilterToolProps {
  initialFiles?: File[];
}

interface FilterSettings {
  brightness: number; // 0 to 200 (100 standard)
  contrast: number; // 0 to 200 (100 standard)
  saturation: number; // 0 to 200 (100 standard)
  grayscale: number; // 0 to 100
  sepia: number; // 0 to 100
  invert: number; // 0 to 100
  blur: number; // 0 to 10px
}

const DEFAULT_FILTERS: FilterSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  grayscale: 0,
  sepia: 0,
  invert: 0,
  blur: 0,
};

export const ImageFilterTool: React.FC<ImageFilterToolProps> = ({ initialFiles = [] }) => {
  const [file, setFile] = useState<File | null>(initialFiles[0] || null);
  const [filters, setFilters] = useState<FilterSettings>(DEFAULT_FILTERS);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      const img = initialFiles.find((f) => f.type.startsWith('image/')) || initialFiles[0];
      if (img) {
        setFile(img);
        setFilters(DEFAULT_FILTERS);
      }
    }
  }, [initialFiles]);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!file) return;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      setImageObj(img);
    };
    img.src = url;
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  useEffect(() => {
    if (!imageObj || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = imageObj.naturalWidth;
    canvas.height = imageObj.naturalHeight;

    const filterString = `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      saturate(${filters.saturation}%)
      grayscale(${filters.grayscale}%)
      sepia(${filters.sepia}%)
      invert(${filters.invert}%)
      blur(${filters.blur}px)
    `.trim();

    ctx.filter = filterString;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imageObj, 0, 0);
  }, [imageObj, filters]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFilters(DEFAULT_FILTERS);
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current || !file) return;
    setIsProcessing(true);

    canvasRef.current.toBlob(
      (blob) => {
        setIsProcessing(false);
        if (blob) {
          const ext = file.name.split('.').pop() || 'png';
          const name = file.name.replace(/\.[^/.]+$/, '') + `_edited.${ext}`;
          triggerDownload(blob, name);
        }
      },
      file.type.includes('png') ? 'image/png' : 'image/jpeg',
      0.95
    );
  };

  const updateFilter = (key: keyof FilterSettings, value: number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
      {!file ? (
        <div className="py-12 text-center max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center mx-auto mb-4">
            <Sliders className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Photo Filters & Adjustments
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Adjust brightness, contrast, saturation, sepia, and filters with instant preview.
          </p>
          <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition">
            <UploadCloud className="w-4 h-4" />
            <span>Select Image File</span>
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
              <span className="text-xs text-sky-600 font-semibold uppercase tracking-wider">
                Photo Editor
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white truncate max-w-md">
                {file.name}
              </h3>
              <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
              <label className="cursor-pointer text-xs font-medium text-sky-600 hover:underline">
                Change File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Live Canvas Preview */}
            <div className="lg:col-span-7 bg-slate-950/80 rounded-2xl p-4 border border-slate-800 flex items-center justify-center min-h-[320px] max-h-[500px] overflow-hidden">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[460px] object-contain rounded-lg shadow-lg"
              />
            </div>

            {/* Filter Controls */}
            <div className="lg:col-span-5 space-y-4">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-sky-600" />
                <span>Adjust Parameters</span>
              </h4>

              <div className="space-y-3 bg-slate-50/60 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Brightness</span>
                    <span className="font-mono text-sky-600">{filters.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.brightness}
                    onChange={(e) => updateFilter('brightness', Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Contrast</span>
                    <span className="font-mono text-sky-600">{filters.contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.contrast}
                    onChange={(e) => updateFilter('contrast', Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Saturation</span>
                    <span className="font-mono text-sky-600">{filters.saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.saturation}
                    onChange={(e) => updateFilter('saturation', Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Grayscale</span>
                    <span className="font-mono text-sky-600">{filters.grayscale}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.grayscale}
                    onChange={(e) => updateFilter('grayscale', Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Sepia Vintage</span>
                    <span className="font-mono text-sky-600">{filters.sepia}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.sepia}
                    onChange={(e) => updateFilter('sepia', Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Invert Colors</span>
                    <span className="font-mono text-sky-600">{filters.invert}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.invert}
                    onChange={(e) => updateFilter('invert', Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Soft Blur</span>
                    <span className="font-mono text-sky-600">{filters.blur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={filters.blur}
                    onChange={(e) => updateFilter('blur', Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>
              </div>

              <button
                onClick={handleDownload}
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>Export Edited Image</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
