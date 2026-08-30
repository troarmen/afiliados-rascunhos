'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Marca } from './Marca'
import { comissao } from '@/lib/programa'
import { navegacao } from '@/lib/site'

function IconeMenu({ aberto }: { aberto: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {aberto ? (
        <path d="M6 6l12 12M18 6L6 18" />
      ) : (
        <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
      )}
    </svg>
  )
}

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

  // Navegar fecha o menu. Sem isto, clicar numa âncora da mesma página
  // rolava por baixo do painel aberto e a pessoa não via para onde foi.
  useEffect(() => {
    setMenuAberto(false)
  }, [caminho])

  return (
    <>
      {/* Faixa de anúncio, no gesto das plataformas de afiliação: uma única
          informação de urgência real — a turma está aberta e é gratuita. */}
      <div className="barra-anuncio">
        <div className="envelope barra-anuncio__interno">
          <span>
            Inscrições abertas para a 1ª turma · resposta em até {comissao.prazoResposta} dias
            úteis
          </span>
          <Link href="/#inscricao">Quero me candidatar</Link>
        </div>
      </div>

      {/* O cabeçalho é sempre navy, em qualquer tema — por isso carrega os
          tokens do bloco escuro, e não os da página. */}
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
                    <Link href={item.href}>{item.rotulo}</Link>
                  </li>
                ))}
                <li>
                  <Link href="/programa">Regras do programa</Link>
                </li>
              </ul>
              <Link className="botao" href="/#inscricao">
                Quero ser afiliado
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
