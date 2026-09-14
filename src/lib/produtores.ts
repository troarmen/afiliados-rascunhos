/**
 * Conteúdo da porta de entrada dos PRODUTORES — canais, escolas e criadores
 * que têm curso e querem afiliados.
 *
 * O site nasceu falando só com o afiliado; esta é a outra metade do modelo
 * do documento de visão ("conectar as duas pontas"). Vocabulário: para o
 * afiliado, "canal" é o canal DELE no YouTube; por isso o outro lado se
 * chama "produtor" aqui, e o texto explica que pode ser canal, escola ou
 * curso.
 *
 * REGRA: nada de número inventado. O que se promete é o que a estrutura
 * já faz — recrutamento, triagem, biblioteca, campanhas. Plataforma de venda
 * sempre no genérico (ver `plataformaVenda` em programa.ts).
 */

import { plataformaVenda } from './programa'

export const oQueOferece = [
  {
    titulo: 'Recrutamento com filtro humano',
    descricao:
      'Página de candidatura própria, formulário em quatro etapas e triagem com pontuação. Cada candidato é lido por gente — o seu curso não cai na mão de quem divulga por spam.',
  },
  {
    titulo: 'Afiliados de conteúdo, não de tráfego',
    descricao:
      'O programa é desenhado para criadores educacionais do YouTube: audiência que assiste vídeo de 40 minutos e compra por argumento. Seriedade pesa mais que número de inscritos.',
  },
  {
    titulo: 'Biblioteca de materiais integrada',
    descricao:
      'Você publica thumbnail, corte, roteiro, texto e cupom num painel; o afiliado encontra tudo por tipo, campanha e formato. Sem Drive, sem WhatsApp, sem “me manda de novo”.',
  },
  {
    titulo: 'Campanhas com calendário',
    descricao:
      'Lançamento, promoção, data sazonal: você agrupa os materiais por campanha com prazo, e o afiliado vê o que está em andamento sem precisar perguntar.',
  },
  {
    titulo: 'Pagamento pela sua plataforma',
    descricao:
      `A venda, o rastreio e a comissão continuam na plataforma que você já usa (como ${plataformaVenda.exemplos}). O Duck Affiliate não toca em dinheiro nem exige infraestrutura nova de pagamento.`,
  },
  {
    titulo: 'Acompanhamento do parceiro',
    descricao:
      'Contador de uso por material, comunidade fechada e canal direto entre produtor e afiliado. Você sabe o que está sendo usado e ajusta a oferta com quem divulga.',
  },
] as const

export const comoFuncionaProdutor = [
  {
    numero: 1,
    titulo: 'Você conta sobre o catálogo',
    descricao: 'Cursos, público, plataforma de venda e o que espera de um afiliado. Formulário abaixo, cinco minutos.',
  },
  {
    numero: 2,
    titulo: 'Conversamos sobre encaixe',
    descricao: 'Conteúdo educacional sério, curso que já vende e comissão que faça sentido para o criador. Se encaixa, seguimos.',
  },
  {
    numero: 3,
    titulo: 'Seu programa entra na estrutura',
    descricao: 'Página de recrutamento, triagem, biblioteca e campanhas prontas para o seu catálogo. Você publica o material.',
  },
  {
    numero: 4,
    titulo: 'Afiliados selecionados divulgam',
    descricao: 'Criadores aprovados recebem acesso, pegam o material e divulgam no formato deles. A plataforma de venda paga a comissão.',
  },
] as const

export const paraQuemProdutor = {
  serve: [
    'Canais, escolas e criadores com curso educacional que já vende — economia, história, filosofia, ciências, concursos e áreas vizinhas',
    `Quem vende (ou pode vender) em plataforma com programa de afiliados, como ${plataformaVenda.exemplos}`,
    'Quem quer afiliados que entendam do assunto, não uma lista de e-mails para disparar link',
  ],
  naoServe: [
    'Produto sem histórico de venda: o afiliado precisa indicar algo que já funciona',
    'Conteúdo de promessa de renda, apostas ou fora do campo educacional',
    'Quem quer volume rápido por tráfego incentivado — o programa recusa esse tipo de divulgação',
  ],
} as const

export const perguntasProdutor = [
  {
    pergunta: 'Quanto custa colocar meu curso no Duck Affiliate?',
    resposta:
      'Ainda não há tabela pública: estamos abrindo a rede para os primeiros produtores além do Rascunhos Econômicos, e a condição é conversada caso a caso. O que já está definido é o que NÃO existe: taxa de adesão para o afiliado e infraestrutura própria de pagamento. A comissão do afiliado continua sendo paga pela plataforma de venda.',
  },
  {
    pergunta: 'Preciso mudar de plataforma de venda?',
    resposta:
      'Não. O modelo funciona sobre a plataforma de venda que você já usa, desde que ela tenha programa de afiliados. Conte no formulário onde você vende — avaliamos o encaixe.',
  },
  {
    pergunta: 'Quem escolhe os afiliados do meu curso?',
    resposta:
      'A triagem é feita pela equipe do Duck Affiliate com critério aberto (qualidade da audiência, alinhamento editorial, potencial comercial, histórico), e o produtor participa da decisão sobre o próprio catálogo. Ninguém é aprovado por número de inscritos.',
  },
  {
    pergunta: 'Preciso produzir o material de divulgação?',
    resposta:
      'O material sai do produtor — é você quem conhece o curso. A estrutura entrega o lugar para publicar, organizar por campanha e medir uso, e orienta o que costuma funcionar para criadores do YouTube (thumbnail, corte, roteiro de menção, texto de descrição).',
  },
] as const

export const PLATAFORMAS_VENDA = [
  'Hotmart',
  'Eduzz',
  'Kiwify',
  'Cademí',
  'Shopify',
  'Plataforma própria',
  'Outra',
  'Ainda não vendo online',
] as const
