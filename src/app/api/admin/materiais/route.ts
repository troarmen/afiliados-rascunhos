import { NextResponse, type NextRequest } from 'next/server'
import { estaAutenticado } from '@/lib/auth'
import { materialSchema } from '@/lib/schema'
import { criarMaterial, listarMateriais, listarProgramas } from '@/lib/store-materiais'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (!(await estaAutenticado())) {
    return NextResponse.json({ mensagem: 'Sessão inválida ou expirada.' }, { status: 401 })
  }
  const programaId = req.nextUrl.searchParams.get('programa') ?? (await listarProgramas())[0]?.id
  if (!programaId) return NextResponse.json({ materiais: [] })
  const materiais = await listarMateriais(programaId, { incluirArquivados: true })
  return NextResponse.json({ materiais })
}

export async function POST(req: NextRequest) {
  if (!(await estaAutenticado())) {
    return NextResponse.json({ mensagem: 'Sessão inválida ou expirada.' }, { status: 401 })
  }
  const corpo = await req.json().catch(() => null)
  const resultado = materialSchema.safeParse(corpo)
  if (!resultado.success) {
    const campos: Record<string, string> = {}
    for (const p of resultado.error.issues) {
      const chave = p.path.join('.')
      if (chave && !campos[chave]) campos[chave] = p.message
    }
    return NextResponse.json({ mensagem: 'Alguns campos precisam de atenção.', campos }, { status: 422 })
  }
  try {
    const material = await criarMaterial(resultado.data)
    return NextResponse.json({ ok: true, material }, { status: 201 })
  } catch (erro) {
    console.error('[materiais] falha ao gravar:', erro)
    return NextResponse.json({ mensagem: 'Não foi possível gravar o material.' }, { status: 500 })
  }
}
