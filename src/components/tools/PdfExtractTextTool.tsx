import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Copy,
  Check,
  Search,
  UploadCloud,
  Sparkles,
  RefreshCw,
  AlertCircle,
  FileCode,
} from 'lucide-react';
import { extractTextFromPdfPages, ExtractedPageText } from '../../lib/pdfRenderUtils';
import { triggerDownload, formatBytes } from '../../lib/zipUtils';

interface PdfExtractTextToolProps {
  initialFiles?: File[];
}

export const PdfExtractTextTool: React.FC<PdfExtractTextToolProps> = ({ initialFiles = [] }) => {
  const [file, setFile] = useState<File | null>(initialFiles[0] || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pages, setPages] = useState<ExtractedPageText[]>([]);
  const [fullText, setFullText] = useState('');
  const [totalWords, setTotalWords] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPage, setSelectedPage] = useState<number | 'all'>('all');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      setFile(initialFiles[0]);
    }
  }, [initialFiles]);

  useEffect(() => {
    if (file) {
      processFile(file);
    }
  }, [file]);

  const processFile = async (selectedFile: File) => {
    setIsProcessing(true);
    setError(null);
    setProgress(0);
    setPages([]);
    setFullText('');

    try {
      const res = await extractTextFromPdfPages(selectedFile, (pct) => {
        setProgress(pct);
      });
      setPages(res.pages);
      setFullText(res.fullText);
      setTotalWords(res.totalWords);
    } catch (err: any) {
      console.error(err);
      setError('Failed to extract text from PDF. The document might be image-only (scanned) or password-protected.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const currentDisplayContent = React.useMemo(() => {
    if (selectedPage === 'all') {
      return fullText;
    }
    const target = pages.find((p) => p.pageNumber === selectedPage);
    return target ? target.text : '';
  }, [selectedPage, pages, fullText]);

  const filteredContent = React.useMemo(() => {
    if (!searchQuery.trim()) return currentDisplayContent;
    return currentDisplayContent;
  }, [currentDisplayContent, searchQuery]);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentDisplayContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!file || !currentDisplayContent) return;
    const base = file.name.replace(/\.pdf$/i, '');
    const blob = new Blob([currentDisplayContent], { type: 'text/plain;charset=utf-8' });
    const suffix = selectedPage === 'all' ? '_extracted_text.txt' : `_page_${selectedPage}_text.txt`;
    triggerDownload(blob, `${base}${suffix}`);
  };

  const handleDownloadJson = () => {
    if (!file || pages.length === 0) return;
    const base = file.name.replace(/\.pdf$/i, '');
    const data = {
      filename: file.name,
      extractedAt: new Date().toISOString(),
      totalPages: pages.length,
      totalWords,
      pages,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    triggerDownload(blob, `${base}_extracted.json`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
      {!file ? (
        <div className="py-12 text-center max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Choose a PDF to Extract Text
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Extract all text, paragraphs, and words locally in your browser. Zero uploads.
          </p>
          <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition">
            <span>Select PDF Document</span>
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Info Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                  {file.name}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  {formatBytes(file.size)} • {pages.length > 0 ? `${pages.length} Pages • ~${totalWords.toLocaleString()} Words` : 'Processing...'}
                </p>
              </div>
            </div>

            <label className="cursor-pointer px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition">
              <span>Change PDF</span>
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Processing State */}
          {isProcessing && (
            <div className="py-12 text-center space-y-4">
              <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Extracting text streams ({progress}%)
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Parsing layout markers and unicode glyphs in browser memory...
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3 text-amber-800 dark:text-amber-300 text-xs">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">{error}</p>
                <p className="mt-1 text-[11px] opacity-90">
                  Note: If the PDF contains scanned photographs rather than digital text, try running OCR or converting pages to images first.
                </p>
              </div>
            </div>
          )}

          {/* Results Display */}
          {!isProcessing && pages.length > 0 && (
            <div className="space-y-4">
              {/* Controls bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    View Page:
                  </span>
                  <select
                    value={selectedPage}
                    onChange={(e) => setSelectedPage(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">Entire Document ({pages.length} pages)</option>
                    {pages.map((p) => (
                      <option key={p.pageNumber} value={p.pageNumber}>
                        Page {p.pageNumber} (~{p.wordCount} words)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Text'}</span>
                  </button>

                  <button
                    onClick={handleDownloadTxt}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .TXT</span>
                  </button>

                  <button
                    onClick={handleDownloadJson}
                    title="Download structured JSON with page-by-page data"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>JSON</span>
                  </button>
                </div>
              </div>

              {/* Text Area Viewer */}
              <div className="relative">
                <textarea
                  readOnly
                  value={filteredContent}
                  placeholder="No selectable text found on this page..."
                  rows={14}
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                />
              </div>

              {/* Status and privacy badge */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>100% Client-Side Extracted</span>
                </span>
                <span>
                  {currentDisplayContent.length.toLocaleString()} characters
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
