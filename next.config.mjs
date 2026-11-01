import path from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = path.dirname(fileURLToPath(import.meta.url))

const emDesenvolvimento = process.env.NODE_ENV !== 'production'

// Origem do Supabase: o admin envia arquivos direto para o bucket e os
// materiais (imagem/vídeo) são servidos por link assinado de lá.
const supabase = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').origin
  } catch {
    return ''
  }
})()

/**
 * Content Security Policy: lista de onde o navegador pode carregar cada coisa.
 * Ao adicionar um serviço externo novo (fonte, script, vídeo embutido…),
 * a origem dele precisa entrar aqui, senão o navegador bloqueia.
 *
 * `script-src 'unsafe-inline'`: o Next injeta scripts inline em toda página.
 * A alternativa (nonce) obriga renderizar tudo sob demanda e perde o HTML
 * estático. Mesmo assim a política barra scripts de domínios não listados.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com${emDesenvolvimento ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  `img-src 'self' data: blob: https://*.google-analytics.com https://*.googletagmanager.com ${supabase}`,
  `media-src 'self' blob: ${supabase}`,
  `connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com ${supabase}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  ...(emDesenvolvimento ? [] : ['upgrade-insecure-requests']),
]
  .map((d) => d.trim())
  .join('; ')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Sem isto o Next sobe a árvore procurando lockfile, acha um solto no
  // diretório do usuário e elege ELE como raiz do workspace.
  outputFileTracingRoot: raiz,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: csp },
          // Força HTTPS por 1 ano. Sem includeSubDomains/preload de propósito:
          // não sabemos se todo subdomínio tem certificado, e preload é difícil de desfazer.
          ...(emDesenvolvimento ? [] : [{ key: 'Strict-Transport-Security', value: 'max-age=31536000' }]),
        ],
      },
    ]
  },
  async redirects() {
    return [
      // Atalhos divulgados em vídeo / bio de redes sociais.
      { source: '/participar', destination: '/inscricao', permanent: false },
      { source: '/candidatura', destination: '/inscricao', permanent: false },
      { source: '/faq', destination: '/perguntas-frequentes', permanent: true },
    ]
  },
}

export default nextConfig
