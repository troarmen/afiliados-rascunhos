import { NextResponse, type NextRequest } from 'next/server'
import { parceiroAutenticado } from '@/lib/auth-parceiro'
import { validarLinkDeVendas } from '@/lib/plataformas'
import { afiliacaoSchema } from '@/lib/schema'
import { removerAfiliacao, salvarAfiliacao } from '@/lib/store-afiliacoes'
import { obterProgramaPorSlug } from '@/lib/store-materiais'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * O link de vendas do parceiro no programa. Só o próprio parceiro grava —
 * a equipe, em prévia, recebe 401 (a página avisa antes).
 */
export async function PUT(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const parceiro = await parceiroAutenticado()
  if (!parceiro) return NextResponse.json({ mensagem: 'Só o parceiro pode salvar o próprio link.' }, { status: 401 })

  const { slug } = await ctx.params
  const programa = await obterProgramaPorSlug(slug)
  if (!programa || !programa.ativo) return NextResponse.json({ mensagem: 'Programa não encontrado.' }, { status: 404 })

  const corpo = afiliacaoSchema.safeParse(await req.json().catch(() => null))
  if (!corpo.success) return NextResponse.json({ mensagem: corpo.error.issues[0]?.message ?? 'Link inválido.' }, { status: 422 })

  const validacao = validarLinkDeVendas(corpo.data.url, programa.plataforma)
  if (!validacao.ok) return NextResponse.json({ mensagem: validacao.mensagem }, { status: 422 })

  const afiliacao = await salvarAfiliacao(parceiro.id, programa.id, validacao.url)
  return NextResponse.json({ ok: true, afiliacao })
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const parceiro = await parceiroAutenticado()
  if (!parceiro) return NextResponse.json({ mensagem: 'Sessão inválida.' }, { status: 401 })

  const { slug } = await ctx.params
  const programa = await obterProgramaPorSlug(slug)
  if (!programa) return NextResponse.json({ mensagem: 'Programa não encontrado.' }, { status: 404 })

  await removerAfiliacao(parceiro.id, programa.id)
  return NextResponse.json({ ok: true })
}
