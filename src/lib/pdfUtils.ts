import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { renderRealPdfPageToCanvas } from './pdfRenderUtils';

export interface PdfMetadataInfo {
  pageCount: number;
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
  producer: string;
  creationDate?: Date;
  modificationDate?: Date;
  fileSizeBytes: number;
}

export async function getPdfInfo(file: File): Promise<PdfMetadataInfo> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  return {
    pageCount: pdfDoc.getPageCount(),
    title: pdfDoc.getTitle() || '',
    author: pdfDoc.getAuthor() || '',
    subject: pdfDoc.getSubject() || '',
    keywords: pdfDoc.getKeywords() || '',
    creator: pdfDoc.getCreator() || '',
    producer: pdfDoc.getProducer() || '',
    creationDate: pdfDoc.getCreationDate(),
    modificationDate: pdfDoc.getModificationDate(),
    fileSizeBytes: file.size,
  };
}

export async function updatePdfMetadata(
  file: File,
  meta: { title?: string; author?: string; subject?: string; keywords?: string }
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  if (meta.title !== undefined) pdfDoc.setTitle(meta.title);
  if (meta.author !== undefined) pdfDoc.setAuthor(meta.author);
  if (meta.subject !== undefined) pdfDoc.setSubject(meta.subject);
  if (meta.keywords !== undefined) pdfDoc.setKeywords([meta.keywords]);
  pdfDoc.setModificationDate(new Date());

  const bytes = await pdfDoc.save();
  return new Blob([bytes], { type: 'application/pdf' });
}

export async function mergePdfs(files: File[]): Promise<Blob> {
  if (files.length === 0) {
    throw new Error('No files provided for merging');
  }

  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedBytes = await mergedPdf.save();
  return new Blob([mergedBytes], { type: 'application/pdf' });
}

export async function splitPdf(
  file: File,
  mode: 'all' | 'custom' | 'ranges',
  customRangeStr?: string
): Promise<{ name: string; blob: Blob }[]> {
  const arrayBuffer = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();
  const results: { name: string; blob: Blob }[] = [];
  const baseName = file.name.replace(/\.pdf$/i, '');

  if (mode === 'all') {
    for (let i = 0; i < totalPages; i++) {
      const newDoc = await PDFDocument.create();
      const [copiedPage] = await newDoc.copyPages(srcDoc, [i]);
      newDoc.addPage(copiedPage);
      const bytes = await newDoc.save();
      results.push({
        name: `${baseName}_page_${i + 1}.pdf`,
        blob: new Blob([bytes], { type: 'application/pdf' }),
      });
    }
  } else {
    // split by comma or semicolon separated segments e.g. "1-3, 5, 7-10"
    const rawSegments = (customRangeStr || '1').split(/[,;]+/).map((s) => s.trim()).filter(Boolean);
    if (rawSegments.length === 0) {
      throw new Error('No valid page ranges specified');
    }

    for (const segment of rawSegments) {
      const parsedIndices = parsePageRanges(segment, totalPages);
      if (parsedIndices.length > 0) {
        const newDoc = await PDFDocument.create();
        const copiedPages = await newDoc.copyPages(srcDoc, parsedIndices);
        copiedPages.forEach((page) => newDoc.addPage(page));

        const bytes = await newDoc.save();
        const cleanSegmentName = segment.replace(/\s+/g, '');
        results.push({
          name: `${baseName}_pages_${cleanSegmentName}.pdf`,
          blob: new Blob([bytes], { type: 'application/pdf' }),
        });
      }
    }

    if (results.length === 0) {
      throw new Error('No valid pages found in specified ranges');
    }
  }

  return results;
}

export function parsePageRanges(rangeStr: string, maxPages: number): number[] {
  const indices = new Set<number>();
  const parts = rangeStr.split(/[,;\s]+/).map((s) => s.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        const low = Math.max(1, Math.min(start, end));
        const high = Math.min(maxPages, Math.max(start, end));
        for (let i = low; i <= high; i++) {
          indices.add(i - 1); // 0-indexed
        }
      }
    } else {
      const page = parseInt(part, 10);
      if (!isNaN(page) && page >= 1 && page <= maxPages) {
        indices.add(page - 1);
      }
    }
  }

  return Array.from(indices).sort((a, b) => a - b);
}

export async function organizePdfPages(
  file: File,
  pagesConfig: { originalIndex: number; rotation: number }[],
  options?: { addPageNumbers?: boolean; numberingPosition?: 'bottom-center' | 'bottom-right' }
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const newDoc = await PDFDocument.create();

  const font = options?.addPageNumbers ? await newDoc.embedFont(StandardFonts.Helvetica) : null;

  for (let newIndex = 0; newIndex < pagesConfig.length; newIndex++) {
    const config = pagesConfig[newIndex];
    const [copiedPage] = await newDoc.copyPages(srcDoc, [config.originalIndex]);

    // Apply rotation
    if (config.rotation !== 0) {
      const currentRotation = copiedPage.getRotation().angle;
      copiedPage.setRotation(degrees((currentRotation + config.rotation) % 360));
    }

    newDoc.addPage(copiedPage);

    // Add page numbers if enabled
    if (options?.addPageNumbers && font) {
      const { width } = copiedPage.getSize();
      const text = `${newIndex + 1}`;
      const textWidth = font.widthOfTextAtSize(text, 10);
      const x = options.numberingPosition === 'bottom-right' ? width - textWidth - 36 : (width - textWidth) / 2;
      copiedPage.drawText(text, {
        x,
        y: 20,
        size: 10,
        font,
        color: rgb(0.3, 0.3, 0.3),
      });
    }
  }

  const bytes = await newDoc.save({ useObjectStreams: true });
  return new Blob([bytes], { type: 'application/pdf' });
}

export async function rotatePdf(
  file: File,
  rotationAngle: 90 | 180 | 270,
  target: 'all' | 'odd' | 'even'
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();

  pages.forEach((page, index) => {
    const isOdd = (index + 1) % 2 !== 0;
    const shouldRotate =
      target === 'all' || (target === 'odd' && isOdd) || (target === 'even' && !isOdd);

    if (shouldRotate) {
      const curr = page.getRotation().angle;
      page.setRotation(degrees((curr + rotationAngle) % 360));
    }
  });

  const bytes = await pdfDoc.save();
  return new Blob([bytes], { type: 'application/pdf' });
}

export async function compressPdf(
  file: File,
  level: 'recommended' | 'extreme' | 'low' | 'high' | 'medium' = 'recommended'
): Promise<{ blob: Blob; originalSize: number; newSize: number; savings: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  const bytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
    objectsPerTick: 50,
    updateFieldAppearances: false,
  });

  let finalBlob = new Blob([bytes], { type: 'application/pdf' });

  const originalSize = file.size;
  const newSize = finalBlob.size;
  const savings = Math.max(0, Math.round(((originalSize - newSize) / originalSize) * 100));

  return {
    blob: finalBlob,
    originalSize,
    newSize,
    savings,
  };
}

export async function addWatermarkToPdf(
  file: File,
  options: {
    text: string;
    opacity?: number;
    fontSize?: number;
    size?: number;
    colorHex?: string;
    rotationAngle?: number;
    angle?: number;
  }
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const fontSize = options.fontSize || options.size || 48;
  const opacity = options.opacity !== undefined ? options.opacity : 0.35;
  const rotationAngle = options.rotationAngle !== undefined ? options.rotationAngle : (options.angle !== undefined ? options.angle : 45);
  const colorHex = options.colorHex || '#ef4444';

  // Parse colorHex e.g. #ef4444
  const hex = colorHex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255 || 0.5;
  const g = parseInt(hex.substring(2, 4), 16) / 255 || 0.5;
  const b = parseInt(hex.substring(4, 6), 16) / 255 || 0.5;

  const pages = pdfDoc.getPages();
  for (const page of pages) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(options.text, fontSize);
    const textHeight = font.heightAtSize(fontSize);

    page.drawText(options.text, {
      x: (width - textWidth) / 2,
      y: (height - textHeight) / 2,
      size: fontSize,
      font,
      color: rgb(r, g, b),
      opacity,
      rotate: degrees(rotationAngle),
    });
  }

  const bytes = await pdfDoc.save();
  return new Blob([bytes], { type: 'application/pdf' });
}

export async function addPageNumbersToPdf(
  file: File,
  options: {
    format?: 'X' | 'Page X of Y';
    position: 'bottom-center' | 'bottom-right' | 'top-right';
    startNumber: number;
  }
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const total = pages.length;
  const format = options.format || 'X';

  pages.forEach((page, i) => {
    const currentNum = options.startNumber + i;
    const text = format === 'Page X of Y' ? `Page ${currentNum} of ${total}` : `${currentNum}`;
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, 10);

    let x = (width - textWidth) / 2;
    let y = 24;

    if (options.position === 'bottom-right') {
      x = width - textWidth - 36;
      y = 24;
    } else if (options.position === 'top-right') {
      x = width - textWidth - 36;
      y = height - 36;
    }

    page.drawText(text, {
      x,
      y,
      size: 10,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });
  });

  const bytes = await pdfDoc.save();
  return new Blob([bytes], { type: 'application/pdf' });
}

export async function imagesToPdf(
  images: File[],
  options: {
    pageSize?: 'fit' | 'a4' | 'letter';
    orientation?: 'auto' | 'portrait' | 'landscape';
    margin?: number;
  }
): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const pageSize = options.pageSize || 'fit';
  const orientation = options.orientation || 'auto';
  const margin = options.margin !== undefined ? options.margin : 0;

  // A4 dimensions in points: 595.28 x 841.89
  // Letter dimensions: 612 x 792
  const standardSizes = {
    a4: { width: 595.28, height: 841.89 },
    letter: { width: 612, height: 792 },
  };

  for (const imageFile of images) {
    const imageBytes = await imageFile.arrayBuffer();
    let embeddedImage;

    const type = imageFile.type.toLowerCase();
    if (type.includes('png')) {
      embeddedImage = await pdfDoc.embedPng(imageBytes);
    } else if (type.includes('jpeg') || type.includes('jpg')) {
      embeddedImage = await pdfDoc.embedJpg(imageBytes);
    } else {
      // For WebP or other formats, convert to PNG in canvas first
      const pngBlob = await convertImageToPngBlob(imageFile);
      const pngBytes = await pngBlob.arrayBuffer();
      embeddedImage = await pdfDoc.embedPng(pngBytes);
    }

    const imgWidth = embeddedImage.width;
    const imgHeight = embeddedImage.height;

    let pageWidth = imgWidth;
    let pageHeight = imgHeight;

    if (options.pageSize === 'fit') {
      pageWidth = imgWidth + options.margin * 2;
      pageHeight = imgHeight + options.margin * 2;
    } else {
      const base = standardSizes[options.pageSize];
      const isLandscape =
        options.orientation === 'landscape' ||
        (options.orientation === 'auto' && imgWidth > imgHeight);

      pageWidth = isLandscape ? base.height : base.width;
      pageHeight = isLandscape ? base.width : base.height;
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    // calculate scaled dimension
    const availWidth = pageWidth - options.margin * 2;
    const availHeight = pageHeight - options.margin * 2;

    const scale = Math.min(availWidth / imgWidth, availHeight / imgHeight);
    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;

    const x = (pageWidth - drawWidth) / 2;
    const y = (pageHeight - drawHeight) / 2;

    page.drawImage(embeddedImage, {
      x,
      y,
      width: drawWidth,
      height: drawHeight,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

async function convertImageToPngBlob(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context unavailable'));
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to convert image to PNG'));
      }, 'image/png');
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for PDF embedding'));
    };
    img.src = url;
  });
}

export const getPdfMetadata = getPdfInfo;

export async function rotatePdfPages(
  file: File,
  options: { angle: 90 | 180 | 270; scope: 'all' | 'odd' | 'even' }
): Promise<Blob> {
  return rotatePdf(file, options.angle, options.scope);
}

export async function renderPdfPageToCanvas(
  pdfInput: PDFDocument | ArrayBuffer | File | Uint8Array,
  pageIndex: number,
  scale: number = 1.5
): Promise<HTMLCanvasElement> {
  if (pdfInput instanceof File || pdfInput instanceof ArrayBuffer || pdfInput instanceof Uint8Array) {
    return renderRealPdfPageToCanvas(pdfInput, pageIndex + 1, scale);
  }

  // If pdf-lib PDFDocument instance
  const bytes = await pdfInput.save();
  return renderRealPdfPageToCanvas(bytes, pageIndex + 1, scale);
}

export interface SignaturePlacement {
  pageIndex: number; // 0-indexed
  xPercent: number; // 0 to 100 from left
  yPercent: number; // 0 to 100 from top
  widthPercent: number; // 0 to 100
  signatureDataUrl: string; // PNG base64 data URL
}

export async function signPdfDocument(
  file: File,
  signatures: SignaturePlacement[]
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  for (const sig of signatures) {
    if (sig.pageIndex < 0 || sig.pageIndex >= pdfDoc.getPageCount()) continue;

    const page = pdfDoc.getPage(sig.pageIndex);
    const { width: pageWidth, height: pageHeight } = page.getSize();

    // Convert data URL to bytes
    const base64Data = sig.signatureDataUrl.replace(/^data:image\/\w+;base64,/, '');
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const embeddedPng = await pdfDoc.embedPng(bytes);

    // Calculate dimensions
    const sigWidth = (sig.widthPercent / 100) * pageWidth;
    const sigHeight = (sigWidth / embeddedPng.width) * embeddedPng.height;

    // Convert top-left coordinates to PDF coordinate system (bottom-left origin)
    const x = (sig.xPercent / 100) * pageWidth;
    const y = pageHeight - (sig.yPercent / 100) * pageHeight - sigHeight;

    page.drawImage(embeddedPng, {
      x: Math.max(0, Math.min(pageWidth - sigWidth, x)),
      y: Math.max(0, Math.min(pageHeight - sigHeight, y)),
      width: sigWidth,
      height: sigHeight,
    });
  }

  const outputBytes = await pdfDoc.save();
  return new Blob([outputBytes], { type: 'application/pdf' });
}


