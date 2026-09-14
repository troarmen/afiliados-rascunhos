'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Marca } from './Marca'
import { comissao } from '@/lib/programa'
import { navegacao, navegacaoSecundaria } from '@/lib/site'

function IconeMenu({ aberto }: { aberto: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      {aberto ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />}
    </svg>
  )
}

/**
 * Cabeçalho do site público.
 *
 * Cada item do menu é uma página; o item da página atual fica marcado
 * (`aria-current`) para a pessoa saber onde está sem ler a URL. "Entrar"
 * é a porta da área do parceiro — discreta, porque a maioria de quem chega
 * ainda não é parceiro, mas presente, porque quem é precisa achá-la.
 */
export function Topo() {
  const [rolado, setRolado] = useState(false)
  const [menuAberto, setMenuAberto] = useState(false)
  const caminho = usePathname()

  useEffect(() => {
    const aoRolar = () => setRolado(window.scrollY > 8)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  useEffect(() => {
    setMenuAberto(false)
  }, [caminho])

  const atual = (href: string) => (caminho === href ? 'page' : undefined)

  return (
    <>
      <div className="barra-anuncio">
        <div className="envelope barra-anuncio__interno">
          <span>
            Inscrições abertas para a 1ª turma · resposta em até {comissao.prazoResposta} dias úteis
          </span>
          <Link href="/inscricao">Quero me candidatar</Link>
        </div>
      </div>

      <header className="topo escuro" data-rolado={rolado}>
        <div className="envelope topo__interno">
          <Marca />
          <nav className="topo__nav" aria-label="Navegação principal">
            {navegacao.map((item) => (
              <Link key={item.href} href={item.href} aria-current={atual(item.href)}>
                {item.rotulo}
              </Link>
            ))}
          </nav>
          <div className="topo__acao">
            <Link className="topo__entrar" href="/parceiro/entrar">
              Entrar
            </Link>
            <Link className="botao botao--avanco" href="/inscricao">
              Quero ser afiliado
            </Link>
          </div>
          <button
            type="button"
            className="topo__gatilho"
            aria-expanded={menuAberto}
            aria-controls="menu-movel"
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMenuAberto((v) => !v)}
          >
            <IconeMenu aberto={menuAberto} />
          </button>
        </div>

        {menuAberto && (
          <div className="menu-movel escuro" id="menu-movel">
            <div className="envelope">
              <ul>
                {navegacao.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} aria-current={atual(item.href)}>{item.rotulo}</Link>
                  </li>
                ))}
                {navegacaoSecundaria.map((item) => (
                  <li key={item.href} className="menu-movel__secundario">
                    <Link href={item.href} aria-current={atual(item.href)}>{item.rotulo}</Link>
                  </li>
                ))}
                <li className="menu-movel__secundario">
                  <Link href="/parceiro/entrar">Já sou parceiro: entrar</Link>
                </li>
              </ul>
              <Link className="botao botao--avanco" href="/inscricao">
                Quero ser afiliado
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
