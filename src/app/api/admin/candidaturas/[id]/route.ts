import { NextResponse, type NextRequest } from 'next/server'
import { estaAutenticado } from '@/lib/auth'
import { atualizacaoSchema } from '@/lib/schema'
import { atualizarCandidatura, obterCandidatura } from '@/lib/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  // O middleware só confere a presença do cookie; a assinatura é validada aqui.
  if (!(await estaAutenticado())) {
    return NextResponse.json({ mensagem: 'Sessão inválida ou expirada.' }, { status: 401 })
  }

  const { id } = await ctx.params
  const corpo = await req.json().catch(() => null)
  const resultado = atualizacaoSchema.safeParse(corpo)

  if (!resultado.success) {
    return NextResponse.json({ mensagem: 'Dados inválidos.' }, { status: 422 })
  }

  const atualizada = await atualizarCandidatura(id, resultado.data)
  if (!atualizada) {
    return NextResponse.json({ mensagem: 'Candidatura não encontrada.' }, { status: 404 })
  }

  return NextResponse.json({ ok: true, candidatura: atualizada })
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await estaAutenticado())) {
    return NextResponse.json({ mensagem: 'Sessão inválida ou expirada.' }, { status: 401 })
  }
  const { id } = await ctx.params
  const candidatura = await obterCandidatura(id)
  if (!candidatura) {
    return NextResponse.json({ mensagem: 'Candidatura não encontrada.' }, { status: 404 })
  }
  return NextResponse.json({ candidatura })
}
