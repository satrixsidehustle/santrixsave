function LegalSections({ contactEmail, gmailComposeUrl }) {
  return (
    <>
      <section id="privacy" className="card-border rounded-lg p-6">
        <h2 className="font-heading text-2xl font-bold text-white">Privacy Policy</h2>
        <div className="mt-4 grid gap-4 text-sm leading-6 text-slate-300 md:grid-cols-2">
          <p>
            SantrixSave does not ask users to create an account and does not intentionally collect personal Instagram login information. URLs entered into the downloader are sent to the backend only to fetch public media details and generate download links.
          </p>
          <p>
            Recent downloads are stored locally in your browser using localStorage. This history stays on your device and can be cleared by clearing your browser site data.
          </p>
          <p>
            Server logs from hosting providers may temporarily include request details such as IP address, timestamps, and API paths for security, debugging, and abuse prevention.
          </p>
          <p>
            Do not paste private, sensitive, or unauthorized links. This service is intended only for public Instagram content that you have permission to access and download.
          </p>
        </div>
      </section>

      <section id="terms" className="card-border rounded-lg p-6">
        <h2 className="font-heading text-2xl font-bold text-white">Terms and Conditions</h2>
        <div className="mt-4 grid gap-4 text-sm leading-6 text-slate-300 md:grid-cols-2">
          <p>
            SantrixSave is provided for personal and lawful use only. You are responsible for making sure you have the right to download, save, or reuse any media obtained through this tool.
          </p>
          <p>
            You agree not to use this service to violate copyright, privacy rights, platform rules, or Instagram&apos;s Terms of Service. Private, restricted, or deleted content is not supported.
          </p>
          <p>
            The service is provided as-is without guarantees that every Instagram link will work. Instagram may change access rules at any time, especially for unofficial free fetching methods.
          </p>
          <p>
            SantrixSave is not affiliated with, endorsed by, or sponsored by Instagram or Meta. Brand names are used only to describe compatibility.
          </p>
        </div>
      </section>

      <section id="contact" className="card-border rounded-lg p-6">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="font-heading text-2xl font-bold text-white">Contact</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              For support, questions, takedown requests, or feedback, contact the SantrixSave team by email.
            </p>
          </div>
          <a
            href={gmailComposeUrl}
            target="_blank"
            rel="noreferrer"
            className="instagram-gradient inline-flex h-12 items-center justify-center rounded-lg px-5 font-heading font-bold text-white shadow-glow transition hover:scale-[1.02]"
          >
            {contactEmail}
          </a>
        </div>
      </section>
    </>
  );
}

export default LegalSections;
