'use client'

import { useState } from 'react'

/** Copia um texto e confirma por dois segundos. Cai no prompt onde a API de clipboard não existe. */
export function BotaoCopiar({ texto, rotulo = 'Copiar', className = 'botao botao--secundario' }: { texto: string; rotulo?: string; className?: string }) {
  const [feito, setFeito] = useState(false)
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto)
      setFeito(true)
      setTimeout(() => setFeito(false), 2000)
    } catch {
      window.prompt('Copie o texto:', texto)
    }
  }
  return (
    <button type="button" className={className} onClick={copiar} data-feito={feito}>
      {feito ? 'Copiado ✓' : rotulo}
    </button>
  )
}
