/**
 * Conteúdo comercial do programa.
 *
 * ATENÇÃO — os números abaixo são a proposta inicial e precisam de
 * confirmação do cliente antes de publicar (ver README, seção
 * "Números a confirmar"). Estão isolados aqui exatamente para que
 * mudá-los seja um commit de uma linha, sem tocar em componente algum.
 *
 * REGRA DE CONTEÚDO: nada aqui pode ser inventado. Não existe depoimento,
 * número de parceiros, volume de vendas ou métrica de mercado nesta página
 * porque o programa ainda não tem histórico. O que dá para afirmar é a
 * REGRA do programa — comissão, rastreio, prazo, custo — e é só isso que
 * aparece como prova.
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
  /** Prazo de resposta a uma candidatura, em dias úteis. */
  prazoResposta: 7,
} as const

/** Números da faixa de prova. Todos são REGRA do programa, não histórico. */
export const numeros = [
  { valor: `${comissao.base}%–${comissao.teto}%`, rotulo: 'de comissão por venda aprovada' },
  { valor: `${comissao.cookieDias} dias`, rotulo: `de rastreio por ${comissao.atribuicao}` },
  { valor: 'R$ 0', rotulo: 'de custo para entrar e para ficar' },
  { valor: `${comissao.prazoResposta} dias úteis`, rotulo: 'é o prazo máximo de resposta' },
] as const

/**
 * Os três pilares da operação — o resumo de uma linha do modelo inteiro.
 * Estrutura emprestada das plataformas de afiliação: o criador precisa
 * entender em cinco segundos quem faz o quê.
 */
export const pilares = [
  {
    numero: 1,
    titulo: 'Você divulga',
    descricao:
      'No seu canal, no seu formato, no seu ritmo. Menção no meio do vídeo, review dedicado, ' +
      'link fixado na descrição ou card na comunidade. Você recebe o material pronto e escolhe ' +
      'como usar.',
    ator: 'Você',
  },
  {
    numero: 2,
    titulo: 'O link rastreia',
    descricao:
      `Cada clique carrega a sua identificação por ${comissao.cookieDias} dias. Quem assistiu ` +
      'hoje e comprou na semana seguinte continua sendo venda sua. O cupom com o seu nome ' +
      'rastreia até quem chega sem passar pelo link.',
    ator: 'O rastreio',
  },
  {
    numero: 3,
    titulo: 'A Hotmart paga',
    descricao:
      'A plataforma processa a venda, identifica a origem, calcula a comissão e deposita na ' +
      'sua conta. Não existe repasse manual nosso, planilha paralela nem “confia em mim”: ' +
      'você audita cada venda no painel dela.',
    ator: 'A plataforma',
  },
] as const

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
      'Um formulário de cinco minutos com o link do seu canal, sua área e como você pretende divulgar. Não pedimos nada além do que precisamos para avaliar.',
    prazo: '5 minutos',
  },
  {
    numero: 2,
    titulo: 'Analisamos sua candidatura',
    descricao:
      'Assistimos ao seu conteúdo, olhamos os comentários e medimos o encaixe com os cursos. Análise humana, feita por quem toca o projeto — não é filtro automático por número de inscritos.',
    prazo: `até ${comissao.prazoResposta} dias úteis`,
  },
  {
    numero: 3,
    titulo: 'Conversamos',
    descricao:
      'Uma conversa por e-mail, WhatsApp ou Google Meet para alinhar expectativa, formato de divulgação e a condição de comissão da sua parceria.',
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
    titulo: 'Recebe o kit e entra na comunidade',
    descricao:
      'Thumbnails, cortes de vídeo, roteiros de menção, textos de descrição, cupom com o seu nome e o calendário de campanhas — tudo em um lugar só.',
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
    titulo: 'Comissão por venda, sem teto de ganho',
    descricao: `A partir de ${comissao.base}% por venda aprovada, com condição negociada até ${comissao.teto}% para parceiros com histórico. Pagamento pela Hotmart, ${comissao.prazoPagamento}.`,
  },
  {
    icone: 'material',
    titulo: 'Kit de divulgação pronto para o YouTube',
    descricao:
      'Thumbnails, cortes editados, roteiro de menção de 40 segundos, texto de descrição e comentário fixado. Você não para a sua produção para criar peça de divulgação.',
  },
  {
    icone: 'cupom',
    titulo: 'Cupom exclusivo com o seu nome',
    descricao:
      'Desconto real para a sua audiência e rastreio independente do link. Quem compra sente que ganhou algo por te seguir — e a venda continua sendo sua.',
  },
  {
    icone: 'campanha',
    titulo: 'Calendário de campanhas com antecedência',
    descricao:
      'Você sabe antes quando tem lançamento, promoção e data sazonal. Dá para encaixar a divulgação no seu planejamento de pauta em vez de correr atrás.',
  },
  {
    icone: 'comunidade',
    titulo: 'Comunidade de criadores educacionais',
    descricao:
      'Um grupo fechado de gente que faz o mesmo que você, trocando o que funciona: formato, abordagem, números reais. Contato direto com quem produz os cursos.',
  },
  {
    icone: 'suporte',
    titulo: 'Acompanhamento de verdade',
    descricao:
      'Você não recebe um link e some. A gente revisa resultado com você e ajusta oferta, material e formato para o seu público específico.',
  },
]

/** O que existe dentro do portal do parceiro, depois da aprovação. */
export const portal = [
  {
    titulo: 'Biblioteca de criativos',
    itens: ['Thumbnails em alta', 'Cortes editados', 'Artes para stories', 'Identidade visual'],
  },
  {
    titulo: 'Textos prontos',
    itens: ['Roteiro de menção', 'Descrição do vídeo', 'Comentário fixado', 'Post de newsletter'],
  },
  {
    titulo: 'Oferta e campanha',
    itens: ['Cupom com o seu nome', 'Calendário de lançamentos', 'Cronograma de descontos', 'Avisos de mudança de oferta'],
  },
  {
    titulo: 'Acompanhamento',
    itens: ['Painel de vendas na Hotmart', 'Revisão de resultado', 'Canal direto com o produtor', 'Atualizações dos cursos'],
  },
] as const

/**
 * Comparativo de posicionamento. Cada linha é uma característica do NOSSO
 * programa — a coluna da direita descreve o padrão de mercado, não um
 * concorrente nomeado.
 */
export const comparativo = [
  {
    criterio: 'Aprovação',
    duck: 'Análise humana do seu conteúdo, com resposta escrita para todo mundo',
    comum: 'Aprovação automática por número de seguidores, ou silêncio',
  },
  {
    criterio: 'Material de divulgação',
    duck: 'Kit pronto para YouTube: thumbnail, corte, roteiro e descrição',
    comum: 'Um banner genérico e o link',
  },
  {
    criterio: 'Comissão',
    duck: `${comissao.base}% na entrada, negociável até ${comissao.teto}% por histórico`,
    comum: 'Percentual fixo, igual para todo mundo, sem conversa',
  },
  {
    criterio: 'Rastreio',
    duck: `Link com ${comissao.cookieDias} dias mais cupom nominal para quem chega direto`,
    comum: 'Só o link — quem digita o site perde a atribuição',
  },
  {
    criterio: 'Relacionamento',
    duck: 'Comunidade fechada, calendário de campanha e revisão de resultado',
    comum: 'Um e-mail de boas-vindas e mais nada',
  },
  {
    criterio: 'Exclusividade',
    duck: 'Nenhuma. Você segue livre para trabalhar com outros produtos',
    comum: 'Cláusula de exclusividade ou meta mínima de vendas',
  },
] as const

export type Perfil = { titulo: string; descricao: string }

export const perfis: Perfil[] = [
  {
    titulo: 'Canais de conteúdo educacional no YouTube',
    descricao:
      'Vídeo longo, aula, análise ou ensaio sobre economia, história, filosofia, matemática, sociologia, direito, geopolítica e áreas vizinhas. É o nosso público principal.',
  },
  {
    titulo: 'Quem faz Shorts e cortes com profundidade',
    descricao:
      'Canal de cortes, formato curto ou clipes de podcast — desde que o conteúdo ensine alguma coisa de verdade e a audiência volte por isso.',
  },
  {
    titulo: 'Professores e pesquisadores com canal',
    descricao:
      'Quem já tem autoridade no assunto e uma audiência que confia na indicação, mesmo que ainda não venda nada e nunca tenha sido afiliado.',
  },
  {
    titulo: 'Criador de vídeo sem produto próprio',
    descricao:
      'Você construiu audiência qualificada mas não quer (ou não tem tempo de) criar curso, gravar aula e responder aluno. Monetize com o nosso catálogo.',
  },
]

/** Fora do YouTube, mas ainda dentro do programa. */
export const alemDoYoutube =
  'O foco é YouTube, mas quem divulga em Instagram, TikTok, podcast, newsletter ou comunidade ' +
  'fechada também é bem-vindo — basta indicar no formulário qual é o seu canal principal.'

export const naoServe = [
  'Canais de conteúdo raso ou audiência comprada — a análise olha comentário e retenção, não número de inscritos.',
  'Divulgação por spam, disparo em massa, robô de comentário ou tráfego incentivado.',
  'Conteúdo que conflite com o posicionamento editorial dos cursos que você vai divulgar.',
]

export const criteriosSelecao = [
  {
    titulo: 'Qualidade da audiência',
    descricao:
      'Comentário de gente real, retenção decente e público interessado em aprofundamento — não em viralização.',
  },
  {
    titulo: 'Alinhamento editorial',
    descricao: 'Seu conteúdo e o curso precisam conversar. Seriedade acima de tamanho de canal.',
  },
  {
    titulo: 'Potencial comercial',
    descricao: 'Formato e frequência de publicação que comportem uma divulgação natural.',
  },
  {
    titulo: 'Histórico',
    descricao: 'Experiência anterior com afiliação ajuda, mas não é pré-requisito nenhum.',
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

/** YouTube primeiro: é o canal-alvo do programa e o padrão do formulário. */
export const plataformas = [
  'YouTube',
  'YouTube Shorts / cortes',
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
  'Shorts / cortes',
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
    pergunta: 'Só aceitam canal do YouTube?',
    resposta:
      'O YouTube é o foco do programa e a maior parte do material de divulgação é feita para ele. Mas quem divulga em Instagram, TikTok, podcast, newsletter ou comunidade fechada também pode se inscrever — é só indicar o canal principal no formulário.',
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
    resposta: `O rastreio segue a regra da Hotmart: ${comissao.cookieDias} dias de cookie, com atribuição por ${comissao.atribuicao}. Se a pessoa clicar no seu link hoje e comprar dentro desse prazo, a comissão é sua. O cupom com o seu nome cobre ainda quem chega ao site sem clicar no link.`,
  },
  {
    pergunta: 'Preciso produzir a thumbnail e o texto de divulgação?',
    resposta:
      'Não precisa. O kit tem thumbnail, corte editado, roteiro de menção, texto de descrição e comentário fixado. Se preferir criar do seu jeito, melhor ainda — a gente só pede alinhamento prévio para não conflitar com campanha em andamento.',
  },
  {
    pergunta: 'Existe exclusividade ou meta obrigatória?',
    resposta:
      'Não. Você continua livre para divulgar outros produtos e não tem meta mínima de vendas. O que pedimos é honestidade com a sua audiência: só indique o que você realmente acha que vale.',
  },
  {
    pergunta: 'Quanto tempo leva a resposta?',
    resposta: `Analisamos as candidaturas em até ${comissao.prazoResposta} dias úteis. Todo mundo recebe retorno, aprovado ou não. Se o encaixe não for agora, seu cadastro fica no banco de parceiros para campanhas futuras.`,
  },
  {
    pergunta: 'Tem algum custo para participar?',
    resposta:
      'Nenhum. O programa é gratuito e sempre será. Não vendemos curso de afiliado, não cobramos taxa de adesão e não pedimos investimento em tráfego pago.',
  },
  {
    pergunta: 'Qual a relação do Duck Affiliate com o Rascunhos Econômicos?',
    resposta:
      'O Duck Affiliate é a estrutura de parceria: quem recruta, seleciona, entrega o material e acompanha o parceiro. O Rascunhos Econômicos é o produtor do primeiro catálogo de cursos disponível dentro dela — por isso a assinatura “Powered by Rascunhos Econômicos”. A arquitetura foi desenhada para receber outros produtores de conteúdo educacional, e quem entra agora tem prioridade quando o catálogo abrir.',
  },
]
