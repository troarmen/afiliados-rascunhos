'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Emblema, Wordmark } from '../Marca'

export function CabecalhoParceiro({ nome, previa = false }: { nome: string; previa?: boolean }) {
  const router = useRouter()
  const caminho = usePathname()
  const sair = async () => {
    await fetch('/api/parceiro/sessao', { method: 'DELETE' })
    router.replace('/parceiro/entrar')
    router.refresh()
  }

  return (
    <>
      {previa && (
        <div className="par__previa">
          <div className="par__topo-interno" style={{ minHeight: 0, height: 'auto', padding: '8px clamp(16px, 3vw, 28px)' }}>
            <span>
              <strong>Prévia da equipe.</strong> Você está vendo a área exatamente como o parceiro aprovado vê. Baixar e copiar não contam uso aqui.
            </span>
            <Link href="/admin/materiais" style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}>Voltar ao painel →</Link>
          </div>
        </div>
      )}
      <header className="par__topo escuro">
        <div className="par__topo-interno">
          <Link className="marca" href="/parceiro" aria-label="Área do parceiro">
            <Emblema tamanho={32} />
            <Wordmark />
            <span className="marca__pilula">Área do parceiro</span>
          </Link>
          <nav className="par__nav" aria-label="Área do parceiro">
            <Link href="/parceiro" aria-current={caminho === '/parceiro' ? 'page' : undefined}>Meus programas</Link>
            <Link href="/parceiro#ajuda">Ajuda</Link>
          </nav>
          <div className="par__topo-acoes">
            <span className="par__nome" title={nome}>{nome.split(' ')[0]}</span>
            {!previa && (
              <button className="botao botao--fantasma" type="button" onClick={sair}>Sair</button>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
