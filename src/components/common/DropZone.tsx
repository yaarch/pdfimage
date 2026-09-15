import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  FileImage,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  X,
  Plus,
} from 'lucide-react';
import { getRecommendedToolsForFile } from '../../data/tools';
import { ToolDefinition } from '../../types';
import { DynamicIcon } from './DynamicIcon';
import { formatBytes } from '../../lib/zipUtils';
import { useTranslation } from '../../i18n/context';

interface DropZoneProps {
  onFilesSelected: (files: File[], recommendedTool?: ToolDefinition) => void;
  acceptedExtensions?: string[];
  multiple?: boolean;
  compact?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({
  onFilesSelected,
  acceptedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.webp', '.svg'],
  multiple = true,
  compact = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files) as File[];
      processFiles(filesArray);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files) as File[];
      processFiles(filesArray);
    }
  };

  const processFiles = (files: File[]) => {
    setSelectedFiles(files);
  };

  const clearSelection = () => {
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const primaryFile = selectedFiles[0];
  const recommendedTools = primaryFile ? getRecommendedToolsForFile(primaryFile) : [];

  return (
    <div className="w-full">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={acceptedExtensions.join(',')}
        onChange={handleInputChange}
        className="hidden"
      />

      {selectedFiles.length === 0 ? (
        /* Empty / Drop State - Signature iLovePDF Upload Style */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group relative cursor-pointer border-2 border-dashed transition-all duration-200 rounded-3xl ${
            isDragging
              ? 'border-red-500 bg-red-50/70 dark:bg-red-950/40 ring-4 ring-red-500/10 scale-[1.005]'
              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-red-400 dark:hover:border-red-500 hover:bg-slate-50/80 dark:hover:bg-slate-900/90'
          } ${compact ? 'p-6' : 'p-10 sm:p-14'} shadow-sm text-center flex flex-col items-center justify-center`}
        >
          {/* Animated upload icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-red-600 text-white flex items-center justify-center mb-6 shadow-xl shadow-red-600/30 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          {/* Primary Action Button - Iconic Red Button */}
          <button
            type="button"
            className="px-8 sm:px-10 py-4 sm:py-4.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-base sm:text-lg font-extrabold shadow-lg shadow-red-600/30 transition-all transform group-hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <span>{t.chooseFileBtn}</span>
          </button>

          <p className="mt-4 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
            {t.orDropHere}
          </p>

          {/* Privacy badge under drop area */}
          <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/40 px-4 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t.secureNotice}</span>
          </div>
        </div>
      ) : (
        /* Selected Files & Smart Operations Bar */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl animate-in fade-in-50 zoom-in-95">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                {primaryFile.type.includes('pdf') ? (
                  <FileText className="w-6 h-6 text-rose-500" />
                ) : (
                  <FileImage className="w-6 h-6 text-sky-500" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                    {primaryFile.name}
                  </span>
                  {selectedFiles.length > 1 && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      +{selectedFiles.length - 1} more
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                  <span>{formatBytes(selectedFiles.reduce((acc, f) => acc + f.size, 0))}</span>
                  <span>&bull;</span>
                  <span className="uppercase font-mono">
                    {primaryFile.name.split('.').pop() || 'File'}
                  </span>
                  <span>&bull;</span>
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% In-Memory
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add More</span>
              </button>
              <button
                type="button"
                onClick={clearSelection}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                title="Remove files"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Recommended Tools Grid */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                  {t.recommendedTools}
                </h4>
              </div>
              <span className="text-xs text-slate-400">Select an action to launch</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {recommendedTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => onFilesSelected(selectedFiles, tool)}
                  className="group text-left p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        tool.category === 'pdf'
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                          : tool.category === 'image'
                          ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400'
                          : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                      }`}
                    >
                      <DynamicIcon name={tool.iconName} className="w-4 h-4" />
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {tool.name}
                    </span>
                    <span className="text-[11px] text-slate-500 line-clamp-1">
                      {tool.tagline}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
