import React, { useState, useEffect } from 'react';
import { PDFDocument, StandardFonts, rgb, PageSizes } from 'pdf-lib';
import { Download, FileText, Type, Layout, RefreshCw, Eye, Sparkles } from 'lucide-react';
import { renderRealPdfPageToCanvas } from '../../lib/pdfRenderUtils';

export function TextToPdfTool() {
  const [title, setTitle] = useState('Document Title');
  const [content, setContent] = useState(`Welcome to PDF Image Studio Text to PDF!

You can type or paste any text or notes here.
All formatting and PDF creation takes place 100% privately inside your browser.

Key Features:
• Zero server uploads — complete data privacy.
• Customizable typography, font sizes, margins, and paper formats.
• Instant high-resolution vector PDF export with page numbers.

Start typing your notes, reports, or articles above...`);
  const [paperSize, setPaperSize] = useState<'a4' | 'letter'>('a4');
  const [fontSize, setFontSize] = useState<number>(12);
  const [fontFamily, setFontFamily] = useState<'Helvetica' | 'TimesRoman' | 'Courier'>('Helvetica');
  const [lineHeight, setLineHeight] = useState<number>(1.4);
  const [includePageNumbers, setIncludePageNumbers] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [previewCanvasUrl, setPreviewCanvasUrl] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number>(1);

  useEffect(() => {
    generatePdfPreview();
  }, [title, content, paperSize, fontSize, fontFamily, lineHeight, includePageNumbers]);

  const generatePdfPreview = async () => {
    try {
      setIsGenerating(true);
      const pdfDoc = await PDFDocument.create();
      
      const font = fontFamily === 'TimesRoman' 
        ? await pdfDoc.embedFont(StandardFonts.TimesRoman)
        : fontFamily === 'Courier'
        ? await pdfDoc.embedFont(StandardFonts.Courier)
        : await pdfDoc.embedFont(StandardFonts.Helvetica);

      const boldFont = fontFamily === 'TimesRoman'
        ? await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
        : fontFamily === 'Courier'
        ? await pdfDoc.embedFont(StandardFonts.CourierBold)
        : await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const pageSize = paperSize === 'letter' ? PageSizes.Letter : PageSizes.A4;
      const margin = 50;
      const contentWidth = pageSize[0] - margin * 2;
      const contentHeight = pageSize[1] - margin * 2;

      let currentPage = pdfDoc.addPage(pageSize);
      let yPosition = pageSize[1] - margin;

      // Draw Header Title
      if (title.trim()) {
        currentPage.drawText(title.trim(), {
          x: margin,
          y: yPosition - 20,
          size: fontSize + 8,
          font: boldFont,
          color: rgb(0.09, 0.09, 0.11),
        });

        // Horizontal accent line
        currentPage.drawLine({
          start: { x: margin, y: yPosition - 32 },
          end: { x: pageSize[0] - margin, y: yPosition - 32 },
          thickness: 1,
          color: rgb(0.85, 0.85, 0.9),
        });

        yPosition -= 50;
      }

      // Format & wrap body text lines
      const paragraphs = content.split('\n');
      const textLineHeight = fontSize * lineHeight;

      for (const paragraph of paragraphs) {
        if (!paragraph.trim()) {
          yPosition -= textLineHeight;
          if (yPosition < margin) {
            currentPage = pdfDoc.addPage(pageSize);
            yPosition = pageSize[1] - margin;
          }
          continue;
        }

        const words = paragraph.split(' ');
        let currentLine = '';

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const width = font.widthOfTextAtSize(testLine, fontSize);

          if (width > contentWidth && currentLine) {
            currentPage.drawText(currentLine, {
              x: margin,
              y: yPosition,
              size: fontSize,
              font: font,
              color: rgb(0.2, 0.2, 0.25),
            });
            yPosition -= textLineHeight;

            if (yPosition < margin + 20) {
              currentPage = pdfDoc.addPage(pageSize);
              yPosition = pageSize[1] - margin;
            }

            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }

        if (currentLine) {
          currentPage.drawText(currentLine, {
            x: margin,
            y: yPosition,
            size: fontSize,
            font: font,
            color: rgb(0.2, 0.2, 0.25),
          });
          yPosition -= textLineHeight;
        }

        // Paragraph spacing
        yPosition -= 4;
        if (yPosition < margin + 20) {
          currentPage = pdfDoc.addPage(pageSize);
          yPosition = pageSize[1] - margin;
        }
      }

      // Add page numbers
      const totalPages = pdfDoc.getPageCount();
      setPageCount(totalPages);

      if (includePageNumbers) {
        const pages = pdfDoc.getPages();
        pages.forEach((page, idx) => {
          page.drawText(`Page ${idx + 1} of ${totalPages}`, {
            x: pageSize[0] / 2 - 25,
            y: 25,
            size: 9,
            font: font,
            color: rgb(0.5, 0.5, 0.55),
          });
        });
      }

      const bytes = await pdfDoc.save();
      setPdfBytes(bytes);

      // Render first page as canvas thumbnail
      const canvas = await renderRealPdfPageToCanvas(bytes, 1, 1.2);
      setPreviewCanvasUrl(canvas.toDataURL('image/png'));
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBytes) return;
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/[^a-z0-9]/gi, '_') || 'document'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Text to PDF Editor</h3>
              <p className="text-xs text-slate-500">Format and convert text notes into a formatted PDF document</p>
            </div>
          </div>
          <button
            onClick={handleDownload}
            disabled={!pdfBytes || isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            Export PDF ({pageCount} {pageCount === 1 ? 'page' : 'pages'})
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls & Textarea */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Document Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title..."
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Paper Size</label>
                <select
                  value={paperSize}
                  onChange={(e) => setPaperSize(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="a4">A4 Standard</option>
                  <option value="letter">US Letter</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Font Family</label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="Helvetica">Sans-Serif (Helvetica)</option>
                  <option value="TimesRoman">Serif (Times Roman)</option>
                  <option value="Courier">Monospace (Courier)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Font Size: {fontSize}pt</label>
                <input
                  type="range"
                  min="9"
                  max="20"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Document Content
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includePageNumbers}
                    onChange={(e) => setIncludePageNumbers(e.target.checked)}
                    className="rounded text-indigo-600 accent-indigo-600"
                  />
                  Page numbers
                </label>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                placeholder="Type or paste your content here..."
                className="w-full p-3.5 text-xs leading-relaxed font-mono bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-y"
              />
            </div>
          </div>

          {/* Live Preview Canvas */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-3">
              <Eye className="w-4 h-4 text-indigo-500" />
              Live First-Page Render
            </div>

            {previewCanvasUrl ? (
              <div className="relative group max-w-full shadow-lg rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-white">
                <img src={previewCanvasUrl} alt="PDF Preview Page 1" className="max-h-[380px] object-contain" />
                <div className="absolute bottom-2 right-2 px-2.5 py-1 bg-slate-900/80 text-white text-[10px] font-medium rounded-md backdrop-blur-sm">
                  1 of {pageCount} pages
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin mb-2" />
                <span className="text-xs">Rendering preview...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
