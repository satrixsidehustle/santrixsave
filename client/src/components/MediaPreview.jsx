import { useState } from 'react';
import { Copy, Images, UserCircle } from 'lucide-react';
import DownloadButton from './DownloadButton';

const labels = {
  reel: 'Reel',
  post: 'Post',
  story: 'Story',
  igtv: 'IGTV',
  profile: 'Profile Pic'
};

function MediaPreview({ data, apiBaseUrl }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('HD');
  const caption = data.caption || '';
  const shouldTruncate = caption.length > 100;
  const visibleCaption = shouldTruncate && !expanded ? `${caption.slice(0, 100)}...` : caption;
  const mediaOptions = data.media || [];
  const selectedVideoMedia = mediaOptions.filter((item) => item.format === 'mp4' && item.quality === selectedQuality);
  const visibleMedia = selectedVideoMedia.length
    ? mediaOptions.filter((item) => item.format !== 'mp4' || item.quality === selectedQuality)
    : mediaOptions;
  const hasVideo = mediaOptions.some((item) => item.format === 'mp4');

  async function copyFirstLink() {
    if (mediaOptions[0]?.url) {
      await navigator.clipboard.writeText(mediaOptions[0].url);
    }
  }

  return (
    <section className="card-border animate-reveal overflow-hidden rounded-lg">
      <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-72 bg-black">
          <img
            src={data.thumbnail || mediaOptions[0]?.url}
            alt=""
            className="h-full min-h-72 w-full object-cover"
          />
          <span className="instagram-gradient absolute left-4 top-4 rounded-full px-3 py-1 text-sm font-bold text-white">
            {labels[data.type] || data.type}
          </span>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              {data.author?.profilePic ? (
                <img src={data.author.profilePic} alt="" className="h-11 w-11 rounded-full object-cover" />
              ) : (
                <UserCircle className="h-11 w-11 text-slate-500" />
              )}
              <div className="min-w-0">
                <p className="truncate font-heading text-lg font-bold text-white">@{data.author?.username || 'instagram'}</p>
                <p className="flex items-center gap-1 text-sm text-slate-400">
                  <Images className="h-4 w-4" />
                  {mediaOptions.length} media item{mediaOptions.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={copyFirstLink}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/10 px-3 text-sm font-bold text-white transition hover:border-amber hover:bg-white/10"
              title="Copy direct media URL"
            >
              <Copy className="h-4 w-4" />
              <span className="hidden sm:inline">Copy link</span>
            </button>
          </div>

          {caption && (
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-sm leading-6 text-slate-300">{visibleCaption}</p>
              {shouldTruncate && (
                <button
                  type="button"
                  onClick={() => setExpanded((current) => !current)}
                  className="mt-2 text-sm font-bold text-amber hover:text-white"
                >
                  {expanded ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>
          )}

          {hasVideo && (
            <div className="flex w-fit rounded-lg border border-white/10 bg-ink p-1">
              {['HD', 'SD'].map((quality) => (
                <button
                  key={quality}
                  type="button"
                  onClick={() => setSelectedQuality(quality)}
                  className={`rounded-md px-4 py-2 text-sm font-bold transition ${
                    selectedQuality === quality ? 'instagram-gradient text-white' : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {quality}
                </button>
              ))}
            </div>
          )}

          <div className="grid gap-3">
            {visibleMedia.map((item, index) => (
              <DownloadButton
                key={`${item.url}-${index}`}
                media={item}
                index={index}
                apiBaseUrl={apiBaseUrl}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MediaPreview;
