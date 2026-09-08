import { NextResponse, type NextRequest } from 'next/server'
import { estaAutenticado } from '@/lib/auth'
import { campanhaAtualizacaoSchema } from '@/lib/schema'
import { atualizarCampanha, removerCampanha } from '@/lib/store-materiais'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, ctx: Ctx) {
  if (!(await estaAutenticado())) {
    return NextResponse.json({ mensagem: 'Sessão inválida ou expirada.' }, { status: 401 })
  }
  const { id } = await ctx.params
  const resultado = campanhaAtualizacaoSchema.safeParse(await req.json().catch(() => null))
  if (!resultado.success) {
    return NextResponse.json({ mensagem: resultado.error.issues[0]?.message ?? 'Dados inválidos.' }, { status: 422 })
  }
  const campanha = await atualizarCampanha(id, resultado.data)
  if (!campanha) return NextResponse.json({ mensagem: 'Campanha não encontrada.' }, { status: 404 })
  return NextResponse.json({ ok: true, campanha })
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  if (!(await estaAutenticado())) {
    return NextResponse.json({ mensagem: 'Sessão inválida ou expirada.' }, { status: 401 })
  }
  const { id } = await ctx.params
  const ok = await removerCampanha(id)
  if (!ok) return NextResponse.json({ mensagem: 'Campanha não encontrada.' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
