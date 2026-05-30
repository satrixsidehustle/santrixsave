# SantrixSave - Instagram Downloader

SantrixSave is a full-stack Instagram downloader web app for saving public Reels, Posts, Stories, IGTV videos, carousels, and profile pictures. The React frontend talks to an Express API, which fetches media metadata and streams downloads through a proxy endpoint to avoid browser CORS download issues.

## Features

- Paste any public Instagram URL and fetch media details.
- Supports Reels, Posts, Stories, IGTV, carousels, and profile pictures.
- Multiple media download cards for carousel posts.
- HD / SD quality selector for videos when multiple qualities are available.
- Copy direct media links to clipboard.
- Download progress indicator powered by Axios.
- Last 5 download history stored in `localStorage`.
- Rate-limited API with friendly error messages.
- Docker-ready production build.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Axios
- Backend: Node.js, Express.js, Axios, CORS, dotenv
- Downloader: `instagram-url-direct` free mode, with optional RapidAPI support
- Rate limiting: `express-rate-limit`

## Setup

1. Clone the project and enter the app directory.

   ```bash
   cd instagram-downloader
   ```

2. Install backend dependencies.

   ```bash
   cd server
   npm install
   ```

3. Install frontend dependencies.

   ```bash
   cd ../client
   npm install
   ```

4. Create an environment file.

   ```bash
   cp ../.env.example ../.env
   ```

5. Choose a downloader mode.

   Free mode works without RapidAPI. Leave `RAPIDAPI_KEY` blank:

   ```env
   RAPIDAPI_KEY=
   ```

   For better production reliability, add a RapidAPI key:

   ```env
   RAPIDAPI_KEY=your_real_rapidapi_key
   ```

6. Run the backend.

   ```bash
   cd ../server
   npm run dev
   ```

7. Run the frontend in another terminal.

   ```bash
   cd ../client
   npm run dev
   ```

Frontend runs on `http://localhost:5173`; backend runs on `http://localhost:5000`.

## Environment Variables

```env
PORT=5000
RAPIDAPI_KEY=
RAPIDAPI_HOST=instagram-downloader-download-instagram-videos-stories4.p.rapidapi.com
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

For the frontend, set `VITE_API_URL` if the API is not running on `http://localhost:5000`.

## Free Mode Without RapidAPI

The backend automatically uses `instagram-url-direct` when `RAPIDAPI_KEY` is empty. This can work for public posts, reels, IGTV links, and some carousels, but Instagram changes its public pages often, so free mode can be less reliable for stories, profile pictures, and rate-limited content.

RapidAPI is optional. Add it only if you want a more stable production downloader.

## API Documentation

### POST `/api/download`

Request:

```json
{
  "url": "https://www.instagram.com/reel/example/"
}
```

Response:

```json
{
  "success": true,
  "type": "reel",
  "thumbnail": "https://...",
  "media": [
    {
      "url": "https://...",
      "quality": "HD",
      "format": "mp4",
      "size": "Unknown"
    }
  ],
  "author": {
    "username": "username",
    "profilePic": "https://..."
  },
  "caption": "Post caption here..."
}
```

### GET `/api/proxy-download?url=MEDIA_URL`

Streams the remote media file to the client with attachment headers.

## Deployment

### Docker

```bash
docker build -t santrixsave .
docker run -p 5000:5000 --env-file .env santrixsave
```

### Render / Railway

- Set the root directory to `instagram-downloader`.
- Add environment variables from `.env.example`.
- Build command: `cd server && npm install && cd ../client && npm install && npm run build`
- Start command: `cd server && npm start`
- Set `NODE_ENV=production` so Express serves the frontend build.

### VPS

- Install Node.js 18+.
- Install dependencies in `server` and `client`.
- Build the frontend with `cd client && npm run build`.
- Start the backend with a process manager such as PM2:

  ```bash
  cd server
  pm2 start server.js --name santrixsave
  ```

## Legal Disclaimer

SantrixSave is for personal use only. Download only content you own or have permission to save. Respect copyright, creator rights, privacy, and Instagram's Terms of Service. This project is not affiliated with Instagram or Meta.

## Credits

- Instagram media fetching via `instagram-url-direct`, with optional RapidAPI support.
- UI built with React, Vite, Tailwind CSS, and Lucide icons.
