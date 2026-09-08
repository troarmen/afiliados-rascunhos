import type { Metadata } from 'next'
import Link from 'next/link'
import { Topo } from '@/components/Topo'
import { Rodape } from '@/components/Rodape'
import { Pilares } from '@/components/secoes/Pilares'
import { ComoFunciona } from '@/components/secoes/ComoFunciona'
import { Selecao } from '@/components/secoes/Selecao'
import { Chamada } from '@/components/secoes/Chamada'
import { comissao } from '@/lib/programa'

export const metadata: Metadata = {
  title: 'Como funciona o programa de afiliados, passo a passo',
  description:
    'Você divulga, o link rastreia por 30 dias e a Hotmart paga. Da inscrição à primeira venda em seis passos, com os critérios de seleção abertos.',
  alternates: { canonical: '/como-funciona' },
  openGraph: {
    title: 'Como funciona o Duck Affiliate, passo a passo',
    description: 'Três partes, seis passos e critério de seleção aberto. Sem promessa vaga.',
    url: '/como-funciona',
  },
}

export default function PaginaComoFunciona() {
  return (
    <>
      <Topo />
      <main id="conteudo">
        <section className="secao secao--superficie cabeca-pagina">
          <div className="envelope">
            <nav className="migalhas" aria-label="Você está aqui">
              <Link href="/">Início</Link> <span aria-hidden="true">/</span> <span>Como funciona</span>
            </nav>
            <span className="olho">Como funciona</span>
            <h1>Da inscrição à primeira venda, <span className="realce">sem virar empresa</span></h1>
            <p className="subtitulo">
              Você não cria produto, não emite nota, não processa pagamento e não dá suporte a aluno.
              Esta página mostra exatamente o que você faz, o que a estrutura faz e o que a Hotmart faz.
            </p>
            <div className="cabeca-pagina__acoes">
              <Link className="botao" href="/inscricao">Quero me candidatar</Link>
              <Link className="botao botao--secundario" href="/comissao">Ver a comissão</Link>
            </div>
          </div>
        </section>
        <Pilares />
        <ComoFunciona />
        <Selecao />
        <section className="secao secao--gelo">
          <div className="envelope">
            <div className="grade grade--3">
              <Link className="cartao cartao--interativo" href="/para-afiliados">
                <h3>Serve para mim?</h3>
                <p>Perfis, áreas e o que você recebe no dia da aprovação.</p>
                <span className="link-ambar">Para afiliados →</span>
              </Link>
              <Link className="cartao cartao--interativo" href="/comissao">
                <h3>Quanto eu ganho?</h3>
                <p>{comissao.base}% a {comissao.teto}% por venda, com simulador e regras de pagamento.</p>
                <span className="link-ambar">Comissão →</span>
              </Link>
              <Link className="cartao cartao--interativo" href="/programa">
                <h3>As regras inteiras</h3>
                <p>A versão longa e sem marketing: obrigações, rastreio, encerramento.</p>
                <span className="link-ambar">Regras completas →</span>
              </Link>
            </div>
          </div>
        </section>
        <Chamada />
      </main>
      <Rodape />
    </>
  )
}
