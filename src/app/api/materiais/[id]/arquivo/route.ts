import { NextResponse, type NextRequest } from 'next/server'
import { estaAutenticado } from '@/lib/auth'
import { parceiroAutenticado } from '@/lib/auth-parceiro'
import { obterMaterial, registrarUso } from '@/lib/store-materiais'
import { entregarArquivo } from '@/lib/storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Entrega o arquivo de um material a quem pode vê-lo: parceiro aprovado
 * ou admin. Sem `?baixar=1` é prévia (thumbnail, player) e não conta;
 * com ele, conta um uso e manda como anexo.
 *
 * No Supabase vira redirecionamento para uma URL assinada de 60 s — o
 * storage entrega com range e streaming, sem prender a função.
 */
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const parceiro = await parceiroAutenticado()
  const admin = parceiro ? false : await estaAutenticado()
  if (!parceiro && !admin) return new NextResponse('Não autorizado.', { status: 401 })

  const { id } = await ctx.params
  const material = await obterMaterial(id)
  if (!material || !material.caminho || (material.arquivado && !admin)) {
    return new NextResponse('Não encontrado.', { status: 404 })
  }

  const baixar = req.nextUrl.searchParams.get('baixar') === '1'
  if (baixar) {
    await registrarUso(id, parceiro?.id ?? 'admin', 'baixar').catch((e) => console.warn('[uso]', e))
  }

  try {
    const entrega = await entregarArquivo(material.caminho, { baixar, nomeArquivo: material.nomeArquivo })
    if ('redirecionar' in entrega) return NextResponse.redirect(entrega.redirecionar, 302)

    const cabecalhos = new Headers({
      'Content-Type': material.mime ?? 'application/octet-stream',
      'Content-Length': String(entrega.bytes.byteLength),
      'Cache-Control': 'private, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
    })
    if (baixar) {
      const nome = (material.nomeArquivo ?? 'material').replace(/[^\w.\-]+/g, '_')
      cabecalhos.set('Content-Disposition', `attachment; filename="${nome}"`)
    }
    return new NextResponse(entrega.bytes, { headers: cabecalhos })
  } catch (erro) {
    console.error('[arquivo] falha ao entregar:', erro)
    return new NextResponse('Arquivo indisponível.', { status: 500 })
  }
}
