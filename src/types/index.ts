export type ToolCategory = 'pdf' | 'image' | 'convert' | 'compress' | 'organize' | 'security';

export interface ToolDefinition {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  category: ToolCategory;
  acceptedMimeTypes: string[];
  acceptedExtensions: string[];
  maxFiles: number;
  route: string;
  iconName: string;
  popular?: boolean;
  isFlagship?: boolean;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  relatedToolIds: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export interface ProcessedFileResult {
  id: string;
  originalName: string;
  originalSize: number;
  processedBlob: Blob;
  processedUrl: string;
  outputName: string;
  outputSize: number;
  mimeType: string;
  savingsPercent?: number;
  metadata?: Record<string, string | number | boolean>;
}

export interface BatchItem {
  id: string;
  file: File;
  name: string;
  size: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  result?: ProcessedFileResult;
  errorMessage?: string;
}

export interface PdfPageItem {
  id: string;
  originalPageIndex: number;
  displayPageNumber: number;
  rotation: number; // 0, 90, 180, 270
  selected: boolean;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type LanguageCode = 'en' | 'ar' | 'es' | 'fr' | 'de';

export interface ArticlePreview {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  description: string;
  content: string[];
}
