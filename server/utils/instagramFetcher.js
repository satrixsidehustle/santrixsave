const axios = require('axios');

const DEFAULT_RAPIDAPI_HOST = 'instagram-downloader-download-instagram-videos-stories4.p.rapidapi.com';

function createFetchError(message = 'Could not fetch media. The post may be private or deleted.') {
  const error = new Error(message);
  error.code = 'PRIVATE_OR_NOT_FOUND';
  error.publicMessage = message;
  return error;
}

function getProfileUsername(url) {
  const { pathname } = new URL(url);
  return pathname.split('/').filter(Boolean)[0];
}

function getMediaFormat(mediaUrl) {
  const cleanUrl = mediaUrl.split('?')[0].toLowerCase();
  if (cleanUrl.endsWith('.jpg') || cleanUrl.endsWith('.jpeg') || cleanUrl.endsWith('.png') || cleanUrl.endsWith('.webp')) {
    return cleanUrl.split('.').pop().replace('jpeg', 'jpg');
  }
  return 'mp4';
}

function getQuality(format, index = 0) {
  if (format === 'mp4') return index === 0 ? 'HD' : 'SD';
  return 'Original';
}

function normalizeMediaUrls(urls = []) {
  return urls
    .filter(Boolean)
    .map((mediaUrl, index) => {
      const format = getMediaFormat(mediaUrl);
      return {
        url: mediaUrl,
        quality: getQuality(format, index),
        format,
        size: 'Unknown'
      };
    });
}

function normalizeRapidApiResponse(payload) {
  const mediaUrls = [];

  if (Array.isArray(payload?.media)) {
    payload.media.forEach((item) => {
      mediaUrls.push(item.url || item.download_url || item.video_url || item.image_url);
    });
  }

  if (Array.isArray(payload?.data)) {
    payload.data.forEach((item) => {
      mediaUrls.push(item.url || item.download_url || item.video_url || item.image_url);
    });
  }

  if (payload?.url) mediaUrls.push(payload.url);
  if (payload?.download_url) mediaUrls.push(payload.download_url);
  if (payload?.video_url) mediaUrls.push(payload.video_url);
  if (payload?.image_url) mediaUrls.push(payload.image_url);

  const media = normalizeMediaUrls([...new Set(mediaUrls)]);

  if (!media.length) {
    throw createFetchError();
  }

  return {
    thumbnail: payload.thumbnail || payload.thumbnail_url || payload.cover || media[0].url,
    media,
    author: {
      username: payload.username || payload.author?.username || '',
      profilePic: payload.profile_pic_url || payload.author?.profilePic || payload.author?.profile_pic_url || ''
    },
    caption: payload.caption || payload.title || ''
  };
}

function normalizeDirectPackageResponse(result) {
  if (result?.post_info?.is_private) {
    throw createFetchError('This account is private. Only public content can be downloaded.');
  }

  const urls = Array.isArray(result?.url_list) ? result.url_list : [];
  const media = normalizeMediaUrls(urls);

  if (!media.length) {
    throw createFetchError();
  }

  return {
    thumbnail: result?.post_info?.image || media[0].url,
    media,
    author: {
      username: result?.post_info?.owner_username || '',
      profilePic: result?.post_info?.owner_profile_pic_url || ''
    },
    caption: result?.post_info?.caption || ''
  };
}

function hasRapidApiKey() {
  const apiKey = process.env.RAPIDAPI_KEY;
  return Boolean(apiKey && apiKey !== 'your_rapidapi_key_here');
}

async function fetchWithRapidApi(url) {
  const apiKey = process.env.RAPIDAPI_KEY;
  const host = process.env.RAPIDAPI_HOST || DEFAULT_RAPIDAPI_HOST;

  const response = await axios.get(`https://${host}/fetch`, {
    params: { url },
    timeout: 30000,
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': host
    }
  });

  return normalizeRapidApiResponse(response.data);
}

async function fetchWithDirectPackage(url) {
  const { instagramGetUrl } = require('instagram-url-direct');
  const result = await instagramGetUrl(url);
  return normalizeDirectPackageResponse(result);
}

async function fetchProfilePicture(url) {
  const username = getProfileUsername(url);

  if (!username) {
    throw createFetchError('Profile username was not found in the URL.');
  }

  const response = await axios.get(`https://www.instagram.com/${username}/`, {
    params: {
      __a: 1,
      __d: 'dis'
    },
    timeout: 30000,
    headers: {
      Accept: 'application/json',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
      Referer: 'https://www.instagram.com/'
    }
  });

  const user =
    response.data?.graphql?.user ||
    response.data?.user ||
    response.data?.data?.user ||
    response.data?.items?.[0]?.user;

  const profilePic = user?.profile_pic_url_hd || user?.profile_pic_url;

  if (!profilePic) {
    throw createFetchError('Could not fetch profile picture. The profile may be private or unavailable.');
  }

  return {
    thumbnail: profilePic,
    media: [
      {
        url: profilePic,
        quality: 'Original',
        format: getMediaFormat(profilePic),
        size: 'Unknown'
      }
    ],
    author: {
      username,
      profilePic
    },
    caption: `${username}'s profile picture`
  };
}

async function fetchInstagramMedia(url, type) {
  const attempts = [];

  if (hasRapidApiKey()) {
    attempts.push(() => fetchWithRapidApi(url));
  }

  attempts.push(() => fetchWithDirectPackage(url));

  if (type === 'profile') {
    attempts.push(() => fetchProfilePicture(url));
  }

  let lastError;

  for (const attempt of attempts) {
    try {
      return await attempt();
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError?.publicMessage) {
    throw lastError;
  }

  throw createFetchError();
}

module.exports = {
  fetchInstagramMedia
};
