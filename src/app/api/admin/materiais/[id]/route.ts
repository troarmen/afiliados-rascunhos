import { NextResponse, type NextRequest } from 'next/server'
import { estaAutenticado } from '@/lib/auth'
import { materialAtualizacaoSchema } from '@/lib/schema'
import { atualizarMaterial, obterMaterial, removerMaterial } from '@/lib/store-materiais'
import { removerArquivo } from '@/lib/storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, ctx: Ctx) {
  if (!(await estaAutenticado())) {
    return NextResponse.json({ mensagem: 'Sessão inválida ou expirada.' }, { status: 401 })
  }
  const { id } = await ctx.params
  const resultado = materialAtualizacaoSchema.safeParse(await req.json().catch(() => null))
  if (!resultado.success) {
    return NextResponse.json({ mensagem: resultado.error.issues[0]?.message ?? 'Dados inválidos.' }, { status: 422 })
  }
  const material = await atualizarMaterial(id, resultado.data)
  if (!material) return NextResponse.json({ mensagem: 'Material não encontrado.' }, { status: 404 })
  return NextResponse.json({ ok: true, material })
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  if (!(await estaAutenticado())) {
    return NextResponse.json({ mensagem: 'Sessão inválida ou expirada.' }, { status: 401 })
  }
  const { id } = await ctx.params
  const material = await removerMaterial(id)
  if (!material) return NextResponse.json({ mensagem: 'Material não encontrado.' }, { status: 404 })
  // O registro já saiu; o arquivo é limpeza best-effort (um órfão no
  // storage não quebra nada, um 500 aqui faria o admin achar que não apagou).
  if (material.caminho) await removerArquivo(material.caminho).catch((e) => console.warn('[materiais] arquivo órfão:', e))
  return NextResponse.json({ ok: true })
}

export async function GET(_req: NextRequest, ctx: Ctx) {
  if (!(await estaAutenticado())) {
    return NextResponse.json({ mensagem: 'Sessão inválida ou expirada.' }, { status: 401 })
  }
  const { id } = await ctx.params
  const material = await obterMaterial(id)
  if (!material) return NextResponse.json({ mensagem: 'Material não encontrado.' }, { status: 404 })
  return NextResponse.json({ material })
}
