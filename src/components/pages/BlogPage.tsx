import React, { useState } from 'react';
import { ArrowRight, BookOpen, Clock, Tag } from 'lucide-react';

interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  category: 'PDF Guides' | 'Security & Privacy' | 'Image Optimization';
  readTime: string;
  content: string;
}

const ARTICLES: BlogArticle[] = [
  {
    id: 'client-side-privacy',
    title: 'Why Browser-Based PDF Processing is Crucial for Confidential Documents',
    excerpt: 'Traditional online converters upload your tax returns, medical files, and legal agreements to remote servers. Here is why client-side WebAssembly and JavaScript engines are transforming data protection.',
    category: 'Security & Privacy',
    readTime: '4 min read',
    content: `When you upload a confidential contract or healthcare invoice to a conventional cloud converter, that file travels over the public internet and sits on an unknown server hard drive. Even if the service promises to delete files after one hour, your data is exposed to server-side breaches, third-party loggers, and regulatory compliance risks under GDPR and HIPAA.

PDF Image Studio solves this problem by performing 100% of the byte manipulation inside your browser's private sandbox. Using modern WebAssembly and JavaScript typed arrays, PDF Image Studio never transmits document bytes across the wire. When you finish editing and close the browser tab, the memory is instantly scrubbed.`,
  },
  {
    id: 'compress-pdf-guide',
    title: 'How to Compress Large PDFs for Email Attachments Without Blurry Text',
    excerpt: 'Email providers typically cap attachments at 20MB or 25MB. Learn how vector compression, stream flattening, and metadata pruning shrink files while preserving crisp typography.',
    category: 'PDF Guides',
    readTime: '3 min read',
    content: `Many people believe compressing a PDF means lowering font resolution or blurring scan text. In reality, modern PDF compression targets redundant internal objects, uncompressed embedded font tables, and duplicated stream buffers.

With PDF Image Studio Compress PDF, the document layout is parsed, font descriptors are deduplicated, and internal cross-reference tables are repacked without degrading typographic clarity. This allows files to shrink by 40% to 75% while keeping text sharp at any zoom level.`,
  },
  {
    id: 'webp-vs-jpg-png',
    title: 'WebP vs JPEG vs PNG: The Definitive 2026 Image Format Comparison',
    excerpt: 'Choosing the right format can improve web page load speed by 3x. Learn when to convert to WebP, when JPEG is still superior, and when PNG alpha transparency is indispensable.',
    category: 'Image Optimization',
    readTime: '5 min read',
    content: `WebP has achieved universal browser support across Chrome, Safari, Firefox, Edge, and mobile platforms. Compared to standard JPEG, WebP provides 25% to 34% smaller file sizes at equivalent visual fidelity.

Use WebP for website assets, e-commerce product catalogs, and high-resolution blog imagery. Keep JPEG when maximum legacy compatibility or camera raw archival is required. Use PNG specifically when 8-bit or 24-bit transparent alpha channels or pixel-perfect screenshots are non-negotiable.`,
  },
];

interface BlogPageProps {
  onNavigate: (route: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);

  if (selectedArticle) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => setSelectedArticle(null)}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mb-6 inline-flex items-center gap-1.5"
        >
          &larr; Back to all articles
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

        <div className="prose dark:prose-invert text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 whitespace-pre-line">
          {selectedArticle.content}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <button
            onClick={() => setSelectedArticle(null)}
            className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            &larr; Back
          </button>
          <button
            onClick={() => onNavigate('/all-tools')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
          >
            Launch Tools Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Guides & Insights</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          PDF Image Studio Knowledge Base
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Master file compression, document security, and image optimization with expert browser engineering tutorials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <span>Read Guide</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
