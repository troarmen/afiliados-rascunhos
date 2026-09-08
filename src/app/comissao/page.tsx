import type { Metadata } from 'next'
import Link from 'next/link'
import { Topo } from '@/components/Topo'
import { Rodape } from '@/components/Rodape'
import { Comissao } from '@/components/secoes/Comissao'
import { ListaFaq } from '@/components/secoes/Faq'
import { Chamada } from '@/components/secoes/Chamada'
import { comissao, faq } from '@/lib/programa'

export const metadata: Metadata = {
  title: 'Comissão de afiliado: quanto você ganha e como recebe',
  description:
    'De 40% a 60% por venda aprovada, 30 dias de rastreio por último clique, cupom nominal e pagamento pela Hotmart em D+30. Simule o seu cenário.',
  alternates: { canonical: '/comissao' },
  openGraph: {
    title: 'Comissão do Duck Affiliate: quanto e como você recebe',
    description: 'Simulador, regras de rastreio e pagamento — tudo o que decide se vale a pena.',
    url: '/comissao',
  },
}

/** Só as perguntas que falam de dinheiro, rastreio e pagamento. */
const perguntasDeComissao = faq.filter((p) =>
  /recebo|pagamento|Hotmart|indicação|custo|exclusividade/i.test(p.pergunta),
)

export default function PaginaComissao() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: perguntasDeComissao.map((item) => ({
              '@type': 'Question',
              name: item.pergunta,
              acceptedAnswer: { '@type': 'Answer', text: item.resposta },
            })),
          }),
        }}
      />
      <Topo />
      <main id="conteudo">
        <section className="secao secao--superficie cabeca-pagina">
          <div className="envelope">
            <nav className="migalhas" aria-label="Você está aqui">
              <Link href="/">Início</Link> <span aria-hidden="true">/</span> <span>Comissão</span>
            </nav>
            <span className="olho">Comissão e pagamento</span>
            <h1>{comissao.base}% a {comissao.teto}% por venda, <span className="realce">pagos pela Hotmart</span></h1>
            <p className="subtitulo">
              Não existe repasse manual nem planilha nossa. A Hotmart identifica a origem da venda,
              calcula e deposita. Abaixo, as regras e um simulador para você dimensionar.
            </p>
            <div className="cabeca-pagina__acoes">
              <Link className="botao" href="/inscricao">Quero me candidatar</Link>
              <Link className="botao botao--secundario" href="/programa">Regras completas</Link>
            </div>
          </div>
        </section>
        <Comissao />
        <section className="secao">
          <div className="envelope">
            <div className="cabecalho-secao">
              <span className="olho">Dúvidas sobre dinheiro</span>
              <h2>O que perguntam sobre <span className="realce">comissão e pagamento</span></h2>
            </div>
            <ListaFaq perguntas={perguntasDeComissao} />
            <p style={{ marginTop: 24, color: 'var(--tinta-2)', fontSize: '0.93rem' }}>
              Outras dúvidas estão em{' '}
              <Link href="/perguntas-frequentes" style={{ color: 'var(--ambar-texto)', fontWeight: 600 }}>perguntas frequentes</Link>.
            </p>
          </div>
        </section>
        <Chamada />
      </main>
      <Rodape />
    </>
  )
}
