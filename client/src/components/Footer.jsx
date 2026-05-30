function Footer() {
  const contactEmail = 'iamsantrix@gmail.com';
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${contactEmail}&su=SantrixSave%20Support`;
  const links = [
    ['Privacy Policy', '#privacy'],
    ['Terms of Use', '#terms'],
    ['Contact', '#contact']
  ];

  return (
    <footer className="border-t border-white/10 bg-ink/80 px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 text-sm text-slate-400">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-heading font-bold text-white">SantrixSave</p>
            <p className="mt-1">This tool is for personal use only. Respect copyright and Instagram&apos;s Terms of Service.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            {links.map(([label, href]) => (
              <a key={label} href={href} className="transition hover:text-white">
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 pt-4 md:flex-row md:items-center md:justify-between">
          <p>Copyright (c) 2026 SantrixSave. All rights reserved.</p>
          <p>
            Contact:{' '}
            <a
              href={gmailComposeUrl}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-amber transition hover:text-white"
            >
              {contactEmail}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
