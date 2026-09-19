import React, { useState, useRef, useEffect } from 'react';
import {
  PenTool,
  Download,
  Trash2,
  Upload,
  Type,
  Move,
  RefreshCw,
  Sparkles,
  AlertCircle,
  UploadCloud,
  Check,
} from 'lucide-react';
import { signPdfDocument, SignaturePlacement } from '../../lib/pdfUtils';
import { renderRealPdfPageToCanvas } from '../../lib/pdfRenderUtils';
import { triggerDownload, formatBytes } from '../../lib/zipUtils';

interface PdfSignToolProps {
  initialFiles?: File[];
}

type SignMode = 'draw' | 'type' | 'upload';

export const PdfSignTool: React.FC<PdfSignToolProps> = ({ initialFiles = [] }) => {
  const [file, setFile] = useState<File | null>(initialFiles[0] || null);
  const [signMode, setSignMode] = useState<SignMode>('draw');
  const [inkColor, setInkColor] = useState('#0f172a');
  const [penWidth, setPenWidth] = useState(3);
  const [typedName, setTypedName] = useState('');
  const [fontFamily, setFontFamily] = useState('cursive');
  const [uploadedSigUrl, setUploadedSigUrl] = useState<string | null>(null);
  
  // Placement State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sigXPercent, setSigXPercent] = useState(60); // 0 to 80%
  const [sigYPercent, setSigYPercent] = useState(80); // 0 to 80%
  const [sigWidthPercent, setSigWidthPercent] = useState(25); // 10 to 50%

  // Page Preview Canvas
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Result state
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signedBlob, setSignedBlob] = useState<Blob | null>(null);

  useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      setFile(initialFiles[0]);
    }
  }, [initialFiles]);

  // Load PDF Page Preview
  useEffect(() => {
    if (!file) return;
    let isCancelled = false;

    const renderPage = async () => {
      try {
        const renderedCanvas = await renderRealPdfPageToCanvas(file, currentPage, 1.2);
        if (isCancelled || !previewCanvasRef.current) return;

        const targetCanvas = previewCanvasRef.current;
        targetCanvas.width = renderedCanvas.width;
        targetCanvas.height = renderedCanvas.height;
        const ctx = targetCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(renderedCanvas, 0, 0);
        }
      } catch (err) {
        console.warn('Preview render error:', err);
      }
    };

    renderPage();
    return () => {
      isCancelled = true;
    };
  }, [file, currentPage]);

  // Drawing Pad setup
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const x = ('clientX' in e ? e.clientX : e.touches[0].clientX) - rect.left;
    const y = ('clientY' in e ? e.clientY : e.touches[0].clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = penWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('clientX' in e ? e.clientX : e.touches[0].clientX) - rect.left;
    const y = ('clientY' in e ? e.clientY : e.touches[0].clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearDrawing = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  // Generate Current Signature Data URL
  const getSignatureDataUrl = (): string | null => {
    if (signMode === 'draw') {
      const canvas = drawCanvasRef.current;
      if (!canvas || !hasDrawn) return null;
      return canvas.toDataURL('image/png');
    }

    if (signMode === 'type') {
      if (!typedName.trim()) return null;
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.clearRect(0, 0, 600, 200);
      ctx.fillStyle = inkColor;
      ctx.font = `italic bold 54px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(typedName, 300, 100);
      return canvas.toDataURL('image/png');
    }

    if (signMode === 'upload') {
      return uploadedSigUrl;
    }

    return null;
  };

  const handleUploadSigFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedSigUrl(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleApplySignature = async () => {
    const sigUrl = getSignatureDataUrl();
    if (!file || !sigUrl) {
      setError('Please draw, type, or upload a signature first.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const placement: SignaturePlacement = {
        pageIndex: currentPage - 1,
        xPercent: sigXPercent,
        yPercent: sigYPercent,
        widthPercent: sigWidthPercent,
        signatureDataUrl: sigUrl,
      };

      const result = await signPdfDocument(file, [placement]);
      setSignedBlob(result);
    } catch (err: any) {
      console.error(err);
      setError('Failed to apply signature to PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!signedBlob || !file) return;
    const base = file.name.replace(/\.pdf$/i, '');
    triggerDownload(signedBlob, `${base}_signed.pdf`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
      {!file ? (
        <div className="py-12 text-center max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <PenTool className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Choose a PDF to Sign
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Draw, type, or upload your signature. Place it on any page with live positioning.
          </p>
          <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition">
            <span>Select PDF Document</span>
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center">
                <PenTool className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                  {file.name}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  {formatBytes(file.size)} • Page {currentPage}
                </p>
              </div>
            </div>

            <label className="cursor-pointer px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition">
              <span>Change PDF</span>
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Controls & Signature Creator */}
            <div className="lg:col-span-6 space-y-5">
              {/* Signature Mode Tabs */}
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                <button
                  onClick={() => setSignMode('draw')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    signMode === 'draw'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Draw</span>
                </button>
                <button
                  onClick={() => setSignMode('type')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    signMode === 'type'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Type className="w-3.5 h-3.5" />
                  <span>Type</span>
                </button>
                <button
                  onClick={() => setSignMode('upload')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    signMode === 'upload'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                </button>
              </div>

              {/* Mode 1: Drawing Pad */}
              {signMode === 'draw' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-500">Color:</span>
                      {['#0f172a', '#1e40af', '#b91c1c'].map((c) => (
                        <button
                          key={c}
                          onClick={() => setInkColor(c)}
                          className={`w-5 h-5 rounded-full border-2 transition ${
                            inkColor === c ? 'border-indigo-600 scale-110' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    <button
                      onClick={clearDrawing}
                      className="text-[11px] text-rose-500 hover:text-rose-600 font-medium flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear Pad</span>
                    </button>
                  </div>

                  <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-950 overflow-hidden touch-none h-44">
                    <canvas
                      ref={drawCanvasRef}
                      width={500}
                      height={180}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="w-full h-full cursor-crosshair"
                    />
                    {!hasDrawn && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-xs text-slate-400">
                        Sign your signature here...
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Mode 2: Typed Signature */}
              {signMode === 'type' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Type Your Full Name
                    </label>
                    <input
                      type="text"
                      value={typedName}
                      onChange={(e) => setTypedName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Script Style
                      </label>
                      <select
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      >
                        <option value="cursive">Classic Cursive</option>
                        <option value="Caveat, cursive">Modern Handwritten</option>
                        <option value="Great Vibes, cursive">Formal Calligraphy</option>
                        <option value="serif">Classic Serif</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Ink Color
                      </label>
                      <div className="flex items-center gap-1.5 pt-1">
                        {['#0f172a', '#1e40af', '#b91c1c'].map((c) => (
                          <button
                            key={c}
                            onClick={() => setInkColor(c)}
                            className={`w-5 h-5 rounded-full border-2 ${
                              inkColor === c ? 'border-indigo-600 scale-110' : 'border-transparent'
                            }`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {typedName && (
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center">
                      <p
                        className="text-2xl font-bold"
                        style={{ fontFamily, color: inkColor }}
                      >
                        {typedName}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Mode 3: Upload Image */}
              {signMode === 'upload' && (
                <div className="space-y-3">
                  <label className="cursor-pointer block border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <Upload className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                      {uploadedSigUrl ? 'Replace Signature Image' : 'Upload Signature Image (PNG/JPG)'}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Transparent PNG is recommended
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadSigFile}
                      className="hidden"
                    />
                  </label>

                  {uploadedSigUrl && (
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                      <img src={uploadedSigUrl} alt="Signature" className="max-h-20 object-contain" />
                    </div>
                  )}
                </div>
              )}

              {/* Placement Sliders */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1">
                    <Move className="w-3.5 h-3.5" />
                    <span>Signature Placement</span>
                  </span>
                  <span>Page {currentPage}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      Horizontal Position ({sigXPercent}%)
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="75"
                      value={sigXPercent}
                      onChange={(e) => setSigXPercent(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      Vertical Position ({sigYPercent}%)
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="85"
                      value={sigYPercent}
                      onChange={(e) => setSigYPercent(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Signature Scale ({sigWidthPercent}%)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="45"
                    value={sigWidthPercent}
                    onChange={(e) => setSigWidthPercent(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleApplySignature}
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Signing PDF Document...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Apply Signature to PDF</span>
                  </>
                )}
              </button>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {signedBlob && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                    <Check className="w-4 h-4" />
                    <span>PDF signed successfully!</span>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Signed PDF</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right Interactive Page Preview */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 self-start">
                Interactive Document Preview
              </p>
              <div className="relative border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-100 dark:bg-slate-950 p-2 shadow-inner max-w-full overflow-hidden flex justify-center">
                <canvas
                  ref={previewCanvasRef}
                  className="max-w-full max-h-[480px] object-contain rounded-lg shadow-sm bg-white"
                />

                {/* Visual Signature Indicator Overlay */}
                <div
                  className="absolute pointer-events-none border-2 border-dashed border-indigo-600 bg-indigo-500/15 rounded-lg flex items-center justify-center transition-all duration-75"
                  style={{
                    left: `${sigXPercent}%`,
                    top: `${sigYPercent}%`,
                    width: `${sigWidthPercent}%`,
                    height: `${sigWidthPercent * 0.4}%`,
                  }}
                >
                  <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-white/80 dark:bg-slate-900/80 px-1 py-0.5 rounded">
                    Signature
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 text-center">
                Use the position sliders on the left to align your signature box accurately.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
