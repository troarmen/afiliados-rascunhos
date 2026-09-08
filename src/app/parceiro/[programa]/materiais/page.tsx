import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Suspense } from 'react'
import { Biblioteca } from '@/components/parceiro/Biblioteca'
import { CabecalhoParceiro } from '@/components/parceiro/CabecalhoParceiro'
import { visitanteDaArea } from '@/lib/auth-parceiro'
import { personalizarMateriais } from '@/lib/materiais'
import { obterAfiliacao } from '@/lib/store-afiliacoes'
import { listarCampanhas, listarMateriais, obterProgramaPorSlug } from '@/lib/store-materiais'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Materiais de divulgação' }

export default async function PaginaMateriais({ params }: { params: Promise<{ programa: string }> }) {
  const { programa: slug } = await params
  const parceiro = await visitanteDaArea()
  if (!parceiro) redirect(`/parceiro/entrar?voltar=/parceiro/${slug}/materiais`)

  const programa = await obterProgramaPorSlug(slug)
  if (!programa || !programa.ativo) notFound()

  const [brutos, campanhas, afiliacao] = await Promise.all([
    listarMateriais(programa.id),
    listarCampanhas(programa.id),
    parceiro.tipo === 'parceiro' ? obterAfiliacao(parceiro.candidatura.id, programa.id) : null,
  ])
  // Cada texto sai com o link do parceiro no lugar de {{link}}.
  const materiais = personalizarMateriais(brutos, afiliacao?.url ?? null, programa.plataforma)

  return (
    <div className="par">
      <CabecalhoParceiro nome={parceiro.nome} previa={parceiro.tipo === 'equipe'} />
      <main className="par__conteudo">
        <nav className="migalhas" aria-label="Você está aqui">
          <Link href="/parceiro">Meus programas</Link> <span aria-hidden="true">/</span>{' '}
          <Link href={`/parceiro/${programa.slug}`}>{programa.nome}</Link> <span aria-hidden="true">/</span>{' '}
          <span>Materiais de divulgação</span>
        </nav>

        <div className="par__cabeca">
          <span className="olho">{programa.nome}</span>
          <h1>Materiais de Divulgação</h1>
          <p className="subtitulo">Encontre tudo o que você precisa para promover este canal.</p>
        </div>

        <Suspense fallback={null}>
          <Biblioteca materiais={materiais} campanhas={campanhas} base={`/parceiro/${programa.slug}/materiais`} />
        </Suspense>
      </main>
    </div>
  )
}
