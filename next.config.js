/** @type {import('next').NextConfig} */

const nextConfig = {
  // 他の設定
  // セキュリティヘッダーを削除またはコメントアウト
  /*
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
        ],
      }
    ]
  },
  */
  // 他の設定
};

module.exports = nextConfig;