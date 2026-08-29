'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Entrada suave quando o bloco aparece na viewport.
 * Respeita `prefers-reduced-motion` pela própria CSS (transição zerada).
 */
export function Revelar({
  children,
  atraso = 0,
  className = '',
}: {
  children: React.ReactNode
  atraso?: number
  className?: string
}) {
  const alvo = useRef<HTMLDivElement>(null)
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const no = alvo.current
    if (!no || typeof IntersectionObserver === 'undefined') {
      setVisivel(true)
      return
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true)
          observador.disconnect()
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    )
    observador.observe(no)

    // Rede de segurança: se o observador não disparar (navegador antigo, aba em
    // segundo plano, renderizador headless), o conteúdo aparece assim mesmo.
    // Conteúdo invisível é falha grave; animação perdida, não.
    const resgate = window.setTimeout(() => setVisivel(true), 1500)

    return () => {
      observador.disconnect()
      window.clearTimeout(resgate)
    }
  }, [])

  return (
    <div
      ref={alvo}
      className={`revelar ${className}`.trim()}
      data-visivel={visivel}
      style={{ transitionDelay: `${atraso}ms` }}
    >
      {children}
    </div>
  )
}
