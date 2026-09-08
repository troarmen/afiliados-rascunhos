'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Emblema } from '../Marca'

const SECOES = [
  { href: '/admin', rotulo: 'Início', exato: true },
  { href: '/admin/candidaturas', rotulo: 'Candidaturas' },
  { href: '/admin/materiais', rotulo: 'Materiais' },
  { href: '/admin/campanhas', rotulo: 'Campanhas' },
  { href: '/admin/produtores', rotulo: 'Produtores' },
] as const

export function CabecalhoAdmin({ modo }: { modo: 'supabase' | 'arquivo' }) {
  const router = useRouter()
  const caminho = usePathname()

  const sair = async () => {
    await fetch('/api/admin/sessao', { method: 'DELETE' })
    router.replace('/admin/entrar')
    router.refresh()
  }

  // A ficha /admin/<id> pertence a Candidaturas, ainda que a URL não diga.
  const ativa = (s: (typeof SECOES)[number]) => {
    if ('exato' in s && s.exato) return caminho === s.href
    if (caminho.startsWith(s.href)) return true
    return s.href === '/admin/candidaturas' && /^\/admin\/[0-9a-f-]{36}$/.test(caminho)
  }

  return (
    <header className="adm__topo">
      <div className="adm__topo-interno">
        <Link className="adm__marca" href="/admin">
          <Emblema tamanho={28} />
          Painel
        </Link>

        <nav className="adm__nav" aria-label="Seções do painel">
          {SECOES.map((s) => (
            <Link key={s.href} href={s.href} aria-current={ativa(s) ? 'page' : undefined}>
              {s.rotulo}
            </Link>
          ))}
        </nav>

        <div className="adm__topo-acoes">
          <span
            className="selo"
            title={modo === 'arquivo' ? 'Gravando em .data/ — configure o Supabase antes de ir para produção.' : 'Conectado ao Supabase.'}
          >
            {modo === 'arquivo' ? 'Modo local' : 'Supabase'}
          </span>
          <a className="botao botao--fantasma" href="/" target="_blank" rel="noopener noreferrer" title="Abrir o site público em outra aba">
            Ver site
          </a>
          <button className="botao botao--fantasma" type="button" onClick={sair}>
            Sair
          </button>
        </div>
      </div>
    </header>
  )
}
