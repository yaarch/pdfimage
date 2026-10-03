import { triggerDownload, formatBytes } from './fileUtils';
export { triggerDownload, formatBytes };

export async function createZipArchive(
  files: { name: string; blob: Blob }[]
): Promise<Blob> {
  const JSZipModule = await import('jszip');
  const JSZip = (JSZipModule && 'default' in JSZipModule ? JSZipModule.default : JSZipModule) as typeof import('jszip');
  const zip = new JSZip();

  for (const item of files) {
    zip.file(item.name, item.blob);
  }

  return await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}
