import { NextResponse } from 'next/server'
import { estaAutenticado } from '@/lib/auth'
import { listarCandidaturas } from '@/lib/store'
import { paraCsv } from '@/lib/utils'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Exporta a base completa para a planilha de candidatos. */
export async function GET() {
  if (!(await estaAutenticado())) {
    return NextResponse.json({ mensagem: 'Sessão inválida ou expirada.' }, { status: 401 })
  }

  const lista = await listarCandidaturas()
  const csv = paraCsv(lista)
  const data = new Date().toISOString().slice(0, 10)

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="candidatos-${data}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
