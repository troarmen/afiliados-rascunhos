import { z } from 'zod'
import { areas, faixasAudiencia, formasDivulgacao, plataformas } from './programa'

const slugsArea = areas.map((a) => a.slug) as [string, ...string[]]

const texto = (min: number, max: number, campo: string) =>
  z
    .string({ required_error: `Preencha ${campo}.` })
    .trim()
    .min(min, `${campo[0].toUpperCase()}${campo.slice(1)} precisa de pelo menos ${min} caracteres.`)
    .max(max, `Limite de ${max} caracteres.`)

const urlOpcional = z
  .string()
  .trim()
  .max(300)
  .optional()
  .transform((v) => (v ? v : undefined))
  .refine((v) => v === undefined || /^(https?:\/\/|@|[\w.-]+\.[a-z]{2,})/i.test(v), {
    message: 'Informe um link ou @usuário válido.',
  })

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
      youtube: urlOpcional,
      instagram: urlOpcional,
      tiktok: urlOpcional,
      outra: urlOpcional,
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
