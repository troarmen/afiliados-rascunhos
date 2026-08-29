import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { comissao } from '@/lib/programa'

export const alt = 'Projeto Afiliado — Rascunhos Econômicos'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Cartão social na identidade do canal: fundo navy, brasão em placa clara,
 * título em serifa com a expressão de realce em dourado.
 *
 * O brasão é embutido como data URI porque o gerador de imagem não resolve
 * caminhos relativos do site.
 */
export default async function Imagem() {
  const brasao = await readFile(path.join(process.cwd(), 'public', 'brasao.png'))
  const brasaoUri = `data:image/png;base64,${brasao.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0a0e1a',
          padding: 72,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={brasaoUri}
            alt=""
            width={62}
            height={62}
            style={{ borderRadius: 12, background: '#f9f9f9' }}
          />
          <span style={{ fontSize: 27, fontWeight: 700, color: '#fff', letterSpacing: -0.5 }}>
            Projeto Afiliado
          </span>
          <span
            style={{
              fontSize: 15,
              letterSpacing: 3,
              color: 'rgba(255,255,255,.6)',
              border: '1px solid rgba(255,255,255,.22)',
              borderRadius: 100,
              padding: '7px 16px',
            }}
          >
            RASCUNHOS ECONÔMICOS
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{ fontSize: 66, fontWeight: 600, color: '#fff', lineHeight: 1.06 }}>
            Sua audiência já confia em você.
          </span>
          <span style={{ fontSize: 66, fontWeight: 600, color: '#c8a45c', lineHeight: 1.06 }}>
            Falta o produto certo.
          </span>
        </div>

        <div style={{ display: 'flex', gap: 14 }}>
          {[
            `${comissao.base}%–${comissao.teto}% de comissão`,
            'Material pronto',
            'Pagamento pela Hotmart',
          ].map((texto) => (
            <span
              key={texto}
              style={{
                fontSize: 21,
                color: 'rgba(255,255,255,.75)',
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
