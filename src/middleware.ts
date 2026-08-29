import { NextResponse, type NextRequest } from 'next/server'

/**
 * Barreira do painel administrativo.
 *
 * O middleware roda no Edge Runtime, onde `node:crypto` não está disponível —
 * por isso aqui só checamos a *presença* do cookie de sessão. A validação da
 * assinatura HMAC acontece em cada página e rota do /admin, no runtime Node
 * (ver `src/lib/auth.ts`). Sem essa dupla checagem, um cookie forjado passaria.
 */
/** Rotas do próprio fluxo de login — precisam ficar acessíveis sem sessão. */
const LIVRES = ['/admin/entrar', '/api/admin/sessao']

export function middleware(req: NextRequest) {
  const caminho = req.nextUrl.pathname
  if (LIVRES.some((livre) => caminho === livre || caminho.startsWith(`${livre}/`))) {
    return NextResponse.next()
  }

  const temCookie = Boolean(req.cookies.get('pare_sessao')?.value)
  if (temCookie) return NextResponse.next()

  const destino = new URL('/admin/entrar', req.url)
  destino.searchParams.set('voltar', req.nextUrl.pathname)
  return NextResponse.redirect(destino)
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
