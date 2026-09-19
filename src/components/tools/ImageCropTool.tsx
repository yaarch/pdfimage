import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Crop,
  Download,
  AlertCircle,
  Sparkles,
  RefreshCw,
  UploadCloud,
  Check,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Maximize2,
  Minimize2,
  Copy,
  Sliders,
  Image as ImageIcon,
  User,
  Grid,
  CheckCircle2,
  Layers,
  ZoomIn,
  Square,
  Circle,
  Eye,
} from 'lucide-react';
import { cropImage, getImageDimensions, ImageDimensions, CropImageOptions } from '../../lib/imageUtils';
import { triggerDownload, formatBytes } from '../../lib/zipUtils';
import { useTranslation } from '../../i18n/context';

interface ImageCropToolProps {
  initialFiles?: File[];
}

type AspectRatioPreset =
  | 'free'
  | '1:1'
  | 'circle'
  | '4:5'
  | '9:16'
  | '16:9'
  | '4:3'
  | '3:2'
  | '3:1';

interface HandleType {
  cursor: string;
  type: 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';
}

const HANDLES: HandleType[] = [
  { type: 'nw', cursor: 'nwse-resize' },
  { type: 'n', cursor: 'ns-resize' },
  { type: 'ne', cursor: 'nesw-resize' },
  { type: 'e', cursor: 'ew-resize' },
  { type: 'se', cursor: 'nwse-resize' },
  { type: 's', cursor: 'ns-resize' },
  { type: 'sw', cursor: 'nesw-resize' },
  { type: 'w', cursor: 'ew-resize' },
];

export const ImageCropTool: React.FC<ImageCropToolProps> = ({ initialFiles = [] }) => {
  const { language, t } = useTranslation();
  const [file, setFile] = useState<File | null>(
    initialFiles.find((f) => f.type.startsWith('image/')) || initialFiles[0] || null
  );

  useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      const img = initialFiles.find((f) => f.type.startsWith('image/')) || initialFiles[0];
      if (img) {
        setFile(img);
        setCroppedBlob(null);
        setError(null);
      }
    }
  }, [initialFiles]);

  const [dimensions, setDimensions] = useState<ImageDimensions | null>(null);
  const [aspectPreset, setAspectPreset] = useState<AspectRatioPreset>('1:1');
  const [showGrid, setShowGrid] = useState(true);

  // Original image pixel coordinates
  const [cropX, setCropX] = useState<number>(0);
  const [cropY, setCropY] = useState<number>(0);
  const [cropW, setCropW] = useState<number>(300);
  const [cropH, setCropH] = useState<number>(300);

  // Transforms
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  // Export options
  const [exportFormat, setExportFormat] = useState<'original' | 'image/png' | 'image/jpeg' | 'image/webp'>('original');
  const [quality, setQuality] = useState<number>(0.92);

  // UI state
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Canvas / container ref for coordinate calculations
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [renderedImgRect, setRenderedImgRect] = useState<{ left: number; top: number; width: number; height: number }>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  // Interaction dragging state
  const dragRef = useRef<{
    isDragging: boolean;
    dragType: 'move' | 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | null;
    startX: number;
    startY: number;
    startCropX: number;
    startCropY: number;
    startCropW: number;
    startCropH: number;
  }>({
    isDragging: false,
    dragType: null,
    startX: 0,
    startY: 0,
    startCropX: 0,
    startCropY: 0,
    startCropW: 0,
    startCropH: 0,
  });

  // Load image dimensions and setup default crop
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setCroppedBlob(null);
      setCroppedPreviewUrl(null);
      setRotationAngle(0);
      setFlipH(false);
      setFlipV(false);

      getImageDimensions(file)
        .then((dim) => {
          setDimensions(dim);
          // Initial centered 1:1 square crop
          const minDim = Math.min(dim.width, dim.height);
          const size = Math.round(minDim * 0.85);
          const x = Math.round((dim.width - size) / 2);
          const y = Math.round((dim.height - size) / 2);
          setCropW(size);
          setCropH(size);
          setCropX(x);
          setCropY(y);
        })
        .catch((err) => {
          console.error(err);
          setError(language === 'ar' ? 'تعذر قراءة أبعاد الصورة' : 'Could not read image dimensions');
        });

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file, language]);

  // Clean up cropped preview URL
  useEffect(() => {
    if (croppedBlob) {
      const url = URL.createObjectURL(croppedBlob);
      setCroppedPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [croppedBlob]);

  // Update rendered image bounds on window resize or image load
  const updateRenderedBounds = useCallback(() => {
    if (!imgRef.current || !containerRef.current) return;
    const imgEl = imgRef.current;
    const containerEl = containerRef.current;

    const imgRect = imgEl.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();

    setRenderedImgRect({
      left: imgRect.left - containerRect.left,
      top: imgRect.top - containerRect.top,
      width: imgRect.width,
      height: imgRect.height,
    });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updateRenderedBounds);
    const timer = setTimeout(updateRenderedBounds, 100);
    return () => {
      window.removeEventListener('resize', updateRenderedBounds);
      clearTimeout(timer);
    };
  }, [updateRenderedBounds, previewUrl, dimensions]);

  // Preset aspect ratio calculations
  const applyPreset = (preset: AspectRatioPreset) => {
    setAspectPreset(preset);
    if (!dimensions) return;

    const imgW = dimensions.width;
    const imgH = dimensions.height;

    let targetRatio: number | null = null;

    if (preset === '1:1' || preset === 'circle') targetRatio = 1;
    else if (preset === '4:5') targetRatio = 4 / 5;
    else if (preset === '9:16') targetRatio = 9 / 16;
    else if (preset === '16:9') targetRatio = 16 / 9;
    else if (preset === '4:3') targetRatio = 4 / 3;
    else if (preset === '3:2') targetRatio = 3 / 2;
    else if (preset === '3:1') targetRatio = 3 / 1;

    if (targetRatio === null) {
      // Free mode: keep current or default to 80% box
      return;
    }

    let newW = imgW * 0.85;
    let newH = newW / targetRatio;

    if (newH > imgH * 0.85) {
      newH = imgH * 0.85;
      newW = newH * targetRatio;
    }

    newW = Math.round(newW);
    newH = Math.round(newH);
    const newX = Math.round((imgW - newW) / 2);
    const newY = Math.round((imgH - newH) / 2);

    setCropW(newW);
    setCropH(newH);
    setCropX(newX);
    setCropY(newY);
  };

  // Center crop action
  const handleCenterCrop = () => {
    if (!dimensions) return;
    setCropX(Math.round((dimensions.width - cropW) / 2));
    setCropY(Math.round((dimensions.height - cropH) / 2));
  };

  // Maximize / Fit to full image preserving current ratio
  const handleFitToEdges = () => {
    if (!dimensions) return;
    const ratio = cropW / cropH;
    let newW = dimensions.width;
    let newH = Math.round(newW / ratio);

    if (newH > dimensions.height) {
      newH = dimensions.height;
      newW = Math.round(newH * ratio);
    }

    setCropW(newW);
    setCropH(newH);
    setCropX(Math.round((dimensions.width - newW) / 2));
    setCropY(Math.round((dimensions.height - newH) / 2));
  };

  // Reset to initial
  const handleReset = () => {
    if (!dimensions) return;
    setRotationAngle(0);
    setFlipH(false);
    setFlipV(false);
    applyPreset('1:1');
    setCroppedBlob(null);
  };

  // Pointer drag & resize handlers
  const handlePointerDown = (
    e: React.PointerEvent,
    type: 'move' | 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'
  ) => {
    e.preventDefault();
    e.stopPropagation();

    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    dragRef.current = {
      isDragging: true,
      dragType: type,
      startX: e.clientX,
      startY: e.clientY,
      startCropX: cropX,
      startCropY: cropY,
      startCropW: cropW,
      startCropH: cropH,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.isDragging || !dimensions || renderedImgRect.width === 0) return;

    const scaleX = dimensions.width / renderedImgRect.width;
    const scaleY = dimensions.height / renderedImgRect.height;

    const deltaX = (e.clientX - dragRef.current.startX) * scaleX;
    const deltaY = (e.clientY - dragRef.current.startY) * scaleY;

    const { dragType, startCropX, startCropY, startCropW, startCropH } = dragRef.current;
    const imgW = dimensions.width;
    const imgH = dimensions.height;

    // Determine target ratio if locked
    let targetRatio: number | null = null;
    if (aspectPreset === '1:1' || aspectPreset === 'circle') targetRatio = 1;
    else if (aspectPreset === '4:5') targetRatio = 4 / 5;
    else if (aspectPreset === '9:16') targetRatio = 9 / 16;
    else if (aspectPreset === '16:9') targetRatio = 16 / 9;
    else if (aspectPreset === '4:3') targetRatio = 4 / 3;
    else if (aspectPreset === '3:2') targetRatio = 3 / 2;
    else if (aspectPreset === '3:1') targetRatio = 3 / 1;

    if (dragType === 'move') {
      let nextX = startCropX + deltaX;
      let nextY = startCropY + deltaY;

      // Clamp within boundaries
      nextX = Math.max(0, Math.min(imgW - startCropW, nextX));
      nextY = Math.max(0, Math.min(imgH - startCropH, nextY));

      setCropX(Math.round(nextX));
      setCropY(Math.round(nextY));
      return;
    }

    let nextX = startCropX;
    let nextY = startCropY;
    let nextW = startCropW;
    let nextH = startCropH;

    const minSize = 30;

    // Handle corner and edge resizes
    if (dragType?.includes('e')) {
      nextW = Math.max(minSize, Math.min(imgW - startCropX, startCropW + deltaX));
    }
    if (dragType?.includes('s')) {
      nextH = Math.max(minSize, Math.min(imgH - startCropY, startCropH + deltaY));
    }
    if (dragType?.includes('w')) {
      const maxDeltaX = startCropW - minSize;
      const appliedDeltaX = Math.max(-startCropX, Math.min(maxDeltaX, deltaX));
      nextX = startCropX + appliedDeltaX;
      nextW = startCropW - appliedDeltaX;
    }
    if (dragType?.includes('n')) {
      const maxDeltaY = startCropH - minSize;
      const appliedDeltaY = Math.max(-startCropY, Math.min(maxDeltaY, deltaY));
      nextY = startCropY + appliedDeltaY;
      nextH = startCropH - appliedDeltaY;
    }

    // Apply aspect ratio lock if active
    if (targetRatio !== null) {
      if (dragType === 'e' || dragType === 'w') {
        nextH = nextW / targetRatio;
        if (nextY + nextH > imgH) {
          nextH = imgH - nextY;
          nextW = nextH * targetRatio;
        }
      } else if (dragType === 'n' || dragType === 's') {
        nextW = nextH * targetRatio;
        if (nextX + nextW > imgW) {
          nextW = imgW - nextX;
          nextH = nextW / targetRatio;
        }
      } else if (dragType === 'se') {
        nextH = nextW / targetRatio;
        if (nextY + nextH > imgH) {
          nextH = imgH - nextY;
          nextW = nextH * targetRatio;
        }
      } else if (dragType === 'ne') {
        nextH = nextW / targetRatio;
        const newYPos = startCropY + startCropH - nextH;
        if (newYPos < 0) {
          nextH = startCropY + startCropH;
          nextW = nextH * targetRatio;
          nextY = 0;
        } else {
          nextY = newYPos;
        }
      } else if (dragType === 'sw') {
        nextH = nextW / targetRatio;
        if (nextY + nextH > imgH) {
          nextH = imgH - nextY;
          nextW = nextH * targetRatio;
          nextX = startCropX + startCropW - nextW;
        }
      } else if (dragType === 'nw') {
        nextH = nextW / targetRatio;
        const newYPos = startCropY + startCropH - nextH;
        if (newYPos < 0) {
          nextH = startCropY + startCropH;
          nextW = nextH * targetRatio;
          nextY = 0;
          nextX = startCropX + startCropW - nextW;
        } else {
          nextY = newYPos;
        }
      }
    }

    // Final boundary safeguard
    nextX = Math.max(0, Math.min(imgW - minSize, nextX));
    nextY = Math.max(0, Math.min(imgH - minSize, nextY));
    nextW = Math.max(minSize, Math.min(imgW - nextX, nextW));
    nextH = Math.max(minSize, Math.min(imgH - nextY, nextH));

    setCropX(Math.round(nextX));
    setCropY(Math.round(nextY));
    setCropW(Math.round(nextW));
    setCropH(Math.round(nextH));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragRef.current.isDragging) {
      dragRef.current.isDragging = false;
      dragRef.current.dragType = null;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setCroppedBlob(null);
      setError(null);
    }
  };

  // Perform crop operation
  const handleCrop = async () => {
    if (!file || !dimensions) return;
    setIsProcessing(true);
    setError(null);

    try {
      const options: CropImageOptions = {
        quality,
        targetFormat:
          exportFormat === 'original'
            ? (aspectPreset === 'circle' ? 'image/png' : (file.type as any) || 'image/jpeg')
            : exportFormat,
        isCircle: aspectPreset === 'circle',
        rotationAngle,
        flipHorizontal: flipH,
        flipVertical: flipV,
      };

      const blob = await cropImage(
        file,
        {
          x: Math.max(0, cropX),
          y: Math.max(0, cropY),
          width: Math.max(1, cropW),
          height: Math.max(1, cropH),
        },
        options
      );

      setCroppedBlob(blob);
    } catch (err: any) {
      console.error(err);
      setError(language === 'ar' ? 'فشل قص الصورة، يرجى المحاولة مرة أخرى.' : 'Failed to crop image.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Download cropped file
  const handleDownload = () => {
    if (!croppedBlob || !file) return;
    const base = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const ext =
      exportFormat === 'image/png' || aspectPreset === 'circle'
        ? 'png'
        : exportFormat === 'image/webp'
        ? 'webp'
        : exportFormat === 'image/jpeg'
        ? 'jpg'
        : file.name.split('.').pop() || 'jpg';

    triggerDownload(croppedBlob, `${base}_cropped.${ext}`);
  };

  // Copy cropped image to clipboard
  const handleCopyToClipboard = async () => {
    if (!croppedBlob) return;
    try {
      if (navigator.clipboard && window.ClipboardItem) {
        // ClipboardItem requires image/png
        let blobToCopy = croppedBlob;
        if (croppedBlob.type !== 'image/png') {
          // convert to png for clipboard
          const canvas = document.createElement('canvas');
          const img = new Image();
          const url = URL.createObjectURL(croppedBlob);
          await new Promise((resolve) => {
            img.onload = resolve;
            img.src = url;
          });
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          URL.revokeObjectURL(url);
          blobToCopy = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), 'image/png'));
        }

        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blobToCopy,
          }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  };

  // Calculate box style relative to display rendered image
  const getCropBoxStyle = () => {
    if (!dimensions || renderedImgRect.width === 0) {
      return { display: 'none' };
    }

    const scaleX = renderedImgRect.width / dimensions.width;
    const scaleY = renderedImgRect.height / dimensions.height;

    const left = renderedImgRect.left + cropX * scaleX;
    const top = renderedImgRect.top + cropY * scaleY;
    const width = cropW * scaleX;
    const height = cropH * scaleY;

    return {
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
    };
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-7 shadow-xs space-y-6">
      {!file ? (
        <div className="py-16 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-100 dark:border-indigo-900/40 shadow-xs">
            <Crop className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">
            {language === 'ar' ? 'محرر وقص الصور المرئي التفاعلي' : 'Interactive Visual Image Crop Studio'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            {language === 'ar'
              ? 'قص وتأطير الصور بالذكاء البصري، تحكم بالزوايا والمقاسات القياسية لوسائل التواصل، قص دائري للملفات الشخصية، وتصدير بجودة فائقة 100% داخل متصفحك.'
              : 'Crop and frame photos visually with interactive bounding box, social media presets, circular avatar clipping, and lossless quality export.'}
          </p>
          <label className="cursor-pointer inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all transform hover:-translate-y-0.5">
            <UploadCloud className="w-4 h-4" />
            <span>{language === 'ar' ? 'اختر صورة للبدء' : 'Select Image to Crop'}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml,image/bmp"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Bar: File Info & Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="truncate max-w-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {file.name}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {dimensions ? `${dimensions.width} × ${dimensions.height} px` : ''} &bull;{' '}
                  {formatBytes(file.size)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition flex items-center gap-1.5"
                title={language === 'ar' ? 'إعادة ضبط' : 'Reset crop'}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'إعادة ضبط' : 'Reset'}</span>
              </button>
              <label className="cursor-pointer px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs">
                <span>{language === 'ar' ? 'تغيير الصورة' : 'Change Image'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml,image/bmp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Aspect Ratio Presets Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <span>{language === 'ar' ? 'نسب الأبعاد وتنسيقات المنصات' : 'Aspect Ratio & Social Presets'}</span>
              </label>
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 ${
                  showGrid
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Grid className="w-3 h-3" />
                <span>{language === 'ar' ? 'شبكة الأثلاث' : '3×3 Grid'}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { id: 'free', label: language === 'ar' ? 'حر (Custom)' : 'Free', icon: Square },
                { id: '1:1', label: '1:1 Square', icon: Square },
                { id: 'circle', label: language === 'ar' ? 'دائري (Avatar)' : 'Circle (Avatar)', icon: Circle },
                { id: '4:5', label: '4:5 IG Portrait', icon: Square },
                { id: '9:16', label: '9:16 Story/Reels', icon: Square },
                { id: '16:9', label: '16:9 YouTube', icon: Square },
                { id: '4:3', label: '4:3 Standard', icon: Square },
                { id: '3:2', label: '3:2 Classic', icon: Square },
                { id: '3:1', label: '3:1 Banner', icon: Square },
              ].map((p) => {
                const Icon = p.icon;
                const active = aspectPreset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => applyPreset(p.id as AspectRatioPreset)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                      active
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Transformation & Alignment Controls */}
          <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">
              {language === 'ar' ? 'إجراءات سريعة:' : 'Quick Align:'}
            </span>
            <button
              type="button"
              onClick={handleCenterCrop}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-xs font-semibold transition flex items-center gap-1"
            >
              <Minimize2 className="w-3 h-3 text-indigo-500" />
              <span>{language === 'ar' ? 'توسيط الإطار' : 'Center Crop'}</span>
            </button>
            <button
              type="button"
              onClick={handleFitToEdges}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-xs font-semibold transition flex items-center gap-1"
            >
              <Maximize2 className="w-3 h-3 text-indigo-500" />
              <span>{language === 'ar' ? 'ملء الحواف' : 'Fit Edges'}</span>
            </button>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />
            <button
              type="button"
              onClick={() => setRotationAngle((r) => (r - 90 + 360) % 360)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-xs font-semibold transition flex items-center gap-1"
              title="Rotate Left 90°"
            >
              <RotateCcw className="w-3 h-3" />
              <span>90°</span>
            </button>
            <button
              type="button"
              onClick={() => setRotationAngle((r) => (r + 90) % 360)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-xs font-semibold transition flex items-center gap-1"
              title="Rotate Right 90°"
            >
              <RotateCw className="w-3 h-3" />
              <span>90°</span>
            </button>
            <button
              type="button"
              onClick={() => setFlipH((f) => !f)}
              className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition flex items-center gap-1 ${
                flipH
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 text-indigo-600'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
              title="Flip Horizontal"
            >
              <FlipHorizontal className="w-3 h-3" />
              <span>{language === 'ar' ? 'قلب أفقي' : 'Flip H'}</span>
            </button>
            <button
              type="button"
              onClick={() => setFlipV((f) => !f)}
              className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition flex items-center gap-1 ${
                flipV
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 text-indigo-600'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
              title="Flip Vertical"
            >
              <FlipVertical className="w-3 h-3" />
              <span>{language === 'ar' ? 'قلب رأسي' : 'Flip V'}</span>
            </button>
          </div>

          {/* Main Visual Interactive Cropping Stage & Side Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Visual Canvas Area */}
            <div className="lg:col-span-8 flex flex-col items-center justify-center">
              <div
                ref={containerRef}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="relative w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center select-none shadow-inner min-h-[360px] max-h-[580px] p-2"
                style={{ touchAction: 'none' }}
              >
                {previewUrl && (
                  <img
                    ref={imgRef}
                    src={previewUrl}
                    alt="Source for cropping"
                    onLoad={updateRenderedBounds}
                    className="max-h-[540px] w-auto max-w-full object-contain pointer-events-none transition-transform duration-150"
                    style={{
                      transform: `rotate(${rotationAngle}deg) scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`,
                    }}
                  />
                )}

                {/* Dark Mask Scrim outside crop area */}
                {renderedImgRect.width > 0 && (
                  <div
                    className="absolute inset-0 pointer-events-none bg-slate-950/60 backdrop-brightness-75"
                    style={{
                      clipPath: `polygon(
                        0% 0%, 100% 0%, 100% 100%, 0% 100%,
                        0% 0%,
                        ${getCropBoxStyle().left} ${getCropBoxStyle().top},
                        ${getCropBoxStyle().left} calc(${getCropBoxStyle().top} + ${getCropBoxStyle().height}),
                        calc(${getCropBoxStyle().left} + ${getCropBoxStyle().width}) calc(${getCropBoxStyle().top} + ${getCropBoxStyle().height}),
                        calc(${getCropBoxStyle().left} + ${getCropBoxStyle().width}) ${getCropBoxStyle().top},
                        ${getCropBoxStyle().left} ${getCropBoxStyle().top}
                      )`,
                    }}
                  />
                )}

                {/* Interactive Crop Box Overlay */}
                <div
                  onPointerDown={(e) => handlePointerDown(e, 'move')}
                  className={`absolute border-2 border-indigo-400 dark:border-indigo-300 shadow-xl cursor-move select-none ${
                    aspectPreset === 'circle' ? 'rounded-full' : 'rounded-none'
                  }`}
                  style={getCropBoxStyle()}
                >
                  {/* Rule-of-Thirds Grid inside crop area */}
                  {showGrid && (
                    <div className="absolute inset-0 pointer-events-none opacity-40 grid grid-cols-3 grid-rows-3">
                      <div className="border-r border-b border-white/70" />
                      <div className="border-r border-b border-white/70" />
                      <div className="border-b border-white/70" />
                      <div className="border-r border-b border-white/70" />
                      <div className="border-r border-b border-white/70" />
                      <div className="border-b border-white/70" />
                      <div className="border-r border-white/70" />
                      <div className="border-r border-white/70" />
                      <div />
                    </div>
                  )}

                  {/* Circle guideline if circle mode active */}
                  {aspectPreset === 'circle' && (
                    <div className="absolute inset-0 rounded-full border border-dashed border-white/80 pointer-events-none" />
                  )}

                  {/* Corner & Edge Handles */}
                  {HANDLES.map((h) => {
                    const isCorner = ['nw', 'ne', 'se', 'sw'].includes(h.type);
                    const handlePosStyles: Record<string, string> = {
                      nw: '-top-1.5 -left-1.5',
                      n: '-top-1.5 left-1/2 -translate-x-1/2',
                      ne: '-top-1.5 -right-1.5',
                      e: 'top-1/2 -right-1.5 -translate-y-1/2',
                      se: '-bottom-1.5 -right-1.5',
                      s: '-bottom-1.5 left-1/2 -translate-x-1/2',
                      sw: '-bottom-1.5 -left-1.5',
                      w: 'top-1/2 -left-1.5 -translate-y-1/2',
                    };

                    return (
                      <div
                        key={h.type}
                        onPointerDown={(e) => handlePointerDown(e, h.type)}
                        className={`absolute ${handlePosStyles[h.type]} ${
                          isCorner
                            ? 'w-3.5 h-3.5 rounded-sm bg-white border-2 border-indigo-600 shadow-md'
                            : 'w-4 h-2 rounded-xs bg-white border border-indigo-600 shadow-sm'
                        }`}
                        style={{ cursor: h.cursor }}
                      />
                    );
                  })}

                  {/* Dimension overlay badge */}
                  <div className="absolute bottom-2 left-2 pointer-events-none px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-[10px] font-mono font-bold text-white shadow-xs">
                    {cropW} × {cropH} px
                  </div>
                </div>
              </div>

              {/* Instructions footer */}
              <div className="text-center text-[11px] text-slate-500 mt-2">
                {language === 'ar'
                  ? 'اسحب المربع لتغيير موضعه، أو اسحب المقابض البيضاء في الزوايا لتعديل الحجم.'
                  : 'Drag inside the box to reposition, or pull the corner handles to resize.'}
              </div>
            </div>

            {/* Side Panel: Live Coordinates & Export Configuration */}
            <div className="lg:col-span-4 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Manual Coordinates Input Grid */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {language === 'ar' ? 'الإحداثيات الدقيقة (PX)' : 'Crop Precision (PX)'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-mono font-bold">
                      Ratio: {(cropW / cropH).toFixed(2)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                        X ({language === 'ar' ? 'إزاحة أفقية' : 'Offset X'})
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={dimensions ? dimensions.width - 10 : 2000}
                        value={cropX}
                        onChange={(e) => setCropX(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                        Y ({language === 'ar' ? 'إزاحة رأسية' : 'Offset Y'})
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={dimensions ? dimensions.height - 10 : 2000}
                        value={cropY}
                        onChange={(e) => setCropY(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                        {language === 'ar' ? 'العرض W' : 'Width (W)'}
                      </label>
                      <input
                        type="number"
                        min={10}
                        max={dimensions?.width || 2000}
                        value={cropW}
                        onChange={(e) => setCropW(Math.max(10, parseInt(e.target.value) || 10))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                        {language === 'ar' ? 'الارتفاع H' : 'Height (H)'}
                      </label>
                      <input
                        type="number"
                        min={10}
                        max={dimensions?.height || 2000}
                        value={cropH}
                        onChange={(e) => setCropH(Math.max(10, parseInt(e.target.value) || 10))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Format & Quality Settings */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{language === 'ar' ? 'تنسيق وجودة التصدير' : 'Export Format & Quality'}</span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'original', label: 'Auto' },
                      { id: 'image/png', label: 'PNG' },
                      { id: 'image/jpeg', label: 'JPG' },
                      { id: 'image/webp', label: 'WebP' },
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setExportFormat(fmt.id as any)}
                        className={`py-1.5 rounded-lg text-xs font-bold transition ${
                          exportFormat === fmt.id
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>

                  {exportFormat !== 'image/png' && (
                    <div className="pt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">{language === 'ar' ? 'جودة الصورة' : 'Quality'}</span>
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {Math.round(quality * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0.5}
                        max={1.0}
                        step={0.02}
                        value={quality}
                        onChange={(e) => setQuality(parseFloat(e.target.value))}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleCrop}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{language === 'ar' ? 'جارٍ المعالجة والقص...' : 'Processing Crop...'}</span>
                  </>
                ) : (
                  <>
                    <Crop className="w-4 h-4" />
                    <span>{language === 'ar' ? 'تطبيق وقص الصورة الآن' : 'Apply & Crop Image Now'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Success Download Card */}
          {croppedBlob && (
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-50/70 via-emerald-50/40 to-slate-50/70 dark:from-indigo-950/30 dark:via-emerald-950/20 dark:to-slate-900/40 rounded-3xl p-6 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in">
              <div className="flex items-center gap-4">
                {croppedPreviewUrl && (
                  <div
                    className={`w-20 h-20 bg-slate-950/10 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 flex items-center justify-center shadow-xs ${
                      aspectPreset === 'circle' ? 'rounded-full' : 'rounded-2xl'
                    }`}
                  >
                    <img
                      src={croppedPreviewUrl}
                      alt="Cropped preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {language === 'ar' ? 'تم قص الصورة بنجاح!' : 'Image Successfully Cropped!'}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {language === 'ar' ? 'الأبعاد الجديدة:' : 'Final Dimensions:'}{' '}
                    <span className="font-bold text-slate-900 dark:text-white font-mono">
                      {cropW} × {cropH} px
                    </span>{' '}
                    &bull; {formatBytes(croppedBlob.size)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full md:w-auto">
                <button
                  onClick={handleCopyToClipboard}
                  className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  <span>
                    {copied
                      ? language === 'ar'
                        ? 'تم النسخ للحافظة'
                        : 'Copied!'
                      : language === 'ar'
                      ? 'نسخ الصورة'
                      : 'Copy Image'}
                  </span>
                </button>

                <button
                  onClick={handleDownload}
                  className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>{language === 'ar' ? 'تحميل الصورة المقصوصة' : 'Download Cropped Image'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
