import { NextResponse, type NextRequest } from 'next/server'
import { estaAutenticado } from '@/lib/auth'
import { campanhaSchema } from '@/lib/schema'
import { criarCampanha, listarCampanhas } from '@/lib/store-materiais'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (!(await estaAutenticado())) {
    return NextResponse.json({ mensagem: 'Sessão inválida ou expirada.' }, { status: 401 })
  }
  const programa = req.nextUrl.searchParams.get('programa') ?? undefined
  return NextResponse.json({ campanhas: await listarCampanhas(programa) })
}

export async function POST(req: NextRequest) {
  if (!(await estaAutenticado())) {
    return NextResponse.json({ mensagem: 'Sessão inválida ou expirada.' }, { status: 401 })
  }
  const resultado = campanhaSchema.safeParse(await req.json().catch(() => null))
  if (!resultado.success) {
    return NextResponse.json({ mensagem: resultado.error.issues[0]?.message ?? 'Dados inválidos.' }, { status: 422 })
  }
  const campanha = await criarCampanha(resultado.data)
  return NextResponse.json({ ok: true, campanha }, { status: 201 })
}
