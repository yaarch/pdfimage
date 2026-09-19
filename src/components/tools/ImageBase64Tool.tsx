import React, { useState, useEffect } from 'react';
import {
  Code,
  Copy,
  Check,
  Download,
  UploadCloud,
  FileCode,
  Image as ImageIcon,
  ArrowRightLeft,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { convertFileToBase64, decodeBase64ToBlob } from '../../lib/imageUtils';
import { triggerDownload, formatBytes } from '../../lib/zipUtils';

interface ImageBase64ToolProps {
  initialFiles?: File[];
}

type Mode = 'encode' | 'decode';

export const ImageBase64Tool: React.FC<ImageBase64ToolProps> = ({ initialFiles = [] }) => {
  const [mode, setMode] = useState<Mode>('encode');
  const [file, setFile] = useState<File | null>(initialFiles[0] || null);
  const [base64Output, setBase64Output] = useState('');
  const [formatType, setFormatType] = useState<'data-uri' | 'raw' | 'html' | 'css' | 'markdown'>('data-uri');
  const [copied, setCopied] = useState(false);

  // Decode state
  const [decodeInput, setDecodeInput] = useState('');
  const [decodedBlob, setDecodedBlob] = useState<Blob | null>(null);
  const [decodedPreviewUrl, setDecodedPreviewUrl] = useState<string | null>(null);
  const [decodeError, setDecodeError] = useState<string | null>(null);

  useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      setFile(initialFiles[0]);
    }
  }, [initialFiles]);

  useEffect(() => {
    if (file && mode === 'encode') {
      convertFileToBase64(file).then((b64) => {
        setBase64Output(b64);
      }).catch(console.error);
    }
  }, [file, mode]);

  const getFormattedOutput = (): string => {
    if (!base64Output) return '';
    const rawB64 = base64Output.replace(/^data:image\/\w+;base64,/, '');

    switch (formatType) {
      case 'data-uri':
        return base64Output;
      case 'raw':
        return rawB64;
      case 'html':
        return `<img src="${base64Output}" alt="Image" />`;
      case 'css':
        return `background-image: url("${base64Output}");`;
      case 'markdown':
        return `![Image](${base64Output})`;
      default:
        return base64Output;
    }
  };

  const handleCopy = () => {
    const formatted = getFormattedOutput();
    if (!formatted) return;
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const formatted = getFormattedOutput();
    if (!formatted || !file) return;
    const base = file.name.replace(/\.[^/.]+$/, '');
    const blob = new Blob([formatted], { type: 'text/plain;charset=utf-8' });
    triggerDownload(blob, `${base}_base64.txt`);
  };

  const handleDecode = () => {
    setDecodeError(null);
    setDecodedBlob(null);
    setDecodedPreviewUrl(null);

    if (!decodeInput.trim()) return;

    try {
      const { blob, mimeType } = decodeBase64ToBlob(decodeInput);
      setDecodedBlob(blob);
      const url = URL.createObjectURL(blob);
      setDecodedPreviewUrl(url);
    } catch (err: any) {
      console.error(err);
      setDecodeError('Invalid Base64 string. Please ensure the string is valid base64 data.');
    }
  };

  const handleDownloadDecoded = () => {
    if (!decodedBlob) return;
    const ext = decodedBlob.type.split('/')[1] || 'png';
    triggerDownload(decodedBlob, `decoded_image.${ext}`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
      {/* Top Mode Tabs */}
      <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1.5 max-w-sm mx-auto mb-8">
        <button
          onClick={() => setMode('encode')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
            mode === 'encode'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Image to Base64</span>
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
            mode === 'decode'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Base64 to Image</span>
        </button>
      </div>

      {mode === 'encode' ? (
        !file ? (
          <div className="py-12 text-center max-w-sm mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <UploadCloud className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Select an Image to Convert
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Generates clean Data URI, HTML img tag, CSS background, and Raw Base64.
            </p>
            <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition">
              <span>Choose Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header file info */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                    {file.name}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {formatBytes(file.size)} • ~{base64Output.length.toLocaleString()} base64 chars
                  </p>
                </div>
              </div>

              <label className="cursor-pointer px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition">
                <span>Change Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>

            {/* Format Selection Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mr-2">
                Output Format:
              </span>
              {[
                { id: 'data-uri', label: 'Data URI (data:image/...)' },
                { id: 'raw', label: 'Raw Base64' },
                { id: 'html', label: 'HTML <img />' },
                { id: 'css', label: 'CSS background-image' },
                { id: 'markdown', label: 'Markdown' },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setFormatType(fmt.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    formatType === fmt.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>

            {/* Code View with Action buttons */}
            <div className="space-y-2">
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
                </button>
                <button
                  onClick={handleDownloadTxt}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .TXT</span>
                </button>
              </div>

              <textarea
                readOnly
                value={getFormattedOutput()}
                rows={10}
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y break-all"
              />
            </div>
          </div>
        )
      ) : (
        /* Decode Mode */
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Paste Base64 or Data URI String
            </label>
            <textarea
              value={decodeInput}
              onChange={(e) => setDecodeInput(e.target.value)}
              placeholder="Paste data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA... or raw Base64 string"
              rows={6}
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
            />
          </div>

          <button
            onClick={handleDecode}
            disabled={!decodeInput.trim()}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Decode Base64 to Image</span>
          </button>

          {decodeError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{decodeError}</span>
            </div>
          )}

          {decodedPreviewUrl && decodedBlob && (
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-4 text-center">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Decoded Image Preview ({formatBytes(decodedBlob.size)})
              </h4>
              <div className="flex justify-center">
                <img
                  src={decodedPreviewUrl}
                  alt="Decoded output"
                  className="max-h-64 max-w-full rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 bg-white"
                />
              </div>
              <button
                onClick={handleDownloadDecoded}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Decoded Image</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
