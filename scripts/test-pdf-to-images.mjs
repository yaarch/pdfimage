import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import canvasPkg from '@napi-rs/canvas';
import JSZip from 'jszip';
import path from 'path';

globalThis.Path2D = canvasPkg.Path2D;
const { createCanvas } = canvasPkg;

async function runTests() {
  console.log('--- Starting PDF to Images Engine Tests ---');

  // Test 1: Create a multi-page PDF with text and graphics
  console.log('1. Generating sample multi-page PDF with text and vector graphics...');
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Page 1: Text
  const page1 = pdfDoc.addPage([500, 700]);
  page1.drawText('Sample Document - Page 1', {
    x: 50,
    y: 620,
    size: 24,
    font,
    color: rgb(0.1, 0.1, 0.2),
  });
  page1.drawText('This is a test of client-side PDF rendering in PDF Image Studio.', {
    x: 50,
    y: 580,
    size: 14,
    color: rgb(0.2, 0.2, 0.3),
  });

  // Page 2: Graphics and text
  const page2 = pdfDoc.addPage([500, 700]);
  page2.drawText('Sample Document - Page 2 (Graphics)', {
    x: 50,
    y: 620,
    size: 24,
    font,
    color: rgb(0.1, 0.1, 0.2),
  });
  page2.drawRectangle({
    x: 50,
    y: 400,
    width: 400,
    height: 150,
    color: rgb(0.3, 0.4, 0.9),
  });
  page2.drawText('Contained inside a colored banner', {
    x: 70,
    y: 470,
    size: 16,
    font,
    color: rgb(1, 1, 1),
  });

  const pdfBytes = await pdfDoc.save();
  console.log(`PDF created successfully: ${pdfBytes.length} bytes, 2 pages.`);

  // Test 2: Load document with PDF.js using standardFontDataUrl
  console.log('\n2. Testing PDF.js document loading with standard fonts...');
  const fontsPath = path.resolve('node_modules/pdfjs-dist/standard_fonts') + '/';
  const cmapsPath = path.resolve('public/cmaps') + '/';

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(pdfBytes.slice(0)),
    standardFontDataUrl: fontsPath,
    cMapUrl: cmapsPath,
    cMapPacked: true,
  });
  const loadedPdf = await loadingTask.promise;
  console.log(`PDF.js loaded document with numPages: ${loadedPdf.numPages}`);
  if (loadedPdf.numPages !== 2) {
    throw new Error(`Expected 2 pages, got ${loadedPdf.numPages}`);
  }

  // Test 3: Test rendering each page at different scales (DPI)
  const testScales = [1.5, 2.0, 3.0];
  const zip = new JSZip();

  for (const scale of testScales) {
    console.log(`\n3. Testing scale ${scale}x (DPI check)...`);
    for (let i = 1; i <= loadedPdf.numPages; i++) {
      const page = await loadedPdf.getPage(i);
      const viewport = page.getViewport({ scale });
      const width = Math.floor(viewport.width);
      const height = Math.floor(viewport.height);
      console.log(`   Page ${i} viewport: ${width}x${height}`);

      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');

      // Pre-fill solid white
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Render page
      const renderTask = page.render({
        canvasContext: ctx,
        viewport: viewport,
      });
      await renderTask.promise;

      // Verify that canvas is not blank (check for non-white pixels)
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      let nonWhiteCount = 0;
      for (let p = 0; p < data.length; p += 4) {
        const r = data[p];
        const g = data[p + 1];
        const b = data[p + 2];
        if (r < 250 || g < 250 || b < 250) {
          nonWhiteCount++;
        }
      }

      console.log(`   Page ${i} rendered! Non-white pixels detected: ${nonWhiteCount}`);
      if (nonWhiteCount === 0) {
        throw new Error(`Page ${i} rendered as completely blank white canvas!`);
      }

      // Test PNG export
      const pngBuffer = canvas.toBuffer('image/png');
      console.log(`   Page ${i} PNG buffer size: ${pngBuffer.length} bytes`);
      if (pngBuffer.length < 1000) {
        throw new Error(`Page ${i} PNG buffer size is unexpectedly small: ${pngBuffer.length}`);
      }

      // Test JPEG export
      const jpegBuffer = canvas.toBuffer('image/jpeg');
      console.log(`   Page ${i} JPEG buffer size: ${jpegBuffer.length} bytes`);
      if (jpegBuffer.length < 1000) {
        throw new Error(`Page ${i} JPEG buffer size is unexpectedly small: ${jpegBuffer.length}`);
      }

      zip.file(`scale_${scale}_page_${i}.png`, pngBuffer);
      zip.file(`scale_${scale}_page_${i}.jpg`, jpegBuffer);
    }
  }

  // Test 4: ZIP generation
  console.log('\n4. Testing ZIP archive packaging...');
  const zipBlob = await zip.generateAsync({ type: 'nodebuffer' });
  console.log(`ZIP generated successfully: ${zipBlob.length} bytes.`);
  if (zipBlob.length < 5000) {
    throw new Error('ZIP archive is unexpectedly small.');
  }

  console.log('\n--- ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ---');
}

runTests().catch((err) => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
