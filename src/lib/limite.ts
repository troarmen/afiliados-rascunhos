import 'server-only'
import type { NextRequest } from 'next/server'

/**
 * Limite de tentativas por chave (normalmente o IP), em janela deslizante.
 *
 * Em memória: some a cada deploy e não é compartilhado entre instâncias.
 * Suficiente para uma instância só; com mais de uma, trocar por Upstash/Redis
 * (ver docs/05-roadmap.md).
 */
export function criarLimitador({ janelaMs, limite }: { janelaMs: number; limite: number }) {
  const tentativas = new Map<string, number[]>()

  function recentes(chave: string, agora: number): number[] {
    return (tentativas.get(chave) ?? []).filter((t) => agora - t < janelaMs)
  }

  function podar(agora: number) {
    if (tentativas.size <= 5000) return
    // Trava de memória: descarta só o que já expirou, sem zerar quem está bloqueado.
    for (const [chave, lista] of tentativas) {
      if (lista.every((t) => agora - t >= janelaMs)) tentativas.delete(chave)
    }
  }

  return {
    /** Já passou do limite? Não conta como tentativa. */
    bloqueado(chave: string): boolean {
      return recentes(chave, Date.now()).length >= limite
    },
    /** Conta uma tentativa. */
    registrar(chave: string) {
      const agora = Date.now()
      const lista = recentes(chave, agora)
      lista.push(agora)
      tentativas.set(chave, lista)
      podar(agora)
    },
    /** Conta uma tentativa e diz se ela estourou o limite. */
    consumir(chave: string): boolean {
      this.registrar(chave)
      return recentes(chave, Date.now()).length > limite
    },
    limpar(chave: string) {
      tentativas.delete(chave)
    },
  }
}

/**
 * IP de quem fez a requisição.
 *
 * O PRIMEIRO valor do X-Forwarded-For vem do próprio cliente e pode ser
 * inventado — usar ele deixava qualquer um driblar o limite trocando o IP a
 * cada envio. O ÚLTIMO valor é o que o nosso proxy acrescentou, com o IP real
 * da conexão. (Se um dia entrar uma segunda camada de proxy na frente, como
 * Cloudflare, rever isto.)
 */
export function ipDaRequisicao(req: NextRequest): string {
  const encaminhado = req.headers.get('x-forwarded-for')
  if (encaminhado) {
    const ultimo = encaminhado.split(',').pop()?.trim()
    if (ultimo) return ultimo
  }
  return req.headers.get('x-real-ip') ?? 'desconhecido'
}
