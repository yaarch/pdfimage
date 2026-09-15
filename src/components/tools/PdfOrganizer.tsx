import React, { useState, useEffect } from 'react';
import {
  RotateCw,
  RotateCcw,
  Trash2,
  Copy,
  Download,
  CheckSquare,
  Square,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Hash,
  AlertCircle,
  FileText,
  UploadCloud,
  Check,
  RefreshCw,
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { PdfPageItem } from '../../types';
import { organizePdfPages, renderPdfPageToCanvas } from '../../lib/pdfUtils';
import { triggerDownload, formatBytes } from '../../lib/zipUtils';
import { useTranslation } from '../../i18n/context';

const PdfPageThumbnail: React.FC<{ file: File; pageIndex: number }> = ({ file, pageIndex }) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    file.arrayBuffer().then((buf) => {
      return renderPdfPageToCanvas(buf, pageIndex, 0.4);
    }).then((canvas) => {
      if (active) {
        setDataUrl(canvas.toDataURL('image/png'));
        setLoading(false);
      }
    }).catch((err) => {
      console.error('Failed to render page thumbnail', err);
      if (active) setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [file, pageIndex]);

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg">
        <FileText className="w-6 h-6 text-slate-400 mb-1" />
        <span className="text-[9px] font-mono text-slate-400">Loading #{pageIndex + 1}...</span>
      </div>
    );
  }

  if (!dataUrl) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <FileText className="w-6 h-6 text-slate-400 mb-1" />
        <span className="text-[9px] font-mono text-slate-400">Page {pageIndex + 1}</span>
      </div>
    );
  }

  return (
    <img
      src={dataUrl}
      alt={`Page ${pageIndex + 1}`}
      className="w-full h-full object-contain rounded shadow-xs"
    />
  );
};

interface PdfOrganizerProps {
  initialFile?: File | null;
  initialFiles?: File[];
}

export const PdfOrganizer: React.FC<PdfOrganizerProps> = ({ initialFile, initialFiles }) => {
  const [file, setFile] = useState<File | null>(() => {
    if (initialFiles && initialFiles.length > 0) return initialFiles[0];
    return initialFile || null;
  });
  const [pages, setPages] = useState<PdfPageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addPageNumbers, setAddPageNumbers] = useState(false);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const target = (initialFiles && initialFiles.length > 0) ? initialFiles[0] : initialFile;
    if (target) {
      setFile(target);
      loadPdf(target);
    }
  }, [initialFile, initialFiles]);

  const loadPdf = async (selectedFile: File) => {
    setIsLoading(true);
    setError(null);
    setProcessedBlob(null);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = doc.getPageCount();

      const newPages: PdfPageItem[] = [];
      for (let i = 0; i < count; i++) {
        const page = doc.getPage(i);
        const { width, height } = page.getSize();
        const initialRotation = page.getRotation().angle;

        newPages.push({
          id: `p-${i}-${Date.now()}`,
          originalPageIndex: i,
          displayPageNumber: i + 1,
          rotation: initialRotation,
          selected: false,
          width,
          height,
        });
      }

      setPages(newPages);
      setFile(selectedFile);
    } catch (err: any) {
      console.error('Failed to load PDF:', err);
      setError('Unable to load this PDF document. The file may be password-protected or corrupted.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      loadPdf(e.target.files[0]);
    }
  };

  // Reordering helpers
  const movePage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= pages.length) return;
    const updated = [...pages];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setPages(updated);
  };

  // Drag & drop handlers
  const handleDragStart = (idx: number) => {
    setDraggedIndex(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
  };

  const handleDrop = (targetIdx: number) => {
    if (draggedIndex === null || draggedIndex === targetIdx) return;
    movePage(draggedIndex, targetIdx);
    setDraggedIndex(null);
  };

  // Selection helpers
  const toggleSelect = (id: string) => {
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    );
  };

  const selectAll = (select: boolean) => {
    setPages((prev) => prev.map((p) => ({ ...p, selected: select })));
  };

  const selectedPages = pages.filter((p) => p.selected);
  const hasSelection = selectedPages.length > 0;

  // Actions on selected or all pages
  const rotateSelected = (degreesToAdd: number) => {
    setPages((prev) =>
      prev.map((p) => {
        if (!hasSelection || p.selected) {
          return { ...p, rotation: (p.rotation + degreesToAdd + 360) % 360 };
        }
        return p;
      })
    );
  };

  const deleteSelected = () => {
    if (pages.length <= 1) {
      setError('Cannot delete the last remaining page of the PDF.');
      return;
    }
    setPages((prev) => (hasSelection ? prev.filter((p) => !p.selected) : prev));
  };

  const duplicateSelected = () => {
    if (!hasSelection) return;
    const newItems: PdfPageItem[] = [];
    pages.forEach((p) => {
      newItems.push(p);
      if (p.selected) {
        newItems.push({
          ...p,
          id: `p-${p.originalPageIndex}-dup-${Math.random().toString(36).substring(2, 7)}`,
          selected: false,
        });
      }
    });
    setPages(newItems);
  };

  const handleApplyChanges = async () => {
    if (!file || pages.length === 0) return;
    setIsProcessing(true);
    setError(null);

    try {
      const pageConfigs = pages.map((p) => ({
        originalIndex: p.originalPageIndex,
        rotation: p.rotation,
      }));

      const blob = await organizePdfPages(file, pageConfigs, {
        addPageNumbers,
        numberingPosition: 'bottom-center',
      });

      setProcessedBlob(blob);
    } catch (err: any) {
      console.error(err);
      setError('An error occurred while compiling your organized PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedBlob || !file) return;
    const base = file.name.replace(/\.pdf$/i, '');
    triggerDownload(processedBlob, `${base}_organized.pdf`);
  };

  if (!file) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center max-w-xl mx-auto shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
          <UploadCloud className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          Select a PDF to Organize
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Upload any multi-page PDF document to rearrange, rotate, delete, or duplicate pages visually.
        </p>
        <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 transition">
          <span>Choose PDF Document</span>
          <input
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Toolbar Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Selection status and controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => selectAll(selectedPages.length !== pages.length)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition"
          >
            {selectedPages.length === pages.length ? (
              <>
                <CheckSquare className="w-4 h-4 text-indigo-600" />
                <span>Deselect All</span>
              </>
            ) : (
              <>
                <Square className="w-4 h-4" />
                <span>Select All ({pages.length})</span>
              </>
            )}
          </button>

          {hasSelection && (
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 px-2 py-1 bg-indigo-50 dark:bg-indigo-950/60 rounded-md">
              {selectedPages.length} selected
            </span>
          )}
        </div>

        {/* Editing Tools Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => rotateSelected(90)}
            className="p-2 sm:px-3 sm:py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition"
            title="Rotate 90° Clockwise"
          >
            <RotateCw className="w-4 h-4" />
            <span className="hidden sm:inline">Rotate 90°</span>
          </button>

          <button
            onClick={duplicateSelected}
            disabled={!hasSelection}
            className="p-2 sm:px-3 sm:py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition"
            title="Duplicate Selected Pages"
          >
            <Copy className="w-4 h-4" />
            <span className="hidden sm:inline">Duplicate</span>
          </button>

          <button
            onClick={deleteSelected}
            disabled={pages.length <= 1 || !hasSelection}
            className="p-2 sm:px-3 sm:py-1.5 text-xs font-semibold rounded-lg border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition"
            title="Delete Selected Pages"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Delete</span>
          </button>

          {/* Numbering Option Toggle */}
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition">
            <input
              type="checkbox"
              checked={addPageNumbers}
              onChange={(e) => setAddPageNumbers(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <Hash className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Number Pages</span>
          </label>
        </div>

        {/* Primary Save / Download Trigger */}
        <div className="flex items-center gap-2">
          {processedBlob ? (
            <button
              onClick={handleDownload}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition animate-bounce-subtle"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF ({formatBytes(processedBlob.size)})</span>
            </button>
          ) : (
            <button
              onClick={handleApplyChanges}
              disabled={isProcessing}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm shadow-indigo-600/20 transition disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Save & Generate PDF</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Pages Grid Layout */}
      <div className="bg-slate-100/60 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 min-h-[420px]">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {pages.map((page, index) => {
            const isPortrait = !page.width || !page.height || page.height >= page.width;
            const effectiveRotation = page.rotation % 360;

            return (
              <div
                key={page.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={() => handleDrop(index)}
                className={`group relative rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-200 cursor-grab active:cursor-grabbing select-none shadow-2xs hover:shadow-md flex flex-col items-center justify-between p-3.5 ${
                  page.selected
                    ? 'border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                } ${draggedIndex === index ? 'opacity-40 scale-95' : ''}`}
              >
                {/* Page Number Badge & Selection Check */}
                <div className="w-full flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Page {index + 1}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelect(page.id);
                    }}
                    className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    {page.selected ? (
                      <CheckSquare className="w-4 h-4 text-indigo-600 fill-indigo-50 dark:fill-indigo-950" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Page Visual Canvas Representation */}
                <div
                  onClick={() => toggleSelect(page.id)}
                  className="w-full aspect-[3/4] rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 p-1.5 transition-transform relative overflow-hidden flex items-center justify-center cursor-pointer"
                  style={{
                    transform: `rotate(${effectiveRotation}deg)`,
                  }}
                >
                  <PdfPageThumbnail file={file} pageIndex={page.originalPageIndex} />

                  {effectiveRotation !== 0 && (
                    <div className="absolute top-1 right-1 bg-indigo-600 text-white text-[9px] font-bold px-1 rounded shadow-xs">
                      {effectiveRotation}&deg;
                    </div>
                  )}
                </div>

                {/* Micro controls underneath page */}
                <div className="w-full flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-slate-400">
                  <button
                    onClick={() => movePage(index, index - 1)}
                    disabled={index === 0}
                    className="p-1 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20"
                    title="Move Left"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      setPages((prev) =>
                        prev.map((p, idx) =>
                          idx === index ? { ...p, rotation: (p.rotation + 90) % 360 } : p
                        )
                      );
                    }}
                    className="p-1 hover:text-indigo-600 dark:hover:text-indigo-400"
                    title="Rotate 90°"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => movePage(index, index + 1)}
                    disabled={index === pages.length - 1}
                    className="p-1 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20"
                    title="Move Right"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
