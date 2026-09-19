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

export interface CropImageOptions {
  quality?: number;
  targetFormat?: 'image/jpeg' | 'image/png' | 'image/webp';
  isCircle?: boolean;
  rotationAngle?: number; // 0, 90, 180, 270
  flipHorizontal?: boolean;
  flipVertical?: boolean;
}

export async function cropImage(
  file: File,
  cropArea: { x: number; y: number; width: number; height: number },
  optionsOrQuality: CropImageOptions | number = 0.92
): Promise<Blob> {
  const options: CropImageOptions =
    typeof optionsOrQuality === 'number'
      ? { quality: optionsOrQuality }
      : optionsOrQuality;

  const quality = options.quality ?? 0.92;
  const targetFormat = options.targetFormat || (options.isCircle ? 'image/png' : (file.type as any) || 'image/jpeg');
  const rotationAngle = options.rotationAngle || 0;
  const flipH = options.flipHorizontal || false;
  const flipV = options.flipVertical || false;
  const isCircle = options.isCircle || false;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const targetW = Math.max(1, Math.round(cropArea.width));
      const targetH = Math.max(1, Math.round(cropArea.height));

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context error'));

      if (targetFormat === 'image/jpeg' && !isCircle) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetW, targetH);
      }

      ctx.save();

      // Circular masking if enabled
      if (isCircle) {
        ctx.beginPath();
        const centerX = targetW / 2;
        const centerY = targetH / 2;
        const radius = Math.min(targetW, targetH) / 2;
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
      }

      // Handle orientation transforms if applied
      if (rotationAngle !== 0 || flipH || flipV) {
        ctx.translate(targetW / 2, targetH / 2);
        if (rotationAngle !== 0) {
          ctx.rotate((rotationAngle * Math.PI) / 180);
        }
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
        ctx.translate(-targetW / 2, -targetH / 2);
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        img,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        targetW,
        targetH
      );

      ctx.restore();

      canvas.toBlob(
        (blob) => {
          canvas.width = 0;
          canvas.height = 0;
          if (blob) resolve(blob);
          else reject(new Error('Failed to crop image'));
        },
        targetFormat,
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

export interface ImageWatermarkOptions {
  type: 'text' | 'image';
  text?: string;
  textColor?: string;
  fontSize?: number; // relative pt or px
  opacity?: number; // 0.1 to 1
  rotation?: number; // -180 to 180 degrees
  position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'tile';
  logoFile?: File;
  logoScalePercent?: number; // 10 to 80
}

export async function applyImageWatermark(
  file: File,
  options: ImageWatermarkOptions
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const mainImg = new Image();
    const mainUrl = URL.createObjectURL(file);

    mainImg.onload = async () => {
      URL.revokeObjectURL(mainUrl);
      const width = mainImg.naturalWidth;
      const height = mainImg.naturalHeight;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas 2D context unavailable'));

      // Draw base image
      ctx.drawImage(mainImg, 0, 0, width, height);

      const opacity = options.opacity ?? 0.5;
      const rotationRad = ((options.rotation ?? -30) * Math.PI) / 180;
      const pos = options.position ?? 'center';

      if (options.type === 'text') {
        const text = options.text || 'CONFIDENTIAL';
        const fontSize = options.fontSize || Math.max(20, Math.round(width / 18));
        const color = options.textColor || '#ffffff';

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = color;
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (pos === 'tile') {
          const stepX = Math.max(150, Math.round(width / 4));
          const stepY = Math.max(100, Math.round(height / 4));
          for (let x = -width; x < width * 2; x += stepX) {
            for (let y = -height; y < height * 2; y += stepY) {
              ctx.save();
              ctx.translate(x, y);
              ctx.rotate(rotationRad);
              ctx.fillText(text, 0, 0);
              ctx.restore();
            }
          }
        } else {
          let posX = width / 2;
          let posY = height / 2;

          if (pos === 'top-left') {
            posX = width * 0.2;
            posY = height * 0.15;
          } else if (pos === 'top-right') {
            posX = width * 0.8;
            posY = height * 0.15;
          } else if (pos === 'bottom-left') {
            posX = width * 0.2;
            posY = height * 0.85;
          } else if (pos === 'bottom-right') {
            posX = width * 0.8;
            posY = height * 0.85;
          }

          ctx.translate(posX, posY);
          ctx.rotate(rotationRad);
          ctx.fillText(text, 0, 0);
        }
        ctx.restore();

        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to watermark image'));
        }, file.type || 'image/jpeg', 0.95);

      } else if (options.type === 'image' && options.logoFile) {
        const logoImg = new Image();
        const logoUrl = URL.createObjectURL(options.logoFile);
        logoImg.onload = () => {
          URL.revokeObjectURL(logoUrl);
          ctx.save();
          ctx.globalAlpha = opacity;

          const scalePercent = (options.logoScalePercent ?? 25) / 100;
          const logoTargetWidth = width * scalePercent;
          const logoTargetHeight = (logoTargetWidth / logoImg.naturalWidth) * logoImg.naturalHeight;

          let posX = (width - logoTargetWidth) / 2;
          let posY = (height - logoTargetHeight) / 2;

          if (pos === 'top-left') {
            posX = width * 0.05;
            posY = height * 0.05;
          } else if (pos === 'top-right') {
            posX = width - logoTargetWidth - width * 0.05;
            posY = height * 0.05;
          } else if (pos === 'bottom-left') {
            posX = width * 0.05;
            posY = height - logoTargetHeight - height * 0.05;
          } else if (pos === 'bottom-right') {
            posX = width - logoTargetWidth - width * 0.05;
            posY = height - logoTargetHeight - height * 0.05;
          }

          ctx.drawImage(logoImg, posX, posY, logoTargetWidth, logoTargetHeight);
          ctx.restore();

          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to stamp watermark logo'));
          }, file.type || 'image/jpeg', 0.95);
        };
        logoImg.onerror = () => {
          URL.revokeObjectURL(logoUrl);
          reject(new Error('Failed to load logo watermark file'));
        };
        logoImg.src = logoUrl;
      } else {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to process image'));
        }, file.type || 'image/jpeg', 0.95);
      }
    };

    mainImg.onerror = () => {
      URL.revokeObjectURL(mainUrl);
      reject(new Error('Failed to load main image'));
    };
    mainImg.src = mainUrl;
  });
}

export interface ImageBorderRoundOptions {
  borderWidth: number; // 0 to 50
  borderColor: string;
  cornerRadius: number; // 0 to 500 (or 50% for circle)
  isCircle: boolean;
  padding: number; // 0 to 100
  backgroundColor: string;
  shadowBlur: number; // 0 to 50
  shadowColor: string;
}

export async function applyImageBorderAndCorners(
  file: File,
  options: ImageBorderRoundOptions
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const origW = img.naturalWidth;
      const origH = img.naturalHeight;

      const pad = options.padding || 0;
      const border = options.borderWidth || 0;
      const totalExtra = (pad + border) * 2;

      let targetW = origW;
      let targetH = origH;

      if (options.isCircle) {
        const minDim = Math.min(origW, origH);
        targetW = minDim;
        targetH = minDim;
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetW + totalExtra;
      canvas.height = targetH + totalExtra;

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas 2D context unavailable'));

      // If background color is set, fill whole canvas
      if (options.backgroundColor && options.backgroundColor !== 'transparent') {
        ctx.fillStyle = options.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const imgX = pad + border;
      const imgY = pad + border;

      ctx.save();

      // Rounded path or circle path
      ctx.beginPath();
      if (options.isCircle) {
        const centerX = imgX + targetW / 2;
        const centerY = imgY + targetH / 2;
        const radius = targetW / 2;
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      } else if (options.cornerRadius > 0) {
        const r = Math.min(options.cornerRadius, targetW / 2, targetH / 2);
        ctx.moveTo(imgX + r, imgY);
        ctx.lineTo(imgX + targetW - r, imgY);
        ctx.quadraticCurveTo(imgX + targetW, imgY, imgX + targetW, imgY + r);
        ctx.lineTo(imgX + targetW, imgY + targetH - r);
        ctx.quadraticCurveTo(imgX + targetW, imgY + targetH, imgX + targetW - r, imgY + targetH);
        ctx.lineTo(imgX + r, imgY + targetH);
        ctx.quadraticCurveTo(imgX, imgY + targetH, imgX, imgY + targetH - r);
        ctx.lineTo(imgX, imgY + r);
        ctx.quadraticCurveTo(imgX, imgY, imgX + r, imgY);
      } else {
        ctx.rect(imgX, imgY, targetW, targetH);
      }
      ctx.closePath();

      // Clip image to rounded / circular bounds
      ctx.clip();

      if (options.isCircle) {
        const srcX = (origW - targetW) / 2;
        const srcY = (origH - targetH) / 2;
        ctx.drawImage(img, srcX, srcY, targetW, targetH, imgX, imgY, targetW, targetH);
      } else {
        ctx.drawImage(img, imgX, imgY, targetW, targetH);
      }
      ctx.restore();

      // Draw border on top if requested
      if (border > 0) {
        ctx.save();
        ctx.lineWidth = border;
        ctx.strokeStyle = options.borderColor || '#000000';
        ctx.beginPath();
        if (options.isCircle) {
          const centerX = imgX + targetW / 2;
          const centerY = imgY + targetH / 2;
          const radius = targetW / 2;
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        } else if (options.cornerRadius > 0) {
          const r = Math.min(options.cornerRadius, targetW / 2, targetH / 2);
          ctx.moveTo(imgX + r, imgY);
          ctx.lineTo(imgX + targetW - r, imgY);
          ctx.quadraticCurveTo(imgX + targetW, imgY, imgX + targetW, imgY + r);
          ctx.lineTo(imgX + targetW, imgY + targetH - r);
          ctx.quadraticCurveTo(imgX + targetW, imgY + targetH, imgX + targetW - r, imgY + targetH);
          ctx.lineTo(imgX + r, imgY + targetH);
          ctx.quadraticCurveTo(imgX, imgY + targetH, imgX, imgY + targetH - r);
          ctx.lineTo(imgX, imgY + r);
          ctx.quadraticCurveTo(imgX, imgY, imgX + r, imgY);
        } else {
          ctx.rect(imgX, imgY, targetW, targetH);
        }
        ctx.stroke();
        ctx.restore();
      }

      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to frame image'));
      }, 'image/png');
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for framing'));
    };
    img.src = url;
  });
}

export async function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file as Base64'));
    reader.readAsDataURL(file);
  });
}

export function decodeBase64ToBlob(base64String: string): { blob: Blob; mimeType: string } {
  let cleanBase64 = base64String.trim();
  let mimeType = 'image/png';

  const matches = cleanBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (matches && matches.length === 3) {
    mimeType = matches[1];
    cleanBase64 = matches[2];
  }

  const binaryString = atob(cleanBase64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const blob = new Blob([bytes], { type: mimeType });
  return { blob, mimeType };
}

