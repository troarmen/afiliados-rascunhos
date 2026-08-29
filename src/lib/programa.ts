/**
 * Conteúdo comercial do programa.
 *
 * ATENÇÃO — os números abaixo são a proposta inicial e precisam de
 * confirmação do cliente antes de publicar (ver README, seção
 * "Números a confirmar"). Estão isolados aqui exatamente para que
 * mudá-los seja um commit de uma linha, sem tocar em componente algum.
 */

export const comissao = {
  /** Percentual pago ao parceiro na entrada do programa. */
  base: 40,
  /** Teto negociado para parceiros com histórico de resultado. */
  teto: 60,
  /** Dias de cookie na Hotmart (padrão da plataforma: 30, último clique). */
  cookieDias: 30,
  /** Prazo de liberação do saque na Hotmart após a compra. */
  prazoPagamento: 'D+30 da confirmação da compra',
  atribuicao: 'último clique',
  /** Ticket usado apenas na simulação da landing page. Confirmar com o cliente. */
  precoReferencia: 497,
} as const

export type Etapa = {
  numero: number
  titulo: string
  descricao: string
  prazo: string
}

export const etapas: Etapa[] = [
  {
    numero: 1,
    titulo: 'Você se inscreve',
    descricao:
      'Um formulário de cinco minutos com seu canal, sua área e como você pretende divulgar. Não pedimos nada além do que precisamos para avaliar.',
    prazo: '5 minutos',
  },
  {
    numero: 2,
    titulo: 'Analisamos sua candidatura',
    descricao:
      'Olhamos o conteúdo, o encaixe com os cursos e o tipo de audiência. Análise humana, feita por quem toca o projeto — não é um filtro automático.',
    prazo: 'até 7 dias úteis',
  },
  {
    numero: 3,
    titulo: 'Conversamos',
    descricao:
      'Uma conversa por e-mail, WhatsApp ou Google Meet para alinhar expectativa, formato de divulgação e condições da parceria.',
    prazo: '30 minutos',
  },
  {
    numero: 4,
    titulo: 'Você entra como afiliado',
    descricao:
      'Aprovada a parceria, você cria (ou usa) sua conta Hotmart e é liberado nos produtos. Toda a venda, o rastreio e o pagamento correm por lá.',
    prazo: 'mesmo dia',
  },
  {
    numero: 5,
    titulo: 'Recebe acesso à comunidade',
    descricao:
      'Artes, thumbnails, vídeos, textos prontos, cupons, calendário de campanhas e as atualizações dos produtos — tudo em um lugar só.',
    prazo: 'imediato',
  },
  {
    numero: 6,
    titulo: 'Começa a divulgar',
    descricao:
      'No seu ritmo e no seu formato. A gente acompanha os resultados junto e ajusta material, oferta e campanha com você.',
    prazo: 'contínuo',
  },
]

export type Beneficio = {
  titulo: string
  descricao: string
  icone: 'material' | 'comissao' | 'comunidade' | 'campanha' | 'suporte' | 'cupom'
}

export const beneficios: Beneficio[] = [
  {
    icone: 'comissao',
    titulo: 'Comissão por venda, sem teto',
    descricao: `A partir de ${comissao.base}% por venda aprovada, com condição negociada até ${comissao.teto}% para parceiros com histórico. Pagamento pela Hotmart, ${comissao.prazoPagamento}.`,
  },
  {
    icone: 'material',
    titulo: 'Material pronto para publicar',
    descricao:
      'Artes, thumbnails, cortes de vídeo, roteiros, textos para descrição e stories. Você não precisa parar sua produção para criar peça de divulgação.',
  },
  {
    icone: 'cupom',
    titulo: 'Cupom exclusivo com seu nome',
    descricao:
      'Desconto real para a sua audiência e rastreio independente do link. Quem compra sente que ganhou algo por te seguir.',
  },
  {
    icone: 'campanha',
    titulo: 'Calendário de campanhas',
    descricao:
      'Você sabe com antecedência quando tem lançamento, promoção e data sazonal — dá para encaixar a divulgação no seu planejamento de conteúdo.',
  },
  {
    icone: 'comunidade',
    titulo: 'Comunidade de parceiros',
    descricao:
      'Um grupo fechado de criadores educacionais trocando o que funciona: formato, abordagem, números. Contato direto com quem produz os cursos.',
  },
  {
    icone: 'suporte',
    titulo: 'Acompanhamento de verdade',
    descricao:
      'Você não recebe um link e some. A gente revisa resultado com você e ajusta oferta, material e formato para o seu público específico.',
  },
]

export type Perfil = { titulo: string; descricao: string }

export const perfis: Perfil[] = [
  {
    titulo: 'Canais de conteúdo educacional',
    descricao:
      'YouTube, TikTok, Instagram ou podcast tratando economia, história, filosofia, matemática, sociologia, direito, geopolítica e áreas vizinhas.',
  },
  {
    titulo: 'Professores e pesquisadores',
    descricao:
      'Quem já tem autoridade no assunto e uma audiência que confia na indicação — mesmo que ainda não venda nada.',
  },
  {
    titulo: 'Newsletters e comunidades',
    descricao:
      'Listas de e-mail, servidores do Discord, grupos de estudo e canais do Telegram com público engajado em aprender.',
  },
  {
    titulo: 'Criadores sem produto próprio',
    descricao:
      'Você construiu audiência qualificada mas não quer (ou não tem tempo de) criar e dar suporte a um curso. Monetize com o nosso.',
  },
]

export const naoServe = [
  'Perfis de conteúdo raso ou audiência comprada — a análise olha engajamento real, não número de seguidores.',
  'Divulgação por spam, disparo em massa ou tráfego incentivado.',
  'Conteúdo que conflite com o posicionamento editorial do Rascunhos Econômicos.',
]

export const criteriosSelecao = [
  {
    titulo: 'Qualidade da audiência',
    descricao: 'Engajamento real e público interessado em aprofundamento, não em viralização.',
  },
  {
    titulo: 'Alinhamento editorial',
    descricao: 'Seu conteúdo e o nosso precisam conversar. Seriedade acima de tamanho.',
  },
  {
    titulo: 'Potencial comercial',
    descricao: 'Formato e frequência de publicação que comportem uma divulgação natural.',
  },
  {
    titulo: 'Histórico',
    descricao: 'Experiência anterior com afiliação ajuda, mas não é pré-requisito.',
  },
]

/** Áreas usadas no formulário e nas páginas programáticas de SEO. */
export const areas = [
  { slug: 'economia', nome: 'Economia', plural: 'economia' },
  { slug: 'historia', nome: 'História', plural: 'história' },
  { slug: 'filosofia', nome: 'Filosofia', plural: 'filosofia' },
  { slug: 'matematica', nome: 'Matemática', plural: 'matemática' },
  { slug: 'sociologia', nome: 'Sociologia', plural: 'sociologia' },
  { slug: 'direito', nome: 'Direito', plural: 'direito' },
  { slug: 'geopolitica', nome: 'Geopolítica', plural: 'geopolítica' },
  { slug: 'financas', nome: 'Finanças pessoais', plural: 'finanças pessoais' },
  { slug: 'ciencias', nome: 'Ciências (física, química, biologia)', plural: 'ciências' },
  { slug: 'concursos', nome: 'Concursos e vestibulares', plural: 'concursos e vestibulares' },
  { slug: 'outra', nome: 'Outra área', plural: 'conteúdo educacional' },
] as const

export type AreaSlug = (typeof areas)[number]['slug']

/** Áreas com página própria de SEO (exclui "outra"). */
export const areasComPagina = areas.filter((a) => a.slug !== 'outra')

export const faixasAudiencia = [
  'Até 1.000',
  'De 1.000 a 10.000',
  'De 10.000 a 50.000',
  'De 50.000 a 200.000',
  'De 200.000 a 1 milhão',
  'Mais de 1 milhão',
] as const

export const plataformas = [
  'YouTube',
  'Instagram',
  'TikTok',
  'Podcast',
  'Newsletter',
  'X / Twitter',
  'Discord',
  'Telegram',
  'Blog / site',
  'Sala de aula',
] as const

export const formasDivulgacao = [
  'Menção dentro dos vídeos',
  'Vídeo dedicado / review',
  'Descrição e comentário fixado',
  'Stories e posts',
  'Newsletter',
  'Comunidade fechada (Discord, Telegram, WhatsApp)',
  'Aula / mentoria',
  'Ainda estou definindo',
] as const

export type Pergunta = { pergunta: string; resposta: string }

export const faq: Pergunta[] = [
  {
    pergunta: 'Preciso ter um canal grande para participar?',
    resposta:
      'Não. Avaliamos a qualidade da audiência antes do tamanho. Um canal de 3 mil inscritos que discute economia a sério converte mais do que um perfil de 300 mil sem foco. Canais pequenos e médios são exatamente o público deste programa.',
  },
  {
    pergunta: 'Quanto eu recebo por venda?',
    resposta: `A comissão parte de ${comissao.base}% por venda aprovada e pode chegar a ${comissao.teto}% em condições negociadas para parceiros com histórico de resultado. Todo o cálculo e o repasse são feitos pela Hotmart, ${comissao.prazoPagamento}.`,
  },
  {
    pergunta: 'Como o pagamento é feito?',
    resposta:
      'Pela Hotmart, que é quem processa a venda, identifica a origem e paga a comissão direto na sua conta. Você não depende de repasse manual nosso e consegue auditar cada venda no painel da plataforma.',
  },
  {
    pergunta: 'Preciso já ter conta na Hotmart?',
    resposta:
      'Não. Se ainda não tiver, você cria durante a aprovação — leva poucos minutos e é gratuito. Depois disso a gente libera você como afiliado dos produtos.',
  },
  {
    pergunta: 'Por quanto tempo vale a minha indicação?',
    resposta: `O rastreio segue a regra da Hotmart: ${comissao.cookieDias} dias de cookie, com atribuição por ${comissao.atribuicao}. Se a pessoa clicar no seu link hoje e comprar dentro desse prazo, a comissão é sua.`,
  },
  {
    pergunta: 'Preciso produzir a arte e o texto de divulgação?',
    resposta:
      'Não precisa. A biblioteca de materiais tem artes, thumbnails, cortes de vídeo, roteiros e textos prontos. Se preferir criar do seu jeito, melhor ainda — a gente só pede alinhamento prévio para não conflitar com campanha em andamento.',
  },
  {
    pergunta: 'Existe exclusividade ou meta obrigatória?',
    resposta:
      'Não. Você continua livre para divulgar outros produtos e não tem meta mínima de vendas. O que pedimos é honestidade com a sua audiência: só indique o que você realmente acha que vale.',
  },
  {
    pergunta: 'Quanto tempo leva a resposta?',
    resposta:
      'Analisamos as candidaturas em até 7 dias úteis. Todo mundo recebe retorno, aprovado ou não. Se o encaixe não for agora, seu cadastro fica no banco de parceiros para campanhas futuras.',
  },
  {
    pergunta: 'Tem algum custo para participar?',
    resposta:
      'Nenhum. O programa é gratuito e sempre será. Não vendemos curso de afiliado, não cobramos taxa de adesão e não pedimos investimento em tráfego pago.',
  },
  {
    pergunta: 'O programa é só para o Rascunhos Econômicos?',
    resposta:
      'Hoje sim — os cursos do Rascunhos Econômicos são o primeiro caso do modelo. A estrutura foi desenhada para receber outros produtores de conteúdo educacional, e os parceiros da primeira leva terão prioridade de acesso ao catálogo quando ele abrir.',
  },
]
