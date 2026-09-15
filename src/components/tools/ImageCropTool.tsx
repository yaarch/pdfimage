import React, { useState, useRef, useEffect } from 'react';
import {
  Crop,
  Download,
  AlertCircle,
  Sparkles,
  RefreshCw,
  UploadCloud,
  Check,
} from 'lucide-react';
import { cropImage, getImageDimensions, ImageDimensions } from '../../lib/imageUtils';
import { triggerDownload, formatBytes } from '../../lib/zipUtils';

interface ImageCropToolProps {
  initialFiles?: File[];
}

export const ImageCropTool: React.FC<ImageCropToolProps> = ({ initialFiles = [] }) => {
  const [file, setFile] = useState<File | null>(
    initialFiles.find((f) => f.type.startsWith('image/')) || initialFiles[0] || null
  );

  useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      const img = initialFiles.find((f) => f.type.startsWith('image/')) || initialFiles[0];
      if (img) {
        setFile(img);
        setCroppedBlob(null);
        setError(null);
      }
    }
  }, [initialFiles]);
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(null);
  const [aspectPreset, setAspectPreset] = useState<'1:1' | '4:3' | '16:9' | 'free'>('1:1');
  const [cropX, setCropX] = useState<number>(0);
  const [cropY, setCropY] = useState<number>(0);
  const [cropW, setCropW] = useState<number>(300);
  const [cropH, setCropH] = useState<number>(300);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      getImageDimensions(file).then((dim) => {
        setDimensions(dim);
        // default centered crop
        const minDim = Math.min(dim.width, dim.height);
        const w = Math.round(minDim * 0.8);
        const h = Math.round(minDim * 0.8);
        setCropW(w);
        setCropH(h);
        setCropX(Math.round((dim.width - w) / 2));
        setCropY(Math.round((dim.height - h) / 2));
      });

      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const applyPreset = (preset: '1:1' | '4:3' | '16:9' | 'free') => {
    setAspectPreset(preset);
    if (!dimensions) return;

    if (preset === '1:1') {
      const side = Math.min(dimensions.width, dimensions.height);
      setCropW(side);
      setCropH(side);
      setCropX(Math.round((dimensions.width - side) / 2));
      setCropY(Math.round((dimensions.height - side) / 2));
    } else if (preset === '16:9') {
      let w = dimensions.width;
      let h = Math.round((w * 9) / 16);
      if (h > dimensions.height) {
        h = dimensions.height;
        w = Math.round((h * 16) / 9);
      }
      setCropW(w);
      setCropH(h);
      setCropX(Math.round((dimensions.width - w) / 2));
      setCropY(Math.round((dimensions.height - h) / 2));
    } else if (preset === '4:3') {
      let w = dimensions.width;
      let h = Math.round((w * 3) / 4);
      if (h > dimensions.height) {
        h = dimensions.height;
        w = Math.round((h * 4) / 3);
      }
      setCropW(w);
      setCropH(h);
      setCropX(Math.round((dimensions.width - w) / 2));
      setCropY(Math.round((dimensions.height - h) / 2));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setCroppedBlob(null);
      setError(null);
    }
  };

  const handleCrop = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const blob = await cropImage(file, {
        x: Math.max(0, cropX),
        y: Math.max(0, cropY),
        width: Math.max(1, cropW),
        height: Math.max(1, cropH),
      });
      setCroppedBlob(blob);
    } catch (err: any) {
      console.error(err);
      setError('Failed to crop image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!croppedBlob || !file) return;
    const base = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const ext = file.name.split('.').pop() || 'jpg';
    triggerDownload(croppedBlob, `${base}_cropped.${ext}`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
      {!file ? (
        <div className="py-12 text-center max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Choose an Image to Crop
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Trim margins or adjust aspect ratios for avatars, banners, and thumbnails.
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
                {dimensions ? `${dimensions.width} × ${dimensions.height} px` : ''} &bull;{' '}
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

          {/* Aspect Ratio Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Aspect Ratio Presets
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: '1:1', label: '1:1 Square (Avatar)' },
                { id: '4:3', label: '4:3 Standard' },
                { id: '16:9', label: '16:9 Widescreen' },
                { id: 'free', label: 'Free Dimensions' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(p.id as any)}
                  className={`p-3 rounded-xl border text-xs font-semibold transition ${
                    aspectPreset === p.id
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Coordinates Inputs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Offset X (px)
              </label>
              <input
                type="number"
                min={0}
                max={dimensions?.width || 1000}
                value={cropX}
                onChange={(e) => setCropX(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Offset Y (px)
              </label>
              <input
                type="number"
                min={0}
                max={dimensions?.height || 1000}
                value={cropY}
                onChange={(e) => setCropY(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Crop Width (px)
              </label>
              <input
                type="number"
                min={1}
                max={dimensions?.width || 1000}
                value={cropW}
                onChange={(e) => setCropW(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Crop Height (px)
              </label>
              <input
                type="number"
                min={1}
                max={dimensions?.height || 1000}
                value={cropH}
                onChange={(e) => setCropH(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-mono"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleCrop}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm shadow-indigo-600/20 transition disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Cropping...</span>
                </>
              ) : (
                <>
                  <Crop className="w-4 h-4" />
                  <span>Crop Image</span>
                </>
              )}
            </button>
          </div>

          {croppedBlob && (
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Cropping Complete!
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Exported size: <span className="font-bold text-slate-700 dark:text-slate-300">{cropW} &times; {cropH} px</span> &bull; {formatBytes(croppedBlob.size)}
                </p>
              </div>

              <button
                onClick={handleDownload}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Cropped Image</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
