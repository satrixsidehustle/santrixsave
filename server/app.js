const express = require('express');
const compression = require('compression');
const cors = require('cors');
const path = require('path');

const downloadRoutes = require('./routes/download');

const app = express();

const allowedOrigin = process.env.FRONTEND_URL || '*';
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? allowedOrigin : true,
  credentials: true
};

app.use(cors(corsOptions));
app.use(compression());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  const hasRapidApiKey = Boolean(process.env.RAPIDAPI_KEY && process.env.RAPIDAPI_KEY !== 'your_rapidapi_key_here');
  res.json({
    status: 'ok',
    downloaderMode: hasRapidApiKey ? 'rapidapi' : 'free'
  });
});

app.use('/api', downloadRoutes);

if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '..', 'client', 'dist');
  app.use(
    express.static(clientDist, {
      maxAge: '1y',
      immutable: true,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('index.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        }
      }
    })
  );
  app.get('*', (_req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: err.publicMessage || 'Something went wrong on our end. Please try again.'
  });
});

module.exports = app;
