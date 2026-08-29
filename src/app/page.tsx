import Link from 'next/link'
import { Topo } from '@/components/Topo'
import { Rodape } from '@/components/Rodape'
import { Hero } from '@/components/secoes/Hero'
import { FaixaAreas } from '@/components/secoes/FaixaAreas'
import { ComoFunciona } from '@/components/secoes/ComoFunciona'
import { QuemPodeParticipar } from '@/components/secoes/QuemPodeParticipar'
import { Beneficios } from '@/components/secoes/Beneficios'
import { Comissao } from '@/components/secoes/Comissao'
import { Selecao } from '@/components/secoes/Selecao'
import { Faq } from '@/components/secoes/Faq'
import { Contato } from '@/components/secoes/Contato'
import { FormularioInscricao } from '@/components/FormularioInscricao'
import { faq } from '@/lib/programa'
import { site } from '@/lib/site'

const faqEstruturado = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((item) => ({
    '@type': 'Question',
    name: item.pergunta,
    acceptedAnswer: { '@type': 'Answer', text: item.resposta },
  })),
}

export default function Pagina() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqEstruturado) }}
      />
      <Topo />
      <main id="conteudo">
        <Hero />
        <FaixaAreas />
        <ComoFunciona />
        <QuemPodeParticipar />
        <Beneficios />
        <Comissao />
        <Selecao />
        <Faq />

        <section className="secao secao--superficie" id="inscricao">
          <div className="envelope">
            <div className="cabecalho-secao centro">
              <span className="olho">Inscrição</span>
              <h2 style={{ textAlign: 'center' }}>
                Candidate-se <span className="realce">ao programa</span>
              </h2>
              <p className="subtitulo" style={{ textAlign: 'center' }}>
                Cinco minutos de formulário. Resposta em até 7 dias úteis, aprovada ou não.
                Nenhum custo, nenhuma pegadinha.
              </p>
            </div>
            <FormularioInscricao />
            <p
              className="campo__dica"
              style={{ textAlign: 'center', marginTop: 22, maxWidth: '56ch', marginInline: 'auto' }}
            >
              Seus dados são usados apenas para avaliar esta candidatura e falar com você sobre a
              parceria. Nunca vendemos ou compartilhamos essas informações —{' '}
              <Link href="/privacidade" style={{ color: 'var(--ouro-texto)' }}>
                veja a política de privacidade
              </Link>
              .
            </p>
          </div>
        </section>

        <Contato />

        <section className="secao escuro">
          <div className="envelope">
            <div className="cabecalho-secao centro" style={{ textAlign: 'center' }}>
              <span className="olho">Visão de longo prazo</span>
              <h2 style={{ textAlign: 'center' }}>
                Isto é maior que um <span className="realce">programa de afiliados</span>
              </h2>
              <p className="subtitulo" style={{ textAlign: 'center' }}>
                O {site.produtor} é o primeiro produto da rede. A ideia é construir uma estrutura
                de distribuição de conteúdo educacional — conectando quem produz curso a quem já
                tem a confiança de uma audiência. Quem entra agora entra na fundação disso.
              </p>
              <Link className="botao botao--g" href="/#inscricao" style={{ marginTop: 14 }}>
                Quero fazer parte
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Rodape />
    </>
  )
}
