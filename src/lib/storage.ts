import 'server-only'
import fs from 'node:fs/promises'
import path from 'node:path'
import { PASTA_DADOS, modoPersistencia, supabase } from './db'

/**
 * Onde os arquivos dos materiais moram.
 *
 * Supabase: bucket privado `materiais`. O navegador do admin envia DIRETO
 * para lá com uma URL assinada — o arquivo não passa pelo servidor Next,
 * o que importa porque a Vercel corta o corpo da requisição em ~4,5 MB e
 * um vídeo não caberia. Para servir, o servidor só assina uma URL de
 * leitura de curta duração e redireciona: o storage entrega o arquivo com
 * range/streaming e sem ocupar a função.
 *
 * Arquivo: `.data/materiais/<id>/<nome>`. Só desenvolvimento.
 */

export const BUCKET = process.env.MATERIAIS_BUCKET ?? 'materiais'
const PASTA_ARQUIVOS = path.join(PASTA_DADOS, 'materiais')

/** Caminho no storage: id do material + nome saneado. */
export function caminhoParaArquivo(materialId: string, nomeOriginal: string): string {
  const nome = nomeOriginal
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120) || 'arquivo'
  return `${materialId}/${nome}`
}

function caminhoLocal(caminho: string): string {
  const absoluto = path.join(PASTA_ARQUIVOS, caminho)
  // Trava de diretório: `caminho` vem do banco, mas nunca custa.
  if (!absoluto.startsWith(PASTA_ARQUIVOS + path.sep)) throw new Error('Caminho inválido.')
  return absoluto
}

/** Modo arquivo: grava bytes que chegaram por multipart. */
export async function guardarArquivoLocal(caminho: string, bytes: Uint8Array) {
  const destino = caminhoLocal(caminho)
  await fs.mkdir(path.dirname(destino), { recursive: true })
  await fs.writeFile(destino, bytes)
}

/**
 * Supabase: URL assinada para o navegador fazer PUT direto no bucket.
 * Vale 2 horas — tempo de sobra para um upload lento de vídeo.
 */
export async function urlDeUploadAssinada(caminho: string) {
  const { data, error } = await supabase().storage.from(BUCKET).createSignedUploadUrl(caminho)
  if (error || !data) throw new Error(`Falha ao assinar upload: ${error?.message ?? 'sem dados'}`)
  return { url: data.signedUrl, token: data.token, caminho: data.path }
}

/**
 * Como entregar o arquivo: ou um redirecionamento (Supabase) ou os bytes
 * (arquivo local). A rota `/api/materiais/[id]/arquivo` decide o resto.
 */
export async function entregarArquivo(
  caminho: string,
  opcoes: { baixar?: boolean; nomeArquivo?: string | null } = {},
): Promise<{ redirecionar: string } | { bytes: Uint8Array<ArrayBuffer> }> {
  if (modoPersistencia() === 'supabase') {
    const { data, error } = await supabase()
      .storage.from(BUCKET)
      .createSignedUrl(caminho, 60, {
        download: opcoes.baixar ? (opcoes.nomeArquivo ?? true) : false,
      })
    if (error || !data) throw new Error(`Falha ao assinar leitura: ${error?.message ?? 'sem dados'}`)
    return { redirecionar: data.signedUrl }
  }
  const lido = await fs.readFile(caminhoLocal(caminho))
  const bytes = new Uint8Array(lido.byteLength)
  bytes.set(lido)
  return { bytes }
}

export async function removerArquivo(caminho: string) {
  if (modoPersistencia() === 'supabase') {
    await supabase().storage.from(BUCKET).remove([caminho])
    return
  }
  await fs.rm(caminhoLocal(caminho), { force: true })
  // Pasta do material fica vazia: some junto.
  await fs.rm(path.dirname(caminhoLocal(caminho)), { recursive: true, force: true }).catch(() => {})
}

/** Tipos de arquivo aceitos no upload. Fora disto, o admin vê um erro claro. */
export const MIMES_ACEITOS = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'application/pdf',
  'application/zip',
  'application/x-zip-compressed',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-powerpoint',
  'text/plain',
  'text/markdown',
])

/** 250 MB: vídeo de Reels cabe folgado; um curso inteiro, não — e nem deveria. */
export const TAMANHO_MAXIMO = 250 * 1024 * 1024
