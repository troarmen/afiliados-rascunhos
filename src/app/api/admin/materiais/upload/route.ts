import { NextResponse, type NextRequest } from 'next/server'
import { randomUUID } from 'node:crypto'
import { estaAutenticado } from '@/lib/auth'
import { modoPersistencia } from '@/lib/db'
import {
  MIMES_ACEITOS,
  TAMANHO_MAXIMO,
  caminhoParaArquivo,
  guardarArquivoLocal,
  urlDeUploadAssinada,
} from '@/lib/storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Upload em dois tempos.
 *
 * 1) JSON {nome, mime, tamanho} → valida e devolve ONDE enviar:
 *    - supabase: {modo:'supabase', url, token, caminho} — o navegador faz PUT
 *      direto no bucket; o arquivo nunca passa por aqui.
 *    - arquivo:  {modo:'arquivo', caminho} — o navegador volta com multipart.
 * 2) multipart {caminho, arquivo} → só no modo arquivo, grava em .data/.
 */
export async function POST(req: NextRequest) {
  if (!(await estaAutenticado())) {
    return NextResponse.json({ mensagem: 'Sessão inválida ou expirada.' }, { status: 401 })
  }

  const tipoConteudo = req.headers.get('content-type') ?? ''

  if (tipoConteudo.startsWith('multipart/form-data')) {
    if (modoPersistencia() !== 'arquivo') {
      return NextResponse.json({ mensagem: 'No Supabase o envio é direto para o bucket.' }, { status: 400 })
    }
    const form = await req.formData()
    const caminho = String(form.get('caminho') ?? '')
    const arquivo = form.get('arquivo')
    if (!caminho || !(arquivo instanceof File)) {
      return NextResponse.json({ mensagem: 'Envio incompleto.' }, { status: 400 })
    }
    const problema = validar(arquivo.name, arquivo.type, arquivo.size)
    if (problema) return NextResponse.json({ mensagem: problema }, { status: 422 })
    await guardarArquivoLocal(caminho, new Uint8Array(await arquivo.arrayBuffer()))
    return NextResponse.json({ ok: true, caminho })
  }

  const { nome, mime, tamanho } = (await req.json().catch(() => ({}))) as {
    nome?: string
    mime?: string
    tamanho?: number
  }
  if (!nome || !mime || typeof tamanho !== 'number') {
    return NextResponse.json({ mensagem: 'Informe nome, tipo e tamanho do arquivo.' }, { status: 400 })
  }
  const problema = validar(nome, mime, tamanho)
  if (problema) return NextResponse.json({ mensagem: problema }, { status: 422 })

  const caminho = caminhoParaArquivo(randomUUID(), nome)

  if (modoPersistencia() === 'supabase') {
    try {
      const assinada = await urlDeUploadAssinada(caminho)
      return NextResponse.json({ modo: 'supabase', ...assinada })
    } catch (erro) {
      console.error('[upload] falha ao assinar:', erro)
      return NextResponse.json({ mensagem: 'Não foi possível preparar o envio.' }, { status: 500 })
    }
  }
  return NextResponse.json({ modo: 'arquivo', caminho })
}

function validar(nome: string, mime: string, tamanho: number): string | null {
  if (!MIMES_ACEITOS.has(mime)) {
    return `Tipo de arquivo não aceito (${mime || nome.split('.').pop()}). Use imagem, vídeo, PDF, ZIP, apresentação ou texto.`
  }
  if (tamanho > TAMANHO_MAXIMO) {
    return `Arquivo acima de ${Math.round(TAMANHO_MAXIMO / (1024 * 1024))} MB.`
  }
  if (tamanho === 0) return 'O arquivo está vazio.'
  return null
}
