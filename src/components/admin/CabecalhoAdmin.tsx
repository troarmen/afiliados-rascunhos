'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Emblema } from '../Marca'

export function CabecalhoAdmin({ modo }: { modo: 'supabase' | 'arquivo' }) {
  const router = useRouter()

  const sair = async () => {
    await fetch('/api/admin/sessao', { method: 'DELETE' })
    router.replace('/admin/entrar')
    router.refresh()
  }

  return (
    <header className="adm__topo">
      <div className="adm__topo-interno">
        <Link className="adm__marca" href="/admin">
          <Emblema tamanho={28} />
          Painel de parceiros
        </Link>

        <span
          className="selo"
          title={
            modo === 'arquivo'
              ? 'Gravando em .data/candidaturas.json — configure o Supabase antes de ir para produção.'
              : 'Conectado ao Supabase.'
          }
          style={{ marginLeft: 4 }}
        >
          {modo === 'arquivo' ? 'Modo local' : 'Supabase'}
        </span>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
          <a className="botao botao--secundario" href="/api/admin/exportar" download>
            Exportar CSV
          </a>
          <button className="botao botao--fantasma" type="button" onClick={sair}>
            Sair
          </button>
        </div>
      </div>
    </header>
  )
}
