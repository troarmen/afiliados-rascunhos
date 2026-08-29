import 'server-only'
import { cookies } from 'next/headers'
import crypto from 'node:crypto'

/**
 * Autenticação do painel administrativo.
 *
 * Uma senha compartilhada + cookie de sessão assinado com HMAC-SHA256.
 * É o suficiente para uma equipe de 1 a 3 pessoas fazendo triagem manual.
 * Quando o time crescer, trocar por Supabase Auth (ver docs/05-roadmap.md).
 */

const COOKIE = 'pare_sessao'
const DURACAO_HORAS = 12

function segredo(): string {
  const s = process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD
  if (!s) throw new Error('Defina AUTH_SECRET (ou ao menos ADMIN_PASSWORD) no ambiente.')
  return s
}

function assinar(payload: string): string {
  return crypto.createHmac('sha256', segredo()).update(payload).digest('hex')
}

function comparacaoSegura(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

export function senhaConfere(tentativa: string): boolean {
  const esperada = process.env.ADMIN_PASSWORD
  if (!esperada) return false
  // Hash antes de comparar: iguala o tamanho e evita vazar por tempo.
  const h = (v: string) => crypto.createHash('sha256').update(v).digest('hex')
  return comparacaoSegura(h(tentativa), h(esperada))
}

export function criarToken(): string {
  const expiraEm = Date.now() + DURACAO_HORAS * 60 * 60 * 1000
  const payload = String(expiraEm)
  return `${payload}.${assinar(payload)}`
}

export function tokenValido(token: string | undefined): boolean {
  if (!token) return false
  const [payload, assinatura] = token.split('.')
  if (!payload || !assinatura) return false
  if (!comparacaoSegura(assinar(payload), assinatura)) return false
  return Number(payload) > Date.now()
}

export const cookieSessao = {
  nome: COOKIE,
  opcoes: {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: DURACAO_HORAS * 60 * 60,
  },
}

/** Uso em Server Components e Route Handlers. */
export async function estaAutenticado(): Promise<boolean> {
  const jar = await cookies()
  return tokenValido(jar.get(COOKIE)?.value)
}
