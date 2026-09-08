import 'server-only'
import { randomUUID } from 'node:crypto'
import { escreverColecao, lerColecao, modoPersistencia, supabase } from './db'
import type { Afiliacao } from './materiais'

/**
 * Store do vínculo parceiro × programa (o link de vendas).
 *
 * Um parceiro tem no máximo um link por programa: salvar de novo substitui.
 * Mesmo contrato dos outros stores — Supabase quando configurado, JSON em
 * `.data/` quando não.
 */

type Linha = Record<string, unknown>
const COLECAO = 'afiliacoes'

function doBanco(l: Linha): Afiliacao {
  return {
    id: String(l.id),
    candidaturaId: String(l.candidatura_id),
    programaId: String(l.programa_id),
    url: String(l.url),
    criadoEm: String(l.criado_em),
    atualizadoEm: String(l.atualizado_em ?? l.criado_em),
  }
}

export async function obterAfiliacao(candidaturaId: string, programaId: string): Promise<Afiliacao | null> {
  if (modoPersistencia() === 'supabase') {
    const { data, error } = await supabase()
      .from(COLECAO)
      .select('*')
      .eq('candidatura_id', candidaturaId)
      .eq('programa_id', programaId)
      .maybeSingle()
    if (error || !data) return null
    return doBanco(data)
  }
  const lista = await lerColecao<Afiliacao>(COLECAO)
  return lista.find((a) => a.candidaturaId === candidaturaId && a.programaId === programaId) ?? null
}

export async function listarAfiliacoes(filtro: { candidaturaId?: string; programaId?: string }): Promise<Afiliacao[]> {
  if (modoPersistencia() === 'supabase') {
    let q = supabase().from(COLECAO).select('*').order('criado_em', { ascending: true })
    if (filtro.candidaturaId) q = q.eq('candidatura_id', filtro.candidaturaId)
    if (filtro.programaId) q = q.eq('programa_id', filtro.programaId)
    const { data, error } = await q
    if (error) throw new Error(`Falha ao listar afiliações: ${error.message}`)
    return (data ?? []).map(doBanco)
  }
  const lista = await lerColecao<Afiliacao>(COLECAO)
  return lista.filter(
    (a) =>
      (!filtro.candidaturaId || a.candidaturaId === filtro.candidaturaId) &&
      (!filtro.programaId || a.programaId === filtro.programaId),
  )
}

/** Cria ou substitui o link do parceiro no programa. */
export async function salvarAfiliacao(candidaturaId: string, programaId: string, url: string): Promise<Afiliacao> {
  const agora = new Date().toISOString()
  const atual = await obterAfiliacao(candidaturaId, programaId)
  const afiliacao: Afiliacao = atual
    ? { ...atual, url, atualizadoEm: agora }
    : { id: randomUUID(), candidaturaId, programaId, url, criadoEm: agora, atualizadoEm: agora }

  if (modoPersistencia() === 'supabase') {
    const { error } = await supabase().from(COLECAO).upsert(
      {
        id: afiliacao.id,
        candidatura_id: candidaturaId,
        programa_id: programaId,
        url,
        criado_em: afiliacao.criadoEm,
        atualizado_em: agora,
      },
      { onConflict: 'candidatura_id,programa_id' },
    )
    if (error) throw new Error(`Falha ao gravar afiliação: ${error.message}`)
    return afiliacao
  }
  const lista = await lerColecao<Afiliacao>(COLECAO)
  const i = lista.findIndex((a) => a.candidaturaId === candidaturaId && a.programaId === programaId)
  if (i === -1) lista.push(afiliacao)
  else lista[i] = afiliacao
  await escreverColecao(COLECAO, lista)
  return afiliacao
}

export async function removerAfiliacao(candidaturaId: string, programaId: string): Promise<boolean> {
  if (modoPersistencia() === 'supabase') {
    const { error } = await supabase().from(COLECAO).delete().eq('candidatura_id', candidaturaId).eq('programa_id', programaId)
    return !error
  }
  const lista = await lerColecao<Afiliacao>(COLECAO)
  const depois = lista.filter((a) => !(a.candidaturaId === candidaturaId && a.programaId === programaId))
  await escreverColecao(COLECAO, depois)
  return depois.length !== lista.length
}
