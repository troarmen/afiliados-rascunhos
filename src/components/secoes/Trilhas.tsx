import Link from 'next/link'
import { comissao } from '@/lib/programa'
import { Seta } from '../Icones'

/**
 * O hub da home: quatro portas, uma por pergunta que a pessoa trouxe.
 * A home deixou de responder tudo; ela orienta. Quem quer o detalhe vai
 * para a landing certa em um clique, sem rolar quinze seções.
 */
const trilhas = [
  { href: '/como-funciona', olho: 'Como funciona', titulo: 'O que você faz e o que a estrutura faz', texto: 'Três partes, seis passos e critério de seleção aberto.' },
  { href: '/para-afiliados', olho: 'Para afiliados', titulo: 'Serve para o meu canal?', texto: 'Perfis, áreas aceitas e o kit que você recebe no dia da aprovação.' },
  { href: '/comissao', olho: 'Comissão', titulo: `${comissao.base}% a ${comissao.teto}% por venda`, texto: 'Simulador, rastreio de 30 dias e pagamento pela Hotmart.' },
  { href: '/para-produtores', olho: 'Para produtores', titulo: 'Tenho um curso e quero afiliados', texto: 'Recrutamento, triagem e biblioteca de materiais prontos para o seu catálogo.' },
] as const

export function Trilhas() {
  return (
    <section className="secao secao--superficie" id="trilhas" aria-label="Por onde começar">
      <div className="envelope">
        <div className="cabecalho-secao">
          <span className="olho">Por onde começar</span>
          <h2>Cada pergunta tem <span className="realce">a sua página</span></h2>
        </div>
        <div className="trilhas">
          {trilhas.map((t) => (
            <Link key={t.href} className="trilha" href={t.href}>
              <span className="olho">{t.olho}</span>
              <h3>{t.titulo}</h3>
              <p>{t.texto}</p>
              <span className="link-ambar">Abrir <Seta /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
