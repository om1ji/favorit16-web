/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "api.favorit-116.ru",
        pathname: "/media/**",
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/admin/:path*',
          destination: 'http://localhost:8000/admin/:path*',
        },
        {
          source: '/api/:path*',
          destination: 'http://localhost:8000/:path*',
        }
      ]
    };
  },
};

module.exports = nextConfig;
