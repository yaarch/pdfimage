import React, { useState, useRef } from 'react';
import { Palette, Copy, Check, Upload, Image as ImageIcon, Sparkles, Code, Download } from 'lucide-react';

interface ColorSwatch {
  hex: string;
  rgb: { r: number; g: number; b: number };
  percentage: number;
  tailwindMatch?: string;
}

export function ImageColorPaletteTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [swatches, setSwatches] = useState<ColorSwatch[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedCss, setCopiedCss] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    }
  };

  const processImage = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      extractPalette(img);
    };
    img.src = url;
  };

  const extractPalette = (img: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Scale down image for fast color quantization
    const width = 150;
    const height = Math.round((img.height / img.width) * width) || 150;
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;

    // Simple color bucket quantization
    const colorMap: Record<string, { r: number; g: number; b: number; count: number }> = {};
    const step = 4 * 3; // sample every 3rd pixel

    for (let i = 0; i < pixels.length; i += step) {
      const alpha = pixels[i + 3];
      if (alpha < 128) continue; // skip transparent

      const r = Math.round(pixels[i] / 24) * 24;
      const g = Math.round(pixels[i + 1] / 24) * 24;
      const b = Math.round(pixels[i + 2] / 24) * 24;

      const key = `${r},${g},${b}`;
      if (!colorMap[key]) {
        colorMap[key] = { r, g, b, count: 0 };
      }
      colorMap[key].count += 1;
    }

    // Sort by frequency
    const sorted = Object.values(colorMap).sort((a, b) => b.count - a.count);
    const totalSamples = sorted.reduce((sum, item) => sum + item.count, 0) || 1;

    // Filter out visually identical colors
    const uniqueSwatches: ColorSwatch[] = [];
    for (const item of sorted) {
      const hex = rgbToHex(item.r, item.g, item.b);
      const isSimilar = uniqueSwatches.some((existing) => colorDistance(existing.rgb, item) < 45);

      if (!isSimilar) {
        uniqueSwatches.push({
          hex,
          rgb: { r: item.r, g: item.g, b: item.b },
          percentage: Math.round((item.count / totalSamples) * 100),
          tailwindMatch: getTailwindName(item.r, item.g, item.b),
        });
      }

      if (uniqueSwatches.length >= 8) break;
    }

    setSwatches(uniqueSwatches);
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('').toUpperCase();
  };

  const colorDistance = (c1: { r: number; g: number; b: number }, c2: { r: number; g: number; b: number }) => {
    return Math.sqrt((c1.r - c2.r) ** 2 + (c1.g - c2.g) ** 2 + (c1.b - c2.b) ** 2);
  };

  const getTailwindName = (r: number, g: number, b: number): string => {
    const tailwindPresets = [
      { name: 'slate-900', r: 15, g: 23, b: 42 },
      { name: 'indigo-600', r: 79, g: 70, b: 229 },
      { name: 'emerald-500', r: 16, g: 185, b: 129 },
      { name: 'amber-500', r: 245, g: 158, b: 11 },
      { name: 'rose-500', r: 244, g: 63, b: 94 },
      { name: 'sky-500', r: 14, g: 165, b: 233 },
      { name: 'purple-600', r: 147, g: 51, b: 234 },
      { name: 'zinc-100', r: 244, g: 244, b: 245 },
    ];

    let closest = tailwindPresets[0].name;
    let minDist = Infinity;

    for (const preset of tailwindPresets) {
      const dist = colorDistance({ r, g, b }, preset);
      if (dist < minDist) {
        minDist = dist;
        closest = preset.name;
      }
    }
    return closest;
  };

  const copyToClipboard = (text: string, index?: number) => {
    navigator.clipboard.writeText(text);
    if (index !== undefined) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } else {
      setCopiedCss(true);
      setTimeout(() => setCopiedCss(false), 2000);
    }
  };

  const generateCssVariables = () => {
    return `:root {\n` + swatches.map((s, idx) => `  --color-${idx + 1}: ${s.hex};`).join('\n') + `\n}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Image Color Palette Extractor</h3>
            <p className="text-xs text-slate-500">Extract dominant colors, hex codes, and CSS variables from any image</p>
          </div>
        </div>

        {/* Dropzone / Upload */}
        {!imagePreview ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-10 text-center transition cursor-pointer bg-slate-50/50 dark:bg-slate-800/30"
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
              id="color-palette-upload"
            />
            <label htmlFor="color-palette-upload" className="cursor-pointer space-y-3 block">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">Upload image to extract palette</span>
                <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG, WebP (100% private in-browser)</p>
              </div>
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Image Preview */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative group max-w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
                <img src={imagePreview} alt="Uploaded Source" className="max-h-72 object-contain" />
              </div>
              <label
                htmlFor="color-palette-upload"
                className="mt-3 text-xs text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer hover:underline"
              >
                Choose another image
              </label>
              <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="color-palette-upload" />
            </div>

            {/* Extracted Swatches */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">Dominant Palette ({swatches.length} Swatches)</h4>
                {swatches.length > 0 && (
                  <button
                    onClick={() => copyToClipboard(generateCssVariables())}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-200 transition"
                  >
                    {copiedCss ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Code className="w-3.5 h-3.5" />}
                    {copiedCss ? 'Copied CSS!' : 'Copy CSS Variables'}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {swatches.map((swatch, idx) => (
                  <div
                    key={idx}
                    onClick={() => copyToClipboard(swatch.hex, idx)}
                    className="group border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition bg-white dark:bg-slate-900"
                  >
                    <div className="h-20 w-full relative" style={{ backgroundColor: swatch.hex }}>
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[10px] font-bold text-white bg-black/40 rounded backdrop-blur-sm">
                        {swatch.percentage}%
                      </span>
                    </div>
                    <div className="p-2.5 text-left flex items-center justify-between">
                      <div>
                        <div className="font-mono text-xs font-bold text-slate-900 dark:text-white">{swatch.hex}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          rgb({swatch.rgb.r},{swatch.rgb.g},{swatch.rgb.b})
                        </div>
                      </div>
                      <div className="text-slate-400 group-hover:text-indigo-600 transition">
                        {copiedIndex === idx ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
