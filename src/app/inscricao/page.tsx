import type { Metadata } from 'next'
import Link from 'next/link'
import { Topo } from '@/components/Topo'
import { Rodape } from '@/components/Rodape'
import { FormularioInscricao } from '@/components/FormularioInscricao'
import { comissao } from '@/lib/programa'

export const metadata: Metadata = {
  title: 'Candidatura ao programa de afiliados',
  description:
    'Cinco minutos de formulário: seu canal, sua área e como pretende divulgar. Resposta em até 7 dias úteis, aprovada ou não. Sem custo.',
  alternates: { canonical: '/inscricao' },
  robots: { index: true, follow: true },
}

/**
 * Página própria para o formulário. Antes ele era a 14ª seção da home:
 * quem chegava de um link "candidate-se" tinha de rolar até lá, e a home
 * inteira carregava o formulário para quem só queria entender o programa.
 */
export default function PaginaInscricao() {
  return (
    <>
      <Topo />
      <main id="conteudo" className="secao secao--superficie">
        <div className="envelope">
          <nav className="migalhas" aria-label="Você está aqui">
            <Link href="/">Início</Link> <span aria-hidden="true">/</span> <span>Candidatura</span>
          </nav>
          <div className="cabecalho-secao centro">
            <span className="olho">Inscrição</span>
            <h1 style={{ textAlign: 'center' }}>Candidate <span className="realce">o seu canal</span></h1>
            <p className="subtitulo" style={{ textAlign: 'center' }}>
              Cinco minutos de formulário. Resposta em até {comissao.prazoResposta} dias úteis,
              aprovada ou não. Nenhum custo, nenhuma pegadinha.
            </p>
            <p className="campo__dica" style={{ textAlign: 'center', marginTop: 4 }}>
              Ainda em dúvida? Veja <Link href="/como-funciona">como funciona</Link> ou{' '}
              <Link href="/para-afiliados">quem pode participar</Link> antes.
            </p>
          </div>
          <FormularioInscricao />
          <p className="campo__dica" style={{ textAlign: 'center', marginTop: 22, maxWidth: '56ch', marginInline: 'auto' }}>
            Seus dados são usados apenas para avaliar esta candidatura e falar com você sobre a
            parceria. Nunca vendemos ou compartilhamos essas informações —{' '}
            <Link href="/privacidade" style={{ color: 'var(--ambar-texto)' }}>veja a política de privacidade</Link>.
          </p>
        </div>
      </main>
      <Rodape />
    </>
  )
}
