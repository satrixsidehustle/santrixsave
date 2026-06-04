import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import UrlInput from './components/UrlInput';
import SupportedFormats from './components/SupportedFormats';
import Footer from './components/Footer';

const MediaPreview = lazy(() => import('./components/MediaPreview'));
const LegalSections = lazy(() => import('./components/LegalSections'));

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const HISTORY_KEY = 'santrixsave-download-history';
const CONTACT_EMAIL = 'iamsantrix@gmail.com';
const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}&su=SantrixSave%20Support`;

const errorMessages = {
  400: 'Please paste a valid Instagram link.',
  404: 'Post not found or has been deleted.',
  429: 'Too many requests. Please wait a moment and try again.',
  500: 'Something went wrong on our end. Please try again.'
};

function normalizeError(error) {
  if (!navigator.onLine) return 'No internet connection. Please check your network.';
  if (error.response?.data?.error) return error.response.data.error;
  if (error.response?.status) return errorMessages[error.response.status] || errorMessages[500];
  return 'No internet connection. Please check your network.';
}

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mediaData, setMediaData] = useState(null);
  const [history, setHistory] = useState([]);

  const apiBaseUrl = useMemo(() => API_BASE_URL.replace(/\/$/, ''), []);

  useEffect(() => {
    try {
      const storedHistory = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      setHistory(Array.isArray(storedHistory) ? storedHistory : []);
    } catch {
      localStorage.removeItem(HISTORY_KEY);
    }
  }, []);

  function saveHistory(item) {
    const nextHistory = [
      {
        id: `${Date.now()}-${item.type}`,
        url: url.trim(),
        type: item.type,
        thumbnail: item.thumbnail,
        username: item.author?.username || 'instagram',
        savedAt: new Date().toISOString()
      },
      ...history.filter((entry) => entry.url !== url.trim())
    ].slice(0, 5);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
    setHistory(nextHistory);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMediaData(null);

    if (!/^https?:\/\/(www\.)?instagram\.com\/.+/i.test(url.trim())) {
      setError('Please paste a valid Instagram link.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${apiBaseUrl}/api/download`, { url: url.trim() });
      setMediaData(response.data);
      saveHistory(response.data);
    } catch (requestError) {
      setError(normalizeError(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen overflow-hidden">
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <section id="home" className="grid gap-8 py-4 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:py-10">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="w-fit rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-amber">
                Free Online Instagram Downloader
              </p>
              <h1 className="font-heading text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                Download Instagram Reels & Posts Free Online
              </h1>
              <p className="max-w-2xl text-lg text-slate-300">
                Save Instagram reels, videos, stories, and carousel posts in HD quality without any watermark. The fastest online downloader tool, with no login required.
              </p>
            </div>
            <UrlInput
              url={url}
              setUrl={setUrl}
              loading={loading}
              error={error}
              onSubmit={handleSubmit}
            />

            {mediaData && (
              <Suspense fallback={<div className="card-border h-40 animate-pulse rounded-lg" />}>
                <MediaPreview
                  data={mediaData}
                  apiBaseUrl={apiBaseUrl}
                />
              </Suspense>
            )}
          </div>
          <div className="card-border animate-reveal rounded-lg p-5 shadow-glow">
            <SupportedFormats />
          </div>
        </section>

        {history.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold text-white">Recent downloads</h2>
              <span className="text-sm text-slate-400">Last 5</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {history.map((entry) => (
                <article key={entry.id} className="card-border overflow-hidden rounded-lg">
                  <img
                    src={entry.thumbnail}
                    alt=""
                    className="h-28 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="space-y-1 p-3">
                    <p className="truncate text-sm font-bold text-white">@{entry.username}</p>
                    <p className="text-xs capitalize text-slate-400">{entry.type}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section id="how-it-works" className="grid gap-4 md:grid-cols-3">
          {['Paste link', 'Preview media', 'Download safely'].map((title, index) => (
            <div key={title} className="card-border rounded-lg p-5">
              <span className="instagram-gradient inline-flex h-9 w-9 items-center justify-center rounded-full font-heading text-sm font-bold">
                {index + 1}
              </span>
              <h3 className="mt-4 font-heading text-xl font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {index === 0 && 'Use any public Reel, Post, Story, IGTV, carousel, or profile URL.'}
                {index === 1 && 'See thumbnails, caption details, and every available media file.'}
                {index === 2 && 'Use the proxy download route to save media without browser CORS issues.'}
              </p>
            </div>
          ))}
        </section>

        <section id="faq" className="card-border rounded-lg p-6">
          <h2 className="font-heading text-2xl font-bold text-white">Frequently Asked Questions</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-white">Can I download private Instagram videos or stories?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">No. SantrixSave only supports public content. Private videos, reels, and stories require account authentication and cannot be accessed by our tool.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white">How do I download Instagram reels to Android or iPhone?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">Simply copy the link of the Instagram reel, paste it in the search input above, and click Download. Once processed, select the quality version you want and it will download automatically to your phone's gallery without installing any app.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white">Do I need to log in with my Instagram details?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">No login or register is required. SantrixSave is completely free and lets you save public Instagram videos, posts, and carousels anonymously without entering your credentials.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white">Why is a proxy server used for downloads?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">Instagram CDN servers block direct browser downloads with CORS policies. Our backend streams the media directly to your device via a proxy connection to bypass these restrictions.</p>
            </div>
          </div>
        </section>

        <Suspense fallback={<div className="card-border h-48 animate-pulse rounded-lg" />}>
          <LegalSections
            contactEmail={CONTACT_EMAIL}
            gmailComposeUrl={GMAIL_COMPOSE_URL}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
