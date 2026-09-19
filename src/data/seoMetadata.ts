export interface SeoPageMetadata {
  route: string;
  title: string;
  description: string;
}

export const STATIC_SEO_PAGES: Record<string, SeoPageMetadata> = {
  '/': {
    route: '/',
    title: 'PDF Image Studio — Private Browser File Tools',
    description: 'Convert, compress, organize, edit and optimize your PDF and image files directly in your browser. Fast, 100% private client-side processing, zero server uploads.',
  },
  '/all-tools': {
    route: '/all-tools',
    title: 'All Browser File Tools Catalog — PDF Image Studio',
    description: 'Explore our complete suite of 100% private, client-side PDF and image tools. Compress, convert, organize, sign, extract, and edit files right in your browser.',
  },
  '/batch-processor': {
    route: '/batch-processor',
    title: 'Batch File Processing Online — Compress & Convert | PDF Image Studio',
    description: 'Batch process multiple files in parallel right in your browser. Download all processed items in a single ZIP file.',
  },
  '/privacy': {
    route: '/privacy',
    title: 'Privacy Architecture & Guarantee — PDF Image Studio',
    description: 'Learn about PDF Image Studio\'s 100% client-side privacy architecture. Your files never leave your device because processing happens entirely in your browser memory.',
  },
  '/terms': {
    route: '/terms',
    title: 'Terms of Service — PDF Image Studio',
    description: 'Read the terms of service for PDF Image Studio, the free, private, client-side browser file utility platform.',
  },
  '/about': {
    route: '/about',
    title: 'About PDF Image Studio — Private Browser File Tools',
    description: 'Discover PDF Image Studio, built to provide secure, lightning-fast, and 100% private PDF and image editing tools directly in your browser without cloud uploads.',
  },
  '/pdf-tools': {
    route: '/pdf-tools',
    title: 'PDF Utilities & Tools — PDF Image Studio',
    description: 'Free online PDF utilities including merge, split, compress, organize, watermark, and convert. 100% private and secure in your browser.',
  },
  '/image-tools': {
    route: '/image-tools',
    title: 'Image Editing & Conversion Tools — PDF Image Studio',
    description: 'Free online image editing tools to compress, resize, crop, convert, and filter photos privately in your browser.',
  },
  '/blog': {
    route: '/blog',
    title: 'Guides & Tutorials — PDF Image Studio Knowledge Base',
    description: 'Read expert guides and tutorials on how to manage, compress, and edit PDF documents and images securely in your web browser.',
  },
  '/sitemap.xml': {
    route: '/sitemap.xml',
    title: 'XML Sitemap — PDF Image Studio',
    description: 'XML sitemap for PDF Image Studio directory.',
  },
};
