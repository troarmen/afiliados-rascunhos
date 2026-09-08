'use client'

import { useState } from 'react'
import { acaoPrincipal, type Material } from '@/lib/materiais'

/**
 * O botão principal de cada material — baixar, copiar ou abrir.
 *
 * Baixar é um <a> para a rota de arquivo com `?baixar=1`: o servidor conta
 * o uso e manda como anexo, sem JS. Copiar e abrir acontecem aqui no
 * navegador, então o uso é registrado por um POST em segundo plano.
 */
export function AcaoMaterial({ material, tamanho }: { material: Material; tamanho?: 'g' }) {
  const [feito, setFeito] = useState(false)
  const { rotulo, acao } = acaoPrincipal(material)
  const classe = `botao${tamanho === 'g' ? ' botao--g' : ''}`

  const registrar = () =>
    fetch(`/api/parceiro/materiais/${material.id}/uso`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ acao }),
      keepalive: true,
    }).catch(() => {})

  if (acao === 'baixar') {
    return (
      <a className={classe} href={`/api/materiais/${material.id}/arquivo?baixar=1`} download={material.nomeArquivo ?? undefined}>
        {rotulo}
      </a>
    )
  }

  if (acao === 'abrir') {
    return (
      <a className={classe} href={material.url ?? '#'} target="_blank" rel="noopener noreferrer" onClick={() => void registrar()}>
        {rotulo} ↗
      </a>
    )
  }

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(material.conteudo ?? '')
      setFeito(true)
      void registrar()
      setTimeout(() => setFeito(false), 2000)
    } catch {
      window.prompt('Copie o texto:', material.conteudo ?? '')
    }
  }

  return (
    <button className={classe} type="button" onClick={copiar} data-feito={feito}>
      {feito ? 'Copiado ✓' : rotulo}
    </button>
  )
}
