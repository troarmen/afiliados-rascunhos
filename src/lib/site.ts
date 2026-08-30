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
  /** Assinatura do produtor do catálogo. Aparece no topo, no rodapé e no OG. */
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
  canal: {
    youtube: 'https://www.youtube.com/@rascunhoseconomicos',
    site: 'https://rascunhoseconomicos.com',
  },
} as const

export const navegacao = [
  { href: '/#como-funciona', rotulo: 'Como funciona' },
  { href: '/#quem-pode', rotulo: 'Para quem é' },
  { href: '/#comissao', rotulo: 'Comissão' },
  { href: '/#portal', rotulo: 'O que você recebe' },
  { href: '/perguntas-frequentes', rotulo: 'Dúvidas' },
] as const

export const rodape = {
  programa: [
    { href: '/programa', rotulo: 'Regras do programa' },
    { href: '/#como-funciona', rotulo: 'Como funciona' },
    { href: '/#comissao', rotulo: 'Comissão e pagamento' },
    { href: '/#portal', rotulo: 'Portal do afiliado' },
    { href: '/perguntas-frequentes', rotulo: 'Perguntas frequentes' },
  ],
  legal: [
    { href: '/termos', rotulo: 'Termos de participação' },
    { href: '/privacidade', rotulo: 'Política de privacidade' },
  ],
} as const

export function urlAbsoluta(caminho = '/') {
  return new URL(caminho, site.url).toString()
}

export function linkWhatsApp(mensagem = 'Olá! Vim pelo site do Duck Affiliate.') {
  if (!site.whatsapp) return null
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensagem)}`
}
