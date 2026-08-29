import type { CandidaturaInput } from './schema'

/**
 * Triagem automática — 0 a 100.
 *
 * O score NÃO aprova nem reprova ninguém: ele só ordena a fila para que a
 * análise humana comece pelos candidatos mais promissores. A regra é
 * deliberadamente simples e auditável (nada de caixa-preta), e pesa
 * alinhamento e intenção acima de tamanho de audiência — que é a tese do
 * programa: audiência qualificada vale mais que audiência grande.
 */

const PESO_AUDIENCIA: Record<string, number> = {
  'Até 1.000': 6,
  'De 1.000 a 10.000': 14,
  'De 10.000 a 50.000': 20,
  'De 50.000 a 200.000': 25,
  'De 200.000 a 1 milhão': 28,
  'Mais de 1 milhão': 30,
}

/** Áreas com maior aderência ao catálogo atual do Rascunhos Econômicos. */
const AREAS_NUCLEO = new Set(['economia', 'financas', 'geopolitica', 'historia'])
const AREAS_ADJACENTES = new Set(['filosofia', 'sociologia', 'direito', 'concursos'])

const FORMATOS_FORTES = new Set([
  'Vídeo dedicado / review',
  'Menção dentro dos vídeos',
  'Newsletter',
])

export function calcularScore(c: CandidaturaInput): number {
  let score = 0

  // Audiência — até 30 pontos.
  score += PESO_AUDIENCIA[c.audiencia] ?? 10

  // Alinhamento de área — até 25 pontos.
  if (AREAS_NUCLEO.has(c.area)) score += 25
  else if (AREAS_ADJACENTES.has(c.area)) score += 16
  else score += 8

  // Formato de divulgação — até 20 pontos.
  const fortes = c.formasDivulgacao.filter((f) => FORMATOS_FORTES.has(f)).length
  score += Math.min(12, fortes * 6)
  if (c.formasDivulgacao.length >= 3) score += 4
  if (!c.formasDivulgacao.includes('Ainda estou definindo')) score += 4

  // Prontidão operacional — até 10 pontos.
  if (c.jaEhAfiliadoHotmart) score += 6
  if ((c.experiencia ?? '').trim().length > 80) score += 4

  // Qualidade da motivação — até 15 pontos.
  // Proxy grosseiro (tamanho + menção ao produto), revisado sempre por humano.
  const motivacao = c.motivacao.trim()
  if (motivacao.length > 600) score += 10
  else if (motivacao.length > 250) score += 7
  else if (motivacao.length > 120) score += 4
  if (/rascunhos|curso|aula|econom/i.test(motivacao)) score += 5

  // Presença multiplataforma — até 10 pontos.
  const redes = [c.redes?.youtube, c.redes?.instagram, c.redes?.tiktok, c.redes?.outra].filter(
    Boolean,
  ).length
  score += Math.min(10, redes * 3)

  return Math.max(0, Math.min(100, Math.round(score)))
}

export function faixaDoScore(score: number): { rotulo: string; tom: 'alto' | 'medio' | 'baixo' } {
  if (score >= 70) return { rotulo: 'Prioridade alta', tom: 'alto' }
  if (score >= 45) return { rotulo: 'Prioridade média', tom: 'medio' }
  return { rotulo: 'Prioridade baixa', tom: 'baixo' }
}
