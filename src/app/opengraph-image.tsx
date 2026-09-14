import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { comissao } from '@/lib/programa'
import { site } from '@/lib/site'

export const alt = `${site.nome} — ${site.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Cartão social na identidade do Duck: navy do logo, emblema em placa e o
 * wordmark bicolor, com a expressão de realce em âmbar.
 *
 * O emblema é embutido como data URI porque o gerador de imagem roda fora do
 * servidor HTTP e não resolve caminhos relativos do site.
 */
export default async function Imagem() {
  const emblema = await readFile(path.join(process.cwd(), 'public', 'duck-emblema-192.png'))
  const emblemaUri = `data:image/png;base64,${emblema.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#000e29',
          padding: 72,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={emblemaUri}
            alt=""
            width={64}
            height={64}
            style={{ borderRadius: 18, border: '1px solid rgba(255,194,14,.35)' }}
          />
          <span style={{ display: 'flex', fontSize: 30, fontWeight: 800, letterSpacing: -1 }}>
            <span style={{ color: '#ffc20e' }}>Duck</span>
            <span style={{ color: '#fff' }}>Affiliate</span>
          </span>
          <span
            style={{
              fontSize: 14,
              letterSpacing: 3,
              color: 'rgba(255,255,255,.55)',
              border: '1px solid rgba(255,255,255,.22)',
              borderRadius: 100,
              padding: '7px 16px',
            }}
          >
            POWERED BY RASCUNHOS ECONÔMICOS
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontSize: 68, fontWeight: 800, color: '#fff', lineHeight: 1.05 }}>
            Seu canal já ensina.
          </span>
          <span style={{ fontSize: 68, fontWeight: 800, color: '#ffc20e', lineHeight: 1.05 }}>
            Agora ele também paga.
          </span>
        </div>

        <div style={{ display: 'flex', gap: 14 }}>
          {[
            `${comissao.minima}%–${comissao.maxima}% de comissão`,
            `${comissao.cookieDias} dias de rastreio`,
            'Kit de divulgação pronto',
          ].map((texto) => (
            <span
              key={texto}
              style={{
                fontSize: 21,
                color: 'rgba(255,255,255,.78)',
                border: '1px solid rgba(255,255,255,.16)',
                borderRadius: 100,
                padding: '11px 24px',
              }}
            >
              {texto}
            </span>
          ))}
        </div>
      </div>
    ),
    size,
  )
}
