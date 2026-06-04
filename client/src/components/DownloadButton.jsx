import { useState } from 'react';
import { Check, Copy, Download, Loader2 } from 'lucide-react';

function getFilename(media, index) {
  return `instagram_media_${index + 1}.${media.format || 'mp4'}`;
}

function DownloadButton({ media, index, apiBaseUrl }) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleDownload() {
    setDownloading(true);
    const downloadUrl = `${apiBaseUrl}/api/proxy-download?url=${encodeURIComponent(media.url)}`;
    window.location.href = downloadUrl;
    window.setTimeout(() => setDownloading(false), 2000);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(media.url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="rounded-lg border border-white/10 bg-ink p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-heading font-bold text-white">
            {media.format?.toUpperCase() || 'MP4'} - {media.quality || 'HD'}
          </p>
          <p className="text-sm text-slate-400">{media.size || 'Size unavailable'}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-white/10 px-3 text-white transition hover:border-amber hover:bg-white/10"
            title="Copy direct media URL"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="instagram-gradient inline-flex h-10 min-w-36 items-center justify-center gap-2 rounded-lg px-4 font-bold text-white transition hover:scale-[1.02] disabled:opacity-70"
          >
            {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {downloading ? 'Downloading' : 'Download'}
          </button>
        </div>
      </div>
      {downloading && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="instagram-gradient h-full w-2/3 animate-pulse rounded-full" />
        </div>
      )}
    </div>
  );
}

export default DownloadButton;
