/**
 * Configuração institucional do site.
 * Tudo que muda por decisão comercial mora aqui ou em `programa.ts`,
 * nunca dentro de componentes.
 */

export const site = {
  nome: 'Projeto Afiliado',
  nomeCompleto: 'Projeto Afiliado Rascunhos Econômicos',
  sigla: 'PARE',
  produtor: 'Rascunhos Econômicos',
  rede: 'Green Eyes',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://afiliados.rascunhoseconomicos.com',
  descricao:
    'Programa de parceria entre o Rascunhos Econômicos e criadores de conteúdo educacional. ' +
    'Você indica cursos que já vendem, com material pronto e comissão recorrente por venda.',
  email: 'parceiros@rascunhoseconomicos.com',
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
  { href: '/#quem-pode', rotulo: 'Quem pode participar' },
  { href: '/#comissao', rotulo: 'Comissão' },
  { href: '/#selecao', rotulo: 'Seleção' },
  { href: '/perguntas-frequentes', rotulo: 'Dúvidas' },
] as const

export const rodape = {
  institucional: [
    { href: '/programa', rotulo: 'Sobre o programa' },
    { href: '/perguntas-frequentes', rotulo: 'Perguntas frequentes' },
    { href: '/#contato', rotulo: 'Contato' },
  ],
  legal: [
    { href: '/termos', rotulo: 'Termos de participação' },
    { href: '/privacidade', rotulo: 'Política de privacidade' },
  ],
} as const

export function urlAbsoluta(caminho = '/') {
  return new URL(caminho, site.url).toString()
}

export function linkWhatsApp(mensagem = 'Olá! Vim pelo site do Projeto Afiliado.') {
  if (!site.whatsapp) return null
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensagem)}`
}
