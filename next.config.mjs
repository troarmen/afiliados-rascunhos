/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      // Atalhos divulgados em vídeo / bio de redes sociais.
      { source: '/inscricao', destination: '/#inscricao', permanent: false },
      { source: '/participar', destination: '/#inscricao', permanent: false },
      { source: '/faq', destination: '/perguntas-frequentes', permanent: true },
    ]
  },
}

export default nextConfig
