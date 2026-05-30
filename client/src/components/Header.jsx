function InstagramIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-9 w-9">
      <defs>
        <linearGradient id="igGradient" x1="8" x2="40" y1="40" y2="8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fcb045" />
          <stop offset="0.5" stopColor="#fd1d1d" />
          <stop offset="1" stopColor="#833ab4" />
        </linearGradient>
      </defs>
      <rect width="38" height="38" x="5" y="5" rx="11" fill="url(#igGradient)" />
      <circle cx="24" cy="24" r="8" fill="none" stroke="white" strokeWidth="3.5" />
      <circle cx="34.2" cy="13.8" r="2.5" fill="white" />
    </svg>
  );
}

function Header() {
  return (
    <header className="border-b border-white/10 bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <a href="#home" className="flex items-center gap-3">
          <InstagramIcon />
          <div>
            <p className="font-heading text-xl font-extrabold text-white">SantrixSave</p>
            <p className="text-xs text-slate-400">Download Instagram Reels, Posts, Stories & More</p>
          </div>
        </a>
        <nav className="flex flex-wrap gap-2 text-sm font-semibold text-slate-300">
          {[
            ['Home', '#home'],
            ['How It Works', '#how-it-works'],
            ['FAQ', '#faq']
          ].map(([label, href]) => (
            <a key={href} href={href} className="rounded-md px-3 py-2 transition hover:bg-white/10 hover:text-white">
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
