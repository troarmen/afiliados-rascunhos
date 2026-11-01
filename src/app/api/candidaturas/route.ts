import { NextResponse, type NextRequest } from 'next/server'
import { candidaturaSchema } from '@/lib/schema'
import { criarCandidatura, jaExisteEmail } from '@/lib/store'
import { alertaEquipe, confirmacaoCandidato } from '@/lib/mail'
import { site } from '@/lib/site'
import { criarLimitador, ipDaRequisicao } from '@/lib/limite'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** 5 envios por IP a cada 10 minutos. */
const limite = criarLimitador({ janelaMs: 10 * 60 * 1000, limite: 5 })

export async function POST(req: NextRequest) {
  const ip = ipDaRequisicao(req)

  if (limite.consumir(ip)) {
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
        // Lê de `site.email` em vez de repetir o endereço: era a única
        // cópia solta e ficou para trás na primeira troca de contato.
        mensagem: `Tivemos um problema para registrar sua inscrição. Tente novamente em instantes ou escreva para ${site.email}.`,
      },
      { status: 500 },
    )
  }
}
