const { parse } = require('url')
const next = require('next')
require('dotenv').config()

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || 'localhost'
const port = parseInt(process.env.PORT, 10) || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  let server;

  if (dev) {
    // 開発環境：HTTPを使用
    const { createServer } = require('http')
    server = createServer((req, res) => {
      const parsedUrl = parse(req.url, true)
      handle(req, res, parsedUrl)
    })
  } else {
    // 本番環境：HTTPSを要求
    const { createServer } = require('https')
    const fs = require('fs')

    const sslKeyPath = process.env.SSL_KEY_PATH
    const sslCertPath = process.env.SSL_CERT_PATH

    if (!sslKeyPath || !sslCertPath) {
      console.error('SSL_KEY_PATH と SSL_CERT_PATH は本番環境で設定する必要があります')
      process.exit(1)
    }

    try {
      const httpsOptions = {
        key: fs.readFileSync(sslKeyPath, 'utf8'),
        cert: fs.readFileSync(sslCertPath, 'utf8')
      }

      server = createServer(httpsOptions, (req, res) => {
        const parsedUrl = parse(req.url, true)
        handle(req, res, parsedUrl)
      })
    } catch (error) {
      console.error('SSLファイルの読み込みエラー:', error)
      process.exit(1)
    }
  }

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on ${dev ? 'http' : 'https'}://${hostname}:${port}`)
  })
}).catch((err) => {
  console.error('サーバー起動エラー:', err)
  process.exit(1)
})

