import type { Metadata } from 'next'
import Link from 'next/link'
import { Topo } from '@/components/Topo'
import { Rodape } from '@/components/Rodape'
import { Contato } from '@/components/secoes/Contato'

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Fale com a equipe do Duck Affiliate por e-mail ou WhatsApp. Respondemos em dias úteis.',
  alternates: { canonical: '/contato' },
}

export default function PaginaContato() {
  return (
    <>
      <Topo />
      <main id="conteudo">
        <section className="secao secao--superficie cabeca-pagina" style={{ paddingBottom: 0 }}>
          <div className="envelope">
            <nav className="migalhas" aria-label="Você está aqui">
              <Link href="/">Início</Link> <span aria-hidden="true">/</span> <span>Contato</span>
            </nav>
            <span className="olho">Contato</span>
            <h1>Fale com <span className="realce">quem toca</span> o programa</h1>
            <p className="subtitulo">E-mail ou WhatsApp, em dias úteis. Para candidatura e cadastro de produtor, os formulários são mais rápidos que um contato.</p>
          </div>
        </section>
        <Contato />
        <section className="secao secao--gelo">
          <div className="envelope">
            <div className="grade grade--2" style={{ maxWidth: 760 }}>
              <Link className="cartao cartao--interativo" href="/inscricao">
                <h3>Quero ser afiliado</h3>
                <p>A candidatura não precisa de contato prévio. Preencha e a gente responde em dias úteis.</p>
                <span className="link-ambar">Candidatar meu canal →</span>
              </Link>
              <Link className="cartao cartao--interativo" href="/para-produtores">
                <h3>Tenho um curso e quero afiliados</h3>
                <p>Conte sobre o seu catálogo pelo formulário de produtores; é o caminho mais rápido.</p>
                <span className="link-ambar">Para produtores →</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Rodape />
    </>
  )
}
