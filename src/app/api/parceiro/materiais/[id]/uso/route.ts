import { NextResponse, type NextRequest } from 'next/server'
import { parceiroAutenticado } from '@/lib/auth-parceiro'
import { usoSchema } from '@/lib/schema'
import { obterMaterial, registrarUso } from '@/lib/store-materiais'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Copiar e abrir acontecem no navegador; o servidor só toma nota. */
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const parceiro = await parceiroAutenticado()
  if (!parceiro) return NextResponse.json({ mensagem: 'Sessão inválida.' }, { status: 401 })

  const { id } = await ctx.params
  const resultado = usoSchema.safeParse(await req.json().catch(() => null))
  if (!resultado.success) return NextResponse.json({ mensagem: 'Ação inválida.' }, { status: 422 })

  const material = await obterMaterial(id)
  if (!material || material.arquivado) return NextResponse.json({ mensagem: 'Material não encontrado.' }, { status: 404 })

  const usos = await registrarUso(id, parceiro.id, resultado.data.acao)
  return NextResponse.json({ ok: true, usos })
}
