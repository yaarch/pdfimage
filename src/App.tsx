import React, { useState, useEffect, lazy, Suspense, useMemo } from 'react';
import { I18nProvider, useTranslation } from './i18n/context';
import { ThemeProvider } from './hooks/useTheme';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CommandPalette } from './components/common/CommandPalette';
import { ToolLayout } from './components/common/ToolLayout';
import { HomePage } from './components/pages/HomePage';
import { SEOHead } from './components/common/SEOHead';
import { extractLanguageAndPath, formatLocalizedRoute, SUPPORTED_LANGUAGES } from './i18n/urlUtils';
import { getLocalizedTool } from './i18n/toolTranslations';

// Lazy loaded secondary pages
const AllToolsCatalog = lazy(() => import('./components/pages/AllToolsCatalog').then(m => ({ default: m.AllToolsCatalog })));
const PrivacyPage = lazy(() => import('./components/pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const AboutPage = lazy(() => import('./components/pages/AboutPage').then(m => ({ default: m.AboutPage })));
const TermsPage = lazy(() => import('./components/pages/TermsPage').then(m => ({ default: m.TermsPage })));
const BlogPage = lazy(() => import('./components/pages/BlogPage').then(m => ({ default: m.BlogPage })));
const SitemapView = lazy(() => import('./components/common/SitemapView').then(m => ({ default: m.SitemapView })));

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
const PdfExtractTextTool = lazy(() => import('./components/tools/PdfExtractTextTool').then(m => ({ default: m.PdfExtractTextTool })));
const PdfSignTool = lazy(() => import('./components/tools/PdfSignTool').then(m => ({ default: m.PdfSignTool })));

// Lazy loaded Image Tools
const ImageCompressTool = lazy(() => import('./components/tools/ImageCompressTool').then(m => ({ default: m.ImageCompressTool })));
const ImageResizeTool = lazy(() => import('./components/tools/ImageResizeTool').then(m => ({ default: m.ImageResizeTool })));
const ImageConvertTool = lazy(() => import('./components/tools/ImageConvertTool').then(m => ({ default: m.ImageConvertTool })));
const ImageCropTool = lazy(() => import('./components/tools/ImageCropTool').then(m => ({ default: m.ImageCropTool })));
const ImageRotateFlipTool = lazy(() => import('./components/tools/ImageRotateFlipTool').then(m => ({ default: m.ImageRotateFlipTool })));
const ImageExifTool = lazy(() => import('./components/tools/ImageExifTool').then(m => ({ default: m.ImageExifTool })));
const ImageFilterTool = lazy(() => import('./components/tools/ImageFilterTool').then(m => ({ default: m.ImageFilterTool })));
const ImageColorPaletteTool = lazy(() => import('./components/tools/ImageColorPaletteTool').then(m => ({ default: m.ImageColorPaletteTool })));
const ImageWatermarkTool = lazy(() => import('./components/tools/ImageWatermarkTool').then(m => ({ default: m.ImageWatermarkTool })));
const ImageBase64Tool = lazy(() => import('./components/tools/ImageBase64Tool').then(m => ({ default: m.ImageBase64Tool })));
const ImageBorderRoundTool = lazy(() => import('./components/tools/ImageBorderRoundTool').then(m => ({ default: m.ImageBorderRoundTool })));

// Lazy loaded Batch Tool
const BatchProcessorTool = lazy(() => import('./components/tools/BatchProcessorTool').then(m => ({ default: m.BatchProcessorTool })));

import { TOOLS, getToolByRoute } from './data/tools';
import { ToolDefinition } from './types';
import { useFavoritesAndRecents } from './hooks/useFavoritesAndRecents';

function MainAppContent() {
  const { language, setLanguage } = useTranslation();
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

  // Extract language code and pure path from current route
  const { language: routeLang, purePath } = useMemo(() => {
    return extractLanguageAndPath(currentRoute);
  }, [currentRoute]);

  // Synchronize language when URL has a language prefix
  useEffect(() => {
    if (routeLang && routeLang !== language) {
      setLanguage(routeLang);
    }
  }, [routeLang, language, setLanguage]);

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

  // Determine currently active tool if any
  const currentTool = useMemo(() => {
    return getToolByRoute(purePath) || getToolByRoute(currentRoute);
  }, [purePath, currentRoute]);

  // Track recent tools
  useEffect(() => {
    if (currentTool) {
      addRecent(currentTool.id);
    }
  }, [currentTool, addRecent]);

  const navigate = (targetRoute: string) => {
    try {
      if (window.location.pathname !== targetRoute) {
        window.history.pushState({}, '', targetRoute);
      }
    } catch {
      try {
        window.location.hash = `#${targetRoute}`;
      } catch {
        // ignore hash error
      }
    }
    setCurrentRoute(targetRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilePreload = (files: File[], targetTool?: ToolDefinition) => {
    setPreloadedFiles(files);
    const dest = targetTool ? targetTool.route : files[0]?.type.includes('pdf') ? '/pdf-organizer' : '/image-compressor';
    const localizedDest = formatLocalizedRoute(dest, language, language !== 'en');
    navigate(localizedDest);
  };

  // Clean path without trailing slashes
  const cleanPath = purePath.replace(/\/+$/, '') || '/';

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

    if (
      cleanPath === '/sitemap' ||
      cleanPath === '/sitemap.xml' ||
      cleanPath.startsWith('/sitemap-')
    ) {
      return <SitemapView onNavigate={navigate} />;
    }

    // 2. Interactive Tools Matching
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
          case 'image-watermark':
            return <ImageWatermarkTool initialFiles={preloadedFiles} />;
          case 'image-base64':
            return <ImageBase64Tool initialFiles={preloadedFiles} />;
          case 'image-border-round':
            return <ImageBorderRoundTool initialFiles={preloadedFiles} />;
          case 'pdf-extract-text':
            return <PdfExtractTextTool initialFiles={preloadedFiles} />;
          case 'pdf-sign':
            return <PdfSignTool initialFiles={preloadedFiles} />;
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
          onClick={() => navigate(formatLocalizedRoute('/', language, language !== 'en'))}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
        >
          Return to PDF Image Studio Home
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500/20 selection:text-indigo-600">
      {/* Comprehensive Dynamic SEO Head */}
      <SEOHead purePath={cleanPath} currentLanguage={language} tool={currentTool} />

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

export function NuvioApp() {
  return <MainAppContent />;
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <MainAppContent />
      </I18nProvider>
    </ThemeProvider>
  );
}
