import { NextResponse, type NextRequest } from 'next/server'
import { cookieSessao, criarToken, senhaConfere } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Atraso fixo: encarece a força bruta sem depender de estado. */
const espera = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function POST(req: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { mensagem: 'ADMIN_PASSWORD não está configurada no servidor.' },
      { status: 500 },
    )
  }

  const { senha } = (await req.json().catch(() => ({}))) as { senha?: string }
  await espera(600)

  if (!senha || !senhaConfere(senha)) {
    return NextResponse.json({ mensagem: 'Senha incorreta.' }, { status: 401 })
  }

  const resposta = NextResponse.json({ ok: true })
  resposta.cookies.set(cookieSessao.nome, criarToken(), cookieSessao.opcoes)
  return resposta
}

export async function DELETE() {
  const resposta = NextResponse.json({ ok: true })
  resposta.cookies.set(cookieSessao.nome, '', { ...cookieSessao.opcoes, maxAge: 0 })
  return resposta
}
