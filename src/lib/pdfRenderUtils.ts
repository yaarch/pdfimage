import * as pdfjsLib from 'pdfjs-dist';

// Configure Mozilla PDF.js worker using same-origin bundled worker with CDN fallback
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).href;
  } catch {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version || '4.10.38'}/build/pdf.worker.min.mjs`;
  }
}

/**
 * Returns parameters for PDF.js document loading with same-origin standard fonts & cmaps
 */
function getPdfJsDocumentParams(data: Uint8Array) {
  const isBrowser = typeof window !== 'undefined';
  const origin = isBrowser && window.location?.origin ? window.location.origin : '';

  return {
    data,
    cMapUrl: isBrowser && origin ? `${origin}/cmaps/` : 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
    cMapPacked: true,
    standardFontDataUrl: isBrowser && origin ? `${origin}/standard_fonts/` : 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/standard_fonts/',
  };
}

/**
 * Loads a PDF Document using Mozilla PDF.js once
 */
export async function loadPdfJsDocument(
  pdfData: ArrayBuffer | Uint8Array | File
): Promise<pdfjsLib.PDFDocumentProxy> {
  let bytes: Uint8Array;
  if (pdfData instanceof File) {
    const ab = await pdfData.arrayBuffer();
    bytes = new Uint8Array(ab);
  } else if (pdfData instanceof ArrayBuffer) {
    // Clone buffer so worker transfer doesn't detach caller's buffer
    bytes = new Uint8Array(pdfData.slice(0));
  } else if (pdfData instanceof Uint8Array) {
    bytes = new Uint8Array(pdfData.buffer.slice(pdfData.byteOffset, pdfData.byteOffset + pdfData.byteLength));
  } else {
    throw new Error('Unsupported PDF data format');
  }

  const loadingTask = pdfjsLib.getDocument(getPdfJsDocumentParams(bytes));
  return await loadingTask.promise;
}

/**
 * Renders an already retrieved PDF page to an HTML5 Canvas using Mozilla PDF.js
 */
export async function renderPdfJsPageToCanvas(
  page: pdfjsLib.PDFPageProxy,
  scale: number = 1.5
): Promise<HTMLCanvasElement> {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);

  if (!canvas.width || !canvas.height) {
    throw new Error('Invalid page viewport dimensions');
  }

  const ctx = canvas.getContext('2d', { alpha: false }) || canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context is unavailable');
  }

  // Pre-fill solid white background so transparent pages and JPEG exports never produce black or blank canvases
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const renderTask = page.render({
    canvasContext: ctx,
    viewport: viewport,
  });

  await renderTask.promise;
  return canvas;
}

/**
 * Renders an actual real PDF page to an HTML5 Canvas using Mozilla PDF.js
 */
export async function renderRealPdfPageToCanvas(
  pdfData: ArrayBuffer | Uint8Array | File,
  pageNumber: number, // 1-indexed
  scale: number = 1.5
): Promise<HTMLCanvasElement> {
  const pdfDoc = await loadPdfJsDocument(pdfData);
  const page = await pdfDoc.getPage(pageNumber);
  const canvas = await renderPdfJsPageToCanvas(page, scale);

  if (typeof (page as any).cleanup === 'function') {
    (page as any).cleanup();
  }

  return canvas;
}

export interface ExtractedPageText {
  pageNumber: number;
  text: string;
  wordCount: number;
}

/**
 * Extracts raw and structured text from all pages of a PDF file using Mozilla PDF.js
 */
export async function extractTextFromPdfPages(
  file: File | ArrayBuffer | Uint8Array,
  onProgress?: (progressPercent: number, currentPage: number, totalPages: number) => void
): Promise<{
  pages: ExtractedPageText[];
  fullText: string;
  totalWords: number;
  totalPages: number;
}> {
  let bytes: Uint8Array;
  if (file instanceof File) {
    const ab = await file.arrayBuffer();
    bytes = new Uint8Array(ab);
  } else if (file instanceof ArrayBuffer) {
    bytes = new Uint8Array(file.slice(0));
  } else if (file instanceof Uint8Array) {
    bytes = new Uint8Array(file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength));
  } else {
    throw new Error('Unsupported PDF data format');
  }

  const loadingTask = pdfjsLib.getDocument(getPdfJsDocumentParams(bytes));
  const pdfDoc = await loadingTask.promise;
  const totalPages = pdfDoc.numPages;
  const pages: ExtractedPageText[] = [];
  let fullText = '';
  let totalWords = 0;

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();

    // Group text items by line roughly based on transform Y coordinate
    const items = textContent.items as Array<{ str: string; hasEOL?: boolean }>;
    const pageStrings: string[] = [];

    for (const item of items) {
      if (item.str) {
        pageStrings.push(item.str);
        if (item.hasEOL) {
          pageStrings.push('\n');
        } else {
          pageStrings.push(' ');
        }
      }
    }

    const rawPageText = pageStrings.join('').replace(/[ ]+/g, ' ').replace(/\n +/g, '\n').trim();
    const words = rawPageText ? rawPageText.split(/\s+/).filter(Boolean).length : 0;

    pages.push({
      pageNumber: i,
      text: rawPageText,
      wordCount: words,
    });

    fullText += (fullText ? '\n\n--- Page ' + i + ' ---\n\n' : '') + rawPageText;
    totalWords += words;

    if (onProgress) {
      onProgress(Math.round((i / totalPages) * 100), i, totalPages);
    }
  }

  return {
    pages,
    fullText,
    totalWords,
    totalPages,
  };
}
