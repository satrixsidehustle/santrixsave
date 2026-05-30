const axios = require('axios');
const http = require('http');
const https = require('https');
const { fetchInstagramMedia } = require('../utils/instagramFetcher');

const INSTAGRAM_URL_REGEX = /^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._/?=&%-]+\/?$/i;
const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

function detectContentType(rawUrl) {
  const { pathname } = new URL(rawUrl);
  const segments = pathname.split('/').filter(Boolean);

  if (segments.includes('reel') || segments.includes('reels')) return 'reel';
  if (segments.includes('p')) return 'post';
  if (segments.includes('stories')) return 'story';
  if (segments.includes('tv')) return 'igtv';
  if (segments.length === 1) return 'profile';

  return 'post';
}

function getProxyContentType(mediaUrl) {
  const cleanUrl = mediaUrl.split('?')[0].toLowerCase();
  if (cleanUrl.endsWith('.jpg') || cleanUrl.endsWith('.jpeg')) return 'image/jpeg';
  if (cleanUrl.endsWith('.png')) return 'image/png';
  if (cleanUrl.endsWith('.webp')) return 'image/webp';
  return 'video/mp4';
}

function getProxyFilename(mediaUrl, contentType) {
  const extensionMap = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'video/mp4': 'mp4'
  };
  const inferredExtension = mediaUrl.split('?')[0].split('.').pop();
  const extension = extensionMap[contentType] || inferredExtension || 'mp4';
  return `instagram_media.${extension}`;
}

function validateProxyUrl(rawUrl) {
  const parsedUrl = new URL(rawUrl);
  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    throw Object.assign(new Error('Unsupported media URL.'), {
      status: 400,
      publicMessage: 'Unsupported media URL.'
    });
  }
  return parsedUrl.toString();
}

async function downloadMedia(req, res, next) {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string' || !INSTAGRAM_URL_REGEX.test(url.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Please paste a valid Instagram link.'
      });
    }

    const normalizedUrl = url.trim();
    const type = detectContentType(normalizedUrl);
    const mediaData = await fetchInstagramMedia(normalizedUrl, type);

    return res.json({
      success: true,
      type,
      thumbnail: mediaData.thumbnail || mediaData.media?.[0]?.url || '',
      media: mediaData.media || [],
      author: mediaData.author || {
        username: '',
        profilePic: ''
      },
      caption: mediaData.caption || ''
    });
  } catch (error) {
    if (error.code === 'PRIVATE_OR_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        error: error.publicMessage
      });
    }

    return next(error);
  }
}

async function proxyDownload(req, res, next) {
  try {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'A media URL is required.'
      });
    }

    const mediaUrl = validateProxyUrl(url);
    const contentType = getProxyContentType(mediaUrl);
    const filename = getProxyFilename(mediaUrl, contentType);

    const response = await axios.get(mediaUrl, {
      responseType: 'stream',
      timeout: 60000,
      httpAgent,
      httpsAgent,
      headers: {
        Accept: '*/*',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
        Referer: 'https://www.instagram.com/'
      }
    });

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', response.headers['content-type'] || contentType);

    if (response.headers['content-length']) {
      res.setHeader('Content-Length', response.headers['content-length']);
    }

    res.flushHeaders();
    response.data.on('error', next);
    response.data.pipe(res);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  downloadMedia,
  proxyDownload
};
