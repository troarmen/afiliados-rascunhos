import Link from 'next/link'
import { ehImagem, ehVideo, extensao, precisaDoLink, tipo as tipoDe, type Material } from '@/lib/materiais'
import { AcaoMaterial } from './AcaoMaterial'
import { IconeTipo } from './IconeTipo'

type Props = { material: Material; campanha?: string; base: string; vista?: 'grade' | 'lista' }

/**
 * Um material na biblioteca. A capa mostra a própria imagem quando é
 * imagem, o primeiro quadro quando é vídeo, e o ícone do tipo sobre a cor
 * do tipo para o resto — assim o parceiro reconhece o que é de longe.
 */
export function CartaoMaterial({ material: m, campanha, base, vista = 'grade' }: Props) {
  const t = tipoDe(m.tipo)
  const arquivo = `/api/materiais/${m.id}/arquivo`
  const detalhe = `${base}/${m.id}`

  return (
    <article className={`mat${vista === 'lista' ? ' mat--lista' : ''}`} style={{ ['--cor-tipo' as string]: t.cor }}>
      <Link className="mat__capa" href={detalhe} aria-label={m.titulo}>
        {m.origem === 'arquivo' && ehImagem(m) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={arquivo} alt="" loading="lazy" />
        ) : m.origem === 'arquivo' && ehVideo(m) ? (
          <video src={`${arquivo}#t=0.5`} preload="metadata" muted playsInline />
        ) : m.origem === 'texto' ? (
          <p className="mat__amostra">{m.conteudo}</p>
        ) : (
          <IconeTipo tipo={m.tipo} tamanho={vista === 'lista' ? 24 : 34} />
        )}
        {m.recomendado && <span className="mat__estrela" title="Recomendado">★</span>}
        <span className="mat__ext">{extensao(m)}</span>
      </Link>

      <div className="mat__corpo">
        <div className="mat__meta">
          <span className="etq-tipo">{t.singular}</span>
          {m.formato && <span className="mat__formato">{m.formato}</span>}
          {precisaDoLink(m) && <span className="etq-aviso" title="Cadastre seu link de vendas para o texto sair pronto">Falta seu link</span>}
        </div>
        <h3 className="mat__titulo"><Link href={detalhe}>{m.titulo}</Link></h3>
        {m.descricao && <p className="mat__descricao">{m.descricao}</p>}
        <p className="mat__rodape">
          {campanha ? <span>{campanha}</span> : <span>Permanente</span>}
          <span>{m.usos} uso{m.usos === 1 ? '' : 's'}</span>
        </p>
      </div>

      <div className="mat__acoes">
        <AcaoMaterial material={m} />
        <Link className="botao botao--fantasma" href={detalhe}>Detalhes</Link>
      </div>
    </article>
  )
}
