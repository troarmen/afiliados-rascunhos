'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Marca } from './Marca'
import { navegacao } from '@/lib/site'

export function Topo() {
  const [rolado, setRolado] = useState(false)

  useEffect(() => {
    const aoRolar = () => setRolado(window.scrollY > 8)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  return (
    // O cabeçalho é sempre navy, em qualquer tema — por isso carrega os tokens
    // do bloco escuro, e não os da página.
    <header className="topo escuro" data-rolado={rolado}>
      <div className="envelope topo__interno">
        <Marca />
        <nav className="topo__nav" aria-label="Navegação principal">
          {navegacao.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.rotulo}
            </Link>
          ))}
        </nav>
        <div className="topo__acao">
          <Link className="botao" href="/#inscricao">
            Quero participar
          </Link>
        </div>
      </div>
    </header>
  )
}
