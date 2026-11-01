import { NextResponse, type NextRequest } from 'next/server'
import { produtorSchema } from '@/lib/schema'
import { criarInteresseProdutor } from '@/lib/store-produtores'
import { alertaProdutor, confirmacaoProdutor } from '@/lib/mail'
import { site } from '@/lib/site'
import { criarLimitador, ipDaRequisicao } from '@/lib/limite'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** 5 envios por IP a cada 10 minutos. */
const limite = criarLimitador({ janelaMs: 10 * 60 * 1000, limite: 5 })

export async function POST(req: NextRequest) {
  const ip = ipDaRequisicao(req)
  if (limite.consumir(ip)) {
    return NextResponse.json({ mensagem: 'Muitas tentativas seguidas. Aguarde alguns minutos.' }, { status: 429 })
  }
  const resultado = produtorSchema.safeParse(await req.json().catch(() => null))
  if (!resultado.success) {
    const campos: Record<string, string> = {}
    for (const p of resultado.error.issues) {
      const chave = p.path.join('.')
      if (chave && !campos[chave]) campos[chave] = p.message
    }
    return NextResponse.json({ mensagem: 'Alguns campos precisam de atenção.', campos }, { status: 422 })
  }
  const dados = resultado.data
  if (dados.website || (dados.tempoPreenchimento > 0 && dados.tempoPreenchimento < 4000)) {
    return NextResponse.json({ ok: true })
  }
  try {
    const registro = await criarInteresseProdutor(dados)
    void Promise.allSettled([confirmacaoProdutor(registro), alertaProdutor(registro)])
    return NextResponse.json({ ok: true, id: registro.id }, { status: 201 })
  } catch (erro) {
    console.error('[produtores] falha ao gravar:', erro)
    return NextResponse.json({ mensagem: `Não conseguimos registrar agora. Tente de novo ou escreva para ${site.email}.` }, { status: 500 })
  }
}
