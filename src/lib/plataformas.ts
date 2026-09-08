/**
 * Plataformas de venda em que um programa pode estar.
 *
 * O Duck Affiliate não processa venda nenhuma: quem rastreia, cobra e paga
 * é a plataforma do produtor. O que o parceiro nos dá é o link que ela
 * gerou para ele — e é a partir desse link que o material vira "dele":
 * QR code, texto com o link já inserido, etiqueta de origem por material.
 *
 * Sem `server-only`: a área do parceiro usa os textos e a validação no
 * navegador, antes de mandar ao servidor (que valida de novo).
 */

export type PlataformaSlug = 'hotmart' | 'eduzz' | 'kiwify' | 'outra'

export type Plataforma = {
  slug: PlataformaSlug
  nome: string
  /** Como a plataforma chama o link do afiliado. */
  nomeDoLink: string
  /** Domínios aceitos para o link (o próprio e subdomínios). Vazio = qualquer https. */
  dominios: string[]
  exemplo: string
  /**
   * Parâmetro de query que a plataforma devolve no relatório de vendas como
   * origem. Na Hotmart é `src`: o afiliado vê, venda a venda, de qual
   * material ela veio. Nulo = a plataforma não tem (ou não confirmamos).
   */
  parametroOrigem: string | null
  /** Passos para o parceiro conseguir o link. Ordem importa. */
  passos: { titulo: string; descricao: string }[]
  /** Onde criar a conta. */
  urlConta: string
}

export const PLATAFORMAS: Record<PlataformaSlug, Plataforma> = {
  hotmart: {
    slug: 'hotmart',
    nome: 'Hotmart',
    nomeDoLink: 'Hotlink',
    dominios: ['hotmart.com', 'hotm.art'],
    exemplo: 'https://go.hotmart.com/A12345678B',
    parametroOrigem: 'src',
    urlConta: 'https://hotmart.com',
    passos: [
      {
        titulo: 'Crie (ou acesse) sua conta na Hotmart',
        descricao: 'É gratuita e leva poucos minutos. É por ela que a comissão é paga.',
      },
      {
        titulo: 'Solicite afiliação ao produto',
        descricao:
          'Na Hotmart, abra a página do produto e clique em “Afiliar-se”. O produtor aprova o pedido.',
      },
      {
        titulo: 'Copie o seu Hotlink e cole aqui',
        descricao:
          'Aprovado, a Hotmart gera um link só seu (começa com go.hotmart.com). É ele que atribui as vendas a você.',
      },
    ],
  },
  eduzz: {
    slug: 'eduzz',
    nome: 'Eduzz',
    nomeDoLink: 'link de afiliado',
    dominios: ['eduzz.com'],
    exemplo: 'https://sun.eduzz.com/123456',
    parametroOrigem: null,
    urlConta: 'https://www.eduzz.com',
    passos: [
      { titulo: 'Crie (ou acesse) sua conta na Eduzz', descricao: 'É gratuita. É por ela que a comissão é paga.' },
      { titulo: 'Solicite afiliação ao produto', descricao: 'Na Eduzz, encontre o produto e peça a afiliação. O produtor aprova.' },
      { titulo: 'Copie o seu link de afiliado e cole aqui', descricao: 'É o link que atribui as vendas a você.' },
    ],
  },
  kiwify: {
    slug: 'kiwify',
    nome: 'Kiwify',
    nomeDoLink: 'link de afiliado',
    dominios: ['kiwify.com.br', 'kiwify.app'],
    exemplo: 'https://pay.kiwify.com.br/abc123?afid=XXXXXX',
    parametroOrigem: null,
    urlConta: 'https://kiwify.com.br',
    passos: [
      { titulo: 'Crie (ou acesse) sua conta na Kiwify', descricao: 'É gratuita. É por ela que a comissão é paga.' },
      { titulo: 'Solicite afiliação ao produto', descricao: 'Na Kiwify, encontre o produto e peça a afiliação. O produtor aprova.' },
      { titulo: 'Copie o seu link de afiliado e cole aqui', descricao: 'É o link que atribui as vendas a você.' },
    ],
  },
  outra: {
    slug: 'outra',
    nome: 'a plataforma do produtor',
    nomeDoLink: 'link de afiliado',
    dominios: [],
    exemplo: 'https://…',
    parametroOrigem: null,
    urlConta: '',
    passos: [
      { titulo: 'Peça a afiliação ao produtor', descricao: 'A equipe do programa indica onde criar a conta e solicitar a afiliação.' },
      { titulo: 'Copie o seu link de afiliado e cole aqui', descricao: 'É o link que atribui as vendas a você.' },
    ],
  },
}

export function plataforma(slug: string | null | undefined): Plataforma {
  return PLATAFORMAS[(slug ?? 'hotmart') as PlataformaSlug] ?? PLATAFORMAS.outra
}

/**
 * Valida o link de vendas: https, endereço bem formado e no domínio da
 * plataforma. Devolve o link normalizado (sem espaços, sem fragmento) —
 * é o que se grava.
 */
export function validarLinkDeVendas(
  bruto: string,
  slug: PlataformaSlug,
): { ok: true; url: string } | { ok: false; mensagem: string } {
  const p = plataforma(slug)
  const valor = bruto.trim()
  if (!valor) return { ok: false, mensagem: `Cole o seu ${p.nomeDoLink}.` }
  let url: URL
  try {
    url = new URL(valor)
  } catch {
    return { ok: false, mensagem: `Isso não parece um link. Ex.: ${p.exemplo}` }
  }
  if (url.protocol !== 'https:') return { ok: false, mensagem: 'O link precisa começar com https://.' }
  const host = url.hostname.toLowerCase()
  if (p.dominios.length > 0 && !p.dominios.some((d) => host === d || host.endsWith(`.${d}`))) {
    return {
      ok: false,
      mensagem: `Esse não é um link da ${p.nome}. O ${p.nomeDoLink} tem o formato ${p.exemplo}`,
    }
  }
  url.hash = ''
  return { ok: true, url: url.toString() }
}

/**
 * O link com a etiqueta de origem — quando a plataforma tem esse recurso.
 * Não sobrescreve uma origem que o parceiro já colocou no próprio link.
 */
export function linkComOrigem(url: string, slug: PlataformaSlug, origem: string): string {
  const p = plataforma(slug)
  if (!p.parametroOrigem) return url
  try {
    const u = new URL(url)
    if (!u.searchParams.has(p.parametroOrigem)) u.searchParams.set(p.parametroOrigem, origem)
    return u.toString()
  } catch {
    return url
  }
}

/** Origem padrão do QR do programa. */
export const ORIGEM_QR = 'duck-qr'

/** Etiqueta de origem de um material: legível no relatório e única o bastante. */
export function origemDoMaterial(m: { tipo: string; id: string }): string {
  return `duck-${m.tipo}-${m.id.replace(/-/g, '').slice(0, 6)}`
}

export const ORIGEM_VALIDA = /^[a-z0-9][a-z0-9-]{0,39}$/
