import { NextResponse, type NextRequest } from 'next/server'
import { pedidoAcessoSchema } from '@/lib/schema'
import { listarCandidaturas } from '@/lib/store'
import { criarTokenDeLink, podeAcessar } from '@/lib/auth-parceiro'
import { linkDeAcesso } from '@/lib/mail'
import { site } from '@/lib/site'
import { criarLimitador, ipDaRequisicao } from '@/lib/limite'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Mesmo limitador do formulário: 5 pedidos por IP a cada 10 minutos. */
const limite = criarLimitador({ janelaMs: 10 * 60 * 1000, limite: 5 })

const espera = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * Pede o link de acesso.
 *
 * Responde 200 SEMPRE que o e-mail é bem formado — aprovado ou não,
 * cadastrado ou não. Diferenciar a resposta contaria para qualquer um quem
 * está no programa. O e-mail só sai para quem pode entrar.
 */
export async function POST(req: NextRequest) {
  if (limite.consumir(ipDaRequisicao(req))) {
    return NextResponse.json({ mensagem: 'Muitos pedidos seguidos. Aguarde alguns minutos.' }, { status: 429 })
  }

  const resultado = pedidoAcessoSchema.safeParse(await req.json().catch(() => null))
  if (!resultado.success) {
    return NextResponse.json({ mensagem: resultado.error.issues[0]?.message ?? 'E-mail inválido.' }, { status: 422 })
  }
  const { email, website } = resultado.data
  await espera(500)
  if (website) return NextResponse.json({ ok: true })

  const candidata = (await listarCandidaturas({ busca: email })).find((c) => c.email === email) ?? null
  let linkDev: string | undefined
  if (podeAcessar(candidata)) {
    const url = new URL('/parceiro/acesso', site.url)
    url.searchParams.set('t', criarTokenDeLink(candidata.id))
    const enviado = await linkDeAcesso(candidata, url.toString())
    if (!enviado && process.env.NODE_ENV !== 'production') {
      // Sem BREVO_API_KEY em desenvolvimento: o link vai para o terminal E
      // para a tela, relativo ao host atual (site.url pode ser o domínio
      // de produção, que não resolve aqui).
      console.info(`[parceiro] link de acesso para ${email}:\n  ${url.toString()}`)
      linkDev = `${url.pathname}${url.search}`
    }
  }

  return NextResponse.json({ ok: true, ...(linkDev ? { linkDev } : {}) })
}
