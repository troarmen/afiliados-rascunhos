import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { Candidatura, CandidaturaInput, Status } from './schema'
import { calcularScore } from './score'

/**
 * Adaptador de persistência.
 *
 * Com `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` definidos, grava
 * no Postgres do Supabase. Sem eles, cai para um arquivo JSON em `.data/` para
 * que `npm run dev` funcione sem nenhuma configuração. O modo arquivo é só
 * para desenvolvimento — nunca use em produção (sem concorrência, sem backup).
 */

const TABELA = 'candidaturas'
const ARQUIVO = path.join(process.cwd(), '.data', 'candidaturas.json')

let cliente: SupabaseClient | null = null

export function modoPersistencia(): 'supabase' | 'arquivo' {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? 'supabase'
    : 'arquivo'
}

function supabase(): SupabaseClient {
  if (!cliente) {
    cliente = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } },
    )
  }
  return cliente
}

// --- Conversão entre o formato da aplicação e as colunas do banco -----------

type LinhaBanco = Record<string, unknown>

function paraBanco(c: Candidatura): LinhaBanco {
  return {
    id: c.id,
    criado_em: c.criadoEm,
    atualizado_em: c.atualizadoEm,
    nome: c.nome,
    email: c.email,
    telefone: c.telefone,
    canal_nome: c.canalNome,
    canal_url: c.canalUrl,
    plataforma_principal: c.plataformaPrincipal,
    redes: c.redes,
    area: c.area,
    audiencia: c.audiencia,
    formas_divulgacao: c.formasDivulgacao,
    ja_eh_afiliado_hotmart: c.jaEhAfiliadoHotmart,
    experiencia: c.experiencia,
    motivacao: c.motivacao,
    como_conheceu: c.comoConheceu,
    utm: c.utm,
    origem: c.origem,
    status: c.status,
    score: c.score,
    notas: c.notas,
    responsavel: c.responsavel,
  }
}

function doBanco(l: LinhaBanco): Candidatura {
  return {
    id: String(l.id),
    criadoEm: String(l.criado_em),
    atualizadoEm: String(l.atualizado_em ?? l.criado_em),
    nome: String(l.nome),
    email: String(l.email),
    telefone: String(l.telefone),
    canalNome: String(l.canal_nome),
    canalUrl: String(l.canal_url),
    plataformaPrincipal: String(l.plataforma_principal),
    redes: (l.redes ?? {}) as Candidatura['redes'],
    area: String(l.area),
    audiencia: String(l.audiencia),
    formasDivulgacao: (l.formas_divulgacao ?? []) as string[],
    jaEhAfiliadoHotmart: Boolean(l.ja_eh_afiliado_hotmart),
    experiencia: String(l.experiencia ?? ''),
    motivacao: String(l.motivacao ?? ''),
    comoConheceu: String(l.como_conheceu ?? ''),
    utm: (l.utm ?? {}) as Candidatura['utm'],
    origem: String(l.origem ?? ''),
    status: (l.status ?? 'novo') as Status,
    score: Number(l.score ?? 0),
    notas: String(l.notas ?? ''),
    responsavel: String(l.responsavel ?? ''),
    website: '',
    tempoPreenchimento: 0,
    aceiteTermos: true,
    aceiteContato: true,
  }
}

// --- Modo arquivo ----------------------------------------------------------

async function lerArquivo(): Promise<Candidatura[]> {
  try {
    const bruto = await fs.readFile(ARQUIVO, 'utf8')
    return JSON.parse(bruto) as Candidatura[]
  } catch {
    return []
  }
}

async function escreverArquivo(lista: Candidatura[]) {
  await fs.mkdir(path.dirname(ARQUIVO), { recursive: true })
  await fs.writeFile(ARQUIVO, JSON.stringify(lista, null, 2), 'utf8')
}

// --- API pública -----------------------------------------------------------

export async function criarCandidatura(
  entrada: CandidaturaInput,
  meta: { origem?: string } = {},
): Promise<Candidatura> {
  const agora = new Date().toISOString()
  const candidatura: Candidatura = {
    ...entrada,
    id: randomUUID(),
    criadoEm: agora,
    atualizadoEm: agora,
    status: 'novo',
    score: calcularScore(entrada),
    notas: '',
    responsavel: '',
    origem: meta.origem ?? '',
  }

  if (modoPersistencia() === 'supabase') {
    const { error } = await supabase().from(TABELA).insert(paraBanco(candidatura))
    if (error) throw new Error(`Falha ao gravar candidatura: ${error.message}`)
  } else {
    const lista = await lerArquivo()
    lista.unshift(candidatura)
    await escreverArquivo(lista)
  }

  return candidatura
}

export async function jaExisteEmail(email: string): Promise<boolean> {
  const alvo = email.trim().toLowerCase()
  if (modoPersistencia() === 'supabase') {
    const { data, error } = await supabase().from(TABELA).select('id').eq('email', alvo).limit(1)
    if (error) return false
    return (data?.length ?? 0) > 0
  }
  const lista = await lerArquivo()
  return lista.some((c) => c.email.toLowerCase() === alvo)
}

export type Filtro = { status?: Status | 'todos'; area?: string; busca?: string }

export async function listarCandidaturas(filtro: Filtro = {}): Promise<Candidatura[]> {
  let lista: Candidatura[]

  if (modoPersistencia() === 'supabase') {
    let consulta = supabase().from(TABELA).select('*').order('criado_em', { ascending: false })
    if (filtro.status && filtro.status !== 'todos') consulta = consulta.eq('status', filtro.status)
    if (filtro.area && filtro.area !== 'todas') consulta = consulta.eq('area', filtro.area)
    const { data, error } = await consulta.limit(1000)
    if (error) throw new Error(`Falha ao listar candidaturas: ${error.message}`)
    lista = (data ?? []).map(doBanco)
  } else {
    lista = await lerArquivo()
    if (filtro.status && filtro.status !== 'todos') {
      lista = lista.filter((c) => c.status === filtro.status)
    }
    if (filtro.area && filtro.area !== 'todas') lista = lista.filter((c) => c.area === filtro.area)
  }

  const busca = filtro.busca?.trim().toLowerCase()
  if (busca) {
    lista = lista.filter((c) =>
      [c.nome, c.email, c.canalNome, c.canalUrl].join(' ').toLowerCase().includes(busca),
    )
  }

  return lista
}

export async function obterCandidatura(id: string): Promise<Candidatura | null> {
  if (modoPersistencia() === 'supabase') {
    const { data, error } = await supabase().from(TABELA).select('*').eq('id', id).maybeSingle()
    if (error || !data) return null
    return doBanco(data)
  }
  const lista = await lerArquivo()
  return lista.find((c) => c.id === id) ?? null
}

export async function atualizarCandidatura(
  id: string,
  campos: { status?: Status; notas?: string; responsavel?: string },
): Promise<Candidatura | null> {
  const atualizadoEm = new Date().toISOString()

  if (modoPersistencia() === 'supabase') {
    const patch: LinhaBanco = { atualizado_em: atualizadoEm }
    if (campos.status !== undefined) patch.status = campos.status
    if (campos.notas !== undefined) patch.notas = campos.notas
    if (campos.responsavel !== undefined) patch.responsavel = campos.responsavel
    const { data, error } = await supabase()
      .from(TABELA)
      .update(patch)
      .eq('id', id)
      .select('*')
      .maybeSingle()
    if (error || !data) return null
    return doBanco(data)
  }

  const lista = await lerArquivo()
  const i = lista.findIndex((c) => c.id === id)
  if (i === -1) return null
  lista[i] = { ...lista[i], ...campos, atualizadoEm }
  await escreverArquivo(lista)
  return lista[i]
}

export async function metricas() {
  const lista = await listarCandidaturas()
  const porStatus = lista.reduce<Record<string, number>>((acc, c) => {
    acc[c.status] = (acc[c.status] ?? 0) + 1
    return acc
  }, {})
  const seteDiasAtras = Date.now() - 7 * 24 * 60 * 60 * 1000
  return {
    total: lista.length,
    porStatus,
    ultimos7: lista.filter((c) => new Date(c.criadoEm).getTime() >= seteDiasAtras).length,
    aprovados: porStatus.aprovado ?? 0,
    naFila: (porStatus.novo ?? 0) + (porStatus.em_analise ?? 0),
  }
}
