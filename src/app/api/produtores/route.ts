import { NextResponse, type NextRequest } from 'next/server'
import { produtorSchema } from '@/lib/schema'
import { criarInteresseProdutor } from '@/lib/store-produtores'
import { alertaProdutor, confirmacaoProdutor } from '@/lib/mail'
import { site } from '@/lib/site'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const JANELA_MS = 10 * 60 * 1000
const LIMITE = 5
const tentativas = new Map<string, number[]>()

function excedeuLimite(ip: string): boolean {
  const agora = Date.now()
  const anteriores = (tentativas.get(ip) ?? []).filter((t) => agora - t < JANELA_MS)
  anteriores.push(agora)
  tentativas.set(ip, anteriores)
  if (tentativas.size > 5000) tentativas.clear()
  return anteriores.length > LIMITE
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? req.headers.get('x-real-ip') ?? 'desconhecido'
  if (excedeuLimite(ip)) {
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
