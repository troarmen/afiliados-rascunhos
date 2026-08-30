import Link from 'next/link'
import { Topo } from '@/components/Topo'
import { Rodape } from '@/components/Rodape'
import { Hero } from '@/components/secoes/Hero'
import { Numeros } from '@/components/secoes/Numeros'
import { Pilares } from '@/components/secoes/Pilares'
import { FaixaAreas } from '@/components/secoes/FaixaAreas'
import { ComoFunciona } from '@/components/secoes/ComoFunciona'
import { QuemPodeParticipar } from '@/components/secoes/QuemPodeParticipar'
import { Beneficios } from '@/components/secoes/Beneficios'
import { Comissao } from '@/components/secoes/Comissao'
import { Portal } from '@/components/secoes/Portal'
import { Comparativo } from '@/components/secoes/Comparativo'
import { Selecao } from '@/components/secoes/Selecao'
import { Assinatura } from '@/components/secoes/Assinatura'
import { Faq } from '@/components/secoes/Faq'
import { Contato } from '@/components/secoes/Contato'
import { Chamada } from '@/components/secoes/Chamada'
import { FormularioInscricao } from '@/components/FormularioInscricao'
import { comissao, faq } from '@/lib/programa'

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
        {/* A ordem responde, nesta sequência, às perguntas de quem chega:
            o que é → é sério? → como funciona → serve para mim? → o que eu
            ganho → quanto → o que recebo → por que aqui → como me escolhem →
            de quem é o curso → e as dúvidas → me inscrevo. */}
        <Hero />
        <Numeros />
        <Pilares />
        <FaixaAreas />
        <ComoFunciona />
        <QuemPodeParticipar />
        <Beneficios />
        <Comissao />
        <Portal />
        <Comparativo />
        <Selecao />
        <Assinatura />
        <Faq />

        <section className="secao secao--superficie" id="inscricao">
          <div className="envelope">
            <div className="cabecalho-secao centro">
              <span className="olho">Inscrição</span>
              <h2 style={{ textAlign: 'center' }}>
                Candidate <span className="realce">o seu canal</span>
              </h2>
              <p className="subtitulo" style={{ textAlign: 'center' }}>
                Cinco minutos de formulário. Resposta em até {comissao.prazoResposta} dias úteis,
                aprovada ou não. Nenhum custo, nenhuma pegadinha.
              </p>
            </div>
            <FormularioInscricao />
            <p
              className="campo__dica"
              style={{ textAlign: 'center', marginTop: 22, maxWidth: '56ch', marginInline: 'auto' }}
            >
              Seus dados são usados apenas para avaliar esta candidatura e falar com você sobre a
              parceria. Nunca vendemos ou compartilhamos essas informações —{' '}
              <Link href="/privacidade" style={{ color: 'var(--ambar-texto)' }}>
                veja a política de privacidade
              </Link>
              .
            </p>
          </div>
        </section>

        <Contato />
        <Chamada />
      </main>
      <Rodape />
    </>
  )
}
