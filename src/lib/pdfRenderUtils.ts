import * as pdfjsLib from 'pdfjs-dist';

// Configure Mozilla PDF.js worker with reliable CDN fallback
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version || '4.10.38'}/build/pdf.worker.min.mjs`;
}

/**
 * Renders an actual real PDF page to an HTML5 Canvas using Mozilla PDF.js
 */
export async function renderRealPdfPageToCanvas(
  pdfData: ArrayBuffer | Uint8Array | File,
  pageNumber: number, // 1-indexed
  scale: number = 1.5
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  try {
    let bytes: Uint8Array;

    if (pdfData instanceof File) {
      const ab = await pdfData.arrayBuffer();
      bytes = new Uint8Array(ab);
    } else if (pdfData instanceof ArrayBuffer) {
      bytes = new Uint8Array(pdfData);
    } else {
      bytes = pdfData;
    }

    const loadingTask = pdfjsLib.getDocument({
      data: bytes,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
      cMapPacked: true,
    });

    const pdfDoc = await loadingTask.promise;
    const page = await pdfDoc.getPage(pageNumber);
    const viewport = page.getViewport({ scale });

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    if (!ctx) {
      throw new Error('Canvas 2D context is unavailable');
    }

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
      canvas: canvas,
    };

    await page.render(renderContext).promise;
    return canvas;
  } catch (err) {
    console.warn(`PDF.js page ${pageNumber} render warning:`, err);
    // Render clean fallback thumbnail on canvas
    canvas.width = 300;
    canvas.height = 400;
    if (ctx) {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 300, 400);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, 280, 380);
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Page ${pageNumber}`, 150, 200);
    }
    return canvas;
  }
}

