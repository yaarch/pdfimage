import React, { useState, useEffect } from 'react';
import { I18nProvider } from './i18n/context';
import { ThemeProvider } from './hooks/useTheme';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CommandPalette } from './components/common/CommandPalette';
import { ToolLayout } from './components/common/ToolLayout';
import { HomePage } from './components/pages/HomePage';
import { AllToolsCatalog } from './components/pages/AllToolsCatalog';
import { PrivacyPage } from './components/pages/PrivacyPage';
import { AboutPage } from './components/pages/AboutPage';
import { TermsPage } from './components/pages/TermsPage';
import { BlogPage } from './components/pages/BlogPage';

// PDF Tools
import { PdfOrganizer } from './components/tools/PdfOrganizer';
import { PdfMergeTool } from './components/tools/PdfMergeTool';
import { PdfSplitTool } from './components/tools/PdfSplitTool';
import { PdfCompressTool } from './components/tools/PdfCompressTool';
import { PdfRotateTool } from './components/tools/PdfRotateTool';
import { PdfWatermarkTool } from './components/tools/PdfWatermarkTool';
import { PdfPageNumbersTool } from './components/tools/PdfPageNumbersTool';
import { PdfMetadataTool } from './components/tools/PdfMetadataTool';
import { PdfFlattenTool } from './components/tools/PdfFlattenTool';
import { PdfRedactSanitizeTool } from './components/tools/PdfRedactSanitizeTool';
import { TextToPdfTool } from './components/tools/TextToPdfTool';
import { ImagesToPdfTool } from './components/tools/ImagesToPdfTool';
import { PdfToImagesTool } from './components/tools/PdfToImagesTool';

// Image Tools
import { ImageCompressTool } from './components/tools/ImageCompressTool';
import { ImageResizeTool } from './components/tools/ImageResizeTool';
import { ImageConvertTool } from './components/tools/ImageConvertTool';
import { ImageCropTool } from './components/tools/ImageCropTool';
import { ImageRotateFlipTool } from './components/tools/ImageRotateFlipTool';
import { ImageExifTool } from './components/tools/ImageExifTool';
import { ImageFilterTool } from './components/tools/ImageFilterTool';
import { ImageColorPaletteTool } from './components/tools/ImageColorPaletteTool';

// Batch Tool
import { BatchProcessorTool } from './components/tools/BatchProcessorTool';

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

  // Update document title and track recents on route change
  useEffect(() => {
    window.scrollTo(0, 0);

    const tool = getToolByRoute(currentRoute);
    if (tool) {
      document.title = `${tool.name} — NUVIO | Private Browser File Tools`;
      addRecent(tool.id);
    } else if (currentRoute.includes('/pdf-tools')) {
      document.title = 'PDF Utilities & Tools — NUVIO';
    } else if (currentRoute.includes('/image-tools')) {
      document.title = 'Image Editing & Conversion Tools — NUVIO';
    } else if (currentRoute.includes('/privacy')) {
      document.title = 'Privacy Architecture & Guarantee — NUVIO';
    } else if (currentRoute.includes('/about')) {
      document.title = 'About NUVIO — Your Files. Your Way.';
    } else if (currentRoute.includes('/terms')) {
      document.title = 'Terms of Service — NUVIO';
    } else if (currentRoute.includes('/blog')) {
      document.title = 'Guides & Tutorials — NUVIO Knowledge Base';
    } else if (currentRoute.includes('/all-tools')) {
      document.title = 'All 18+ Browser File Tools — NUVIO';
    } else {
      document.title = 'NUVIO — Your files. Your way. | Private Browser File Tools';
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
          Return to NUVIO Home
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
      <main className="flex-1">{renderContent()}</main>

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

