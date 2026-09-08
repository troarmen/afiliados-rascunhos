/**
 * Domínio da biblioteca de materiais de divulgação.
 *
 * Um PROGRAMA é um canal/produtor com catálogo próprio (hoje só um: o
 * Rascunhos Econômicos). Cada programa tem CAMPANHAS (lançamento, Black
 * Friday…) e MATERIAIS. Um material é uma de três coisas:
 *
 *   arquivo — banner, vídeo, PDF, logo… guardado no storage
 *   texto   — copy, e-mail pronto, cupom: conteúdo que se copia
 *   link    — landing page, link de divulgação: URL que se abre
 *
 * Este módulo é só tipos e catálogos: sem `server-only`, porque a área do
 * parceiro filtra no navegador e precisa dos mesmos rótulos.
 */

import { linkComOrigem, origemDoMaterial, type PlataformaSlug } from './plataformas'

export type OrigemMaterial = 'arquivo' | 'texto' | 'link'

/**
 * Tipos na ordem em que aparecem nos filtros. Cada um traz a origem que
 * faz sentido por padrão — o formulário do admin pré-seleciona a partir
 * daqui, mas não trava (uma "copy" pode vir como PDF, por exemplo).
 */
export const TIPOS = [
  { slug: 'imagem', rotulo: 'Imagens', singular: 'Imagem', origem: 'arquivo', cor: '#4e86f7' },
  { slug: 'video', rotulo: 'Vídeos', singular: 'Vídeo', origem: 'arquivo', cor: '#c2261e' },
  { slug: 'banner', rotulo: 'Banners', singular: 'Banner', origem: 'arquivo', cor: '#1b4cb8' },
  { slug: 'social', rotulo: 'Social Media', singular: 'Social', origem: 'arquivo', cor: '#8a2be2' },
  { slug: 'email', rotulo: 'E-mail', singular: 'E-mail pronto', origem: 'texto', cor: '#1f7a4d' },
  { slug: 'copy', rotulo: 'Copy', singular: 'Copy', origem: 'texto', cor: '#8a5a00' },
  { slug: 'cupom', rotulo: 'Cupons', singular: 'Cupom', origem: 'texto', cor: '#ffc20e' },
  { slug: 'logo', rotulo: 'Logos', singular: 'Logo', origem: 'arquivo', cor: '#000e29' },
  { slug: 'pdf', rotulo: 'PDFs', singular: 'PDF', origem: 'arquivo', cor: '#b03a2e' },
  { slug: 'link', rotulo: 'Links', singular: 'Link', origem: 'link', cor: '#0e7c86' },
  { slug: 'outro', rotulo: 'Outros', singular: 'Outro', origem: 'arquivo', cor: '#6b7690' },
] as const

export type TipoMaterial = (typeof TIPOS)[number]['slug']
export const SLUGS_TIPO = TIPOS.map((t) => t.slug) as [TipoMaterial, ...TipoMaterial[]]

export function tipo(slug: string) {
  return TIPOS.find((t) => t.slug === slug) ?? TIPOS[TIPOS.length - 1]
}

/** Sugestões de formato no formulário. Campo livre — a lista só acelera. */
export const FORMATOS_SUGERIDOS = [
  'Feed 1080×1080',
  'Story 1080×1920',
  'Reels 9:16',
  'Thumbnail 1280×720',
  'YouTube 1920×1080',
  'Banner 1200×628',
  'Capa 2560×1440',
  'A4',
  'Quadrado',
  'Horizontal',
  'Vertical',
] as const

export const ORDENACOES = [
  { slug: 'recentes', rotulo: 'Mais recentes' },
  { slug: 'usados', rotulo: 'Mais utilizados' },
  { slug: 'recomendados', rotulo: 'Recomendados' },
  { slug: 'titulo', rotulo: 'A–Z' },
] as const

export type Ordenacao = (typeof ORDENACOES)[number]['slug']

export type Programa = {
  id: string
  slug: string
  nome: string
  produtor: string
  descricao: string
  /** Onde o produtor vende. Decide a validação do link do parceiro e as instruções. */
  plataforma: PlataformaSlug
  /** Página em que o parceiro pede a afiliação ao produto (ex.: a do produto na Hotmart). */
  urlAfiliacao: string | null
  ativo: boolean
  criadoEm: string
}

/**
 * O vínculo parceiro × programa: o link de vendas que a plataforma gerou
 * para ele. Sem isso o material é genérico; com isso ele vira do parceiro
 * (QR, texto com o link, etiqueta de origem por material).
 */
export type Afiliacao = {
  id: string
  candidaturaId: string
  programaId: string
  url: string
  criadoEm: string
  atualizadoEm: string
}

export type Campanha = {
  id: string
  programaId: string
  nome: string
  descricao: string
  inicio: string | null
  fim: string | null
  ativa: boolean
  criadoEm: string
}

export type Material = {
  id: string
  programaId: string
  campanhaId: string | null
  tipo: TipoMaterial
  origem: OrigemMaterial
  titulo: string
  descricao: string
  /** Ex.: "Story 1080×1920". Livre; para imagem, preenchido a partir das dimensões. */
  formato: string
  tags: string[]
  recomendado: boolean
  arquivado: boolean
  /** Quantas vezes foi baixado/copiado/aberto. Alimenta "mais utilizados". */
  usos: number
  // --- origem = arquivo
  caminho: string | null
  nomeArquivo: string | null
  mime: string | null
  tamanho: number | null
  largura: number | null
  altura: number | null
  // --- origem = texto
  conteudo: string | null
  // --- origem = link
  url: string | null
  criadoEm: string
  atualizadoEm: string
}

export type AcaoUso = 'baixar' | 'copiar' | 'abrir'

// --- Ajudantes de apresentação (usados no admin e na área do parceiro) ------

export function ehImagem(m: Pick<Material, 'mime'>): boolean {
  return Boolean(m.mime && m.mime.startsWith('image/'))
}

export function ehVideo(m: Pick<Material, 'mime'>): boolean {
  return Boolean(m.mime && m.mime.startsWith('video/'))
}

export function tamanhoLegivel(bytes: number | null): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** "1080×1920" a partir das dimensões — vira o formato quando o admin não escreve um. */
export function formatoDasDimensoes(largura: number | null, altura: number | null): string {
  if (!largura || !altura) return ''
  return `${largura}×${altura}`
}

/** Extensão em maiúsculas para a etiqueta do cartão: "PNG", "MP4", "PDF". */
export function extensao(m: Pick<Material, 'nomeArquivo' | 'mime' | 'origem'>): string {
  if (m.origem === 'texto') return 'TXT'
  if (m.origem === 'link') return 'URL'
  const doNome = m.nomeArquivo?.split('.').pop()
  if (doNome && doNome.length <= 5) return doNome.toUpperCase()
  return (m.mime?.split('/')[1] ?? '').toUpperCase()
}

/** Rótulo curto da ação principal de cada origem. */
export function acaoPrincipal(m: Pick<Material, 'origem'>): { rotulo: string; acao: AcaoUso } {
  if (m.origem === 'texto') return { rotulo: 'Copiar', acao: 'copiar' }
  if (m.origem === 'link') return { rotulo: 'Abrir', acao: 'abrir' }
  return { rotulo: 'Baixar', acao: 'baixar' }
}

/**
 * Filtro e ordenação da biblioteca. Puro, roda no navegador: com algumas
 * centenas de materiais por programa não compensa ida ao servidor a cada
 * tecla.
 */
export type FiltroBiblioteca = {
  busca?: string
  tipo?: TipoMaterial | 'todos'
  campanhaId?: string | 'todas'
  formato?: string | 'todos'
  ordem?: Ordenacao
}

export function filtrarMateriais(lista: Material[], f: FiltroBiblioteca): Material[] {
  let r = lista.filter((m) => !m.arquivado)
  if (f.tipo && f.tipo !== 'todos') r = r.filter((m) => m.tipo === f.tipo)
  if (f.campanhaId && f.campanhaId !== 'todas') r = r.filter((m) => m.campanhaId === f.campanhaId)
  if (f.formato && f.formato !== 'todos') r = r.filter((m) => m.formato === f.formato)

  const termo = f.busca?.trim().toLowerCase()
  if (termo) {
    r = r.filter((m) =>
      [m.titulo, m.descricao, m.formato, m.tags.join(' '), m.nomeArquivo ?? '']
        .join(' ')
        .toLowerCase()
        .includes(termo),
    )
  }

  const ordem = f.ordem ?? 'recentes'
  const porData = (a: Material, b: Material) => b.criadoEm.localeCompare(a.criadoEm)
  if (ordem === 'usados') r.sort((a, b) => b.usos - a.usos || porData(a, b))
  else if (ordem === 'recomendados')
    r.sort((a, b) => Number(b.recomendado) - Number(a.recomendado) || porData(a, b))
  else if (ordem === 'titulo') r.sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR'))
  else r.sort(porData)

  return r
}

/** Formatos distintos presentes na lista — vira o filtro "Formato". */
export function formatosPresentes(lista: Material[]): string[] {
  return [...new Set(lista.map((m) => m.formato).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, 'pt-BR'),
  )
}

// --- Material individualizado ----------------------------------------------

/** O marcador que o admin escreve no texto onde o link do parceiro entra. */
export const MARCADOR_LINK = '{{link}}'
const MARCADOR = /\{\{\s*link\s*\}\}/gi

export function temMarcadorLink(texto: string | null | undefined): boolean {
  return Boolean(texto && new RegExp(MARCADOR.source, 'i').test(texto))
}

/**
 * Devolve o material com o link do parceiro no lugar do marcador. Cada
 * material recebe a própria etiqueta de origem, para o parceiro ver no
 * relatório da plataforma qual texto gerou a venda. Sem link, o marcador
 * fica — e a interface avisa que falta cadastrar.
 */
export function personalizarMaterial(m: Material, link: string | null, plataforma: PlataformaSlug): Material {
  if (!link || m.origem !== 'texto' || !m.conteudo || !temMarcadorLink(m.conteudo)) return m
  const proprio = linkComOrigem(link, plataforma, origemDoMaterial(m))
  return { ...m, conteudo: m.conteudo.replace(MARCADOR, proprio) }
}

export function personalizarMateriais(lista: Material[], link: string | null, plataforma: PlataformaSlug): Material[] {
  return link ? lista.map((m) => personalizarMaterial(m, link, plataforma)) : lista
}

/** Verdadeiro quando o texto ainda tem o marcador: o parceiro precisa cadastrar o link. */
export function precisaDoLink(m: Pick<Material, 'origem' | 'conteudo'>): boolean {
  return m.origem === 'texto' && temMarcadorLink(m.conteudo)
}
