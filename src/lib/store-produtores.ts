import 'server-only'
import { randomUUID } from 'node:crypto'
import { escreverColecao, lerColecao, modoPersistencia, supabase } from './db'
import type { InteresseProdutor, ProdutorInput, StatusProdutor } from './schema'

/** Interesses de produtor: mesmo adaptador dos outros stores. */

const TABELA = 'produtores_interessados'
type Linha = Record<string, unknown>

function paraBanco(p: InteresseProdutor): Linha {
  return {
    id: p.id, criado_em: p.criadoEm, atualizado_em: p.atualizadoEm,
    nome: p.nome, email: p.email, telefone: p.telefone, projeto: p.projeto, url: p.url,
    plataforma: p.plataforma, catalogo: p.catalogo, status: p.status, notas: p.notas,
  }
}

function doBanco(l: Linha): InteresseProdutor {
  return {
    id: String(l.id), criadoEm: String(l.criado_em), atualizadoEm: String(l.atualizado_em ?? l.criado_em),
    nome: String(l.nome), email: String(l.email), telefone: String(l.telefone ?? ''),
    projeto: String(l.projeto), url: String(l.url ?? ''), plataforma: String(l.plataforma),
    catalogo: String(l.catalogo ?? ''), status: (l.status ?? 'novo') as StatusProdutor,
    notas: String(l.notas ?? ''), aceiteContato: true, website: '', tempoPreenchimento: 0,
  }
}

export async function criarInteresseProdutor(entrada: ProdutorInput): Promise<InteresseProdutor> {
  const agora = new Date().toISOString()
  const registro: InteresseProdutor = { ...entrada, id: randomUUID(), criadoEm: agora, atualizadoEm: agora, status: 'novo', notas: '' }
  if (modoPersistencia() === 'supabase') {
    const { error } = await supabase().from(TABELA).insert(paraBanco(registro))
    if (error) throw new Error(`Falha ao gravar interesse: ${error.message}`)
  } else {
    const lista = await lerColecao<InteresseProdutor>(TABELA)
    lista.unshift(registro)
    await escreverColecao(TABELA, lista)
  }
  return registro
}

export async function listarInteressesProdutor(): Promise<InteresseProdutor[]> {
  if (modoPersistencia() === 'supabase') {
    const { data, error } = await supabase().from(TABELA).select('*').order('criado_em', { ascending: false }).limit(1000)
    if (error) throw new Error(`Falha ao listar interesses: ${error.message}`)
    return (data ?? []).map(doBanco)
  }
  return lerColecao<InteresseProdutor>(TABELA)
}

export async function atualizarInteresseProdutor(
  id: string,
  campos: { status?: StatusProdutor; notas?: string },
): Promise<InteresseProdutor | null> {
  const atualizadoEm = new Date().toISOString()
  if (modoPersistencia() === 'supabase') {
    const patch: Linha = { atualizado_em: atualizadoEm }
    if (campos.status !== undefined) patch.status = campos.status
    if (campos.notas !== undefined) patch.notas = campos.notas
    const { data, error } = await supabase().from(TABELA).update(patch).eq('id', id).select('*').maybeSingle()
    if (error || !data) return null
    return doBanco(data)
  }
  const lista = await lerColecao<InteresseProdutor>(TABELA)
  const i = lista.findIndex((p) => p.id === id)
  if (i === -1) return null
  lista[i] = { ...lista[i], ...campos, atualizadoEm }
  await escreverColecao(TABELA, lista)
  return lista[i]
}
