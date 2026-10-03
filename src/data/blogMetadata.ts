export interface BlogMetadataEntry {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
}

export const BLOG_METADATA: BlogMetadataEntry[] = [
  {
    slug: 'when-merging-pdfs-goes-wrong',
    title: 'When Merging PDFs Goes Wrong: Page Order, Blank Pages, and Other Problems',
    excerpt: 'Combining PDF documents can reveal problems such as unexpected blank pages, mixed page sizes, or corrupted embedded fonts. Learn how to inspect, arrange, and verify merged files.',
    category: 'Troubleshooting',
    readTime: '4 min read',
    date: 'October 3, 2026',
    author: 'Editorial & Technical Staff',
  },
  {
    slug: 'why-is-my-pdf-still-huge',
    title: 'Why Is My PDF Still Huge? Understanding Embedded Fonts, Vector Bloat, and Uncompressed Streams',
    excerpt: 'Discover why some PDFs remain large after basic compression. Inspect embedded font subsets, hidden raster assets, duplicate objects, and uncompressed stream dictionaries.',
    category: 'Image Optimization',
    readTime: '4 min read',
    date: 'October 3, 2026',
    author: 'Editorial & Technical Staff',
  },
  {
    slug: 'jpg-png-or-webp',
    title: 'JPG, PNG, or WebP: Choosing the Right Format for Print, Web, and Document Archiving',
    excerpt: 'Compare JPEG, PNG, and WebP across compression efficiency, transparency support, browser compatibility, and color fidelity for web applications and digital document archiving.',
    category: 'Image Optimization',
    readTime: '4 min read',
    date: 'October 3, 2026',
    author: 'Editorial & Technical Staff',
  },
  {
    slug: 'photo-metadata-before-sharing',
    title: 'What Your Photos Reveal: Why Removing EXIF, GPS, and Camera Metadata Matters',
    excerpt: 'Digital camera photos contain hidden EXIF tags including GPS coordinates, camera serials, and timestamps. Learn how to inspect and strip sensitive metadata before public sharing.',
    category: 'Privacy & File Metadata',
    readTime: '3 min read',
    date: 'October 3, 2026',
    author: 'Editorial & Technical Staff',
  },
  {
    slug: 'why-image-compression-looks-worse',
    title: 'Why Compressed Images Look Bad: Chroma Subsampling, Artifacts, and Finding the Right Balance',
    excerpt: 'Understand lossy compression artifacts, 4:2:0 chroma subsampling, and ringing noise. Learn how to balance visual quality with file size reductions.',
    category: 'Image Optimization',
    readTime: '3 min read',
    date: 'October 3, 2026',
    author: 'Editorial & Technical Staff',
  },
  {
    slug: 'what-happens-when-you-edit-a-pdf-in-browser',
    title: 'What Really Happens When You Edit a PDF in Your Browser? Client-Side vs Server-Side Workflows',
    excerpt: 'Examine how client-side browser file tools parse object trees, rasterize canvas viewports, and manipulate binary data locally without uploading files to remote servers.',
    category: 'Technical Insights',
    readTime: '4 min read',
    date: 'October 3, 2026',
    author: 'Editorial & Technical Staff',
  },
  {
    slug: 'build-a-clean-pdf-from-scanned-images',
    title: 'How to Build a Clean, Searchable PDF from Scanned Images and Receipts',
    excerpt: 'Step-by-step workflow to organize, orient, and size scanned images before converting them into uniform, professional multi-page PDF documents.',
    category: 'File Workflow',
    readTime: '4 min read',
    date: 'October 3, 2026',
    author: 'Editorial & Technical Staff',
  },
  {
    slug: 'choosing-image-dimensions',
    title: 'Choosing the Right Image Dimensions: Social Media, Email, Print, and Responsive Web',
    excerpt: 'A comprehensive reference guide for optimal pixel dimensions, aspect ratios, DPI settings, and responsive image scaling across web, email, and social platforms.',
    category: 'Image Optimization',
    readTime: '4 min read',
    date: 'October 3, 2026',
    author: 'Editorial & Technical Staff',
  },
  {
    slug: 'when-to-split-a-pdf',
    title: 'When to Split a PDF: Managing Large Document Portfolios, Contracts, and Chapter Extracts',
    excerpt: 'Learn when splitting multi-page PDF files improves workflow speed, simplifies distribution, and complies with email attachment limits and security protocols.',
    category: 'PDF Guides',
    readTime: '3 min read',
    date: 'October 3, 2026',
    author: 'Editorial & Technical Staff',
  },
  {
    slug: 'what-makes-a-pdf-difficult-to-process',
    title: 'What Makes a PDF Difficult to Process? Malformed Syntax, Security Restrictions, and Non-Standard Fonts',
    excerpt: 'Analyze technical barriers in PDF processing: encrypted permission dictionaries, malformed xref tables, missing ToUnicode maps, and complex transparency blend modes.',
    category: 'Technical Insights',
    readTime: '4 min read',
    date: 'October 3, 2026',
    author: 'Editorial & Technical Staff',
  },
];

export function getBlogMetadataBySlug(slug: string): BlogMetadataEntry | undefined {
  return BLOG_METADATA.find(entry => entry.slug === slug);
}
