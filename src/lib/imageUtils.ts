// Mobile and universal safe maximum canvas pixel boundary (prevents iOS Safari/Android memory exhaustion)
const MAX_SAFE_CANVAS_PIXELS = 16_777_216; // 16.7 Megapixels

export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

export async function getImageDimensions(file: File): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: img.naturalWidth / img.naturalHeight,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Unable to read image dimensions'));
    };
    img.src = url;
  });
}

export interface CompressImageOptions {
  quality: number; // 0.1 to 1.0
  maxDimension?: number;
  targetFormat?: 'image/jpeg' | 'image/png' | 'image/webp';
}

export async function compressImage(
  file: File,
  options: CompressImageOptions
): Promise<{ blob: Blob; originalSize: number; newSize: number; savings: number; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let width = img.naturalWidth;
      let height = img.naturalHeight;

      if (options.maxDimension && (width > options.maxDimension || height > options.maxDimension)) {
        if (width > height) {
          height = Math.round((height * options.maxDimension) / width);
          width = options.maxDimension;
        } else {
          width = Math.round((width * options.maxDimension) / height);
          height = options.maxDimension;
        }
      }

      // Memory boundary clamp for mobile devices & Safari
      if (width * height > MAX_SAFE_CANVAS_PIXELS) {
        const factor = Math.sqrt(MAX_SAFE_CANVAS_PIXELS / (width * height));
        width = Math.floor(width * factor);
        height = Math.floor(height * factor);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas 2D context unavailable'));

      // Clean background for transparency in JPEG
      const format = options.targetFormat || (file.type === 'image/png' ? 'image/png' : 'image/jpeg');
      if (format === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
      }

      // Smooth bicubic resampling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          // Free GPU texture memory immediately
          canvas.width = 0;
          canvas.height = 0;

          if (!blob) return reject(new Error('Failed to compress image'));
          const originalSize = file.size;
          const newSize = blob.size;
          const savings = Math.max(0, Math.round(((originalSize - newSize) / originalSize) * 100));

          resolve({
            blob,
            originalSize,
            newSize,
            savings,
            width,
            height,
          });
        },
        format,
        options.quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for compression'));
    };

    img.src = url;
  });
}

export interface ResizeImageOptions {
  mode: 'exact' | 'percentage';
  width?: number;
  height?: number;
  percentage?: number;
  maintainAspectRatio: boolean;
  quality?: number;
  targetFormat?: string;
}

export async function resizeImage(
  file: File,
  options: ResizeImageOptions
): Promise<{ blob: Blob; width: number; height: number; originalSize: number; newSize: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const origW = img.naturalWidth;
      const origH = img.naturalHeight;
      let targetW = origW;
      let targetH = origH;

      if (options.mode === 'percentage' && options.percentage) {
        const factor = options.percentage / 100;
        targetW = Math.max(1, Math.round(origW * factor));
        targetH = Math.max(1, Math.round(origH * factor));
      } else if (options.mode === 'exact') {
        if (options.maintainAspectRatio) {
          if (options.width && !options.height) {
            targetW = options.width;
            targetH = Math.round((origH * options.width) / origW);
          } else if (options.height && !options.width) {
            targetH = options.height;
            targetW = Math.round((origW * options.height) / origH);
          } else if (options.width && options.height) {
            targetW = options.width;
            targetH = options.height;
          }
        } else {
          targetW = options.width || origW;
          targetH = options.height || origH;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context error'));

      const format = options.targetFormat || file.type || 'image/jpeg';
      if (format === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetW, targetH);
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetW, targetH);

      canvas.toBlob(
        (blob) => {
          canvas.width = 0;
          canvas.height = 0;
          if (!blob) return reject(new Error('Failed to resize image'));
          resolve({
            blob,
            width: targetW,
            height: targetH,
            originalSize: file.size,
            newSize: blob.size,
          });
        },
        format,
        options.quality ?? 0.92
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for resizing'));
    };

    img.src = url;
  });
}

export async function convertImage(
  file: File,
  targetFormat: 'image/jpeg' | 'image/png' | 'image/webp',
  quality = 0.92
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context error'));

      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          canvas.width = 0;
          canvas.height = 0;
          if (blob) resolve(blob);
          else reject(new Error('Failed to convert image format'));
        },
        targetFormat,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to read image for conversion'));
    };

    img.src = url;
  });
}

export async function cropImage(
  file: File,
  cropArea: { x: number; y: number; width: number; height: number },
  quality = 0.92
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, cropArea.width);
      canvas.height = Math.max(1, cropArea.height);

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context error'));

      if (file.type === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(
        img,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        cropArea.width,
        cropArea.height
      );

      canvas.toBlob(
        (blob) => {
          canvas.width = 0;
          canvas.height = 0;
          if (blob) resolve(blob);
          else reject(new Error('Failed to crop image'));
        },
        file.type || 'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for cropping'));
    };

    img.src = url;
  });
}

export async function rotateFlipImage(
  file: File,
  rotationAngle: number, // 0, 90, 180, 270
  flipHorizontal: boolean,
  flipVertical: boolean,
  quality = 0.92
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const rad = (rotationAngle * Math.PI) / 180;
      const isNinety = rotationAngle === 90 || rotationAngle === 270;
      const width = isNinety ? img.naturalHeight : img.naturalWidth;
      const height = isNinety ? img.naturalWidth : img.naturalHeight;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context error'));

      if (file.type === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.translate(width / 2, height / 2);
      ctx.rotate(rad);
      ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

      canvas.toBlob(
        (blob) => {
          canvas.width = 0;
          canvas.height = 0;
          if (blob) resolve(blob);
          else reject(new Error('Failed to rotate/flip image'));
        },
        file.type || 'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for transform'));
    };

    img.src = url;
  });
}

export async function stripImageMetadata(file: File): Promise<Blob> {
  // Re-encoding image pixels through HTML5 canvas strips EXIF, IPTC, GPS, and XMP metadata entirely
  return convertImage(file, (file.type as any) || 'image/jpeg', 0.95);
}
