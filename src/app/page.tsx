import { Topo } from '@/components/Topo'
import { Rodape } from '@/components/Rodape'
import { Hero } from '@/components/secoes/Hero'
import { Numeros } from '@/components/secoes/Numeros'
import { Trilhas } from '@/components/secoes/Trilhas'
import { Pilares } from '@/components/secoes/Pilares'
import { Beneficios } from '@/components/secoes/Beneficios'
import { Assinatura } from '@/components/secoes/Assinatura'
import { FaqCurto } from '@/components/secoes/Faq'
import { Chamada } from '@/components/secoes/Chamada'
import { faq } from '@/lib/programa'

const faqEstruturado = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.slice(0, 3).map((item) => ({
    '@type': 'Question',
    name: item.pergunta,
    acceptedAnswer: { '@type': 'Answer', text: item.resposta },
  })),
}

/**
 * A home é a porta, não o prédio.
 *
 * Antes ela tinha quinze seções e o formulário no fim: quem queria só a
 * comissão rolava tudo; quem queria se candidatar também. Agora ela
 * responde "o que é, é sério, como se divide, o que ganho, de quem é o
 * curso" e manda cada aprofundamento para a landing certa (Trilhas).
 */
export default function Pagina() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqEstruturado) }} />
      <Topo />
      <main id="conteudo">
        <Hero />
        <Numeros />
        <Trilhas />
        <Pilares />
        <Beneficios />
        <Assinatura />
        <FaqCurto />
        <Chamada />
      </main>
      <Rodape />
    </>
  )
}
