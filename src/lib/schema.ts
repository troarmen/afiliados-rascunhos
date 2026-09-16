import { z } from 'zod'
import { SLUGS_TIPO } from './materiais'
import { areas, faixasAudiencia, formasDivulgacao, plataformas } from './programa'
import { aceitaComoRede, normalizarRede } from './redes'

const slugsArea = areas.map((a) => a.slug) as [string, ...string[]]

const texto = (min: number, max: number, campo: string) =>
  z
    .string({ required_error: `Preencha ${campo}.` })
    .trim()
    .min(min, `${campo[0].toUpperCase()}${campo.slice(1)} precisa de pelo menos ${min} caracteres.`)
    .max(max, `Limite de ${max} caracteres.`)

/**
 * Campo de rede social: aceita link, "@usuário" ou só o usuário, e grava
 * sempre com o "@" quando o candidato escreveu apenas o nome (ver `redes.ts`).
 * A normalização vem depois da validação para que lixo ("!!!") continue sendo
 * recusado em vez de virar "@!!!".
 */
const redeOpcional = z
  .string()
  .trim()
  .max(300)
  .optional()
  .transform((v) => (v ? v : undefined))
  .refine((v) => v === undefined || aceitaComoRede(v), {
    message: 'Informe um link ou @usuário válido.',
  })
  .transform((v) => (v === undefined ? undefined : normalizarRede(v)))

export const candidaturaSchema = z.object({
  // --- Identificação
  nome: texto(3, 120, 'seu nome'),
  email: z.string().trim().toLowerCase().email('Informe um e-mail válido.').max(160),
  telefone: texto(10, 20, 'seu WhatsApp').regex(
    /^[\d\s()+\-.]+$/,
    'Use apenas números, espaços e os sinais + ( ) -.',
  ),

  // --- Canal / projeto
  canalNome: texto(2, 120, 'o nome do seu canal ou projeto'),
  canalUrl: z
    .string()
    .trim()
    .min(4, 'Informe o link principal do seu canal.')
    .max(300)
    .refine((v) => /^(https?:\/\/|[\w.-]+\.[a-z]{2,})/i.test(v), 'Informe um link válido.'),
  plataformaPrincipal: z.enum(plataformas as unknown as [string, ...string[]], {
    errorMap: () => ({ message: 'Escolha sua plataforma principal.' }),
  }),
  redes: z
    .object({
      youtube: redeOpcional,
      instagram: redeOpcional,
      tiktok: redeOpcional,
      outra: redeOpcional,
    })
    .default({}),

  // --- Perfil
  area: z.enum(slugsArea, { errorMap: () => ({ message: 'Escolha sua área de atuação.' }) }),
  audiencia: z.enum(faixasAudiencia as unknown as [string, ...string[]], {
    errorMap: () => ({ message: 'Informe o tamanho aproximado da audiência.' }),
  }),
  formasDivulgacao: z
    .array(z.enum(formasDivulgacao as unknown as [string, ...string[]]))
    .min(1, 'Escolha ao menos uma forma de divulgação.')
    .max(formasDivulgacao.length),

  // --- Experiência e motivação
  jaEhAfiliadoHotmart: z.boolean().default(false),
  experiencia: z.string().trim().max(1500).optional().default(''),
  motivacao: texto(40, 1500, 'o motivo do seu interesse'),
  comoConheceu: z.string().trim().max(160).optional().default(''),

  // --- Consentimento (LGPD)
  aceiteTermos: z.literal(true, {
    errorMap: () => ({ message: 'É preciso aceitar os termos de participação.' }),
  }),
  aceiteContato: z.literal(true, {
    errorMap: () => ({ message: 'Precisamos da sua autorização para entrar em contato.' }),
  }),

  // --- Antispam e atribuição (preenchidos pelo próprio formulário)
  /** Honeypot: deve chegar vazio. Bots preenchem. */
  website: z.string().max(0).optional().default(''),
  /** Milissegundos entre abrir e enviar o formulário. */
  tempoPreenchimento: z.number().int().nonnegative().optional().default(0),
  utm: z
    .object({
      source: z.string().max(80).optional(),
      medium: z.string().max(80).optional(),
      campaign: z.string().max(120).optional(),
      content: z.string().max(120).optional(),
    })
    .optional()
    .default({}),
})

export type CandidaturaInput = z.infer<typeof candidaturaSchema>

export const STATUS = [
  'novo',
  'em_analise',
  'contatado',
  'reuniao',
  'aprovado',
  'reprovado',
  'standby',
] as const

export type Status = (typeof STATUS)[number]

export const STATUS_ROTULO: Record<Status, string> = {
  novo: 'Novo',
  em_analise: 'Em análise',
  contatado: 'Contatado',
  reuniao: 'Reunião marcada',
  aprovado: 'Aprovado',
  reprovado: 'Reprovado',
  standby: 'Banco de talentos',
}

export const atualizacaoSchema = z.object({
  status: z.enum(STATUS).optional(),
  notas: z.string().max(5000).optional(),
  responsavel: z.string().max(120).optional(),
})

export type Candidatura = CandidaturaInput & {
  id: string
  criadoEm: string
  atualizadoEm: string
  status: Status
  score: number
  notas: string
  responsavel: string
  origem: string
}

// ===========================================================================
// Biblioteca de materiais
// ===========================================================================


const dataOpcional = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : null))
  .refine((v) => v === null || /^\d{4}-\d{2}-\d{2}$/.test(v), 'Use a data no formato AAAA-MM-DD.')

export const campanhaSchema = z.object({
  programaId: z.string().uuid('Programa inválido.'),
  nome: z.string().trim().min(2, 'Dê um nome à campanha.').max(120),
  descricao: z.string().trim().max(600).default(''),
  inicio: dataOpcional,
  fim: dataOpcional,
  ativa: z.boolean().default(true),
})

export const campanhaAtualizacaoSchema = campanhaSchema.omit({ programaId: true }).partial()

const tags = z
  .array(z.string().trim().min(1).max(40))
  .max(20)
  .default([])
  .transform((lista) => [...new Set(lista.map((t) => t.toLowerCase()))])

/**
 * Um material tem uma origem, e os campos obrigatórios mudam com ela.
 * O `superRefine` é o que impede "link sem URL" ou "arquivo sem caminho".
 */
export const materialSchema = z
  .object({
    programaId: z.string().uuid('Programa inválido.'),
    campanhaId: z
      .string()
      .trim()
      .optional()
      .transform((v) => (v ? v : null)),
    tipo: z.enum(SLUGS_TIPO, { errorMap: () => ({ message: 'Escolha o tipo do material.' }) }),
    origem: z.enum(['arquivo', 'texto', 'link']),
    titulo: z.string().trim().min(2, 'Dê um título ao material.').max(140),
    descricao: z.string().trim().max(1000).default(''),
    formato: z.string().trim().max(60).default(''),
    tags,
    recomendado: z.boolean().default(false),
    arquivado: z.boolean().default(false),
    // arquivo
    caminho: z.string().trim().max(300).optional().nullable().default(null),
    nomeArquivo: z.string().trim().max(200).optional().nullable().default(null),
    mime: z.string().trim().max(120).optional().nullable().default(null),
    tamanho: z.number().int().nonnegative().optional().nullable().default(null),
    largura: z.number().int().positive().optional().nullable().default(null),
    altura: z.number().int().positive().optional().nullable().default(null),
    // texto
    conteudo: z.string().max(20000).optional().nullable().default(null),
    // link
    url: z
      .string()
      .trim()
      .max(600)
      .optional()
      .nullable()
      .default(null)
      .refine((v) => v == null || /^https?:\/\//i.test(v), 'O link precisa começar com http:// ou https://.'),
  })
  .superRefine((m, ctx) => {
    if (m.origem === 'arquivo' && !m.caminho) {
      ctx.addIssue({ code: 'custom', path: ['caminho'], message: 'Envie o arquivo.' })
    }
    if (m.origem === 'texto' && !m.conteudo?.trim()) {
      ctx.addIssue({ code: 'custom', path: ['conteudo'], message: 'Escreva o conteúdo.' })
    }
    if (m.origem === 'link' && !m.url) {
      ctx.addIssue({ code: 'custom', path: ['url'], message: 'Informe o link.' })
    }
  })

export type MaterialInput = z.infer<typeof materialSchema>

/** Edição: tudo opcional, exceto que a origem não muda depois de criado. */
export const materialAtualizacaoSchema = z.object({
  campanhaId: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v === undefined ? undefined : v ? v : null)),
  tipo: z.enum(SLUGS_TIPO).optional(),
  titulo: z.string().trim().min(2).max(140).optional(),
  descricao: z.string().trim().max(1000).optional(),
  formato: z.string().trim().max(60).optional(),
  tags: tags.optional(),
  recomendado: z.boolean().optional(),
  arquivado: z.boolean().optional(),
  conteudo: z.string().max(20000).optional(),
  url: z
    .string()
    .trim()
    .max(600)
    .optional()
    .refine((v) => v === undefined || /^https?:\/\//i.test(v), 'O link precisa começar com http:// ou https://.'),
})

/** Pedido de link de acesso do parceiro. */
export const pedidoAcessoSchema = z.object({
  email: z.string().trim().toLowerCase().email('Informe um e-mail válido.').max(160),
  website: z.string().max(0).optional().default(''),
})

export const usoSchema = z.object({
  acao: z.enum(['baixar', 'copiar', 'abrir']),
})

/** O link de vendas do parceiro num programa. A validação por plataforma é feita na rota. */
export const afiliacaoSchema = z.object({
  url: z.string({ required_error: 'Cole o seu link.' }).trim().min(8, 'Cole o seu link.').max(600, 'Limite de 600 caracteres.'),
})

// ===========================================================================
// Interesse de produtor (canal, escola ou curso que quer afiliados)
// ===========================================================================

import { PLATAFORMAS_VENDA } from './produtores'

export const produtorSchema = z.object({
  nome: texto(3, 120, 'seu nome'),
  email: z.string().trim().toLowerCase().email('Informe um e-mail válido.').max(160),
  telefone: z
    .string()
    .trim()
    .max(20)
    .optional()
    .default('')
    .refine((v) => !v || /^[\d\s()+\-.]+$/.test(v), 'Use apenas números, espaços e os sinais + ( ) -.'),
  projeto: texto(2, 120, 'o nome do canal, escola ou curso'),
  url: z
    .string()
    .trim()
    .max(300)
    .optional()
    .default('')
    .refine((v) => !v || /^(https?:\/\/|[\w.-]+\.[a-z]{2,})/i.test(v), 'Informe um link válido.'),
  plataforma: z.enum(PLATAFORMAS_VENDA as unknown as [string, ...string[]], {
    errorMap: () => ({ message: 'Informe onde você vende (ou pretende vender).' }),
  }),
  catalogo: texto(30, 2000, 'a descrição do catálogo e do público'),
  aceiteContato: z.literal(true, {
    errorMap: () => ({ message: 'Precisamos da sua autorização para entrar em contato.' }),
  }),
  website: z.string().max(0).optional().default(''),
  tempoPreenchimento: z.number().int().nonnegative().optional().default(0),
})

export type ProdutorInput = z.infer<typeof produtorSchema>

export const STATUS_PRODUTOR = ['novo', 'contatado', 'em_conversa', 'integrado', 'descartado'] as const
export type StatusProdutor = (typeof STATUS_PRODUTOR)[number]
export const STATUS_PRODUTOR_ROTULO: Record<StatusProdutor, string> = {
  novo: 'Novo',
  contatado: 'Contatado',
  em_conversa: 'Em conversa',
  integrado: 'Integrado',
  descartado: 'Sem encaixe',
}

export const produtorAtualizacaoSchema = z.object({
  status: z.enum(STATUS_PRODUTOR).optional(),
  notas: z.string().max(5000).optional(),
})

export type InteresseProdutor = ProdutorInput & {
  id: string
  criadoEm: string
  atualizadoEm: string
  status: StatusProdutor
  notas: string
}
