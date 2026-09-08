import { NextResponse, type NextRequest } from 'next/server'

/**
 * Barreira das duas áreas restritas: /admin (equipe) e /parceiro (afiliado).
 *
 * O middleware roda no Edge Runtime, onde `node:crypto` não está disponível —
 * por isso aqui só checamos a *presença* do cookie de sessão. A validação da
 * assinatura HMAC acontece em cada página e rota, no runtime Node (ver
 * `src/lib/auth.ts` e `src/lib/auth-parceiro.ts`). Sem essa dupla checagem,
 * um cookie forjado passaria.
 */
const AREAS = [
  {
    prefixos: ['/admin', '/api/admin'],
    cookie: 'pare_sessao',
    entrada: '/admin/entrar',
    livres: ['/admin/entrar', '/api/admin/sessao'],
  },
  {
    prefixos: ['/parceiro'],
    // A equipe entra em prévia com a própria sessão: só nas PÁGINAS.
    cookie: 'duck_parceiro',
    cookieAlternativo: 'pare_sessao',
    entrada: '/parceiro/entrar',
    livres: ['/parceiro/entrar', '/parceiro/acesso'],
  },
  {
    prefixos: ['/api/parceiro'],
    cookie: 'duck_parceiro',
    entrada: '/parceiro/entrar',
    livres: ['/api/parceiro/acesso'],
  },
]

export function middleware(req: NextRequest) {
  const caminho = req.nextUrl.pathname
  const area = AREAS.find((a) => a.prefixos.some((p) => caminho === p || caminho.startsWith(`${p}/`)))
  if (!area) return NextResponse.next()

  if (area.livres.some((livre) => caminho === livre || caminho.startsWith(`${livre}/`))) {
    return NextResponse.next()
  }
  if (req.cookies.get(area.cookie)?.value) return NextResponse.next()
  const alternativo = 'cookieAlternativo' in area ? area.cookieAlternativo : undefined
  if (alternativo && req.cookies.get(alternativo)?.value) return NextResponse.next()

  if (caminho.startsWith('/api/')) {
    return NextResponse.json({ mensagem: 'Sessão inválida ou expirada.' }, { status: 401 })
  }
  const destino = new URL(area.entrada, req.url)
  destino.searchParams.set('voltar', caminho)
  return NextResponse.redirect(destino)
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/parceiro/:path*', '/api/parceiro/:path*'],
}
