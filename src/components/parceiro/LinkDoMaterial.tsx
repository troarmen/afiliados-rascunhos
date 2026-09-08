import Link from 'next/link'
import { plataforma as plataformaDe, type PlataformaSlug } from '@/lib/plataformas'
import { BotaoCopiar } from './BotaoCopiar'

type Props = {
  programaSlug: string
  plataforma: PlataformaSlug
  /** O link do parceiro já com a etiqueta deste material; nulo se não cadastrou. */
  link: string | null
  origem: string
  previa: boolean
}

/**
 * Na página do material: o link do parceiro etiquetado com ESTE material,
 * para copiar, e o QR correspondente. É o que deixa o relatório da
 * plataforma dizer "essa venda veio da thumbnail X".
 */
export function LinkDoMaterial({ programaSlug, plataforma, link, origem, previa }: Props) {
  const p = plataformaDe(plataforma)
  if (!link) {
    return (
      <div className="aviso aviso--info" role="status">
        <p>
          <strong>Cadastre seu link de vendas</strong> para ter o link e o QR deste material já atribuídos a você.{' '}
          <Link href={`/parceiro/${programaSlug}#link`} style={{ fontWeight: 700, color: 'inherit' }}>Cadastrar agora →</Link>
        </p>
      </div>
    )
  }
  const qr = `/api/parceiro/programas/${programaSlug}/qr?origem=${encodeURIComponent(origem)}&baixar=1`
  return (
    <div className="link-material">
      <span className="link-material__titulo">Seu link para este material</span>
      <div className="caixa-link">
        <code>{link}</code>
        <BotaoCopiar texto={link} />
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        {previa ? (
          <span className="botao botao--fantasma" aria-disabled="true">QR deste material (PNG)</span>
        ) : (
          <a className="botao botao--fantasma" href={qr} download>QR deste material (PNG)</a>
        )}
        {p.parametroOrigem && (
          <span className="campo__dica">
            A etiqueta <code>{p.parametroOrigem}={origem}</code> aparece no relatório da {p.nome} como origem da venda.
          </span>
        )}
      </div>
    </div>
  )
}
