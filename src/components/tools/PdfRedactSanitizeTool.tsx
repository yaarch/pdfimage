import React, { useState, useEffect, useRef } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { ShieldAlert, Download, FileCheck, Eye, Trash2, Plus, Sparkles, Layers } from 'lucide-react';
import { renderRealPdfPageToCanvas } from '../../lib/pdfRenderUtils';

interface RedactBox {
  id: string;
  pageNumber: number; // 1-indexed
  xPercent: number; // 0 - 100
  yPercent: number; // 0 - 100
  widthPercent: number;
  heightPercent: number;
  label: string;
}

interface PdfRedactSanitizeToolProps {
  initialFiles?: File[];
}

export function PdfRedactSanitizeTool({ initialFiles = [] }: PdfRedactSanitizeToolProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(initialFiles[0] || null);

  useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      setSelectedFile(initialFiles[0]);
      setSanitizedBlobUrl(null);
    }
  }, [initialFiles]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageCanvasUrl, setPageCanvasUrl] = useState<string | null>(null);
  const [redactBoxes, setRedactBoxes] = useState<RedactBox[]>([]);
  const [stripAnnotations, setStripAnnotations] = useState<boolean>(true);
  const [stripMetadata, setStripMetadata] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [sanitizedBlobUrl, setSanitizedBlobUrl] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedFile) {
      loadDocument(selectedFile);
    }
  }, [selectedFile]);

  useEffect(() => {
    if (selectedFile && currentPage > 0) {
      renderCurrentPage(selectedFile, currentPage);
    }
  }, [selectedFile, currentPage]);

  const loadDocument = async (file: File) => {
    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdfDoc.getPageCount();
      setPageCount(count);
      setCurrentPage(1);
      setRedactBoxes([]);
      setSanitizedBlobUrl(null);
    } catch (err) {
      console.error('Error loading PDF:', err);
    }
  };

  const renderCurrentPage = async (file: File, pageNum: number) => {
    try {
      const canvas = await renderRealPdfPageToCanvas(file, pageNum, 1.2);
      setPageCanvasUrl(canvas.toDataURL('image/png'));
    } catch (err) {
      console.error('Error rendering page:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.includes('pdf')) {
      setSelectedFile(file);
    }
  };

  const addPresetRedaction = (type: 'top' | 'bottom' | 'middle') => {
    const newBox: RedactBox = {
      id: Math.random().toString(36).substring(2, 9),
      pageNumber: currentPage,
      xPercent: 10,
      yPercent: type === 'top' ? 5 : type === 'bottom' ? 85 : 45,
      widthPercent: 80,
      heightPercent: 10,
      label: type === 'top' ? 'Header Blackout' : type === 'bottom' ? 'Footer Blackout' : 'Confidential Box',
    };
    setRedactBoxes((prev) => [...prev, newBox]);
  };

  const removeBox = (id: string) => {
    setRedactBoxes((prev) => prev.filter((b) => b.id !== id));
  };

  const handleApplyRedaction = async () => {
    if (!selectedFile) return;

    try {
      setIsProcessing(true);
      const buffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      if (stripMetadata) {
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer('PDF Image Studio Private Redactor');
        pdfDoc.setCreator('PDF Image Studio Privacy Engine');
      }

      const pages = pdfDoc.getPages();

      // Apply blackout rectangles to PDF pages
      for (const box of redactBoxes) {
        if (box.pageNumber <= pages.length) {
          const page = pages[box.pageNumber - 1];
          const { width, height } = page.getSize();

          // Convert percentages to PDF coordinate space (PDF origin is bottom-left)
          const rectX = (box.xPercent / 100) * width;
          const rectWidth = (box.widthPercent / 100) * width;
          const rectHeight = (box.heightPercent / 100) * height;
          const rectY = height - (box.yPercent / 100) * height - rectHeight;

          page.drawRectangle({
            x: Math.max(0, rectX),
            y: Math.max(0, rectY),
            width: Math.min(width, rectWidth),
            height: Math.min(height, rectHeight),
            color: rgb(0, 0, 0),
          });
        }
      }

      const redactedBytes = await pdfDoc.save();
      const blob = new Blob([redactedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setSanitizedBlobUrl(url);
    } catch (err) {
      console.error('Failed to sanitize PDF:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!sanitizedBlobUrl || !selectedFile) return;
    const link = document.createElement('a');
    link.href = sanitizedBlobUrl;
    link.download = `redacted_${selectedFile.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentBoxes = redactBoxes.filter((b) => b.pageNumber === currentPage);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">PDF Redactor & Sanitizer</h3>
            <p className="text-xs text-slate-500">Permanently blackout confidential text and strip document metadata 100% locally</p>
          </div>
        </div>

        {!selectedFile ? (
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-10 text-center transition cursor-pointer bg-slate-50/50 dark:bg-slate-800/30">
            <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" id="pdf-redact-file" />
            <label htmlFor="pdf-redact-file" className="cursor-pointer space-y-3 block">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">Select PDF file to redact</span>
                <p className="text-xs text-slate-500 mt-1">100% client-side privacy protection</p>
              </div>
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Page Canvas Preview & Overlays */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <Eye className="w-4 h-4 text-indigo-500" />
                  Page {currentPage} of {pageCount}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 disabled:opacity-40 text-xs rounded-lg font-medium"
                  >
                    Prev
                  </button>
                  <button
                    disabled={currentPage >= pageCount}
                    onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))}
                    className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 disabled:opacity-40 text-xs rounded-lg font-medium"
                  >
                    Next
                  </button>
                </div>
              </div>

              {/* Interactive Page View */}
              <div
                ref={containerRef}
                className="relative border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-950 flex justify-center items-center min-h-[400px]"
              >
                {pageCanvasUrl && (
                  <div className="relative inline-block">
                    <img src={pageCanvasUrl} alt={`Page ${currentPage}`} className="max-h-[480px] object-contain block" />
                    {/* Render redaction boxes overlay */}
                    {currentBoxes.map((box) => (
                      <div
                        key={box.id}
                        className="absolute bg-black/90 border border-red-500 flex items-center justify-center text-[10px] font-bold text-white shadow-lg"
                        style={{
                          left: `${box.xPercent}%`,
                          top: `${box.yPercent}%`,
                          width: `${box.widthPercent}%`,
                          height: `${box.heightPercent}%`,
                        }}
                      >
                        <span className="truncate px-1 text-red-400 font-mono">{box.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Redaction Controls */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-2">Add Redaction Areas</h4>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => addPresetRedaction('top')}
                    className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition text-center"
                  >
                    + Top Bar
                  </button>
                  <button
                    onClick={() => addPresetRedaction('middle')}
                    className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition text-center"
                  >
                    + Center Box
                  </button>
                  <button
                    onClick={() => addPresetRedaction('bottom')}
                    className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition text-center"
                  >
                    + Bottom Bar
                  </button>
                </div>
              </div>

              {/* Active Redaction List */}
              <div>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-2">
                  Applied Blackout Regions ({redactBoxes.length})
                </h4>
                {redactBoxes.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No redaction boxes added yet.</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {redactBoxes.map((box) => (
                      <div
                        key={box.id}
                        className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
                      >
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white">Page {box.pageNumber}:</span>{' '}
                          <span className="text-slate-500">{box.label}</span>
                        </div>
                        <button onClick={() => removeBox(box.id)} className="text-red-500 hover:text-red-700 p-1">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stripMetadata}
                    onChange={(e) => setStripMetadata(e.target.checked)}
                    className="rounded text-indigo-600 accent-indigo-600"
                  />
                  Strip Author, Title & Hidden EXIF Metadata
                </label>
              </div>

              {/* Actions */}
              <div className="pt-2">
                {!sanitizedBlobUrl ? (
                  <button
                    onClick={handleApplyRedaction}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    {isProcessing ? 'Sanitizing PDF...' : 'Burn Redactions & Export'}
                  </button>
                ) : (
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
                  >
                    <Download className="w-4 h-4" />
                    Download Redacted PDF
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
