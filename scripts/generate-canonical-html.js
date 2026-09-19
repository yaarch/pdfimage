import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const INDEX_HTML_PATH = path.join(DIST_DIR, 'index.html');

// Define routes and their SEO metadata
const ROUTES_SEO = {
  '/': {
    title: 'PDF Image Studio — Private Browser File Tools',
    description: 'Convert, compress, organize, edit and optimize your PDF and image files directly in your browser. Fast, 100% private client-side processing, zero server uploads.',
  },
  '/all-tools': {
    title: 'All 18+ Browser File Tools — PDF Image Studio',
    description: 'Explore our complete suite of 100% private, client-side PDF and image tools. Compress, convert, organize, and edit files right in your browser.',
  },
  '/batch-processor': {
    title: 'Batch File Processing Online — Compress & Convert | PDF Image Studio',
    description: 'Batch process multiple files in parallel right in your browser. Download all processed items in a single ZIP file.',
  },
  '/privacy': {
    title: 'Privacy Architecture & Guarantee — PDF Image Studio',
    description: "Learn about PDF Image Studio's 100% client-side privacy architecture. Your files never leave your device because processing happens entirely in your browser memory.",
  },
  '/terms': {
    title: 'Terms of Service — PDF Image Studio',
    description: 'Read the terms of service for PDF Image Studio, the free, private, client-side browser file utility platform.',
  },
  '/about': {
    title: 'About PDF Image Studio — Private Browser File Tools',
    description: 'Discover PDF Image Studio, built to provide secure, lightning-fast, and 100% private PDF and image editing tools directly in your browser without cloud uploads.',
  },
  '/pdf-tools': {
    title: 'PDF Utilities & Tools — PDF Image Studio',
    description: 'Free online PDF utilities including merge, split, compress, organize, watermark, and convert. 100% private and secure in your browser.',
  },
  '/image-tools': {
    title: 'Image Editing & Conversion Tools — PDF Image Studio',
    description: 'Free online image editing tools to compress, resize, crop, convert, and filter photos privately in your browser.',
  },
  '/blog': {
    title: 'Guides & Tutorials — PDF Image Studio Knowledge Base',
    description: 'Read expert guides and tutorials on how to manage, compress, and edit PDF documents and images securely in your web browser.',
  },
  // PDF Tools
  '/pdf-organizer': {
    title: 'PDF Page Organizer & Rotator — PDF Image Studio',
    description: 'Organize, reorder, rotate, and delete PDF pages visually in your browser with 100% privacy.',
  },
  '/merge-pdf': {
    title: 'Merge PDF Files Online Securely — PDF Image Studio',
    description: 'Combine multiple PDF documents into a single organized file directly in your browser. No uploads required.',
  },
  '/split-pdf': {
    title: 'Split PDF Documents Online — PDF Image Studio',
    description: 'Extract individual pages or split PDF documents into separate files instantly in your browser.',
  },
  '/compress-pdf': {
    title: 'Compress PDF File Size Online — PDF Image Studio',
    description: 'Reduce PDF file size securely in your browser without sacrificing document quality.',
  },
  '/rotate-pdf': {
    title: 'Rotate PDF Pages Online — PDF Image Studio',
    description: 'Rotate PDF pages (90°, 180°, 270°) instantly and privately in your browser.',
  },
  '/pdf-watermark': {
    title: 'Add Watermark to PDF Online — PDF Image Studio',
    description: 'Stamp text watermarks over your PDF documents securely in your browser.',
  },
  '/pdf-page-numbers': {
    title: 'Add Page Numbers to PDF Online — PDF Image Studio',
    description: 'Insert page numbers into PDF documents easily with custom position formatting.',
  },
  '/images-to-pdf': {
    title: 'Convert Images to PDF Online — PDF Image Studio',
    description: 'Convert JPG, PNG, and WebP images into a single professional PDF document instantly in your browser.',
  },
  '/pdf-to-images': {
    title: 'Convert PDF to Images (JPG/PNG) — PDF Image Studio',
    description: 'Extract PDF pages as high-resolution JPG or PNG images directly in your browser.',
  },
  '/pdf-metadata': {
    title: 'Edit PDF Metadata Online — PDF Image Studio',
    description: 'View and edit PDF document properties like title, author, subject, and keywords privately.',
  },
  '/pdf-flatten': {
    title: 'Flatten & Lock PDF Online — PDF Image Studio',
    description: 'Flatten interactive form fields and annotations into static PDF content securely.',
  },
  '/pdf-redact-sanitize': {
    title: 'Redact & Sanitize PDF Online — PDF Image Studio',
    description: 'Black out sensitive text and scrub hidden metadata from PDF files in your browser.',
  },
  '/text-to-pdf': {
    title: 'Convert Text & Notes to PDF — PDF Image Studio',
    description: 'Type or paste notes and convert formatted text directly into a printable PDF document.',
  },
  // Image Tools
  '/image-compressor': {
    title: 'Compress Images Online (JPG/PNG/WebP) — PDF Image Studio',
    description: 'Reduce image file size while preserving high visual quality. 100% private browser processing.',
  },
  '/image-resizer': {
    title: 'Resize Images Online by Pixels or % — PDF Image Studio',
    description: 'Easily resize JPG, PNG, and WebP images to exact dimensions or percentage scales.',
  },
  '/image-converter': {
    title: 'Convert Image Formats Online — PDF Image Studio',
    description: 'Convert between JPG, PNG, WebP, AVIF, and BMP image formats instantly in your browser.',
  },
  '/image-crop': {
    title: 'Crop Images Online — PDF Image Studio',
    description: 'Crop photos and images with preset aspect ratios (1:1, 16:9, 4:3) or custom dimensions.',
  },
  '/image-rotate-flip': {
    title: 'Rotate & Flip Images Online — PDF Image Studio',
    description: 'Rotate images and mirror/flip them horizontally or vertically in your browser.',
  },
  '/image-strip-exif': {
    title: 'Remove EXIF & Metadata from Images — PDF Image Studio',
    description: 'Strip sensitive camera data, timestamps, and GPS location metadata from photos to protect privacy.',
  },
  '/image-filter': {
    title: 'Apply Photo Filters & Adjust Colors — PDF Image Studio',
    description: 'Adjust brightness, contrast, saturation, and apply classic photo filters instantly in your browser.',
  },
  '/image-color-palette': {
    title: 'Extract Color Palette from Image — PDF Image Studio',
    description: 'Extract dominant color palettes and HEX/RGB/HSL codes from any uploaded image.',
  },
};

function generateStaticHtmlForRoutes() {
  if (!fs.existsSync(INDEX_HTML_PATH)) {
    console.error('Error: dist/index.html not found. Run vite build first.');
    return;
  }

  const templateHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf8');

  for (const [route, seo] of Object.entries(ROUTES_SEO)) {
    const cleanRoute = route === '/' ? '' : route;
    const targetDir = path.join(DIST_DIR, cleanRoute);
    const canonicalUrl = `https://pdfimage.pages.dev${cleanRoute}`;

    let routeHtml = templateHtml;

    // 1. Title
    if (/<title>[\s\S]*?<\/title>/i.test(routeHtml)) {
      routeHtml = routeHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>${seo.title}</title>`);
    } else {
      routeHtml = routeHtml.replace('</head>', `  <title>${seo.title}</title>\n</head>`);
    }

    // 2. Meta Description (remove any existing description first to prevent duplicates)
    routeHtml = routeHtml.replace(/<meta\s+name=["']description["'][^>]*>\s*/gi, '');

    // 3. Canonical Link (remove any existing canonical first)
    routeHtml = routeHtml.replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, '');

    // 4. Open Graph & Twitter tags (remove existing ones to prevent duplicates)
    routeHtml = routeHtml.replace(/<meta\s+property=["']og:title["'][^>]*>\s*/gi, '');
    routeHtml = routeHtml.replace(/<meta\s+property=["']og:description["'][^>]*>\s*/gi, '');
    routeHtml = routeHtml.replace(/<meta\s+property=["']og:url["'][^>]*>\s*/gi, '');
    routeHtml = routeHtml.replace(/<meta\s+name=["']twitter:title["'][^>]*>\s*/gi, '');
    routeHtml = routeHtml.replace(/<meta\s+name=["']twitter:description["'][^>]*>\s*/gi, '');

    // Construct the clean SEO meta tags block
    const seoTagsBlock = `
    <meta name="description" content="${seo.description}" />
    <meta property="og:title" content="${seo.title}" />
    <meta property="og:description" content="${seo.description}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta name="twitter:title" content="${seo.title}" />
    <meta name="twitter:description" content="${seo.description}" />
    <link rel="canonical" href="${canonicalUrl}" />`;

    // Insert right before </head>
    routeHtml = routeHtml.replace('</head>', `${seoTagsBlock}\n</head>`);

    if (route === '/') {
      fs.writeFileSync(INDEX_HTML_PATH, routeHtml, 'utf8');
      console.log(`[SEO] Generated: / (index.html)`);
    } else {
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const targetFilePath = path.join(targetDir, 'index.html');
      fs.writeFileSync(targetFilePath, routeHtml, 'utf8');
      console.log(`[SEO] Generated: ${route}/index.html`);
    }
  }

  console.log('Successfully generated route-specific static HTML files with clean, unique SEO metadata.');
}

generateStaticHtmlForRoutes();
