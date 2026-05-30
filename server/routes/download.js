const express = require('express');
const { downloadMedia, proxyDownload } = require('../controllers/downloadController');
const rateLimiter = require('../middlewares/rateLimiter');

const router = express.Router();

router.post('/download', rateLimiter, downloadMedia);
router.get('/proxy-download', rateLimiter, proxyDownload);

module.exports = router;
