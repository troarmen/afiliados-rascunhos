import 'server-only'
import { randomUUID } from 'node:crypto'
import { escreverColecao, lerColecao, modoPersistencia, supabase } from './db'
import type { AcaoUso, Campanha, Material, Programa } from './materiais'
import { plataforma } from './plataformas'

/**
 * Store de programas, campanhas e materiais.
 *
 * Mesmo contrato do store de candidaturas: Supabase quando configurado,
 * JSON em `.data/` quando não. Cada função abaixo tem os dois caminhos
 * lado a lado, de propósito — é mais fácil ver que fazem a mesma coisa.
 */

type Linha = Record<string, unknown>

// --- Programas ------------------------------------------------------------

/**
 * O programa padrão. No Supabase ele nasce do schema.sql; no modo arquivo,
 * da primeira leitura. Ter um programa mesmo com um só produtor é o que
 * deixa o multiprodutor da fase 3 ser só "inserir outra linha".
 */
export const PROGRAMA_PADRAO: Omit<Programa, 'id' | 'criadoEm'> = {
  slug: 'rascunhos-economicos',
  nome: 'Rascunhos Econômicos',
  produtor: 'Rascunhos Econômicos',
  descricao:
    'Cursos de economia para quem quer entender o sistema, não decorar fórmula. O primeiro catálogo do Duck Affiliate.',
  plataforma: 'hotmart',
  urlAfiliacao: null,
  ativo: true,
}

function programaDoBanco(l: Linha): Programa {
  return {
    id: String(l.id),
    slug: String(l.slug),
    nome: String(l.nome),
    produtor: String(l.produtor ?? ''),
    descricao: String(l.descricao ?? ''),
    plataforma: plataforma(l.plataforma ? String(l.plataforma) : null).slug,
    urlAfiliacao: l.url_afiliacao ? String(l.url_afiliacao) : null,
    ativo: Boolean(l.ativo ?? true),
    criadoEm: String(l.criado_em),
  }
}

/** Programas gravados antes dos campos de plataforma existirem ganham o padrão. */
function programaDoArquivo(p: Partial<Programa> & Pick<Programa, 'id' | 'slug' | 'nome'>): Programa {
  return {
    produtor: '',
    descricao: '',
    ativo: true,
    criadoEm: new Date(0).toISOString(),
    ...p,
    plataforma: plataforma(p.plataforma).slug,
    urlAfiliacao: p.urlAfiliacao ?? null,
  }
}

export async function listarProgramas(somenteAtivos = true): Promise<Programa[]> {
  if (modoPersistencia() === 'supabase') {
    let q = supabase().from('programas').select('*').order('criado_em', { ascending: true })
    if (somenteAtivos) q = q.eq('ativo', true)
    const { data, error } = await q
    if (error) throw new Error(`Falha ao listar programas: ${error.message}`)
    return (data ?? []).map(programaDoBanco)
  }

  let lista = (await lerColecao<Programa>('programas')).map(programaDoArquivo)
  if (lista.length === 0) {
    lista = [{ ...PROGRAMA_PADRAO, id: randomUUID(), criadoEm: new Date().toISOString() }]
    await escreverColecao('programas', lista)
  }
  return somenteAtivos ? lista.filter((p) => p.ativo) : lista
}

export async function obterProgramaPorSlug(slug: string): Promise<Programa | null> {
  const lista = await listarProgramas(false)
  return lista.find((p) => p.slug === slug) ?? null
}

// --- Campanhas ------------------------------------------------------------

function campanhaDoBanco(l: Linha): Campanha {
  return {
    id: String(l.id),
    programaId: String(l.programa_id),
    nome: String(l.nome),
    descricao: String(l.descricao ?? ''),
    inicio: l.inicio ? String(l.inicio) : null,
    fim: l.fim ? String(l.fim) : null,
    ativa: Boolean(l.ativa ?? true),
    criadoEm: String(l.criado_em),
  }
}

function campanhaParaBanco(c: Campanha): Linha {
  return {
    id: c.id,
    programa_id: c.programaId,
    nome: c.nome,
    descricao: c.descricao,
    inicio: c.inicio,
    fim: c.fim,
    ativa: c.ativa,
    criado_em: c.criadoEm,
  }
}

export async function listarCampanhas(programaId?: string): Promise<Campanha[]> {
  if (modoPersistencia() === 'supabase') {
    let q = supabase().from('campanhas').select('*').order('criado_em', { ascending: false })
    if (programaId) q = q.eq('programa_id', programaId)
    const { data, error } = await q
    if (error) throw new Error(`Falha ao listar campanhas: ${error.message}`)
    return (data ?? []).map(campanhaDoBanco)
  }
  const lista = await lerColecao<Campanha>('campanhas')
  return (programaId ? lista.filter((c) => c.programaId === programaId) : lista).sort((a, b) =>
    b.criadoEm.localeCompare(a.criadoEm),
  )
}

export async function criarCampanha(
  entrada: Pick<Campanha, 'programaId' | 'nome' | 'descricao' | 'inicio' | 'fim' | 'ativa'>,
): Promise<Campanha> {
  const campanha: Campanha = { ...entrada, id: randomUUID(), criadoEm: new Date().toISOString() }
  if (modoPersistencia() === 'supabase') {
    const { error } = await supabase().from('campanhas').insert(campanhaParaBanco(campanha))
    if (error) throw new Error(`Falha ao criar campanha: ${error.message}`)
  } else {
    const lista = await lerColecao<Campanha>('campanhas')
    lista.unshift(campanha)
    await escreverColecao('campanhas', lista)
  }
  return campanha
}

export async function atualizarCampanha(
  id: string,
  campos: Partial<Pick<Campanha, 'nome' | 'descricao' | 'inicio' | 'fim' | 'ativa'>>,
): Promise<Campanha | null> {
  if (modoPersistencia() === 'supabase') {
    const patch: Linha = {}
    if (campos.nome !== undefined) patch.nome = campos.nome
    if (campos.descricao !== undefined) patch.descricao = campos.descricao
    if (campos.inicio !== undefined) patch.inicio = campos.inicio
    if (campos.fim !== undefined) patch.fim = campos.fim
    if (campos.ativa !== undefined) patch.ativa = campos.ativa
    const { data, error } = await supabase()
      .from('campanhas')
      .update(patch)
      .eq('id', id)
      .select('*')
      .maybeSingle()
    if (error || !data) return null
    return campanhaDoBanco(data)
  }
  const lista = await lerColecao<Campanha>('campanhas')
  const i = lista.findIndex((c) => c.id === id)
  if (i === -1) return null
  lista[i] = { ...lista[i], ...campos }
  await escreverColecao('campanhas', lista)
  return lista[i]
}

export async function removerCampanha(id: string): Promise<boolean> {
  // Materiais da campanha ficam, só perdem o vínculo — apagar campanha
  // nunca pode apagar arquivo.
  if (modoPersistencia() === 'supabase') {
    await supabase().from('materiais').update({ campanha_id: null }).eq('campanha_id', id)
    const { error } = await supabase().from('campanhas').delete().eq('id', id)
    return !error
  }
  const materiais = await lerColecao<Material>('materiais')
  await escreverColecao(
    'materiais',
    materiais.map((m) => (m.campanhaId === id ? { ...m, campanhaId: null } : m)),
  )
  const lista = await lerColecao<Campanha>('campanhas')
  const depois = lista.filter((c) => c.id !== id)
  await escreverColecao('campanhas', depois)
  return depois.length !== lista.length
}

// --- Materiais ------------------------------------------------------------

function materialDoBanco(l: Linha): Material {
  return {
    id: String(l.id),
    programaId: String(l.programa_id),
    campanhaId: l.campanha_id ? String(l.campanha_id) : null,
    tipo: String(l.tipo) as Material['tipo'],
    origem: String(l.origem) as Material['origem'],
    titulo: String(l.titulo),
    descricao: String(l.descricao ?? ''),
    formato: String(l.formato ?? ''),
    tags: (l.tags ?? []) as string[],
    recomendado: Boolean(l.recomendado),
    arquivado: Boolean(l.arquivado),
    usos: Number(l.usos ?? 0),
    caminho: l.caminho ? String(l.caminho) : null,
    nomeArquivo: l.nome_arquivo ? String(l.nome_arquivo) : null,
    mime: l.mime ? String(l.mime) : null,
    tamanho: l.tamanho != null ? Number(l.tamanho) : null,
    largura: l.largura != null ? Number(l.largura) : null,
    altura: l.altura != null ? Number(l.altura) : null,
    conteudo: l.conteudo != null ? String(l.conteudo) : null,
    url: l.url ? String(l.url) : null,
    criadoEm: String(l.criado_em),
    atualizadoEm: String(l.atualizado_em ?? l.criado_em),
  }
}

function materialParaBanco(m: Material): Linha {
  return {
    id: m.id,
    programa_id: m.programaId,
    campanha_id: m.campanhaId,
    tipo: m.tipo,
    origem: m.origem,
    titulo: m.titulo,
    descricao: m.descricao,
    formato: m.formato,
    tags: m.tags,
    recomendado: m.recomendado,
    arquivado: m.arquivado,
    usos: m.usos,
    caminho: m.caminho,
    nome_arquivo: m.nomeArquivo,
    mime: m.mime,
    tamanho: m.tamanho,
    largura: m.largura,
    altura: m.altura,
    conteudo: m.conteudo,
    url: m.url,
    criado_em: m.criadoEm,
    atualizado_em: m.atualizadoEm,
  }
}

export type EntradaMaterial = Omit<Material, 'id' | 'usos' | 'criadoEm' | 'atualizadoEm'>

export async function listarMateriais(
  programaId: string,
  opcoes: { incluirArquivados?: boolean } = {},
): Promise<Material[]> {
  if (modoPersistencia() === 'supabase') {
    let q = supabase()
      .from('materiais')
      .select('*')
      .eq('programa_id', programaId)
      .order('criado_em', { ascending: false })
    if (!opcoes.incluirArquivados) q = q.eq('arquivado', false)
    const { data, error } = await q.limit(2000)
    if (error) throw new Error(`Falha ao listar materiais: ${error.message}`)
    return (data ?? []).map(materialDoBanco)
  }
  const lista = await lerColecao<Material>('materiais')
  return lista
    .filter((m) => m.programaId === programaId && (opcoes.incluirArquivados || !m.arquivado))
    .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))
}

export async function obterMaterial(id: string): Promise<Material | null> {
  if (modoPersistencia() === 'supabase') {
    const { data, error } = await supabase().from('materiais').select('*').eq('id', id).maybeSingle()
    if (error || !data) return null
    return materialDoBanco(data)
  }
  const lista = await lerColecao<Material>('materiais')
  return lista.find((m) => m.id === id) ?? null
}

export async function criarMaterial(entrada: EntradaMaterial): Promise<Material> {
  const agora = new Date().toISOString()
  const material: Material = { ...entrada, id: randomUUID(), usos: 0, criadoEm: agora, atualizadoEm: agora }
  if (modoPersistencia() === 'supabase') {
    const { error } = await supabase().from('materiais').insert(materialParaBanco(material))
    if (error) throw new Error(`Falha ao gravar material: ${error.message}`)
  } else {
    const lista = await lerColecao<Material>('materiais')
    lista.unshift(material)
    await escreverColecao('materiais', lista)
  }
  return material
}

export async function atualizarMaterial(
  id: string,
  campos: Partial<EntradaMaterial>,
): Promise<Material | null> {
  const atualizadoEm = new Date().toISOString()
  if (modoPersistencia() === 'supabase') {
    const atual = await obterMaterial(id)
    if (!atual) return null
    const mesclado: Material = { ...atual, ...campos, atualizadoEm }
    const { data, error } = await supabase()
      .from('materiais')
      .update(materialParaBanco(mesclado))
      .eq('id', id)
      .select('*')
      .maybeSingle()
    if (error || !data) return null
    return materialDoBanco(data)
  }
  const lista = await lerColecao<Material>('materiais')
  const i = lista.findIndex((m) => m.id === id)
  if (i === -1) return null
  lista[i] = { ...lista[i], ...campos, atualizadoEm }
  await escreverColecao('materiais', lista)
  return lista[i]
}

export async function removerMaterial(id: string): Promise<Material | null> {
  const material = await obterMaterial(id)
  if (!material) return null
  if (modoPersistencia() === 'supabase') {
    const { error } = await supabase().from('materiais').delete().eq('id', id)
    if (error) return null
  } else {
    const lista = await lerColecao<Material>('materiais')
    await escreverColecao(
      'materiais',
      lista.filter((m) => m.id !== id),
    )
  }
  return material
}

/**
 * Registra um uso e devolve o novo total. Também guarda a linha de log:
 * hoje ninguém lê, mas é o que permite "materiais mais usados POR
 * parceiro" e "o que este parceiro já baixou" sem migração depois.
 */
export async function registrarUso(
  materialId: string,
  candidaturaId: string,
  acao: AcaoUso,
): Promise<number> {
  const em = new Date().toISOString()
  if (modoPersistencia() === 'supabase') {
    const { data, error } = await supabase().rpc('incrementar_uso_material', {
      p_material_id: materialId,
      p_candidatura_id: candidatureIdOuNulo(candidaturaId),
      p_acao: acao,
    })
    if (error) throw new Error(`Falha ao registrar uso: ${error.message}`)
    return Number(data ?? 0)
  }
  const lista = await lerColecao<Material>('materiais')
  const i = lista.findIndex((m) => m.id === materialId)
  if (i === -1) return 0
  lista[i] = { ...lista[i], usos: lista[i].usos + 1 }
  await escreverColecao('materiais', lista)
  const usos = await lerColecao<Linha>('materiais_usos')
  usos.push({ materialId, candidaturaId, acao, em })
  await escreverColecao('materiais_usos', usos)
  return lista[i].usos
}

/** O admin também baixa material para conferir; não é parceiro, vai como nulo. */
function candidatureIdOuNulo(id: string) {
  return id === 'admin' ? null : id
}

/** Contagens por programa para o painel do parceiro e o admin. */
export async function resumoMateriais(programaId: string) {
  const lista = await listarMateriais(programaId)
  return {
    total: lista.length,
    recomendados: lista.filter((m) => m.recomendado).length,
    porTipo: lista.reduce<Record<string, number>>((acc, m) => {
      acc[m.tipo] = (acc[m.tipo] ?? 0) + 1
      return acc
    }, {}),
    usos: lista.reduce((s, m) => s + m.usos, 0),
  }
}
