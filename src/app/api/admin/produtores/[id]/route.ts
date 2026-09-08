import { NextResponse, type NextRequest } from 'next/server'
import { estaAutenticado } from '@/lib/auth'
import { produtorAtualizacaoSchema } from '@/lib/schema'
import { atualizarInteresseProdutor } from '@/lib/store-produtores'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await estaAutenticado())) {
    return NextResponse.json({ mensagem: 'Sessão inválida ou expirada.' }, { status: 401 })
  }
  const { id } = await ctx.params
  const resultado = produtorAtualizacaoSchema.safeParse(await req.json().catch(() => null))
  if (!resultado.success) return NextResponse.json({ mensagem: 'Dados inválidos.' }, { status: 422 })
  const registro = await atualizarInteresseProdutor(id, resultado.data)
  if (!registro) return NextResponse.json({ mensagem: 'Registro não encontrado.' }, { status: 404 })
  return NextResponse.json({ ok: true, registro })
}
