import React, { useState } from 'react';
import {
  ShieldCheck,
  Download,
  AlertCircle,
  Sparkles,
  RefreshCw,
  UploadCloud,
  CheckCircle,
} from 'lucide-react';
import { stripImageMetadata } from '../../lib/imageUtils';
import { triggerDownload, formatBytes } from '../../lib/zipUtils';

interface ImageExifToolProps {
  initialFiles?: File[];
}

export const ImageExifTool: React.FC<ImageExifToolProps> = ({ initialFiles = [] }) => {
  const [file, setFile] = useState<File | null>(
    initialFiles.find((f) => f.type.startsWith('image/')) || initialFiles[0] || null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cleanBlob, setCleanBlob] = useState<Blob | null>(null);

  React.useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      const img = initialFiles.find((f) => f.type.startsWith('image/')) || initialFiles[0];
      if (img) {
        setFile(img);
        setCleanBlob(null);
        setError(null);
      }
    }
  }, [initialFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setCleanBlob(null);
      setError(null);
    }
  };

  const handleSanitize = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const blob = await stripImageMetadata(file);
      setCleanBlob(blob);
    } catch (err: any) {
      console.error(err);
      setError('Failed to sanitize image metadata.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!cleanBlob || !file) return;
    const base = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const ext = file.name.split('.').pop() || 'jpg';
    triggerDownload(cleanBlob, `${base}_sanitized.${ext}`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
      {!file ? (
        <div className="py-12 text-center max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Choose a Photo to Sanitize
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Strip GPS coordinates, camera model, lens metadata, and timestamp tags.
          </p>
          <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition">
            <span>Choose Photo</span>
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
                Photo Under Inspection
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white truncate max-w-md">
                {file.name}
              </h3>
              <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
            </div>
            <label className="cursor-pointer text-xs font-medium text-indigo-600 hover:underline">
              Change Photo
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

          {/* Privacy info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                GPS Location Data
              </span>
              <p className="text-[11px] text-slate-500">
                Latitude, longitude, altitude, and geocoded addresses are fully eliminated.
              </p>
            </div>
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                Camera & Device Info
              </span>
              <p className="text-[11px] text-slate-500">
                Phone model, camera serial numbers, and software versions are purged.
              </p>
            </div>
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                Embedded Timestamps
              </span>
              <p className="text-[11px] text-slate-500">
                Date taken and modification headers are cleanly re-encoded.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSanitize}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm shadow-indigo-600/20 transition disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sanitizing EXIF...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Strip All EXIF Metadata</span>
                </>
              )}
            </button>
          </div>

          {cleanBlob && (
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-3xl p-6 border border-emerald-200/50 dark:border-emerald-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Photo Sanitized!
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Safe to share publicly &bull; Size: {formatBytes(cleanBlob.size)}
                  </p>
                </div>
              </div>

              <button
                onClick={handleDownload}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Sanitized Photo</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
