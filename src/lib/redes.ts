/**
 * Normalização dos campos de rede social da candidatura.
 *
 * O candidato escreve como quiser: "@fulano", "fulano" ou o link do perfil.
 * Regra combinada com o cliente: só o usuário sem "@" ganha o "@". Quem já
 * escreveu o "@" ou colou um link fica exatamente como veio — prefixar um
 * link produziria "@https://…", e o link é justamente o que a equipe abre
 * para assistir ao trabalho do candidato.
 */

/**
 * Domínios de topo que aparecem nos links que os candidatos colam. Existe
 * para separar "instagram.com" (link) de "maria.silva" (usuário com ponto
 * no nome), que uma expressão de domínio sozinha confundiria.
 */
const DOMINIOS_DE_TOPO = new Set([
  'com', 'br', 'net', 'org', 'io', 'me', 'tv', 'co', 'app', 'gg', 'bio',
  'link', 'to', 'be', 'info', 'online', 'site', 'store', 'xyz', 'dev',
  'club', 'live', 'news', 'blog', 'shop', 'art', 'tech', 'pro',
])

/** Um usuário: letras, números, ponto, hífen e sublinhado, com ou sem "@". */
const USUARIO = /^@?[A-Za-z0-9._-]{2,}$/

function pareceLink(valor: string): boolean {
  if (/^https?:\/\//i.test(valor)) return true
  if (valor.includes('/')) return true
  const partes = valor.toLowerCase().split('.')
  return partes.length > 1 && DOMINIOS_DE_TOPO.has(partes[partes.length - 1])
}

/** O que o campo aceita: link, @usuário ou só o usuário. */
export function aceitaComoRede(valor: string): boolean {
  const v = valor.trim()
  if (!v) return true
  if (USUARIO.test(v)) return true
  return /^https?:\/\/\S+$/i.test(v) || /^[\w.-]+\.[a-z]{2,}(\/\S*)?$/i.test(v)
}

/** Garante o "@" no que for usuário; não mexe em link nenhum. */
export function normalizarRede(valor: string): string {
  const v = valor.trim()
  if (!v) return ''
  if (pareceLink(v)) return v
  if (v.startsWith('@')) return `@${v.replace(/^@+/, '')}`
  return USUARIO.test(v) ? `@${v}` : v
}
