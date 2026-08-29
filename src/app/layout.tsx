import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.nome} — ${site.produtor} | Programa de parceria para criadores`,
    template: `%s · ${site.nome}`,
  },
  description: site.descricao,
  applicationName: site.nomeCompleto,
  keywords: [
    'programa de afiliados',
    'afiliado curso de economia',
    'monetizar canal educacional',
    'parceria criadores de conteúdo',
    'afiliado Hotmart educação',
    'Rascunhos Econômicos',
  ],
  authors: [{ name: site.produtor, url: site.canal.site }],
  creator: site.produtor,
  publisher: site.rede,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: site.url,
    siteName: site.nomeCompleto,
    title: `${site.nome} — monetize sua audiência com cursos que já vendem`,
    description: site.descricao,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.nome} — ${site.produtor}`,
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
    { media: '(prefers-color-scheme: light)', color: '#f5f3ee' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0e1a' },
  ],
  width: 'device-width',
  initialScale: 1,
}

const dadosEstruturados = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.nomeCompleto,
  alternateName: site.sigla,
  url: site.url,
  parentOrganization: { '@type': 'Organization', name: site.rede },
  description: site.descricao,
  email: site.email,
  sameAs: [site.canal.site, site.canal.youtube],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Mesma requisição de fontes do site do canal — inclui o eixo itálico
            do Fraunces, usado no realce dourado dos títulos. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500;1,9..144,600&family=Inter:wght@300;400;500;600;700&display=swap"
        />
        <link rel="icon" href="/brasao.png" type="image/png" />
        <link rel="apple-touch-icon" href="/brasao.png" />
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
