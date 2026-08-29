import { NextResponse, type NextRequest } from 'next/server'
import { candidaturaSchema } from '@/lib/schema'
import { criarCandidatura, jaExisteEmail } from '@/lib/store'
import { alertaEquipe, confirmacaoCandidato } from '@/lib/mail'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Limite de envio por IP.
 * Em memória: some a cada deploy e não é compartilhado entre instâncias.
 * Suficiente contra flood bobo; para algo sério, trocar por Upstash/Redis
 * (ver docs/05-roadmap.md).
 */
const JANELA_MS = 10 * 60 * 1000
const LIMITE = 5
const tentativas = new Map<string, number[]>()

function excedeuLimite(ip: string): boolean {
  const agora = Date.now()
  const anteriores = (tentativas.get(ip) ?? []).filter((t) => agora - t < JANELA_MS)
  anteriores.push(agora)
  tentativas.set(ip, anteriores)
  if (tentativas.size > 5000) tentativas.clear() // trava de memória
  return anteriores.length > LIMITE
}

function ipDaRequisicao(req: NextRequest): string {
  const encaminhado = req.headers.get('x-forwarded-for')
  if (encaminhado) return encaminhado.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'desconhecido'
}

export async function POST(req: NextRequest) {
  const ip = ipDaRequisicao(req)

  if (excedeuLimite(ip)) {
    return NextResponse.json(
      { mensagem: 'Muitas tentativas seguidas. Aguarde alguns minutos e tente de novo.' },
      { status: 429 },
    )
  }

  let corpo: unknown
  try {
    corpo = await req.json()
  } catch {
    return NextResponse.json({ mensagem: 'Requisição inválida.' }, { status: 400 })
  }

  const resultado = candidaturaSchema.safeParse(corpo)

  if (!resultado.success) {
    const campos: Record<string, string> = {}
    for (const problema of resultado.error.issues) {
      const chave = problema.path.join('.')
      if (chave && !campos[chave]) campos[chave] = problema.message
    }
    return NextResponse.json(
      { mensagem: 'Alguns campos precisam de atenção.', campos },
      { status: 422 },
    )
  }

  const dados = resultado.data

  // Antispam silencioso: responde 200 para o bot não aprender com o erro.
  const preenchimentoInstantaneo = dados.tempoPreenchimento > 0 && dados.tempoPreenchimento < 4000
  if (dados.website || preenchimentoInstantaneo) {
    console.warn(`[antispam] envio descartado (ip ${ip}, tempo ${dados.tempoPreenchimento}ms)`)
    return NextResponse.json({ ok: true })
  }

  try {
    if (await jaExisteEmail(dados.email)) {
      return NextResponse.json(
        {
          mensagem:
            'Já temos uma inscrição com este e-mail. Se quiser atualizar algo, responda o e-mail de confirmação que enviamos.',
          campos: { email: 'E-mail já inscrito.' },
        },
        { status: 409 },
      )
    }

    const referer = req.headers.get('referer') ?? ''
    const origem = [dados.utm?.source, dados.utm?.campaign].filter(Boolean).join(' / ') || referer

    const candidatura = await criarCandidatura(dados, { origem })

    // E-mails não podem derrubar a inscrição: erro aqui só vira log.
    void Promise.allSettled([confirmacaoCandidato(candidatura), alertaEquipe(candidatura)])

    return NextResponse.json({ ok: true, id: candidatura.id }, { status: 201 })
  } catch (erro) {
    console.error('[candidaturas] falha ao gravar:', erro)
    return NextResponse.json(
      {
        mensagem:
          'Tivemos um problema para registrar sua inscrição. Tente novamente em instantes ou escreva para parceiros@rascunhoseconomicos.com.',
      },
      { status: 500 },
    )
  }
}
