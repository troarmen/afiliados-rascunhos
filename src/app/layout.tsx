import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `Programa de afiliados para canais do YouTube | ${site.nome}`,
    template: `%s · ${site.nome}`,
  },
  description: site.descricao,
  applicationName: site.nome,
  keywords: [
    'programa de afiliados',
    'afiliado YouTube',
    'monetizar canal do YouTube',
    'monetizar canal educacional',
    'afiliado curso online',
    'afiliado Hotmart educação',
    'parceria para criadores de conteúdo',
    'Duck Affiliate',
  ],
  authors: [{ name: site.nome, url: site.url }],
  creator: site.nome,
  publisher: site.nome,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: site.url,
    siteName: site.nome,
    title: `${site.nome} — ${site.tagline}`,
    description: site.descricao,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.nome} — ${site.tagline}`,
    description: site.descricao,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f6fb' },
    { media: '(prefers-color-scheme: dark)', color: '#000e29' },
  ],
  width: 'device-width',
  initialScale: 1,
}

/**
 * O Duck Affiliate é a organização que assina o site; o Rascunhos Econômicos
 * entra como `provider`, que é o papel real dele — produtor do catálogo de
 * cursos oferecido dentro do programa, não dono da marca.
 */
const dadosEstruturados = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.nome,
  url: site.url,
  logo: `${site.url}/duck-emblema.png`,
  slogan: site.tagline,
  description: site.descricao,
  email: site.email,
  memberOf: { '@type': 'Organization', name: site.rede },
  sameAs: [site.canal.site, site.canal.youtube],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Figtree 700/800/900 no display — a geométrica pesada que mais se
            aproxima do wordmark do logo. Inter segue na interface. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Figtree:wght@500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap"
        />
        <link rel="icon" href="/icone-64.png" type="image/png" sizes="64x64" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(dadosEstruturados) }}
        />
      </head>
      <body>
        <a className="pular-para-conteudo" href="#conteudo">
          Pular para o conteúdo
        </a>
        {children}

        {site.gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${site.gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());gtag('config','${site.gaId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
