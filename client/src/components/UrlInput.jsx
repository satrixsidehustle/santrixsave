import { Clipboard, Download, Loader2 } from 'lucide-react';

function UrlInput({ url, setUrl, loading, error, onSubmit }) {
  async function handlePaste() {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setUrl(clipboardText);
    } catch {
      setUrl(url);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card-border rounded-lg p-4 shadow-glow sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="flex-1">
          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="Paste Instagram link here..."
            className={`h-14 w-full rounded-lg border bg-ink px-4 text-base text-white transition placeholder:text-slate-500 focus:focus-ring ${
              error ? 'border-flame' : 'border-white/10 focus:border-amber'
            }`}
            aria-invalid={Boolean(error)}
          />
          {error && <p className="mt-2 text-sm font-medium text-red-300">{error}</p>}
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-3 lg:flex">
          <button
            type="button"
            onClick={handlePaste}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-lg border border-white/10 px-4 font-bold text-white transition hover:border-amber hover:bg-white/10"
            title="Paste from clipboard"
          >
            <Clipboard className="h-5 w-5" />
            <span className="hidden sm:inline">Paste</span>
          </button>
          <button
            type="submit"
            disabled={loading}
            className="instagram-gradient inline-flex h-14 items-center justify-center gap-2 rounded-lg px-5 font-heading font-bold text-white shadow-glow transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
            {loading ? 'Fetching' : 'Download'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default UrlInput;
