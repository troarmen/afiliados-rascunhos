import { NextResponse, type NextRequest } from 'next/server'
import { candidaturaDoLink, cookieParceiro, criarSessao, podeAcessar } from '@/lib/auth-parceiro'
import { obterCandidatura } from '@/lib/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** O clique no e-mail: token de link vira cookie de sessão. */
export async function GET(req: NextRequest) {
  const id = candidaturaDoLink(req.nextUrl.searchParams.get('t') ?? undefined)
  const candidatura = id ? await obterCandidatura(id) : null

  if (!podeAcessar(candidatura)) {
    const destino = new URL('/parceiro/entrar', req.url)
    destino.searchParams.set('erro', id ? 'sem-acesso' : 'expirado')
    return NextResponse.redirect(destino)
  }

  const resposta = NextResponse.redirect(new URL('/parceiro', req.url))
  resposta.cookies.set(cookieParceiro.nome, criarSessao(candidatura.id), cookieParceiro.opcoes)
  return resposta
}
