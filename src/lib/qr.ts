import 'server-only'
import QRCode from 'qrcode'

/**
 * QR code do link do parceiro, gerado aqui — sem serviço externo, sem o
 * link passar por terceiro. Navy sobre branco: qualquer leitor lê escuro
 * sobre claro; o contraste é o mesmo do preto.
 *
 * Correção de erro M (15%): o bastante para impressão e tela sem inflar
 * o código. O link com a etiqueta de origem tem ~60 caracteres.
 */
const COR = { dark: '#000e29', light: '#ffffff' }
export const QR_TAMANHO_MIN = 256
export const QR_TAMANHO_MAX = 2048
export const QR_TAMANHO_PADRAO = 1024

export function qrSvg(texto: string, tamanho = 220): Promise<string> {
  return QRCode.toString(texto, { type: 'svg', width: tamanho, margin: 2, errorCorrectionLevel: 'M', color: COR })
}

export function qrPng(texto: string, tamanho = QR_TAMANHO_PADRAO): Promise<Buffer> {
  return QRCode.toBuffer(texto, { type: 'png', width: tamanho, margin: 2, errorCorrectionLevel: 'M', color: COR })
}

export function tamanhoValido(bruto: string | null): number {
  if (!bruto) return QR_TAMANHO_PADRAO
  const n = Number(bruto)
  if (!Number.isInteger(n)) return QR_TAMANHO_PADRAO
  return Math.min(QR_TAMANHO_MAX, Math.max(QR_TAMANHO_MIN, n))
}
