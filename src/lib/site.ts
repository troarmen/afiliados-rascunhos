/**
 * Configuração institucional do Duck Affiliate.
 *
 * O Duck Affiliate é marca própria: nome, identidade e domínio são dele.
 * O Rascunhos Econômicos aparece como produtor do primeiro catálogo —
 * a assinatura "Powered by" — e não como dono do site.
 *
 * Tudo que muda por decisão comercial mora aqui ou em `programa.ts`,
 * nunca dentro de componentes.
 */

export const site = {
  nome: 'Duck Affiliate',
  nomeCurto: 'Duck',
  tagline: 'Afiliados que transformam conteúdo em renda',
  /** Assinatura do produtor do catálogo. Aparece no rodapé e no OG — não no topo. */
  selo: 'Powered by Rascunhos Econômicos',
  produtor: 'Rascunhos Econômicos',
  rede: 'Green Eyes',
  /**
   * O domínio próprio ainda não foi comprado. Até lá nada de domínio aparece
   * em texto visível — só aqui, e sempre sobrescrito por NEXT_PUBLIC_SITE_URL.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://duckaffiliate.com.br',
  /**
   * Vira a meta description e a descrição do Open Graph. O Google corta por
   * volta de 155 caracteres: a versão anterior tinha 225 e perdia justamente
   * o fecho comercial. Mantida abaixo do corte, de propósito.
   */
  descricao:
    'Monetize seu canal educacional do YouTube indicando cursos que já vendem: ' +
    '40% a 60% de comissão por venda, kit de divulgação pronto e pagamento pela Hotmart.',
  email: 'contato@rascunhoseconomicos.com',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? '',
  hotmart: process.env.NEXT_PUBLIC_HOTMART_URL ?? 'https://hotmart.com',
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? '',
  /**
   * Comunidade de parceiros.
   *
   * O documento de visão a coloca no fluxo do aprovado ("entrada na
   * comunidade") e o site a promete em `etapas`, `beneficios` e no
   * comparativo. Sem URL configurada, nenhum convite aparece em lugar
   * nenhum — promessa sem entrega é pior que ausência, mas link morto
   * na semana da aprovação é pior ainda.
   */
  comunidade: {
    url: process.env.NEXT_PUBLIC_COMUNIDADE_URL ?? '',
    /** Telegram é a escolha do cliente (docs/03); trocar aqui muda o texto todo. */
    plataforma: process.env.NEXT_PUBLIC_COMUNIDADE_PLATAFORMA ?? 'Telegram',
  },
  canal: {
    youtube: 'https://www.youtube.com/@rascunhoseconomicos',
    site: 'https://rascunhoseconomicos.com',
  },
} as const

/**
 * Navegação principal. Cada item é uma página própria — a home deixou de
 * carregar tudo e virou a porta de entrada; o aprofundamento mora nas
 * landing pages, para que buscar uma informação não seja rolar a página.
 */
export const navegacao = [
  { href: '/como-funciona', rotulo: 'Como funciona' },
  { href: '/para-afiliados', rotulo: 'Para afiliados' },
  { href: '/comissao', rotulo: 'Comissão' },
  { href: '/para-produtores', rotulo: 'Para produtores' },
  { href: '/perguntas-frequentes', rotulo: 'Dúvidas' },
] as const

/** Só no menu móvel, abaixo dos itens principais. */
export const navegacaoSecundaria = [
  { href: '/programa', rotulo: 'Regras completas' },
  { href: '/contato', rotulo: 'Contato' },
] as const

export const rodape = {
  afiliados: [
    { href: '/como-funciona', rotulo: 'Como funciona' },
    { href: '/para-afiliados', rotulo: 'Quem pode participar' },
    { href: '/comissao', rotulo: 'Comissão e pagamento' },
    { href: '/programa', rotulo: 'Regras completas' },
    { href: '/perguntas-frequentes', rotulo: 'Perguntas frequentes' },
    { href: '/inscricao', rotulo: 'Candidatar meu canal' },
  ],
  produtores: [
    { href: '/para-produtores', rotulo: 'Encontrar afiliados' },
    { href: '/para-produtores#interesse', rotulo: 'Cadastrar interesse' },
    { href: '/contato', rotulo: 'Falar com a equipe' },
  ],
  acesso: [
    { href: '/parceiro/entrar', rotulo: 'Entrar na área do parceiro' },
    { href: '/inscricao', rotulo: 'Ainda não sou parceiro' },
  ],
  legal: [
    { href: '/termos', rotulo: 'Termos de participação' },
    { href: '/privacidade', rotulo: 'Política de privacidade' },
  ],
} as const

export function urlAbsoluta(caminho = '/') {
  return new URL(caminho, site.url).toString()
}

/** Convite da comunidade, ou `null` quando ainda não há comunidade. */
export function linkComunidade() {
  return site.comunidade.url || null
}

export function linkWhatsApp(mensagem = 'Olá! Vim pelo site do Duck Affiliate.') {
  if (!site.whatsapp) return null
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensagem)}`
}
