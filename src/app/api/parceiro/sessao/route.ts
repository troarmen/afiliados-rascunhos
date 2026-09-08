import { NextResponse } from 'next/server'
import { cookieParceiro } from '@/lib/auth-parceiro'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function DELETE() {
  const resposta = NextResponse.json({ ok: true })
  resposta.cookies.set(cookieParceiro.nome, '', { ...cookieParceiro.opcoes, maxAge: 0 })
  return resposta
}
