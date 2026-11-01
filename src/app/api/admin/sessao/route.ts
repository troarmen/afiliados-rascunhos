import { NextResponse, type NextRequest } from 'next/server'
import { cookieSessao, criarToken, senhaConfere } from '@/lib/auth'
import { criarLimitador, ipDaRequisicao } from '@/lib/limite'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Atraso fixo: encarece a força bruta sem depender de estado. */
const espera = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Só erros contam: 5 senhas erradas por IP bloqueiam por 15 minutos. */
const errosPorIp = criarLimitador({ janelaMs: 15 * 60 * 1000, limite: 5 })

/**
 * Teto global, independente de IP: segura um ataque distribuído (ou um proxy
 * que não informe o IP real). Efeito colateral aceito: durante um ataque, a
 * equipe também fica sem entrar até a janela passar.
 */
const errosGlobais = criarLimitador({ janelaMs: 60 * 60 * 1000, limite: 30 })
const GLOBAL = 'todos'

export async function POST(req: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) {
    console.error('[admin] ADMIN_PASSWORD não está configurada no servidor.')
    return NextResponse.json({ mensagem: 'Login indisponível no momento.' }, { status: 500 })
  }

  const ip = ipDaRequisicao(req)
  if (errosPorIp.bloqueado(ip) || errosGlobais.bloqueado(GLOBAL)) {
    return NextResponse.json(
      { mensagem: 'Muitas tentativas erradas. Aguarde 15 minutos e tente de novo.' },
      { status: 429 },
    )
  }

  const { senha } = (await req.json().catch(() => ({}))) as { senha?: string }
  await espera(600)

  if (!senha || !senhaConfere(senha)) {
    errosPorIp.registrar(ip)
    errosGlobais.registrar(GLOBAL)
    console.warn(`[admin] senha incorreta (ip ${ip})`)
    return NextResponse.json({ mensagem: 'Senha incorreta.' }, { status: 401 })
  }

  errosPorIp.limpar(ip)
  const resposta = NextResponse.json({ ok: true })
  resposta.cookies.set(cookieSessao.nome, criarToken(), cookieSessao.opcoes)
  return resposta
}

export async function DELETE() {
  const resposta = NextResponse.json({ ok: true })
  resposta.cookies.set(cookieSessao.nome, '', { ...cookieSessao.opcoes, maxAge: 0 })
  return resposta
}
