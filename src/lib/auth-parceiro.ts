import 'server-only'
import { cookies } from 'next/headers'
import crypto from 'node:crypto'
import type { Candidatura } from './schema'
import { obterCandidatura } from './store'
import { estaAutenticado } from './auth'

/**
 * Autenticação do parceiro (afiliado aprovado).
 *
 * Sem senha. O parceiro pede um link por e-mail; o link carrega um token
 * assinado que vale 20 minutos; ao abrir, vira um cookie de sessão de 30
 * dias. A cada página a sessão é reconferida contra a candidatura: se o
 * status deixar de ser "aprovado", o acesso cai na hora — sem precisar
 * revogar nada.
 *
 * O token não é de uso único: guardar tokens consumidos exigiria tabela e
 * o risco aqui é baixo (biblioteca de material, não dinheiro). Se um dia a
 * área do parceiro mostrar comissão, trocar por uso único.
 *
 * Mesma assinatura HMAC do admin (`auth.ts`), com prefixo diferente para
 * um token nunca servir no outro lugar.
 */

const COOKIE = 'duck_parceiro'
const SESSAO_DIAS = 30
const LINK_MINUTOS = 20

function segredo(): string {
  const s = process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD
  if (!s) throw new Error('Defina AUTH_SECRET no ambiente.')
  return s
}

function assinar(escopo: 'link' | 'sessao', payload: string): string {
  return crypto.createHmac('sha256', segredo()).update(`${escopo}:${payload}`).digest('hex')
}

function comparacaoSegura(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

function emitir(escopo: 'link' | 'sessao', candidaturaId: string, duracaoMs: number): string {
  const payload = `${candidaturaId}.${Date.now() + duracaoMs}`
  return `${payload}.${assinar(escopo, payload)}`
}

function verificar(escopo: 'link' | 'sessao', token: string | undefined): string | null {
  if (!token) return null
  const partes = token.split('.')
  if (partes.length !== 3) return null
  const [id, expira, assinatura] = partes
  if (!comparacaoSegura(assinar(escopo, `${id}.${expira}`), assinatura)) return null
  if (Number(expira) < Date.now()) return null
  return id
}

export function criarTokenDeLink(candidaturaId: string): string {
  return emitir('link', candidaturaId, LINK_MINUTOS * 60 * 1000)
}

export function candidaturaDoLink(token: string | undefined): string | null {
  return verificar('link', token)
}

export function criarSessao(candidaturaId: string): string {
  return emitir('sessao', candidaturaId, SESSAO_DIAS * 24 * 60 * 60 * 1000)
}

export const cookieParceiro = {
  nome: COOKIE,
  opcoes: {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSAO_DIAS * 24 * 60 * 60,
  },
}

/** Só parceiro APROVADO tem acesso. A regra mora aqui e em mais lugar nenhum. */
export function podeAcessar(c: Candidatura | null): c is Candidatura {
  return Boolean(c && c.status === 'aprovado')
}

/**
 * Uso em Server Components e Route Handlers. Devolve a candidatura do
 * parceiro logado, ou null — e null também quando a sessão é válida mas o
 * parceiro deixou de ser aprovado.
 */
export async function parceiroAutenticado(): Promise<Candidatura | null> {
  const jar = await cookies()
  const id = verificar('sessao', jar.get(COOKIE)?.value)
  if (!id) return null
  const c = await obterCandidatura(id)
  return podeAcessar(c) ? c : null
}

export type Visitante =
  | { tipo: 'parceiro'; nome: string; candidatura: Candidatura }
  | { tipo: 'equipe'; nome: string; candidatura: null }

/**
 * Quem está na área do parceiro: o próprio parceiro, ou a equipe vendo em
 * PRÉVIA (sessão do admin). A prévia existe para quem publica material
 * conferir o resultado sem precisar de uma conta de parceiro de mentira.
 * Ações de uso (baixar, copiar) continuam exigindo parceiro de verdade.
 */
export async function visitanteDaArea(): Promise<Visitante | null> {
  const parceiro = await parceiroAutenticado()
  if (parceiro) return { tipo: 'parceiro', nome: parceiro.nome, candidatura: parceiro }
  if (await estaAutenticado()) return { tipo: 'equipe', nome: 'Equipe', candidatura: null }
  return null
}
