import type { Metadata } from 'next'
import Link from 'next/link'
import { Topo } from '@/components/Topo'
import { Rodape } from '@/components/Rodape'
import { FaixaAreas } from '@/components/secoes/FaixaAreas'
import { QuemPodeParticipar } from '@/components/secoes/QuemPodeParticipar'
import { Beneficios } from '@/components/secoes/Beneficios'
import { Portal } from '@/components/secoes/Portal'
import { Comparativo } from '@/components/secoes/Comparativo'
import { Chamada } from '@/components/secoes/Chamada'
import { comissao } from '@/lib/programa'

export const metadata: Metadata = {
  title: 'Quem pode ser afiliado: perfis, áreas e o que você recebe',
  description:
    'Canais educacionais do YouTube, pequenos e médios, com audiência de verdade: os perfis que buscamos, as áreas aceitas e o kit que você recebe ao ser aprovado.',
  alternates: { canonical: '/para-afiliados' },
  openGraph: {
    title: 'Para afiliados: quem pode participar e o que recebe',
    description: 'Perfis, áreas, kit de divulgação e a diferença para um programa comum.',
    url: '/para-afiliados',
  },
}

export default function PaginaParaAfiliados() {
  return (
    <>
      <Topo />
      <main id="conteudo">
        <section className="secao secao--superficie cabeca-pagina">
          <div className="envelope">
            <nav className="migalhas" aria-label="Você está aqui">
              <Link href="/">Início</Link> <span aria-hidden="true">/</span> <span>Para afiliados</span>
            </nav>
            <span className="olho">Para afiliados</span>
            <h1>Feito para quem ensina no YouTube e ainda <span className="realce">não vende nada</span></h1>
            <p className="subtitulo">
              Não olhamos primeiro o número de inscritos. Olhamos quem te assiste e o quanto essa
              pessoa leva a sério o que você diz. Aqui está quem encaixa, o que você recebe e por que
              isto não é “mais um link”.
            </p>
            <div className="cabeca-pagina__acoes">
              <Link className="botao" href="/inscricao">Candidatar meu canal</Link>
              <Link className="botao botao--secundario" href="/como-funciona">Como funciona</Link>
            </div>
          </div>
        </section>
        <FaixaAreas />
        <QuemPodeParticipar />
        <Beneficios />
        <Portal />
        <Comparativo />
        <section className="secao secao--gelo">
          <div className="envelope" style={{ maxWidth: 760 }}>
            <div className="cartao">
              <h3>Resumo em uma linha</h3>
              <p>
                Inscrição gratuita, resposta em até {comissao.prazoResposta} dias úteis, sem
                exclusividade e sem meta. Comissão de {comissao.base}% a {comissao.teto}% paga pela
                Hotmart.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
                <Link className="botao" href="/inscricao">Quero me candidatar</Link>
                <Link className="botao botao--fantasma" href="/perguntas-frequentes">Ver dúvidas frequentes</Link>
              </div>
            </div>
          </div>
        </section>
        <Chamada />
      </main>
      <Rodape />
    </>
  )
}
