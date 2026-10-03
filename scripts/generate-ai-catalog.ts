import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOOLS } from '../src/data/tools';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const WELL_KNOWN_DIR = path.join(PUBLIC_DIR, '.well-known');

if (!fs.existsSync(WELL_KNOWN_DIR)) {
  fs.mkdirSync(WELL_KNOWN_DIR, { recursive: true });
}

// Queries map tailored to each tool
const TOOL_QUERIES: Record<string, string[]> = {
  'pdf-organizer': [
    'How do I reorder pages in a PDF?',
    'Can I delete or rotate PDF pages in my browser?',
    'Rearrange PDF pages visually online'
  ],
  'merge-pdf': [
    'How do I combine multiple PDF files into one?',
    'Merge PDF files online privately without uploading',
    'Join PDF documents into a single file'
  ],
  'split-pdf': [
    'How can I extract specific pages from a PDF document?',
    'Split PDF into individual pages or ranges',
    'Extract PDF chapter pages online'
  ],
  'compress-pdf': [
    'How do I reduce PDF file size in browser?',
    'Compress PDF documents without losing quality',
    'Shrink large PDF files for email attachments'
  ],
  'rotate-pdf': [
    'How do I rotate PDF pages permanently?',
    'Rotate upside down PDF pages online',
    'Fix PDF orientation 90 degrees'
  ],
  'pdf-watermark': [
    'How do I add a watermark to my PDF?',
    'Stamp text or confidential mark on PDF pages',
    'Protect PDF documents with custom watermark'
  ],
  'pdf-page-numbers': [
    'How do I add page numbers to a PDF file?',
    'Number PDF document pages in header or footer',
    'Format pagination on multi-page PDF'
  ],
  'images-to-pdf': [
    'How do I convert multiple images into a PDF?',
    'Convert JPG and PNG photos into a single PDF document',
    'Combine photos into a PDF album'
  ],
  'pdf-to-images': [
    'How do I extract images from PDF pages?',
    'Convert PDF pages into high resolution JPG or PNG',
    'Save PDF document as image files'
  ],
  'pdf-metadata': [
    'How do I view and edit PDF document metadata?',
    'Change PDF title author and keywords',
    'Inspect PDF file properties online'
  ],
  'pdf-flatten': [
    'How do I flatten interactive form fields in a PDF?',
    'Lock fillable PDF forms into static text',
    'Make PDF form fields non-editable'
  ],
  'pdf-redact-sanitize': [
    'How do I redact sensitive text from a PDF document?',
    'Black out confidential information in PDF files',
    'Sanitize and scrub hidden data from PDF'
  ],
  'text-to-pdf': [
    'How do I convert text notes into a clean PDF document?',
    'Create PDF from plain text or typed notes',
    'Format and download text as PDF'
  ],
  'image-compressor': [
    'How do I compress images without losing visual quality?',
    'Reduce JPG, PNG, and WebP file sizes',
    'Optimize photos for web performance'
  ],
  'image-resizer': [
    'How do I resize images by pixel dimensions or percentage?',
    'Scale image width and height online',
    'Resize photos for social media requirements'
  ],
  'image-converter': [
    'How do I convert images between JPG, PNG, WebP, and AVIF?',
    'Convert photo format in browser',
    'Fast client-side image format transformation'
  ],
  'image-crop': [
    'How do I crop pictures to standard aspect ratios?',
    'Crop image square 16:9 or custom dimensions',
    'Interactive photo cropper online'
  ],
  'image-rotate-flip': [
    'How do I rotate and flip images horizontally or vertically?',
    'Mirror photo and rotate 90 degrees',
    'Adjust image orientation in browser'
  ],
  'image-strip-exif': [
    'How do I remove GPS and camera metadata from photos?',
    'Strip EXIF tags before sharing photos online',
    'Clean privacy data from image files'
  ],
  'image-filter': [
    'How do I adjust brightness, contrast, and color filters on photos?',
    'Apply grayscale, sepia, and blur to images online',
    'Enhance photo tones in browser'
  ],
  'image-color-palette': [
    'How do I extract dominant color palettes and hex codes from images?',
    'Generate color palette from photograph',
    'Extract HEX and RGB colors from photos'
  ],
  'image-watermark': [
    'How do I add a text watermark to my pictures?',
    'Protect photos with copyright watermark overlay',
    'Stamp brand text over images'
  ],
  'image-base64': [
    'How do I convert images to Base64 data URIs?',
    'Encode image file as base64 string for CSS and HTML',
    'Generate data:image base64 code'
  ],
  'image-border-round': [
    'How do I add rounded corners and decorative borders to pictures?',
    'Round image borders with custom radius and shadow',
    'Frame photos with stylish borders'
  ],
  'batch-processor': [
    'How do I compress or convert multiple files in batch?',
    'Batch process PDFs and images concurrently',
    'Bulk convert and download files in a ZIP archive'
  ],
};

const entries = TOOLS.map((tool) => {
  const queries = TOOL_QUERIES[tool.id] || [
    `How do I use ${tool.name}?`,
    `Free online ${tool.name} in browser`
  ];

  return {
    identifier: `urn:air:pdfimage.pages.dev:tool:${tool.id}`,
    displayName: tool.name,
    type: 'text/html',
    url: `https://pdfimage.pages.dev${tool.route}`,
    description: tool.description,
    tags: tool.keywords.slice(0, 10),
    capabilities: [tool.id.replace(/-/g, '_'), `${tool.category}_tool`],
    representativeQueries: queries.slice(0, 5),
    version: '1.0.0',
    updatedAt: '2026-10-04T00:00:00Z',
  };
});

const aiCatalogManifest = {
  specVersion: '1.0',
  host: {
    displayName: 'PDF Image Studio',
    documentationUrl: 'https://pdfimage.pages.dev/about',
    logoUrl: 'https://pdfimage.pages.dev/icon.svg',
  },
  entries,
};

const jsonContent = JSON.stringify(aiCatalogManifest, null, 2);

// Write to all standard ARD / Agentic Navigation locations
fs.writeFileSync(path.join(WELL_KNOWN_DIR, 'ai-catalog.json'), jsonContent, 'utf8');
fs.writeFileSync(path.join(PUBLIC_DIR, 'ai-catalog.json'), jsonContent, 'utf8');
fs.writeFileSync(path.join(WELL_KNOWN_DIR, 'ard.json'), jsonContent, 'utf8');
fs.writeFileSync(path.join(PUBLIC_DIR, 'ard.json'), jsonContent, 'utf8');

console.log(`Generated ai-catalog.json and ard.json with ${entries.length} capabilities.`);
