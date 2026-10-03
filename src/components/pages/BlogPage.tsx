import React, { useState } from 'react';
import { ArrowRight, BookOpen, Clock, Tag, ChevronRight, FileText, Image } from 'lucide-react';
import { useTranslation } from '../../i18n/context';

interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  category: 'PDF Guides' | 'Security & Privacy' | 'Image Optimization' | 'Technical Insights';
  readTime: string;
  content: string;
  targetToolRoute?: string;
}

const ARTICLES: BlogArticle[] = [
  {
    id: 'how-to-merge-pdf-files',
    title: 'How to Merge PDF Files Safely and Rearrange Page Order',
    excerpt: 'Combining separate PDF files into a single document is one of the most common administrative tasks. Learn how to securely upload multiple documents, reorganize file sequences, and merge them on your own terms.',
    category: 'PDF Guides',
    readTime: '4 min read',
    targetToolRoute: '/merge-pdf',
    content: `### Introduction
Merging PDF documents often involves compiling distinct sections—like reports, billing statements, or resumes—into a clean, unified presentation. While conventional online utilities require uploading these private files to cloud queues, you can complete the process inside your local workspace.

### Step-by-Step Instructions
1. **Prepare Your Files**: Collect the separate PDF documents you wish to combine on your computer or phone.
2. **Add Your Documents**: Drag and drop the selected files into the PDF Merge tool workspace. The tool parses each document's internal structures locally.
3. **Arrange Page & Document Order**: Use the drag-and-drop handles on the visual file cards to position each document exactly where you want it. This ensures pages flow seamlessly from first to last.
4. **Compile and Download**: Click the "Merge PDF" button. The client-side compiler merges the underlying objects, cross-reference tables, and typography streams into a new unified PDF stream in browser memory for instant download.

### Best Practices for File Organization
* **Check Page Orientation**: Verify if any files have horizontal (landscape) pages mixed with vertical (portrait) pages. A standard client-side merger will preserve these layouts automatically.
* **Keep Original Backups**: Always retain your individual source files. Once compiled, splitting pages again requires parsing the merged file.`,
  },
  {
    id: 'how-to-split-a-pdf',
    title: 'How to Split a PDF Into Separate Documents and Page Ranges',
    excerpt: 'Extracting key sections or individual pages from a bloated PDF is vital for clean document sharing. Learn how to configure custom split-ranges or extract every single page cleanly.',
    category: 'PDF Guides',
    readTime: '3 min read',
    targetToolRoute: '/split-pdf',
    content: `### Introduction
Large PDF manuals, tax submissions, or design bundles often contain pages that do not apply to all recipients. Splitting the document into smaller, target-specific files ensures clarity and keeps file sizes manageable.

### Step-by-Step Instructions
1. **Choose Your PDF**: Open the Split PDF utility and select the document you need to divide.
2. **Review the Layout**: The client-side parser reads the file structure to detect total pages and internal structural bookmarks.
3. **Configure Your Split Profile**:
   * *Custom Ranges*: Input specific page ranges (e.g., "1-3, 5, 8-12") to carve out specific chapters.
   * *Split-Every-Page*: Choose this to extract every single page into its own individual single-page PDF.
4. **Process and Download**: Click "Split PDF". The browser isolates the target page dictionaries and bundles the resulting files as a ZIP archive for convenient extraction.

### Tips for Large Document Splitting
* **Verify Page Numbers**: Standard PDF pages are indexed from 1. Double-check your page references inside a viewer before entering split ranges.
* **Preserve Interactive Forms**: Note that splitting complex forms can flatten interactive fields. Make sure to audit the outputs.`,
  },
  {
    id: 'how-to-compress-a-pdf-without-losing-too-much-quality',
    title: 'How to Compress a PDF File Size Without Blurring Text Clarity',
    excerpt: 'Reduce bloated file sizes for email attachments while keeping typography crisp. Learn how vector compression, stream flattening, and metadata pruning work.',
    category: 'PDF Guides',
    readTime: '4 min read',
    targetToolRoute: '/compress-pdf',
    content: `### Introduction
Email services typically cap attachments at 20MB or 25MB. Simply lower-resolution conversion of PDF pages into fuzzy images is a poor way to save space. Modern compression should target structural redundancies without compromising typographic readability.

### How Compression Works Without Blurry Text
* **Vector Path Pruning**: Removing duplicate stroke records and drawing streams.
* **Font Table Deduplication**: Parsing and sub-setting embedded TrueType and OpenType font descriptions so only the characters actually used are saved.
* **Metadata Scraping**: Pruning redundant thumbnails, XML tags, and editing histories.

### Step-by-Step Instructions
1. **Select the Source PDF**: Load your file into the Compress PDF tool.
2. **Choose Compression Strength**:
   * *Recommended/Medium*: Balanced parameters preserving clear scanned text and image resolution while achieving significant file-size savings.
   * *Extreme Compression*: Maximizes space savings for simple text documents.
3. **Process and Save**: Let the browser parse, compress, and repack the PDF streams, then download the resulting compact file immediately.`,
  },
  {
    id: 'how-to-convert-jpg-images-to-pdf',
    title: 'How to Convert Multiple JPG/PNG Images Into a Clean PDF',
    excerpt: 'Convert photo snapshots, physical document scans, or design layouts into a unified, professional PDF document for portfolio sharing or official submission.',
    category: 'Image Optimization',
    readTime: '3 min read',
    targetToolRoute: '/images-to-pdf',
    content: `### Introduction
Submitting job applications, expense receipts, or design assets often requires a single PDF rather than dozens of loose JPG or PNG images. Converting and organizing images into a PDF layout ensures consistent margins, proper rotation, and easy viewing.

### Step-by-Step Instructions
1. **Collect Your Images**: Group all photos or drawings on your computer or smartphone workspace.
2. **Add to Workspace**: Drag them into the Images to PDF tool.
3. **Configure the Page Layout**:
   * *Page Margins*: Choose zero margins for full-bleed graphics, or small margins to create a clean border.
   * *Page Orientation*: Select portrait or landscape alignment, or let the converter determine it automatically based on each image's aspect ratio.
4. **Compile PDF**: Click "Create PDF" to bundle the images as compressed objects inside a standard PDF structure, ready for instant local saving.`,
  },
  {
    id: 'how-to-convert-pdf-pages-to-images',
    title: 'How to Convert PDF Document Pages to High-Resolution Images',
    excerpt: 'Extract crisp JPG or PNG images from your PDF files directly. Perfect for sharing presentation slides or specific report graphics on social media and slides.',
    category: 'PDF Guides',
    readTime: '3 min read',
    targetToolRoute: '/pdf-to-images',
    content: `### Introduction
Sometimes you need to present slide layouts or document previews on platforms that do not support inline PDF reading, such as social feeds or presentation slides. Converting each page of a PDF document into a standalone image is the standard solution.

### Step-by-Step Instructions
1. **Load Your PDF**: Import the target document into the PDF to Images converter.
2. **Select Target Format & Scale**:
   * *PNG Format*: Best for documents containing high-contrast text, formulas, or diagrams.
   * *JPG Format*: Best for continuous-tone photography and large scanned catalogs.
   * *DPI Selection*: Pick 150 DPI for web previews, or 200–300 DPI for high-quality presentations.
3. **Convert locally**: Let the browser parse and draw the vector canvas of each page, converting it to the selected format.
4. **Download**: Save individual pages as needed, or export the entire set bundled inside a single ZIP file.`,
  },
  {
    id: 'how-to-resize-images-for-web-use',
    title: 'How to Resize Images for Fast Web Performance and Load Times',
    excerpt: 'Learn how to downscale image pixel dimensions and aspect ratios to match web standards, significantly boosting page load speed and user retention.',
    category: 'Image Optimization',
    readTime: '4 min read',
    targetToolRoute: '/image-resizer',
    content: `### Introduction
Modern cameras capture photos with huge resolutions (often 4000px wide or more). Uploading these unresized files to a website slows down performance, hurts search engine rankings, and wastes user bandwidth. Downscaling pixel widths is the easiest way to boost web page speeds.

### Understanding Aspect Ratios & Web Standards
* **E-Commerce Catalogs**: Typically use square 1:1 layouts (e.g., 800x800 or 1200x1200px).
* **Hero Banners**: Typically use widescreen 16:9 formats (e.g., 1920x1080px).
* **Blog Post Imagery**: Standard dimensions of 1200px width are widely recommended.

### Step-by-Step Instructions
1. **Import the Photo**: Load your image into the Resize Image tool workspace.
2. **Select Resizing Profile**:
   * *By Pixels*: Set the target width (e.g., 1200px) and keep "Maintain Aspect Ratio" checked to avoid distortion.
   * *By Percentage*: Scale down by 25%, 50%, or 75% for quick, proportional resizing.
3. **Optimize and Download**: Click "Resize Image" and download the optimized output.`,
  },
  {
    id: 'webp-vs-jpg-png-comparison',
    title: 'JPG vs PNG vs WebP: Which Image Format Should You Choose?',
    excerpt: 'Choosing the right format can improve web page load speed by up to 3x. Learn when to convert to WebP, when JPEG is still superior, and when PNG alpha transparency is indispensable.',
    category: 'Image Optimization',
    readTime: '5 min read',
    targetToolRoute: '/image-converter',
    content: `### Introduction
Web design, file management, and document preparation require careful choice of image file formats. Using the wrong format can result in either bloated file sizes or low-quality, pixelated text.

### JPG (JPEG)
* **Best Used For**: Continuous-tone photography, scanned color documents, natural landscapes.
* **Characteristics**: Lossy compression. Excellent at maintaining colors with small file sizes.
* **Limitations**: Does not support transparent background layers; compresses sharp text with blurry artifacts.

### PNG
* **Best Used For**: Screenshots, user interface designs, logo designs, sharp vector-like text, transparent assets.
* **Characteristics**: Lossless compression. Preserves pixel-perfect transparency layers (Alpha channel).
* **Limitations**: Much larger file sizes compared to JPG for rich photos.

### WebP
* **Best Used For**: Modern web assets, blogs, product catalogs, online listings.
* **Characteristics**: Developed by Google, WebP supports both lossy and lossless modes, alpha transparency, and animation. Offers 25% to 35% smaller file sizes compared to JPG or PNG at identical quality levels.
* **Limitations**: Minimal compatibility issues with older, legacy software systems.`,
  },
  {
    id: 'how-to-remove-metadata-from-images',
    title: 'How to Strip GPS, Location, and EXIF Metadata From Photos',
    excerpt: 'Every smartphone photo contains hidden metadata (EXIF) detailing your location, date, time, and camera model. Learn how to strip this sensitive data before sharing.',
    category: 'Security & Privacy',
    readTime: '3 min read',
    targetToolRoute: '/image-strip-exif',
    content: `### Introduction
When you capture a picture with a modern smartphone, the device automatically inserts an Exchangeable Image File Format (EXIF) tag into the file. This hidden metadata can contain exact GPS coordinates of your home, the timestamp, and specific device parameters. Stripping this data before publishing is a smart privacy precaution.

### Step-by-Step Instructions
1. **Choose Your Photos**: Select the images from which you want to remove metadata.
2. **Load into Workspace**: Drag and drop the images into our metadata-removal tool.
3. **Clean EXIF Data**: The tool parses the file structures locally, strips the EXIF markers, and copies the raw pixel matrix into a clean image container.
4. **Save Clean Photos**: Download the newly generated photos, which are now free of camera details, timestamps, and GPS coordinates.`,
  },
  {
    id: 'how-to-reduce-image-file-size',
    title: 'How to Safely Compress and Reduce Image File Size',
    excerpt: 'Struggling with slow upload limits on online applications? Learn how lossy and lossless photo compression algorithms shrink file footprints with minimal visual impact.',
    category: 'Image Optimization',
    readTime: '4 min read',
    targetToolRoute: '/image-compressor',
    content: `### Introduction
Many government websites, visa portals, and academic applications restrict photo file submissions to small limits like 500KB or 1MB. If your captured image exceeds these sizes, you must optimize it to meet the requirements without making the photo blurry.

### Understanding Compression Methods
* **Lossless Compression**: Re-encodes file data patterns to save space. Best for retaining perfect quality.
* **Lossy Compression**: Prunes minor color variations that are barely noticeable to the human eye. This method achieves maximum space savings, making it ideal for large photographic images.

### Step-by-Step Instructions
1. **Import Your Photo**: Load your image file (JPG, PNG, or WebP) into the compressor.
2. **Select Compression Profile**: Set your target quality percentage. A setting between 75% and 85% is typically a great sweet spot.
3. **Verify and Save**: Review the estimated output size and download your optimized image.`,
  },
  {
    id: 'how-browser-based-file-processing-works',
    title: 'Under the Hood: How Browser-Based File Processing Works',
    excerpt: 'Curious how complex PDF merges or photo crops run directly inside your browser window without uploading files to our servers? Explore the modern browser technologies behind PDF Image Studio.',
    category: 'Technical Insights',
    readTime: '5 min read',
    targetToolRoute: '/privacy',
    content: `### Introduction
For years, file conversion meant uploading private data to cloud services. Today, modern web standards allow browsers to compile files directly within their sandboxed javascript workspace.

### Key Browser Technologies We Use
* **HTML5 Canvas API**: Used to draw, scale, crop, and convert images locally.
* **ArrayBuffers & Typed Arrays**: Standard JavaScript structures that handle raw binary streams of PDF documents within browser memory.
* **WebAssembly (Wasm)**: Compiles high-performance document libraries into lightweight instructions that run locally with near-native hardware speed.
* **Service Workers**: Enable PWA features, saving tools to local storage for offline use.

### The Benefits
This design gives you instant processing speeds, lets you work offline, saves data transfer costs, and ensures your private documents remain strictly within your local browser workspace.`,
  },
];

interface BlogPageProps {
  onNavigate: (route: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
  const { language } = useTranslation();
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);

  const isAr = language === 'ar';

  if (selectedArticle) {
    return (
      <div dir={isAr ? 'rtl' : 'ltr'} className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <button
          onClick={() => setSelectedArticle(null)}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mb-6 inline-flex items-center gap-1.5"
        >
          {isAr ? '← العودة لجميع المقالات والأدلة' : '← Back to all articles'}
        </button>

        <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
          <span className="font-bold text-indigo-600 dark:text-indigo-400">
            {selectedArticle.category}
          </span>
          <span>&bull;</span>
          <span>{selectedArticle.readTime}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
          {selectedArticle.title}
        </h1>

        <div className="prose dark:prose-invert text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed space-y-6 whitespace-pre-line">
          {selectedArticle.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={index} className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-2">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('* ')) {
              return (
                <ul key={index} className="list-disc pl-5 rtl:pl-0 rtl:pr-5 space-y-2 text-xs sm:text-sm">
                  {paragraph.split('\n').map((li, liIdx) => (
                    <li key={liIdx}>{li.replace('* ', '')}</li>
                  ))}
                </ul>
              );
            }
            if (paragraph.startsWith('1. ')) {
              return (
                <ol key={index} className="list-decimal pl-5 rtl:pl-0 rtl:pr-5 space-y-2 text-xs sm:text-sm">
                  {paragraph.split('\n').map((li, liIdx) => (
                    <li key={liIdx}>{li.replace(/^\d+\.\s*/, '')}</li>
                  ))}
                </ol>
              );
            }
            return (
              <p key={index} className="text-xs sm:text-sm leading-relaxed text-slate-650 dark:text-slate-350">
                {paragraph}
              </p>
            );
          })}
        </div>

        {selectedArticle.targetToolRoute && (
          <div className="mt-8 p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {selectedArticle.category === 'PDF Guides' ? (
                <FileText className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              ) : (
                <Image className="w-8 h-8 text-sky-600 dark:text-sky-400" />
              )}
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isAr ? 'هل تريد تجربة هذه الأداة الآن؟' : 'Ready to use this tool?'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isAr ? 'جرب المعالجة السريعة والآمنة مباشرة في متصفحك.' : 'Process your files securely right inside your browser window.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate(selectedArticle.targetToolRoute!)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm"
            >
              {isAr ? 'افتح الأداة الآن' : 'Launch Interactive Tool'}
            </button>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <button
            onClick={() => setSelectedArticle(null)}
            className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            {isAr ? '← عودة' : '← Back'}
          </button>
          <button
            onClick={() => onNavigate('/all-tools')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
          >
            {isAr ? 'فتح دليل الأدوات' : 'Launch Tools Catalog'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{isAr ? 'الأدلة والمعارف' : 'Guides & Insights'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {isAr ? 'الأدلة والتعليمات لـ PDF Image Studio' : 'PDF Image Studio Knowledge Base'}
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          {isAr
            ? 'تعلم كيفية تنظيم الـ PDF، وضغط الملفات، وتحسين الصور بسهولة باستخدام أدلة فنية مفصلة.'
            : 'Master file compression, document security, and image optimization with expert browser engineering tutorials.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ARTICLES.map((art) => (
          <div
            key={art.id}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-indigo-400 dark:hover:border-indigo-500 shadow-2xs hover:shadow-md transition-all cursor-pointer"
            onClick={() => setSelectedArticle(art)}
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {art.category}
                </span>
                <span className="flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3" /> {art.readTime}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2 line-clamp-2">
                {art.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {art.excerpt}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span>{isAr ? 'اقرأ الدليل' : 'Read Guide'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 rtl:rotate-180 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
