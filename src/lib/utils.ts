import type { Candidatura } from './schema'
import { STATUS_ROTULO } from './schema'
import { areas } from './programa'

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

export function nomeDaArea(slug: string): string {
  return areas.find((a) => a.slug === slug)?.nome ?? slug
}

export function dataCurta(iso: string): string {
  try {
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(iso))
  } catch {
    return iso.slice(0, 10)
  }
}

export function dataLonga(iso: string): string {
  try {
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' }).format(
      new Date(iso),
    )
  } catch {
    return iso
  }
}

export function normalizarUrl(valor: string): string {
  const v = valor.trim()
  if (!v) return ''
  return /^https?:\/\//i.test(v) ? v : `https://${v}`
}

/** Exportação para a planilha de candidatos (Google Sheets / Excel). */
export function paraCsv(lista: Candidatura[]): string {
  const colunas: Array<[string, (c: Candidatura) => string]> = [
    ['Data', (c) => dataCurta(c.criadoEm)],
    ['Status', (c) => STATUS_ROTULO[c.status] ?? c.status],
    ['Score', (c) => String(c.score)],
    ['Nome', (c) => c.nome],
    ['E-mail', (c) => c.email],
    ['WhatsApp', (c) => c.telefone],
    ['Canal', (c) => c.canalNome],
    ['Link', (c) => c.canalUrl],
    ['Plataforma', (c) => c.plataformaPrincipal],
    ['Área', (c) => nomeDaArea(c.area)],
    ['Audiência', (c) => c.audiencia],
    ['Formas de divulgação', (c) => c.formasDivulgacao.join(' | ')],
    ['Afiliado Hotmart', (c) => (c.jaEhAfiliadoHotmart ? 'Sim' : 'Não')],
    ['Experiência', (c) => c.experiencia ?? ''],
    ['Motivação', (c) => c.motivacao],
    ['Como conheceu', (c) => c.comoConheceu ?? ''],
    ['Origem', (c) => c.origem],
    ['Responsável', (c) => c.responsavel],
    ['Notas', (c) => c.notas],
  ]

  const escapar = (v: string) => `"${String(v ?? '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`
  const cabecalho = colunas.map(([titulo]) => escapar(titulo)).join(',')
  const linhas = lista.map((c) => colunas.map(([, ler]) => escapar(ler(c))).join(','))
  // BOM para o Excel abrir com acentuação correta.
  return '﻿' + [cabecalho, ...linhas].join('\r\n')
}
