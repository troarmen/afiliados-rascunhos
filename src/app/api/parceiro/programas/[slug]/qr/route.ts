import { NextResponse, type NextRequest } from 'next/server'
import { parceiroAutenticado } from '@/lib/auth-parceiro'
import { ORIGEM_QR, ORIGEM_VALIDA, linkComOrigem } from '@/lib/plataformas'
import { qrPng, qrSvg, tamanhoValido } from '@/lib/qr'
import { obterAfiliacao } from '@/lib/store-afiliacoes'
import { obterProgramaPorSlug } from '@/lib/store-materiais'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * O QR code do parceiro no programa, para baixar.
 *
 *   ?formato=png|svg   png por padrão (1024 px); svg para quem edita vetor
 *   ?tamanho=256..2048 lado do PNG em pixels
 *   ?origem=duck-…     etiqueta de origem (padrão: duck-qr; por material,
 *                      a página do material manda a dela)
 *   ?baixar=1          manda como anexo, com nome de arquivo
 *
 * O conteúdo do QR é o link do parceiro com a etiqueta — nada mais. Quem
 * lê o código cai direto na página de venda, já atribuída a ele.
 */
export async function GET(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const parceiro = await parceiroAutenticado()
  if (!parceiro) return NextResponse.json({ mensagem: 'Sessão inválida.' }, { status: 401 })

  const { slug } = await ctx.params
  const programa = await obterProgramaPorSlug(slug)
  if (!programa || !programa.ativo) return NextResponse.json({ mensagem: 'Programa não encontrado.' }, { status: 404 })

  const afiliacao = await obterAfiliacao(parceiro.id, programa.id)
  if (!afiliacao) return NextResponse.json({ mensagem: 'Cadastre o seu link de vendas antes de gerar o QR.' }, { status: 404 })

  const q = req.nextUrl.searchParams
  const origemBruta = q.get('origem') ?? ORIGEM_QR
  const origem = ORIGEM_VALIDA.test(origemBruta) ? origemBruta : ORIGEM_QR
  const conteudo = linkComOrigem(afiliacao.url, programa.plataforma, origem)
  const svg = q.get('formato') === 'svg'
  const tamanho = tamanhoValido(q.get('tamanho'))
  const nome = `qr-${programa.slug}-${origem}.${svg ? 'svg' : 'png'}`

  const cabecalhos: Record<string, string> = {
    'Content-Type': svg ? 'image/svg+xml; charset=utf-8' : 'image/png',
    'Cache-Control': 'private, max-age=600',
    'X-Duck-Conteudo': encodeURIComponent(conteudo),
  }
  if (q.get('baixar')) cabecalhos['Content-Disposition'] = `attachment; filename="${nome}"`

  if (svg) return new NextResponse(await qrSvg(conteudo, tamanho), { headers: cabecalhos })
  const png = await qrPng(conteudo, tamanho)
  return new NextResponse(new Uint8Array(png), { headers: cabecalhos })
}
