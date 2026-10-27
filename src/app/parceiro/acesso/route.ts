import { NextResponse, type NextRequest } from 'next/server'
import { candidaturaDoLink, cookieParceiro, criarSessao, podeAcessar } from '@/lib/auth-parceiro'
import { site } from '@/lib/site'
import { obterCandidatura } from '@/lib/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** O clique no e-mail: token de link vira cookie de sessão. */
export async function GET(req: NextRequest) {
  const id = candidaturaDoLink(req.nextUrl.searchParams.get('t') ?? undefined)
  const candidatura = id ? await obterCandidatura(id) : null

  if (!podeAcessar(candidatura)) {
    // Base pública, não `req.url`: atrás do proxy ela vira 0.0.0.0:3000.
    const destino = new URL('/parceiro/entrar', site.url)
    destino.searchParams.set('erro', id ? 'sem-acesso' : 'expirado')
    return NextResponse.redirect(destino)
  }

  const resposta = NextResponse.redirect(new URL('/parceiro', site.url))
  resposta.cookies.set(cookieParceiro.nome, criarSessao(candidatura.id), cookieParceiro.opcoes)
  return resposta
}
