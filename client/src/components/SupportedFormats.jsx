import { BadgeCheck, Clapperboard, Image, Layers, MonitorPlay, UserRound } from 'lucide-react';

const formats = [
  {
    title: 'Reels',
    description: 'Public short videos with MP4 download links.',
    icon: Clapperboard,
    status: 'Best support'
  },
  {
    title: 'Posts',
    description: 'Single image or video posts from public profiles.',
    icon: Image,
    status: 'Best support'
  },
  {
    title: 'Carousels',
    description: 'Multiple images/videos shown as separate download options.',
    icon: Layers,
    status: 'Supported'
  },
  {
    title: 'IGTV',
    description: 'Legacy long-form Instagram video URLs.',
    icon: MonitorPlay,
    status: 'Supported'
  },
  {
    title: 'Profile Pictures',
    description: 'Public profile image when Instagram allows access.',
    icon: UserRound,
    status: 'Limited'
  }
];

function SupportedFormats() {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-white">Supported formats</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Free mode works best with public posts and reels. Private or login-only content is not supported.
          </p>
        </div>
        <span className="hidden shrink-0 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-200 sm:inline-flex">
          Free mode
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {formats.map(({ icon: Icon, title, description, status }) => (
          <div key={title} className="rounded-lg border border-white/10 bg-white/5 p-3 transition hover:border-amber/50 hover:bg-white/10">
            <div className="flex items-start gap-3">
              <span className="instagram-gradient flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-heading font-bold text-white">{title}</p>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2 py-0.5 text-[11px] font-bold text-slate-300">
                    <BadgeCheck className="h-3 w-3 text-amber" />
                    {status}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-5 text-slate-400">{description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-amber/20 bg-amber/10 p-3 text-sm leading-5 text-amber">
        Stories usually need a stronger API provider because Instagram blocks most free public fetches.
      </div>
    </div>
  );
}

export default SupportedFormats;
