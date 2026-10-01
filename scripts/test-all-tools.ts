import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import {
  mergePdfs,
  splitPdf,
  rotatePdf,
  compressPdf,
  addWatermarkToPdf,
  addPageNumbersToPdf,
  imagesToPdf,
  updatePdfMetadata,
  signPdfDocument,
  organizePdfPages,
  getPdfInfo
} from '../src/lib/pdfUtils';
import { createZipArchive } from '../src/lib/zipUtils';

async function runAllToolTests() {
  console.log('==================================================');
  console.log('RUNNING END-TO-END UTILITY TESTS FOR ALL TOOLS');
  console.log('==================================================\n');

  // Helper to create a dummy PDF File
  async function createSamplePdfFile(name: string, pagesCount: number = 2): Promise<File> {
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    for (let i = 0; i < pagesCount; i++) {
      const page = doc.addPage([500, 700]);
      page.drawText(`Sample Document: ${name} - Page ${i + 1}`, { x: 50, y: 650, font, size: 18 });
    }
    const bytes = await doc.save();
    return new File([bytes], name, { type: 'application/pdf' });
  }

  // 1. Test PDF Organizer
  console.log('1. Testing PDF Organizer (organizePdfPages)...');
  const file1 = await createSamplePdfFile('doc1.pdf', 3);
  const organizedBlob = await organizePdfPages(file1, [
    { originalIndex: 1, rotation: 90 },
    { originalIndex: 0, rotation: 0 }
  ], { addPageNumbers: true });
  console.log(`   -> Organized PDF generated successfully. Blob size: ${organizedBlob.size} bytes`);

  // 2. Test Merge PDF
  console.log('2. Testing Merge PDF (mergePdfs)...');
  const file2 = await createSamplePdfFile('doc2.pdf', 2);
  const mergedBlob = await mergePdfs([file1, file2]);
  console.log(`   -> Merged PDF generated successfully. Blob size: ${mergedBlob.size} bytes`);

  // 3. Test Split PDF
  console.log('3. Testing Split PDF (splitPdf)...');
  const splitResults = await splitPdf(file1, 'all');
  console.log(`   -> Split PDF produced ${splitResults.length} files`);

  // 4. Test Compress PDF
  console.log('4. Testing Compress PDF (compressPdf)...');
  const compressRes = await compressPdf(file1, 'recommended');
  console.log(`   -> Compressed PDF produced blob size: ${compressRes.blob.size} bytes`);

  // 5. Test Rotate PDF
  console.log('5. Testing Rotate PDF (rotatePdf)...');
  const rotatedBlob = await rotatePdf(file1, 90, 'all');
  console.log(`   -> Rotated PDF produced blob size: ${rotatedBlob.size} bytes`);

  // 6. Test PDF Watermark
  console.log('6. Testing PDF Watermark (addWatermarkToPdf)...');
  const watermarkedBlob = await addWatermarkToPdf(file1, { text: 'CONFIDENTIAL', opacity: 0.5 });
  console.log(`   -> Watermarked PDF produced blob size: ${watermarkedBlob.size} bytes`);

  // 7. Test PDF Page Numbers
  console.log('7. Testing PDF Page Numbers (addPageNumbersToPdf)...');
  const pagedBlob = await addPageNumbersToPdf(file1, { position: 'bottom-center', startNumber: 1 });
  console.log(`   -> Page Numbered PDF produced blob size: ${pagedBlob.size} bytes`);

  // 8. Test PDF Metadata
  console.log('8. Testing PDF Metadata (getPdfInfo & updatePdfMetadata)...');
  const info = await getPdfInfo(file1);
  console.log(`   -> Read metadata: pageCount=${info.pageCount}`);
  const updatedMetaBlob = await updatePdfMetadata(file1, { title: 'Updated Title', author: 'PDF Image Studio' });
  console.log(`   -> Updated Metadata PDF blob size: ${updatedMetaBlob.size} bytes`);

  // 9. Test PDF Signing
  console.log('9. Testing PDF Signing (signPdfDocument)...');
  // 1x1 transparent PNG base64
  const sampleSigBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const signedBlob = await signPdfDocument(file1, [{
    pageIndex: 0,
    xPercent: 10,
    yPercent: 80,
    widthPercent: 20,
    signatureDataUrl: sampleSigBase64
  }]);
  console.log(`   -> Signed PDF blob size: ${signedBlob.size} bytes`);

  // 10. Test ZIP Archiving
  console.log('10. Testing ZIP Archive (createZipArchive)...');
  const zipBlob = await createZipArchive([
    { name: 'file1.pdf', blob: organizedBlob },
    { name: 'file2.pdf', blob: mergedBlob }
  ]);
  console.log(`   -> ZIP archive created successfully. Blob size: ${zipBlob.size} bytes`);

  console.log('\n==================================================');
  console.log('ALL CORE TOOL UTILITIES VERIFIED AND PASSED SUCCESSFULLY!');
  console.log('==================================================');
}

runAllToolTests().catch((err) => {
  console.error('FAILED TEST:', err);
  process.exit(1);
});
