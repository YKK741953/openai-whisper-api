const { createServer } = require('https')
const { parse } = require('url')
const next = require('next')
const fs = require('fs')

require('dotenv').config()

const dev = process.env.NODE_ENV !== 'production'

const hostname = process.env.HOSTNAME
const port = parseInt(process.env.PORT, 10)

//const app = next({ dev })
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

const httpsOptions = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH, 'utf8'),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH, 'utf8')
  };

console.log('Key file content:', httpsOptions.key);
console.log('Cert file content:', httpsOptions.cert);

app.prepare().then(() => {
    createServer(httpsOptions, (req, res) => {

        const parsedUrl = parse(req.url, true)
        handle(req, res, parsedUrl)

    }).listen(port, (err) => {
        if(err) {
          console.error('Server error:', err);
          throw err;
        }
        console.log('\x1b[35m%s\x1b[0m', 'event', `- started ssl server on https://localhost:${port}`);
      });
    }).catch(err => {
      console.error('Preparation error:', err);
    });

