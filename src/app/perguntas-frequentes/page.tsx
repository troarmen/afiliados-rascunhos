import type { Metadata } from 'next'
import Link from 'next/link'
import { Topo } from '@/components/Topo'
import { Rodape } from '@/components/Rodape'
import { ListaFaq } from '@/components/secoes/Faq'
import { faq } from '@/lib/programa'

export const metadata: Metadata = {
  title: 'Perguntas frequentes',
  description:
    'Comissão, pagamento, rastreio, exclusividade e prazo de resposta: as dúvidas mais comuns sobre o Projeto Afiliado Rascunhos Econômicos.',
  alternates: { canonical: '/perguntas-frequentes' },
}

const estruturado = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((item) => ({
    '@type': 'Question',
    name: item.pergunta,
    acceptedAnswer: { '@type': 'Answer', text: item.resposta },
  })),
}

export default function PerguntasFrequentes() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(estruturado) }}
      />
      <Topo />
      <main id="conteudo" className="secao">
        <div className="envelope">
          <nav className="migalhas" aria-label="Você está aqui">
            <Link href="/">Início</Link> <span aria-hidden="true">/</span>{' '}
            <span>Perguntas frequentes</span>
          </nav>

          <div className="cabecalho-secao">
            <span className="olho">Dúvidas</span>
            <h1>Perguntas frequentes</h1>
            <p className="subtitulo">
              Tudo o que costumam perguntar antes de se inscrever. Não achou sua dúvida? Escreva
              para <Link href="/#contato">a equipe</Link>.
            </p>
          </div>

          <ListaFaq />

          <div className="cartao" style={{ marginTop: 36, maxWidth: 640 }}>
            <h3>Ainda quer entender melhor as regras?</h3>
            <p>
              A página do programa traz a versão longa: comissão, rastreio, obrigações e critérios
              de seleção por extenso.
            </p>
            <Link
              className="botao botao--secundario"
              href="/programa"
              style={{ alignSelf: 'flex-start', marginTop: 8 }}
            >
              Ler as regras completas
            </Link>
          </div>
        </div>
      </main>
      <Rodape />
    </>
  )
}
