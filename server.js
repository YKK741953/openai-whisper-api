// server.js
const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT, 10) || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH, 'utf8'),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH, 'utf8')
};

let server;

app.prepare().then(() => {
  server = createServer(httpsOptions, async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on https://${hostname}:${port}`);
  });
}).catch(err => {
  console.error('Error occurred starting server:', err);
  process.exit(1);
});


// グレースフルシャットダウンの処理
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// 未処理の例外とRejectの処理
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});