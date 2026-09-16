import React, { useState, useEffect, lazy, Suspense } from 'react';
import { I18nProvider } from './i18n/context';
import { ThemeProvider } from './hooks/useTheme';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CommandPalette } from './components/common/CommandPalette';
import { ToolLayout } from './components/common/ToolLayout';
import { HomePage } from './components/pages/HomePage';

// Lazy loaded secondary pages
const AllToolsCatalog = lazy(() => import('./components/pages/AllToolsCatalog').then(m => ({ default: m.AllToolsCatalog })));
const PrivacyPage = lazy(() => import('./components/pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const AboutPage = lazy(() => import('./components/pages/AboutPage').then(m => ({ default: m.AboutPage })));
const TermsPage = lazy(() => import('./components/pages/TermsPage').then(m => ({ default: m.TermsPage })));
const BlogPage = lazy(() => import('./components/pages/BlogPage').then(m => ({ default: m.BlogPage })));

// Lazy loaded PDF Tools
const PdfOrganizer = lazy(() => import('./components/tools/PdfOrganizer').then(m => ({ default: m.PdfOrganizer })));
const PdfMergeTool = lazy(() => import('./components/tools/PdfMergeTool').then(m => ({ default: m.PdfMergeTool })));
const PdfSplitTool = lazy(() => import('./components/tools/PdfSplitTool').then(m => ({ default: m.PdfSplitTool })));
const PdfCompressTool = lazy(() => import('./components/tools/PdfCompressTool').then(m => ({ default: m.PdfCompressTool })));
const PdfRotateTool = lazy(() => import('./components/tools/PdfRotateTool').then(m => ({ default: m.PdfRotateTool })));
const PdfWatermarkTool = lazy(() => import('./components/tools/PdfWatermarkTool').then(m => ({ default: m.PdfWatermarkTool })));
const PdfPageNumbersTool = lazy(() => import('./components/tools/PdfPageNumbersTool').then(m => ({ default: m.PdfPageNumbersTool })));
const PdfMetadataTool = lazy(() => import('./components/tools/PdfMetadataTool').then(m => ({ default: m.PdfMetadataTool })));
const PdfFlattenTool = lazy(() => import('./components/tools/PdfFlattenTool').then(m => ({ default: m.PdfFlattenTool })));
const PdfRedactSanitizeTool = lazy(() => import('./components/tools/PdfRedactSanitizeTool').then(m => ({ default: m.PdfRedactSanitizeTool })));
const TextToPdfTool = lazy(() => import('./components/tools/TextToPdfTool').then(m => ({ default: m.TextToPdfTool })));
const ImagesToPdfTool = lazy(() => import('./components/tools/ImagesToPdfTool').then(m => ({ default: m.ImagesToPdfTool })));
const PdfToImagesTool = lazy(() => import('./components/tools/PdfToImagesTool').then(m => ({ default: m.PdfToImagesTool })));

// Lazy loaded Image Tools
const ImageCompressTool = lazy(() => import('./components/tools/ImageCompressTool').then(m => ({ default: m.ImageCompressTool })));
const ImageResizeTool = lazy(() => import('./components/tools/ImageResizeTool').then(m => ({ default: m.ImageResizeTool })));
const ImageConvertTool = lazy(() => import('./components/tools/ImageConvertTool').then(m => ({ default: m.ImageConvertTool })));
const ImageCropTool = lazy(() => import('./components/tools/ImageCropTool').then(m => ({ default: m.ImageCropTool })));
const ImageRotateFlipTool = lazy(() => import('./components/tools/ImageRotateFlipTool').then(m => ({ default: m.ImageRotateFlipTool })));
const ImageExifTool = lazy(() => import('./components/tools/ImageExifTool').then(m => ({ default: m.ImageExifTool })));
const ImageFilterTool = lazy(() => import('./components/tools/ImageFilterTool').then(m => ({ default: m.ImageFilterTool })));
const ImageColorPaletteTool = lazy(() => import('./components/tools/ImageColorPaletteTool').then(m => ({ default: m.ImageColorPaletteTool })));

// Lazy loaded Batch Tool
const BatchProcessorTool = lazy(() => import('./components/tools/BatchProcessorTool').then(m => ({ default: m.BatchProcessorTool })));

import { TOOLS, getToolByRoute, getToolById } from './data/tools';
import { ToolDefinition } from './types';
import { useFavoritesAndRecents } from './hooks/useFavoritesAndRecents';

export function NuvioApp() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash ? window.location.hash.replace(/^#/, '') : '';
      if (hash && hash.startsWith('/')) return hash;
      return window.location.pathname || '/';
    }
    return '/';
  });
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [preloadedFiles, setPreloadedFiles] = useState<File[]>([]);
  const { addRecent } = useFavoritesAndRecents();

  // Synchronize browser history, popstate, and hashchange
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash ? window.location.hash.replace(/^#/, '') : '';
      const route = (hash && hash.startsWith('/')) ? hash : (window.location.pathname || '/');
      setCurrentRoute(route);
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Update document title, dynamic canonical link, and track recents on route change
  useEffect(() => {
    window.scrollTo(0, 0);

    const tool = getToolByRoute(currentRoute);
    if (tool) {
      document.title = `${tool.name} — PDF Image Studio | Private Browser File Tools`;
      addRecent(tool.id);
    } else if (currentRoute.includes('/sitemap.xml')) {
      document.title = 'XML Sitemap — PDF Image Studio';
    } else if (currentRoute.includes('/pdf-tools')) {
      document.title = 'PDF Utilities & Tools — PDF Image Studio';
    } else if (currentRoute.includes('/image-tools')) {
      document.title = 'Image Editing & Conversion Tools — PDF Image Studio';
    } else if (currentRoute.includes('/privacy')) {
      document.title = 'Privacy Architecture & Guarantee — PDF Image Studio';
    } else if (currentRoute.includes('/about')) {
      document.title = 'About PDF Image Studio — Private Browser File Tools';
    } else if (currentRoute.includes('/terms')) {
      document.title = 'Terms of Service — PDF Image Studio';
    } else if (currentRoute.includes('/blog')) {
      document.title = 'Guides & Tutorials — PDF Image Studio Knowledge Base';
    } else if (currentRoute.includes('/all-tools')) {
      document.title = 'All 18+ Browser File Tools — PDF Image Studio';
    } else {
      document.title = 'PDF Image Studio — Private Browser File Tools';
    }

    // Dynamic canonical link update
    try {
      // 1. Determine clean path without query parameters or hash, normalized
      const cleanPathName = (currentRoute.split('?')[0].split('#')[0] || '/')
        .replace(/\/index\.html$/i, '')
        .replace(/\/+$/, '') || '/';
      
      // Ensure it starts with a '/' if it's not empty, and doesn't end with a '/' unless it's just '/'
      const pathWithSlash = cleanPathName.startsWith('/') ? cleanPathName : `/${cleanPathName}`;
      const normalizedPath = pathWithSlash === '/' ? '' : pathWithSlash;

      // 2. Build official HTTPS clean URL
      const canonicalUrl = `https://pdfimage.pages.dev${normalizedPath}`;

      // 3. Find or create the canonical link tag in the head
      let linkElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.setAttribute('rel', 'canonical');
        document.head.appendChild(linkElement);
      }
      
      linkElement.setAttribute('href', canonicalUrl);
    } catch (error) {
      console.error('Error updating canonical URL:', error);
    }
  }, [currentRoute, addRecent]);

  const navigate = (route: string) => {
    try {
      if (window.location.pathname !== route) {
        window.history.pushState({}, '', route);
      }
    } catch (e) {
      try {
        window.location.hash = `#${route}`;
      } catch (err) {
        // ignore hash error
      }
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilePreload = (files: File[], targetTool?: ToolDefinition) => {
    setPreloadedFiles(files);
    if (targetTool) {
      navigate(targetTool.route);
    } else if (files[0]?.type.includes('pdf')) {
      navigate('/pdf-organizer');
    } else {
      navigate('/image-compressor');
    }
  };

  // Clean and normalize path for static and tool route checking
  const cleanPath = (currentRoute.split('?')[0].split('#')[0] || '/')
    .replace(/\/index\.html$/i, '')
    .replace(/\/+$/, '') || '/';

  // Render view depending on route
  const renderContent = () => {
    // 1. Static and Catalog Pages
    if (cleanPath === '/' || cleanPath === '') {
      return (
        <HomePage
          onNavigate={navigate}
          onFilePreload={handleFilePreload}
          initialCategory="popular"
        />
      );
    }

    if (cleanPath === '/pdf-tools') {
      return (
        <HomePage
          onNavigate={navigate}
          onFilePreload={handleFilePreload}
          initialCategory="pdf"
        />
      );
    }

    if (cleanPath === '/image-tools') {
      return (
        <HomePage
          onNavigate={navigate}
          onFilePreload={handleFilePreload}
          initialCategory="image"
        />
      );
    }

    if (cleanPath === '/all-tools') {
      const urlParams = new URLSearchParams(currentRoute.split('?')[1] || '');
      const cat = (urlParams.get('cat') || 'all') as any;
      return <AllToolsCatalog onNavigate={navigate} initialCategory={cat} />;
    }

    if (cleanPath === '/privacy') {
      return <PrivacyPage onNavigate={navigate} />;
    }

    if (cleanPath === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }

    if (cleanPath === '/terms') {
      return <TermsPage onNavigate={navigate} />;
    }

    if (cleanPath === '/blog') {
      return <BlogPage onNavigate={navigate} />;
    }

    if (cleanPath === '/sitemap.xml' || cleanPath === '/sitemap') {
      return (
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                XML Sitemap — PDF Image Studio
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Index of all valid routes and utilities available on pdfimage.pages.dev
              </p>
            </div>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-2"
            >
              <span>View Raw XML</span>
            </a>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Indexed URLs ({TOOLS.length + 5} Pages)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <button onClick={() => navigate('/')} className="p-2.5 text-left rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold transition">
                https://pdfimage.pages.dev/
              </button>
              <button onClick={() => navigate('/all-tools')} className="p-2.5 text-left rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold transition">
                https://pdfimage.pages.dev/all-tools
              </button>
              {TOOLS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => navigate(t.route)}
                  className="p-2.5 text-left rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 transition"
                >
                  https://pdfimage.pages.dev{t.route}
                </button>
              ))}
              <button onClick={() => navigate('/privacy')} className="p-2.5 text-left rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 transition">
                https://pdfimage.pages.dev/privacy
              </button>
              <button onClick={() => navigate('/about')} className="p-2.5 text-left rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 transition">
                https://pdfimage.pages.dev/about
              </button>
              <button onClick={() => navigate('/terms')} className="p-2.5 text-left rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 transition">
                https://pdfimage.pages.dev/terms
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 2. Interactive Tools Matching
    const currentTool = getToolByRoute(cleanPath);

    if (currentTool) {
      const toolElement = (() => {
        switch (currentTool.id) {
          case 'pdf-organizer':
            return <PdfOrganizer initialFiles={preloadedFiles} />;
          case 'merge-pdf':
            return <PdfMergeTool initialFiles={preloadedFiles} />;
          case 'split-pdf':
            return <PdfSplitTool initialFiles={preloadedFiles} />;
          case 'compress-pdf':
            return <PdfCompressTool initialFiles={preloadedFiles} />;
          case 'pdf-rotate':
            return <PdfRotateTool initialFiles={preloadedFiles} />;
          case 'pdf-watermark':
            return <PdfWatermarkTool initialFiles={preloadedFiles} />;
          case 'pdf-page-numbers':
            return <PdfPageNumbersTool initialFiles={preloadedFiles} />;
          case 'pdf-metadata':
            return <PdfMetadataTool initialFiles={preloadedFiles} />;
          case 'pdf-flatten':
            return <PdfFlattenTool initialFiles={preloadedFiles} />;
          case 'pdf-redact-sanitize':
            return <PdfRedactSanitizeTool initialFiles={preloadedFiles} />;
          case 'text-to-pdf':
            return <TextToPdfTool />;
          case 'images-to-pdf':
            return <ImagesToPdfTool initialFiles={preloadedFiles} />;
          case 'pdf-to-images':
            return <PdfToImagesTool initialFiles={preloadedFiles} />;
          case 'image-compressor':
            return <ImageCompressTool initialFiles={preloadedFiles} />;
          case 'image-resizer':
            return <ImageResizeTool initialFiles={preloadedFiles} />;
          case 'image-converter':
            return <ImageConvertTool initialFiles={preloadedFiles} />;
          case 'image-crop':
            return <ImageCropTool initialFiles={preloadedFiles} />;
          case 'image-rotate-flip':
            return <ImageRotateFlipTool initialFiles={preloadedFiles} />;
          case 'image-strip-exif':
            return <ImageExifTool initialFiles={preloadedFiles} />;
          case 'image-filter':
            return <ImageFilterTool initialFiles={preloadedFiles} />;
          case 'image-color-palette':
            return <ImageColorPaletteTool />;
          case 'batch-processor':
            return <BatchProcessorTool />;
          default:
            return <PdfOrganizer initialFiles={preloadedFiles} />;
        }
      })();

      return (
        <ToolLayout tool={currentTool} onNavigate={navigate}>
          {toolElement}
        </ToolLayout>
      );
    }

    // Fallback: 404 Not Found Page
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
          Page Not Found
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          The file utility or page you requested could not be located.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
        >
          Return to PDF Image Studio Home
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500/20 selection:text-indigo-600">
      {/* Top Header Navigation */}
      <Header
        currentRoute={currentRoute}
        onNavigate={navigate}
        onOpenSearch={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        <Suspense fallback={
          <div className="min-h-[50vh] flex items-center justify-center p-12 text-center">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          {renderContent()}
        </Suspense>
      </main>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={navigate}
        onSelectTool={navigate}
      />

      {/* Trust & Footer */}
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <NuvioApp />
      </I18nProvider>
    </ThemeProvider>
  );
}

